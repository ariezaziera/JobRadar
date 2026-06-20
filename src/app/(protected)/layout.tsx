import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { MobileHeader } from '@/components/layout/mobile-header'
import { InstallBanner } from '@/components/ui/install-banner'
import { IdleTimeoutProvider } from '@/components/providers/idle-timeout-provider'
import { SidebarProvider } from '@/components/providers/sidebar-provider'
import { MainContent } from '@/components/layout/main-content'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <IdleTimeoutProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <div className="hidden md:block">
            <Sidebar
              userEmail={user.email}
              userAvatarUrl={user.user_metadata?.avatar_url}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <MobileHeader
              userEmail={user.email}
              userAvatarUrl={user.user_metadata?.avatar_url}
            />
            <MainContent>{children}</MainContent>
          </div>
          <MobileNav />
          <InstallBanner />
        </div>
      </SidebarProvider>
    </IdleTimeoutProvider>
  )
}