import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reminderEmailHtml, getEmailSubject } from '@/lib/email/templates'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    // Verify cron secret so only Vercel cron can trigger this
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Fetch all pending reminders due now
    const now = new Date().toISOString()
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        applications (position, company, user_id),
        profiles:user_id (full_name, id)
      `)
      .eq('status', 'pending')
      .lte('remind_at', now)
      .limit(50)

    if (error) throw error
    if (!reminders?.length) {
      return NextResponse.json({ sent: 0, message: 'No pending reminders.' })
    }

    let sent = 0
    const errors: string[] = []

    for (const reminder of reminders) {
      try {
        const app = reminder.applications as any
        const profile = reminder.profiles as any

        // Get user email from auth
        const { data: { user } } = await supabase.auth.admin.getUserById(reminder.user_id)
        if (!user?.email) continue

        const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}/applications/${reminder.application_id}`

        await resend.emails.send({
          from: 'Qestly <onboarding@resend.dev>',
          to: user.email,
          subject: getEmailSubject({
            type: reminder.type,
            position: app.position,
            company: app.company,
          }),
          html: reminderEmailHtml({
            candidateName: profile?.full_name ?? 'there',
            type: reminder.type,
            position: app.position,
            company: app.company,
            message: reminder.message,
            appUrl,
          }),
        })

        // Mark as sent
        await supabase
          .from('reminders')
          .update({ status: 'sent' })
          .eq('id', reminder.id)

        sent++
      } catch (err) {
        errors.push(`Reminder ${reminder.id}: ${err}`)
      }
    }

    return NextResponse.json({ sent, errors })
  } catch (err) {
    console.error('reminders/send error:', err)
    return NextResponse.json({ error: 'Failed to process reminders.' }, { status: 500 })
  }
}