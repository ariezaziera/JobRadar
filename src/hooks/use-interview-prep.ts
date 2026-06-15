import { useState } from 'react'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface InterviewQuestion {
  category: string
  question: string
  tip: string
  difficulty: Difficulty
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; questions: InterviewQuestion[] }
  | { status: 'error'; message: string }

export function useInterviewPrep() {
  const [state, setState] = useState<State>({ status: 'idle' })

  async function generate(applicationId: string) {
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/generate-interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })
      const json = await res.json()
      if (!res.ok) {
        setState({ status: 'error', message: json.error ?? 'Generation failed.' })
        return null
      }
      setState({ status: 'success', questions: json.questions })
      return json.questions as InterviewQuestion[]
    } catch {
      setState({ status: 'error', message: 'Network error. Check your connection.' })
      return null
    }
  }

  function reset() { setState({ status: 'idle' }) }

  return { state, generate, reset }
}