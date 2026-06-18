import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/welcome'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. CHECK: Is the user authenticated?
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      )
    }

    // 2. CHECK: Is the email being sent to the authenticated user themselves?
    const { email, name } = await request.json()

    if (email !== user.email) {
      return NextResponse.json(
        { error: 'You can only send welcome emails to your own address.' },
        { status: 403 }
      )
    }

    // 3. Send the welcome email
    await sendWelcomeEmail({ to: email, name: name || user.user_metadata?.full_name || 'User' })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    )
  }
}