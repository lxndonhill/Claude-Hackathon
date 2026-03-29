import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateScheduleSchema } from '@/lib/validators/schedule'
import { z } from 'zod'

async function getScheduleAndVerifyOwnership(scheduleId: string, userId: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { child: true },
  })
  if (!schedule || schedule.child.userId !== userId) return null
  return schedule
}

export async function GET(
  _req: Request,
  { params }: { params: { scheduleId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schedule = await getScheduleAndVerifyOwnership(params.scheduleId, session.user.id)
  if (!schedule) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...schedule,
    blocks: JSON.parse(schedule.blocks),
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
  })
}

export async function PUT(
  req: Request,
  { params }: { params: { scheduleId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schedule = await getScheduleAndVerifyOwnership(params.scheduleId, session.user.id)
  if (!schedule) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data = updateScheduleSchema.parse(body)

    const updated = await prisma.schedule.update({
      where: { id: params.scheduleId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.dayOfWeek && { dayOfWeek: data.dayOfWeek }),
        ...(data.blocks !== undefined && { blocks: JSON.stringify(data.blocks) }),
        ...(data.isTemplate !== undefined && { isTemplate: data.isTemplate }),
      },
    })

    const parsedBlocks = data.blocks ?? JSON.parse(schedule.blocks)
    return NextResponse.json({
      ...updated,
      blocks: parsedBlocks,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { scheduleId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schedule = await getScheduleAndVerifyOwnership(params.scheduleId, session.user.id)
  if (!schedule) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.schedule.delete({ where: { id: params.scheduleId } })
  return NextResponse.json({ success: true })
}
