import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePlanSchema } from '@/lib/validators/plan'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { buildLearningPlanPrompt, SYSTEM_PROMPT } from '@/lib/prompts/learning-plan'
import { parsePlanResponse } from '@/lib/prompts/plan-parser'
import { z } from 'zod'
import { ChildProfile } from '@/types/child'

const DAILY_PLAN_LIMIT = 10

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
    const body = await req.json()
    const data = generatePlanSchema.parse(body)

    const child = await prisma.child.findFirst({
      where: { id: data.childId, userId: session.user.id },
    })
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // Rate limit: 10 plans per user per day
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

    const childProfile: ChildProfile = {
      ...child,
      strengths: JSON.parse(child.strengths),
      challenges: JSON.parse(child.challenges),
      sensoryPreferences: JSON.parse(child.sensoryPreferences),
      interests: JSON.parse(child.interests),
      dateOfBirth: child.dateOfBirth.toISOString(),
      createdAt: child.createdAt.toISOString(),
      updatedAt: child.updatedAt.toISOString(),
    }

    const userPrompt = buildLearningPlanPrompt(childProfile, data.focusArea, data.additionalContext)

    let rawResponse = ''
    let attempt = 0
    const maxAttempts = 3

    while (attempt < maxAttempts) {
      attempt++
      try {
        const message = await anthropic.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        })

        rawResponse = message.content
          .filter((c) => c.type === 'text')
          .map((c) => (c as { type: 'text'; text: string }).text)
          .join('')

        break
      } catch (err) {
        if (attempt === maxAttempts) throw err
        await new Promise((r) => setTimeout(r, 1000 * attempt))
      }
    }

    const parsed = parsePlanResponse(rawResponse)

    const plan = await prisma.learningPlan.create({
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
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    console.error('Plan generation error:', err)
    return NextResponse.json(
      { error: 'Failed to generate plan. Please try again.' },
      { status: 500 }
    )
  }
}
