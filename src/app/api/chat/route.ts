import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CLAUDE_MODEL } from '@/lib/anthropic'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
})

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  planContext: z.string().max(8000).optional(),
})

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
  return new Anthropic({ apiKey })
}

const CHAT_SYSTEM_PROMPT = `You are Lumen, a friendly and knowledgeable autism education specialist assistant built into Lumio. You help teachers and parents understand and implement a child's personalized learning support plan.

Your role:
- Answer questions about specific goals, strategies, accommodations, and materials in the plan
- Explain WHY certain strategies were recommended for this student
- Suggest practical tips for implementing strategies at home or in the classroom
- Help interpret progress and suggest adjustments
- Offer encouragement and support to educators and families

IMPORTANT:
- Be warm, approachable, and non-clinical in your language
- Use the plan context provided to give specific, relevant answers
- If asked something outside the scope of the plan or education support, gently redirect
- Keep responses concise but complete — typically 2-4 paragraphs at most
- Never diagnose or provide medical advice`

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = chatRequestSchema.parse(body)

    const systemPrompt = data.planContext
      ? `${CHAT_SYSTEM_PROMPT}\n\n---\nCURRENT LEARNING PLAN CONTEXT:\n${data.planContext}`
      : CHAT_SYSTEM_PROMPT

    const client = getAnthropicClient()

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: data.messages,
    })

    const text = message.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as { type: 'text'; text: string }).text)
      .join('')

    return NextResponse.json({ message: text })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to get response from Lumen' }, { status: 500 })
  }
}
