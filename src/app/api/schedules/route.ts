import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createScheduleSchema } from '@/lib/validators/schedule'
import { z } from 'zod'

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

  const schedules = await prisma.schedule.findMany({
    where: { childId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    schedules.map((s) => ({
      ...s,
      blocks: JSON.parse(s.blocks),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
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
    const data = createScheduleSchema.parse(body)

    const child = await prisma.child.findFirst({
      where: { id: data.childId, userId: session.user.id },
    })
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    const schedule = await prisma.schedule.create({
      data: {
        childId: data.childId,
        title: data.title,
        dayOfWeek: data.dayOfWeek,
        blocks: JSON.stringify(data.blocks),
        isTemplate: data.isTemplate,
      },
    })

    return NextResponse.json(
      {
        ...schedule,
        blocks: data.blocks,
        createdAt: schedule.createdAt.toISOString(),
        updatedAt: schedule.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
