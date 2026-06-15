'use client'

import { useState, useEffect } from 'react'
import { Radar, X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already installed — running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // User dismissed before
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed')
    if (wasDismissed) return

    function handler(e: Event) {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      // Show after 3 seconds so it's not immediately jarring
      setTimeout(() => setShow(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setShow(false)
    }
  }

  function handleDismiss() {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('pwa-banner-dismissed', '1')
  }

  if (!show || installed || dismissed) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-in">
      <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Radar size={20} color="white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm mb-0.5">Install JobRadar</p>
            <p className="text-xs text-muted leading-relaxed">
              Add to your home screen for faster access and offline support.
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/10 text-muted hover:text-foreground transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 border border-border hover:border-primary/40 text-muted text-xs rounded-xl transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Download size={13} />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}