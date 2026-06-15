'use client'

import { useState } from 'react'
import { useReminders } from '@/hooks/use-reminders'
import {
  Bell, Plus, Trash2, Loader2,
  Clock, CheckCircle2, X, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReminderType } from '@/types'

const TYPES: { value: ReminderType; label: string; desc: string }[] = [
  { value: 'follow_up', label: 'Follow Up',  desc: 'Remind to follow up on application' },
  { value: 'interview',  label: 'Interview',  desc: 'Interview reminder'                 },
  { value: 'deadline',   label: 'Deadline',   desc: 'Application deadline'               },
  { value: 'custom',     label: 'Custom',     desc: 'Custom reminder'                    },
]

const TYPE_COLORS: Record<string, string> = {
  follow_up: '#22D3EE',
  interview:  '#6366F1',
  deadline:   '#EF4444',
  custom:     '#F59E0B',
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'text-amber-400',
  sent:      'text-emerald-400',
  cancelled: 'text-muted',
}

interface Props {
  applicationId: string
}

export function RemindersPanel({ applicationId }: Props) {
  const { reminders, loading, createReminder, deleteReminder } = useReminders(applicationId)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: 'follow_up' as ReminderType,
    message: '',
    remind_at: '',
  })

  async function handleSubmit() {
    if (!form.remind_at) return
    setSubmitting(true)
    await createReminder(form)
    setForm({ type: 'follow_up', message: '', remind_at: '' })
    setShowForm(false)
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteReminder(id)
    setDeletingId(null)
  }

  // Min datetime — now + 5 minutes
  const minDatetime = new Date(Date.now() + 5 * 60000)
    .toISOString().slice(0, 16)

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell size={16} className="text-muted" />
          Reminders
        </h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-medium transition-colors"
        >
          <Plus size={13} />
          Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-4 rounded-xl bg-background border border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">New reminder</p>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted">Type</label>
            <div className="relative">
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as ReminderType }))}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground appearance-none focus:outline-none focus:border-primary transition-colors"
              >
                {TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>

          {/* Datetime */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted">Remind at</label>
            <input
              type="datetime-local"
              min={minDatetime}
              value={form.remind_at}
              onChange={e => setForm(f => ({ ...f, remind_at: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted">Note (optional)</label>
            <input
              type="text"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="e.g. Ask about remote policy"
              className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.remind_at || submitting}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submitting
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : <><Bell size={14} /> Set Reminder</>
            }
          </button>
        </div>
      )}

      {/* Reminders list */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted">No reminders set.</p>
          <p className="text-xs text-muted/60 mt-1">
            Add one to get emailed at the right time.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.map(r => {
            const color = TYPE_COLORS[r.type] ?? '#6B7280'
            const isPast = new Date(r.remind_at) < new Date()
            return (
              <div
                key={r.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border group"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color }}
                    >
                      {TYPES.find(t => t.value === r.type)?.label}
                    </span>
                    <span className={cn('text-xs flex items-center gap-1', STATUS_STYLES[r.status])}>
                      {r.status === 'sent'
                        ? <><CheckCircle2 size={10} /> Sent</>
                        : r.status === 'pending' && isPast
                          ? <><Clock size={10} /> Processing</>
                          : <><Clock size={10} /> Pending</>
                      }
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted">
                    {new Date(r.remind_at).toLocaleString('en-MY', {
                      day: 'numeric', month: 'short',
                      year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {r.message && (
                    <p className="text-xs text-muted/70 mt-1 truncate">{r.message}</p>
                  )}
                </div>
                {r.status === 'pending' && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/15 text-muted hover:text-red-400 transition-all shrink-0"
                  >
                    {deletingId === r.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />
                    }
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}