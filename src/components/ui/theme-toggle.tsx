'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return <div className={cn('w-10 h-10 rounded-xl bg-card border border-border', className)} />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative w-10 h-10 rounded-xl bg-card border border-border',
        'flex items-center justify-center overflow-hidden',
        'hover:border-primary/40 transition-colors',
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun
        size={17}
        className={cn(
          'absolute transition-all duration-300',
          isDark
            ? 'rotate-90 scale-0 opacity-0 text-muted'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        )}
      />
      <Moon
        size={17}
        className={cn(
          'absolute transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-primary'
            : '-rotate-90 scale-0 opacity-0 text-muted'
        )}
      />
    </button>
  )
}