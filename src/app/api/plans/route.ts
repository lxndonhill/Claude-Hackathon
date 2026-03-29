import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePlanSchema } from '@/lib/validators/plan'
import { CLAUDE_MODEL } from '@/lib/anthropic'
import { buildLearningPlanPrompt, SYSTEM_PROMPT, PreviousPlanSummary, PreviousProgressSummary } from '@/lib/prompts/learning-plan'
import { RATING_LABELS } from '@/types/progress'
import { parsePlanResponse } from '@/lib/prompts/plan-parser'
import { z } from 'zod'
import { ChildProfile } from '@/types/child'
import Anthropic from '@anthropic-ai/sdk'

const DAILY_PLAN_LIMIT = 10

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
  }
  return new Anthropic({ apiKey })
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const childId = searchParams.get('childId')
  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 })
  }

  const child = await prisma.child.findFirst({
    where: { id: childId, userId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const plans = await prisma.learningPlan.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    plans.map((p) => ({
      ...p,
      goals: JSON.parse(p.goals),
      strategies: JSON.parse(p.strategies),
      accommodations: JSON.parse(p.accommodations),
      materials: JSON.parse(p.materials),
      weeklyStructure: JSON.parse(p.weeklyStructure),
      assessmentMethods: JSON.parse(p.assessmentMethods),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  )
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // --- 1. Validate request body ---
    const body = await req.json()
    const data = generatePlanSchema.parse(body)
    console.log('[plans/POST] Request validated:', { childId: data.childId, focusArea: data.focusArea })

    // --- 2. Verify child ownership ---
    const child = await prisma.child.findFirst({
      where: { id: data.childId, userId: session.user.id },
    })
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // --- 3. Rate limit check ---
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await prisma.learningPlan.count({
      where: {
        child: { userId: session.user.id },
        createdAt: { gte: today },
      },
    })
    if (todayCount >= DAILY_PLAN_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit of ${DAILY_PLAN_LIMIT} plans reached. Try again tomorrow.` },
        { status: 429 }
      )
    }

    // --- 4. Build prompt with previous context ---
    const childProfile: ChildProfile = {
      ...child,
      strengths: JSON.parse(child.strengths),
      challenges: JSON.parse(child.challenges),
      sensoryPreferences: JSON.parse(child.sensoryPreferences),
      interests: JSON.parse(child.interests),
      dateOfBirth: child.dateOfBirth.toISOString(),
      createdAt: child.createdAt.toISOString(),
      updatedAt: child.updatedAt.toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as ChildProfile

    const [prevPlansRaw, prevProgressRaw] = await Promise.all([
      prisma.learningPlan.findMany({
        where: { childId: data.childId },
        orderBy: { createdAt: 'desc' },
        take: 2,
        select: { title: true, focusArea: true, goals: true, createdAt: true },
      }),
      prisma.progressEntry.findMany({
        where: { childId: data.childId },
        orderBy: { date: 'desc' },
        take: 10,
        select: { goalDescription: true, rating: true, date: true },
      }),
    ])

    const previousPlans: PreviousPlanSummary[] = prevPlansRaw.map((p) => ({
      title: p.title,
      focusArea: p.focusArea,
      goalDescriptions: (JSON.parse(p.goals) as { description: string }[]).map((g) => g.description),
      createdAt: p.createdAt.toISOString(),
    }))

    const previousProgress: PreviousProgressSummary[] = prevProgressRaw.map((e) => ({
      goalDescription: e.goalDescription,
      rating: e.rating,
      ratingLabel: RATING_LABELS[e.rating] ?? String(e.rating),
      date: e.date.toISOString(),
    }))

    const userPrompt = buildLearningPlanPrompt(
      childProfile,
      data.focusArea,
      data.additionalContext,
      previousPlans,
      previousProgress
    )

    // --- 5. Call Claude API ---
    console.log('[plans/POST] Calling Claude API with model:', CLAUDE_MODEL)
    let anthropicClient: Anthropic
    try {
      anthropicClient = getAnthropicClient()
    } catch (err) {
      console.error('[plans/POST] Anthropic client init failed:', err)
      return NextResponse.json({ error: 'API key not configured on server' }, { status: 500 })
    }

    let rawResponse = ''
    let attempt = 0
    const maxAttempts = 3

    while (attempt < maxAttempts) {
      attempt++
      try {
        const message = await anthropicClient.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        })
        console.log('[plans/POST] Claude responded, stop_reason:', message.stop_reason, 'content blocks:', message.content.length)

        rawResponse = message.content
          .filter((c) => c.type === 'text')
          .map((c) => (c as { type: 'text'; text: string }).text)
          .join('')

        console.log('[plans/POST] Raw response length:', rawResponse.length, 'preview:', rawResponse.slice(0, 120))
        break
      } catch (err) {
        const apiErr = err as { status?: number; message?: string }
        console.error(`[plans/POST] Claude API attempt ${attempt} failed:`, {
          status: apiErr?.status,
          message: apiErr?.message,
          err,
        })
        if (attempt === maxAttempts) {
          const msg = apiErr?.message ?? 'Unknown Anthropic API error'
          return NextResponse.json({ error: `Lumen API error: ${msg}` }, { status: 502 })
        }
        await new Promise((r) => setTimeout(r, 1000 * attempt))
      }
    }

    // --- 6. Parse Claude response ---
    let parsed
    try {
      parsed = parsePlanResponse(rawResponse)
      console.log('[plans/POST] Plan parsed successfully, title:', parsed.title)
    } catch (err) {
      console.error('[plans/POST] Failed to parse plan response:', err)
      console.error('[plans/POST] Raw response was:', rawResponse)
      return NextResponse.json(
        { error: 'Lumen returned an unexpected response format. Please try again.' },
        { status: 500 }
      )
    }

    // --- 7. Save to database ---
    let plan
    try {
      plan = await prisma.learningPlan.create({
        data: {
          childId: data.childId,
          title: parsed.title,
          focusArea: data.focusArea,
          goals: JSON.stringify(parsed.goals),
          strategies: JSON.stringify(parsed.strategies),
          accommodations: JSON.stringify(parsed.accommodations),
          materials: JSON.stringify(parsed.materials),
          weeklyStructure: JSON.stringify(parsed.weeklyStructure),
          assessmentMethods: JSON.stringify(parsed.assessmentMethods),
          rawResponse,
          promptUsed: userPrompt,
          modelVersion: CLAUDE_MODEL,
        },
      })
      console.log('[plans/POST] Plan saved to DB, id:', plan.id)
    } catch (err) {
      console.error('[plans/POST] Database save failed:', err)
      return NextResponse.json({ error: 'Failed to save plan to database.' }, { status: 500 })
    }

    return NextResponse.json(
      {
        ...plan,
        ...parsed,
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.message
      console.error('[plans/POST] Validation error:', messages)
      return NextResponse.json({ error: `Invalid request: ${messages}` }, { status: 400 })
    }
    console.error('[plans/POST] Unhandled error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred. Check server logs.' }, { status: 500 })
  }
}
