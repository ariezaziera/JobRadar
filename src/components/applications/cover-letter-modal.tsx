'use client'

import { useState } from 'react'
import { useCoverLetter, type Tone } from '@/hooks/use-cover-letter'
import {
  X, Sparkles, Loader2, Copy, Check,
  RefreshCw, FileText, AlertCircle, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Application } from '@/types'

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional',    desc: 'Formal and polished'        },
  { value: 'confident',    label: 'Confident',       desc: 'Bold and assertive'         },
  { value: 'conversational', label: 'Conversational', desc: 'Warm and approachable'    },
  { value: 'enthusiastic', label: 'Enthusiastic',    desc: 'Energetic and passionate'  },
]

interface Props {
  application: Application
  onClose: () => void
}

export function CoverLetterModal({ application, onClose }: Props) {
  const { state, generate, reset } = useCoverLetter()
  const [tone, setTone] = useState<Tone>('professional')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    await generate(application.id, tone)
  }

  async function handleCopy() {
    if (state.status !== 'success') return
    await navigator.clipboard.writeText(state.letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRegenerate() {
    reset()
    handleGenerate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Cover Letter</h2>
              <p className="text-xs text-muted">
                {application.position} at {application.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Tone selector */}
          {state.status !== 'success' && (
            <div>
              <p className="text-sm font-medium mb-3">Tone</p>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={cn(
                      'flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-colors',
                      tone === t.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted hover:border-primary/30 hover:text-foreground'
                    )}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="text-xs opacity-70 mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Idle state */}
          {state.status === 'idle' && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-primary" />
              </div>
              <p className="text-sm text-muted max-w-xs mx-auto">
                AI will write a tailored cover letter using your profile skills
                and the job requirements.
              </p>
            </div>
          )}

          {/* Loading */}
          {state.status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-sm text-muted">Writing your cover letter…</p>
            </div>
          )}

          {/* Error */}
          {state.status === 'error' && (
            <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              {state.message}
            </div>
          )}

          {/* Success */}
          {state.status === 'success' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-accent flex items-center gap-2">
                  <Sparkles size={14} />
                  Generated with {tone} tone
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 text-muted hover:text-foreground text-xs transition-colors"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      copied
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20'
                    )}
                  >
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-background border border-border">
                <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {state.letter}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex-shrink-0">
          {state.status !== 'success' ? (
            <button
              onClick={handleGenerate}
              disabled={state.status === 'loading'}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
            >
              {state.status === 'loading'
                ? <><Loader2 size={18} className="animate-spin" /> Generating…</>
                : <><Sparkles size={18} /> Generate Cover Letter</>
              }
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 border border-border hover:border-primary/40 text-foreground rounded-xl transition-colors font-medium"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}