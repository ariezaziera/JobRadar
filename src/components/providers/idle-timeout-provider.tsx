'use client'

import { useIdleTimeout } from '@/hooks/useIdleTimeout'

export function IdleTimeoutProvider({ children }: { children: React.ReactNode }) {
  useIdleTimeout()
  return <>{children}</>
}