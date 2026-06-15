import { useState, useEffect } from 'react'
import type { Reminder } from '@/types'

export function useReminders(applicationId: string) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchReminders() {
    setLoading(true)
    try {
      const res = await fetch(`/api/reminders?applicationId=${applicationId}`)
      const json = await res.json()
      setReminders(json.reminders ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function createReminder(data: {
    type: string
    message?: string
    remind_at: string
  }) {
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId, ...data }),
    })
    const json = await res.json()
    if (json.reminder) setReminders(prev => [...prev, json.reminder])
    return json.reminder
  }

  async function deleteReminder(id: string) {
    await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' })
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  useEffect(() => { fetchReminders() }, [applicationId])

  return { reminders, loading, createReminder, deleteReminder }
}