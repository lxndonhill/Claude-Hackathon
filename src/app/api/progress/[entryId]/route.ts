import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateProgressEntrySchema } from '@/lib/validators/progress'
import { z } from 'zod'

async function getEntryAndVerifyOwnership(entryId: string, userId: string) {
  const entry = await prisma.progressEntry.findUnique({
    where: { id: entryId },
    include: { child: true },
  })
  if (!entry || entry.child.userId !== userId) return null
  return entry
}

export async function PUT(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entry = await getEntryAndVerifyOwnership(params.entryId, session.user.id)
  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data = updateProgressEntrySchema.parse(body)

    const updated = await prisma.progressEntry.update({
      where: { id: params.entryId },
      data: {
        ...(data.goalDescription && { goalDescription: data.goalDescription }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.planId !== undefined && { planId: data.planId }),
      },
    })

    return NextResponse.json({
      ...updated,
      date: updated.date.toISOString(),
      createdAt: updated.createdAt.toISOString(),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { entryId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entry = await getEntryAndVerifyOwnership(params.entryId, session.user.id)
  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.progressEntry.delete({ where: { id: params.entryId } })
  return NextResponse.json({ success: true })
}
