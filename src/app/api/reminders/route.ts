import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('remind_at', { ascending: true })

    if (applicationId) query = query.eq('application_id', applicationId)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ reminders: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch reminders.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { application_id, type, message, remind_at } = body

    if (!application_id || !type || !remind_at) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        application_id,
        type,
        message: message || null,
        remind_at,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ reminder: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create reminder.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete reminder.' }, { status: 500 })
  }
}