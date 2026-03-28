import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProgressEntrySchema } from '@/lib/validators/progress'
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

  const planId = searchParams.get('planId')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const entries = await prisma.progressEntry.findMany({
    where: {
      childId,
      ...(planId ? { planId } : {}),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(
    entries.map((e) => ({
      ...e,
      date: e.date.toISOString(),
      createdAt: e.createdAt.toISOString(),
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
    const data = createProgressEntrySchema.parse(body)

    const child = await prisma.child.findFirst({
      where: { id: data.childId, userId: session.user.id },
    })
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    const entry = await prisma.progressEntry.create({
      data: {
        childId: data.childId,
        planId: data.planId,
        goalDescription: data.goalDescription,
        rating: data.rating,
        notes: data.notes,
        date: new Date(data.date),
      },
    })

    return NextResponse.json(
      {
        ...entry,
        date: entry.date.toISOString(),
        createdAt: entry.createdAt.toISOString(),
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
