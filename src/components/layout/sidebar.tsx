'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Kanban,
  User,
  LogOut,
  Plus,
  Map,
  Compass,
  ChevronLeft,
} from 'lucide-react'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AvatarMenu } from '@/components/layout/avatar-menu'
import { useSidebar } from '@/components/providers/sidebar-provider'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/applications', icon: BriefcaseBusiness, label: 'Applications' },
  { href: '/board', icon: Kanban, label: 'Board' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/profile', icon: User, label: 'Profile' },
]

// Detects whether the device genuinely supports hover (mouse/trackpad)
// vs touch-only (phone/tablet), so hover-to-peek never gets stuck open
// on touch devices that fire mouseenter without a matching mouseleave.
function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHoverCapable(mq.matches)

    const handler = (e: MediaQueryListEvent) => setHoverCapable(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return hoverCapable
}

// Custom tooltip shown next to icons while the sidebar is collapsed
// and not currently being peeked open.
function IconLabel({ label, show }: { label: string; show: boolean }) {
  if (!show) return null
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 scale-95 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-all duration-150 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100"
    >
      {label}
    </span>
  )
}

type SidebarProps = {
  userEmail?: string | null
  userAvatarUrl?: string | null
}

export function Sidebar({
  userEmail,
  userAvatarUrl,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { expanded, toggle } = useSidebar()

  // Hover-to-peek: temporarily shows the full sidebar as an overlay
  // without pushing main content. Only active on real hover-capable
  // devices (mouse/trackpad) — disabled on touch so it can't get stuck.
  const hoverCapable = useHoverCapable()
  const [peeking, setPeeking] = useState(false)
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visualExpanded = expanded || peeking

  function handleMouseEnter() {
    if (!hoverCapable || expanded) return
    peekTimeout.current = setTimeout(() => setPeeking(true), 150)
  }

  function handleMouseLeave() {
    if (peekTimeout.current) clearTimeout(peekTimeout.current)
    setPeeking(false)
  }

  // Safety net: if any touch interaction happens, force-close peek.
  // Covers hybrid devices (touch laptops, some tablets) that can fire
  // mouseenter without a reliable mouseleave.
  useEffect(() => {
    function handleTouchStart() {
      setPeeking(false)
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => window.removeEventListener('touchstart', handleTouchStart)
  }, [])

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card'

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-40 transition-[width] duration-200',
        visualExpanded ? 'w-60' : 'w-[72px]',
        peeking && 'shadow-2xl shadow-black/40'
      )}
    >
      {/* Logo + Avatar */}
      <div
        className={cn(
          'p-4 border-b border-border flex items-center',
          visualExpanded ? 'justify-between' : 'flex-col gap-3'
        )}
      >
        <div className={cn('flex items-center', visualExpanded ? 'gap-2' : '')}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
              <g transform="translate(0, 20)">
                <path
                  d="M 56,256 A200,200 0 0,1 456,256"
                  fill="none"
                  stroke="#f6d365"
                  strokeWidth="20"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M 106,256 A150,150 0 0,1 406,256"
                  fill="none"
                  stroke="#f6d365"
                  strokeWidth="20"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M 156,256 A100,100 0 0,1 356,256"
                  fill="none"
                  stroke="#f6d365"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <line
                  x1="256"
                  y1="256"
                  x2="256"
                  y2="355"
                  stroke="#f6d365"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <circle cx="256" cy="256" r="26" fill="#86efac" />
                <line
                  x1="272"
                  y1="272"
                  x2="320"
                  y2="320"
                  stroke="#86efac"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {visualExpanded && (
            <span className="font-bold text-lg tracking-tight whitespace-nowrap">
              Qestly
            </span>
          )}
        </div>

        <AvatarMenu
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          align={visualExpanded ? 'right' : 'left'}
        />
      </div>

      {/* New Application */}
      <div className="p-3 border-b border-border">
        <div className="relative group/tooltip">
          <Link
            href="/applications/new"
            aria-label={!visualExpanded ? 'New Application' : undefined}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary/90 text-on-primary text-sm font-medium rounded-xl transition-colors',
              !visualExpanded && 'px-0',
              focusRing
            )}
          >
            <Plus size={16} className="shrink-0" />
            {visualExpanded && <span className="whitespace-nowrap">New Application</span>}
          </Link>
          <IconLabel label="New Application" show={!visualExpanded} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')

          return (
            <div key={href} className="relative group/tooltip">
              <Link
                href={href}
                aria-label={!visualExpanded ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                  !visualExpanded && 'justify-center px-0',
                  active
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-muted hover:text-foreground hover:bg-white/5',
                  focusRing
                )}
              >
                <Icon size={18} className="shrink-0" />
                {visualExpanded && <span className="whitespace-nowrap">{label}</span>}
              </Link>
              <IconLabel label={label} show={!visualExpanded} />
            </div>
          )
        })}
      </nav>

      {/* Collapse Button */}
      <div className="px-3 pb-3">
        <div className="relative group/tooltip">
          <button
            onClick={toggle}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors w-full',
              !visualExpanded && 'justify-center px-0',
              focusRing
            )}
          >
            <ChevronLeft
              size={18}
              className={cn('shrink-0 transition-transform duration-200', !expanded && 'rotate-180')}
            />
            {visualExpanded && (
              <span className="whitespace-nowrap">
                {expanded ? 'Collapse Sidebar' : 'Pin Sidebar Open'}
              </span>
            )}
          </button>
          <IconLabel label={expanded ? 'Collapse' : 'Expand (⌘B)'} show={!visualExpanded} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        {visualExpanded ? (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted px-2">Appearance</span>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}

        <div className="relative group/tooltip">
          <button
            onClick={signOut}
            aria-label={!visualExpanded ? 'Sign Out' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors w-full',
              !visualExpanded && 'justify-center px-0',
              focusRing
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {visualExpanded && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
          <IconLabel label="Sign Out" show={!visualExpanded} />
        </div>
      </div>
    </aside>
  )
}