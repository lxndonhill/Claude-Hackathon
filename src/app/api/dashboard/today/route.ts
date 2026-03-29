import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todayDay = DAYS[new Date().getDay()]

  const [schedules, plans] = await Promise.all([
    // Today's schedules across all children
    prisma.schedule.findMany({
      where: {
        dayOfWeek: todayDay,
        child: { userId: session.user.id },
      },
      include: { child: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // Most recent plans across all children
    prisma.learningPlan.findMany({
      where: { child: { userId: session.user.id } },
      include: { child: { select: { name: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  return NextResponse.json({
    todayDay,
    schedules: schedules.map((s) => ({
      id: s.id,
      title: s.title,
      childName: s.child.name,
      childId: s.childId,
      blockCount: (() => {
        try { return JSON.parse(s.blocks).length } catch { return 0 }
      })(),
    })),
    recentPlans: plans.map((p) => ({
      id: p.id,
      title: p.title,
      focusArea: p.focusArea,
      childName: p.child.name,
      childId: p.child.id,
      createdAt: p.createdAt.toISOString(),
    })),
  })
}
