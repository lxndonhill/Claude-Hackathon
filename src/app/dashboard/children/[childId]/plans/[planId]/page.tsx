import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LearningPlan } from '@/types/plan'
import { PlanDisplay } from '@/components/plans/PlanDisplay'

export default async function PlanDetailPage({
  params,
}: {
  params: { childId: string; planId: string }
}) {
  const session = await getServerSession(authOptions)

  const plan = await prisma.learningPlan.findUnique({
    where: { id: params.planId },
    include: { child: true },
  })

  if (!plan || plan.child.userId !== session!.user.id || plan.childId !== params.childId) {
    notFound()
  }

  const learningPlan: LearningPlan = {
    ...plan,
    goals: JSON.parse(plan.goals),
    strategies: JSON.parse(plan.strategies),
    accommodations: JSON.parse(plan.accommodations),
    materials: JSON.parse(plan.materials),
    weeklyStructure: JSON.parse(plan.weeklyStructure),
    assessmentMethods: JSON.parse(plan.assessmentMethods),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  }

  return <PlanDisplay plan={learningPlan} />
}
