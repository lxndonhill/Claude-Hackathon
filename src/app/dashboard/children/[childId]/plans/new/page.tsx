import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ChildProfile } from '@/types/child'
import { PlanGeneratorForm } from '@/components/plans/PlanGeneratorForm'

export default async function NewPlanPage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions)

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session!.user.id },
  })

  if (!child) notFound()

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Learning Plan</h1>
        <p className="text-gray-500">For {child.name}</p>
      </div>
      <PlanGeneratorForm child={childProfile} />
    </div>
  )
}
