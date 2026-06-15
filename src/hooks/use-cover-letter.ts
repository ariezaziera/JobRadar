import { useState } from 'react'

export type Tone = 'professional' | 'confident' | 'conversational' | 'enthusiastic'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; letter: string }
  | { status: 'error'; message: string }

export function useCoverLetter() {
  const [state, setState] = useState<State>({ status: 'idle' })

  async function generate(applicationId: string, tone: Tone) {
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, tone }),
      })
      const json = await res.json()
      if (!res.ok) {
        setState({ status: 'error', message: json.error ?? 'Generation failed.' })
        return null
      }
      setState({ status: 'success', letter: json.letter })
      return json.letter as string
    } catch {
      setState({ status: 'error', message: 'Network error. Check your connection.' })
      return null
    }
  }

  function reset() { setState({ status: 'idle' }) }

  return { state, generate, reset }
}