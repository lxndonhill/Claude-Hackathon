import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { planId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plan = await prisma.learningPlan.findUnique({
    where: { id: params.planId },
    include: { child: true },
  })

  if (!plan || plan.child.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...plan,
    goals: JSON.parse(plan.goals),
    strategies: JSON.parse(plan.strategies),
    accommodations: JSON.parse(plan.accommodations),
    materials: JSON.parse(plan.materials),
    weeklyStructure: JSON.parse(plan.weeklyStructure),
    assessmentMethods: JSON.parse(plan.assessmentMethods),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { planId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plan = await prisma.learningPlan.findUnique({
    where: { id: params.planId },
    include: { child: true },
  })

  if (!plan || plan.child.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.learningPlan.delete({ where: { id: params.planId } })
  return NextResponse.json({ success: true })
}
