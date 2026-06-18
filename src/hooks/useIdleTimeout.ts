'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minit

export function useIdleTimeout() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [router, supabase])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleLogout, IDLE_TIMEOUT)
    }

    // Events yang tunjuk user aktif
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(e => document.addEventListener(e, resetTimer))

    resetTimer() // Start timer

    return () => {
      clearTimeout(timeout)
      events.forEach(e => document.removeEventListener(e, resetTimer))
    }
  }, [handleLogout])
}