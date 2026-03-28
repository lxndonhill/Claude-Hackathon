import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ChildProfileForm } from '@/components/children/ChildProfileForm'
import { ChildProfile } from '@/types/child'

export default async function EditChildPage({ params }: { params: { childId: string } }) {
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
        <h1 className="text-2xl font-bold text-gray-900">Edit {child.name}&apos;s profile</h1>
      </div>
      <ChildProfileForm child={childProfile} />
    </div>
  )
}
