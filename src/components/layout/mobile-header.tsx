'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type MobileHeaderProps = {
  userEmail?: string | null
  userAvatarUrl?: string | null
}

export function MobileHeader({ userEmail, userAvatarUrl }: MobileHeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initial = userEmail?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-40 md:hidden bg-card/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 512 512" fill="none">
              <g transform="translate(0, 20)">
                <path d="M 56,256 A200,200 0 0,1 456,256" fill="none" stroke="#f6d365" strokeWidth="20" strokeLinecap="round" opacity="0.5"/>
                <path d="M 106,256 A150,150 0 0,1 406,256" fill="none" stroke="#f6d365" strokeWidth="20" strokeLinecap="round" opacity="0.8"/>
                <path d="M 156,256 A100,100 0 0,1 356,256" fill="none" stroke="#f6d365" strokeWidth="20" strokeLinecap="round"/>
                <line x1="256" y1="256" x2="256" y2="355" stroke="#f6d365" strokeWidth="20" strokeLinecap="round"/>
                <circle cx="256" cy="256" r="26" fill="#86efac"/>
                <line x1="272" y1="272" x2="320" y2="320" stroke="#86efac" strokeWidth="15" strokeLinecap="round"/>
              </g>
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight">Qestly</span>
        </Link>

        {/* Avatar menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Account menu"
            aria-expanded={open}
          >
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatarUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                {initial}
              </div>
            )}
            <ChevronDown
              size={14}
              className={cn('text-muted transition-transform', open && 'rotate-180')}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              {userEmail && (
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-xs text-muted truncate">{userEmail}</p>
                </div>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2.5 px-3 py-2.5 w-full text-sm text-error hover:bg-error/10 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}