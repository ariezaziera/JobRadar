'use client'

import { useSidebar } from '@/components/providers/sidebar-provider'
import { cn } from '@/lib/utils'

export function MainContent({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar()

  return (
    <main
      className={cn(
        'flex-1 min-w-0 overflow-x-hidden min-h-screen pb-20 md:pb-0 transition-[margin] duration-200',
        expanded ? 'md:ml-60' : 'md:ml-[72px]'
      )}
    >
      {children}
    </main>
  )
}