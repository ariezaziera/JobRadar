import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { applicationId } = await request.json()
    if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

    const [{ data: app }, { data: profile }] = await Promise.all([
      supabase.from('applications').select('*').eq('id', applicationId).single(),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ])

    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    const prompt = `You are a senior hiring manager and interview coach preparing a candidate for a job interview.

Job details:
- Position: ${app.position}
- Company: ${app.company}
- Experience level: ${app.experience_level ?? 'not specified'}
- Required skills: ${app.required_skills?.join(', ') || 'not specified'}
- Job summary: ${app.summary ?? 'not provided'}

Candidate profile:
- Skills: ${profile?.skills?.join(', ') || 'not specified'}
- Target role: ${profile?.target_role ?? 'not specified'}

Generate 15 interview questions across these exact categories. Return ONLY a valid JSON array with no markdown, no backticks:
[
  {
    "category": "Behavioral",
    "question": "...",
    "tip": "...",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Categories to cover (use these exact category names):
- Behavioral (4 questions) — STAR-method questions about past experience
- Technical (4 questions) — specific to the required skills listed
- Situational (3 questions) — hypothetical scenarios relevant to the role
- Culture Fit (2 questions) — values, teamwork, work style
- Role Specific (2 questions) — deep questions about the position responsibilities

For each question:
- "tip": a short 1-sentence coaching tip on how to answer it well
- "difficulty": easy / medium / hard based on how tough the question is
- Make questions specific to this exact role and company, not generic

Return ONLY the JSON array, no markdown, no backticks, no explanation.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    let questions
    try {
      const clean = text.replace(/```json|```/g, '').trim()
      questions = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response.' }, { status: 500 })
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'Unexpected response format.' }, { status: 500 })
    }

    return NextResponse.json({ questions })

  } catch (err) {
    console.error('interview-prep error:', err)
    return NextResponse.json({ error: 'Generation failed. Try again.' }, { status: 500 })
  }
}