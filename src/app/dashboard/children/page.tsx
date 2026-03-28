import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChildCard } from '@/components/children/ChildCard'
import { ChildProfile } from '@/types/child'

export default async function ChildrenPage() {
  const session = await getServerSession(authOptions)

  const raw = await prisma.child.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const children: ChildProfile[] = raw.map((c) => ({
    ...c,
    strengths: JSON.parse(c.strengths),
    challenges: JSON.parse(c.challenges),
    sensoryPreferences: JSON.parse(c.sensoryPreferences),
    interests: JSON.parse(c.interests),
    dateOfBirth: c.dateOfBirth.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Children</h1>
        <Link href="/dashboard/children/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No children yet</h3>
          <p className="mb-6 text-gray-500">
            Add a child profile to start generating personalized learning plans
          </p>
          <Link href="/dashboard/children/new">
            <Button>Add your first child</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  )
}
