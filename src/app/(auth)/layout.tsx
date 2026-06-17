import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow */}
        <div className="glow-blob absolute -top-32 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="glow-blob absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2 relative">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
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
          <span className="font-bold text-xl tracking-tight">Qestly</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Your entire job<br />
            search in one place.
          </h2>
          <p className="text-muted leading-relaxed mb-10">
            AI extracts job details, match scores rank your fit,
            and a Kanban board shows your full pipeline at a glance.
          </p>

          {/* Mini feature list */}
          <div className="space-y-3">
            {[
              'Paste a URL — AI fills the rest',
              'Match score vs your skills',
              'Drag-and-drop Kanban board',
              'Analytics dashboard',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p className="text-xs text-muted/60 font-mono relative">
          Track Every Application, Land Every Opportunity
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
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
            <span className="font-bold text-lg">Qestly</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}