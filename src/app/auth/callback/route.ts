import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getURL } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const baseUrl = getURL() // <-- guna getURL() instead of origin
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  const baseUrl = getURL()
  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`)
}
