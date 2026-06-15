'use client'

import { useState, useMemo } from 'react'
import { useInterviewPrep, type InterviewQuestion } from '@/hooks/use-interview-prep'
import {
  X, Sparkles, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Lightbulb,
  RefreshCw, Brain, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Application } from '@/types'

const CATEGORIES = ['All', 'Behavioral', 'Technical', 'Situational', 'Culture Fit', 'Role Specific']

const DIFFICULTY_STYLES: Record<string, string> = {
  easy:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400  bg-amber-500/10  border-amber-500/20',
  hard:   'text-red-400    bg-red-500/10    border-red-500/20',
}

const CATEGORY_COLORS: Record<string, string> = {
  Behavioral:   '#6366F1',
  Technical:    '#22D3EE',
  Situational:  '#F59E0B',
  'Culture Fit':'#10B981',
  'Role Specific': '#8B5CF6',
}

interface Props {
  application: Application
  onClose: () => void
}

export function InterviewPrepModal({ application, onClose }: Props) {
  const { state, generate, reset } = useInterviewPrep()
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [practiced, setPracticed] = useState<Set<number>>(new Set())

  async function handleGenerate() {
    await generate(application.id)
  }

  function togglePracticed(idx: number) {
    setPracticed(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const filtered = useMemo(() => {
    if (state.status !== 'success') return []
    return activeCategory === 'All'
      ? state.questions
      : state.questions.filter(q => q.category === activeCategory)
  }, [state, activeCategory])

  const progress = state.status === 'success'
    ? Math.round((practiced.size / state.questions.length) * 100)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
              <Brain size={18} className="text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Interview Prep</h2>
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
        <div className="flex-1 overflow-y-auto">

          {/* Idle */}
          {state.status === 'idle' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <Brain size={28} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Ready to prep?</h3>
              <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                AI will generate 15 tailored interview questions across behavioral,
                technical, situational, culture fit, and role-specific categories.
              </p>

              {/* Category preview pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {CATEGORIES.slice(1).map(cat => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      color: CATEGORY_COLORS[cat],
                      backgroundColor: `${CATEGORY_COLORS[cat]}15`,
                      borderColor: `${CATEGORY_COLORS[cat]}30`,
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {state.status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 size={28} className="animate-spin text-accent" />
              <p className="text-sm text-muted">Generating your interview questions…</p>
            </div>
          )}

          {/* Error */}
          {state.status === 'error' && (
            <div className="p-6">
              <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                {state.message}
              </div>
            </div>
          )}

          {/* Success */}
          {state.status === 'success' && (
            <div className="p-6 space-y-5">

              {/* Progress bar */}
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted">Practice progress</span>
                  <span className="font-mono font-medium">
                    {practiced.size}/{state.questions.length} done
                  </span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {progress === 100 && (
                  <p className="text-xs text-accent mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    All questions practiced — you're ready!
                  </p>
                )}
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
                      activeCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-background border border-border text-muted hover:text-foreground'
                    )}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="ml-1.5 opacity-60">
                        {state.questions.filter(q => q.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Questions */}
              <div className="space-y-2">
                {filtered.map((q, idx) => {
                  const globalIdx = state.questions.indexOf(q)
                  const isExpanded = expandedId === globalIdx
                  const isDone = practiced.has(globalIdx)
                  const color = CATEGORY_COLORS[q.category] ?? '#6366F1'

                  return (
                    <div
                      key={globalIdx}
                      className={cn(
                        'rounded-xl border transition-colors overflow-hidden',
                        isDone
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : 'border-border bg-background hover:border-primary/30'
                      )}
                    >
                      {/* Question row */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : globalIdx)}
                        className="w-full flex items-start gap-3 p-4 text-left"
                      >
                        {/* Category dot */}
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-md"
                              style={{
                                color,
                                backgroundColor: `${color}15`,
                              }}
                            >
                              {q.category}
                            </span>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-md border font-mono',
                                DIFFICULTY_STYLES[q.difficulty]
                              )}
                            >
                              {q.difficulty}
                            </span>
                            {isDone && (
                              <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={11} />
                                Practiced
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium leading-snug">{q.question}</p>
                        </div>

                        <div className="flex-shrink-0 text-muted">
                          {isExpanded
                            ? <ChevronUp size={16} />
                            : <ChevronDown size={16} />
                          }
                        </div>
                      </button>

                      {/* Expanded tip */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          {/* Tip */}
                          <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Lightbulb size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200 leading-relaxed">{q.tip}</p>
                          </div>

                          {/* Mark practiced */}
                          <button
                            onClick={() => togglePracticed(globalIdx)}
                            className={cn(
                              'w-full py-2 rounded-xl text-xs font-medium transition-colors border',
                              isDone
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'border-border hover:border-primary/40 text-muted hover:text-foreground'
                            )}
                          >
                            {isDone ? '✓ Marked as practiced' : 'Mark as practiced'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex-shrink-0 flex gap-3">
          {state.status === 'success' ? (
            <>
              <button
                onClick={() => { reset(); setPracticed(new Set()) }}
                className="flex items-center gap-2 px-4 py-3 border border-border hover:border-primary/40 text-muted hover:text-foreground rounded-xl text-sm transition-colors"
              >
                <RefreshCw size={15} />
                Regenerate
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-border hover:border-primary/40 text-foreground rounded-xl transition-colors font-medium text-sm"
              >
                Done
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={state.status === 'loading'}
              className="w-full py-3.5 bg-accent/90 hover:bg-accent disabled:opacity-50 text-background font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {state.status === 'loading'
                ? <><Loader2 size={18} className="animate-spin" /> Generating…</>
                : <><Sparkles size={18} /> Generate Questions</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  )
}