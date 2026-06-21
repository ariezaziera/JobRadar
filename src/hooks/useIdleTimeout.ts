'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Idle timeout differs based on how the app is being used:
// - Browser tab: shorter timeout — shared/public devices, multiple
//   open tabs, accidental access are real risks here.
// - Installed PWA (standalone): the whole point of installing is that
//   it behaves like a native app — sign in once, stay signed in. A
//   short idle timeout defeats that. The real security backstop is
//   Supabase's own refresh token expiry; idle timeout here is just a
//   long sanity-check window (e.g. lost/stolen device).
const BROWSER_IDLE_TIMEOUT = 30 * 60 * 1000              // 30 minutes
const STANDALONE_IDLE_TIMEOUT = 7 * 24 * 60 * 60 * 1000  // 7 days

const LAST_ACTIVITY_KEY = 'qestly-last-activity'

function isStandalone() {
  if (typeof window === 'undefined') return false
  const mqStandalone = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone = (window.navigator as any).standalone === true
  return mqStandalone || iosStandalone
}

export function useIdleTimeout() {
  const router = useRouter()
  const supabase = createClient()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY)
    } catch {}
    router.push('/login')
  }, [router, supabase])

  useEffect(() => {
    const IDLE_TIMEOUT = isStandalone() ? STANDALONE_IDLE_TIMEOUT : BROWSER_IDLE_TIMEOUT

    const setLastActivity = () => {
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      } catch {}
    }

    const scheduleTimeout = (ms: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(handleLogout, ms)
    }

    const resetTimer = () => {
      setLastActivity()
      scheduleTimeout(IDLE_TIMEOUT)
    }

    // On mount AND whenever the app regains visibility (covers a PWA
    // being reopened after being killed/backgrounded, or a browser tab
    // restored after the OS suspended its timers), check real elapsed
    // time instead of trusting a possibly-throttled setTimeout.
    const checkElapsedOnResume = () => {
      try {
        const last = localStorage.getItem(LAST_ACTIVITY_KEY)
        if (last) {
          const elapsed = Date.now() - Number(last)
          if (elapsed >= IDLE_TIMEOUT) {
            handleLogout()
            return
          }
          scheduleTimeout(IDLE_TIMEOUT - elapsed)
          return
        }
      } catch {}
      resetTimer()
    }

    checkElapsedOnResume()

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(e => document.addEventListener(e, resetTimer))

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkElapsedOnResume()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      events.forEach(e => document.removeEventListener(e, resetTimer))
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [handleLogout])
}