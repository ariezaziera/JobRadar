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

    const { applicationId, tone } = await request.json()
    if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

    const [{ data: app }, { data: profile }] = await Promise.all([
      supabase.from('applications').select('*').eq('id', applicationId).single(),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ])

    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    const prompt = `You are an expert career coach writing a professional cover letter.

Candidate profile:
- Name: ${profile?.full_name ?? 'the candidate'}
- Skills: ${profile?.skills?.join(', ') || 'not specified'}
- Target role: ${profile?.target_role ?? 'not specified'}

Job details:
- Position: ${app.position}
- Company: ${app.company}
- Location: ${app.location ?? 'not specified'}
- Experience level: ${app.experience_level ?? 'not specified'}
- Required skills: ${app.required_skills?.join(', ') || 'not specified'}
- Salary range: ${app.salary_range ?? 'not specified'}
- Job summary: ${app.summary ?? 'not provided'}

Tone: ${tone ?? 'professional'}

Write a compelling cover letter with:
1. Strong opening paragraph that shows genuine interest in the company and role
2. Middle paragraph highlighting relevant skills and experience that match the requirements
3. Brief paragraph showing cultural fit and enthusiasm
4. Professional closing with call to action

Rules:
- Address it "Dear Hiring Manager" if no contact name
- Keep it to 3-4 paragraphs, under 350 words
- Do NOT use placeholder text like [Your Name] — use the actual candidate name
- Make it specific to this company and role, not generic
- Tone must be: ${tone ?? 'professional'}
- End with: Sincerely, ${profile?.full_name ?? 'the candidate'}
- Return ONLY the cover letter text, no extra commentary`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    const letter = completion.choices[0]?.message?.content?.trim() ?? ''

    return NextResponse.json({ letter })

  } catch (err) {
    console.error('cover-letter error:', err)
    return NextResponse.json({ error: 'Generation failed. Try again.' }, { status: 500 })
  }
}