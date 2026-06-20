'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BriefcaseBusiness, Kanban,
  Plus, Map, Compass, MoreHorizontal, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',    icon: LayoutDashboard,   label: 'Dashboard'    },
  { href: '/applications', icon: BriefcaseBusiness, label: 'Applications' },
]

const NAV_RIGHT = [
  { href: '/board', icon: Kanban, label: 'Board' },
]

const MORE_ITEMS = [
  { href: '/map',      icon: Map,     label: 'Map'      },
  { href: '/discover', icon: Compass, label: 'Discover' },
]

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const moreActive = MORE_ITEMS.some(({ href }) => isActive(href))

  return (
    <>
      {/* More sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-card border-t border-border rounded-t-3xl p-4 pb-8 safe-area-pb animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-semibold text-foreground">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-1">
              {MORE_ITEMS.map(({ href, icon: Icon, label }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors',
                      active
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'text-muted hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-[1000] md:hidden bg-card/90 backdrop-blur-md border-t border-border">
  <div className="grid grid-cols-5 items-end px-2 pt-2 pb-2 safe-area-pb">
    {NAV.map(({ href, icon: Icon, label }) => {
      const active = isActive(href)
      return (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-col items-center gap-1 py-2 rounded-xl transition-colors',
            active ? 'text-primary' : 'text-muted hover:text-foreground'
          )}
        >
          <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
          <span className={cn('text-[10px] font-medium truncate', active ? 'text-primary' : 'text-muted')}>
            {label}
          </span>
        </Link>
      )
    })}

    {/* Center raised FAB */}
    <Link href="/applications/new" className="flex flex-col items-center -translate-y-3" aria-label="New Application">
      <span className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <Plus size={26} strokeWidth={2.4} />
      </span>
    </Link>

    {NAV_RIGHT.map(({ href, icon: Icon, label }) => {
      const active = isActive(href)
      return (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-col items-center gap-1 py-2 rounded-xl transition-colors',
            active ? 'text-primary' : 'text-muted hover:text-foreground'
          )}
        >
          <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
          <span className={cn('text-[10px] font-medium truncate', active ? 'text-primary' : 'text-muted')}>
            {label}
          </span>
        </Link>
      )
    })}

    <button
      onClick={() => setMoreOpen(true)}
      className={cn(
        'flex flex-col items-center gap-1 py-2 rounded-xl transition-colors',
        moreActive ? 'text-primary' : 'text-muted hover:text-foreground'
      )}
    >
      <MoreHorizontal size={20} strokeWidth={moreActive ? 2.2 : 1.8} />
      <span className={cn('text-[10px] font-medium truncate', moreActive ? 'text-primary' : 'text-muted')}>
        More
      </span>
    </button>
  </div>
</nav>
    </>
  )
}