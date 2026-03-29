import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChildCard } from '@/components/children/ChildCard'
import { EmptyState } from '@/components/shared/EmptyState'

export default async function ChildrenPage() {
  const session = await getServerSession(authOptions)

  const raw = await prisma.child.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = raw.map((c) => ({
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
    <div className="space-y-6 page-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-foreground">Students</h1>
        <Link href="/dashboard/children/new/consent" className={cn(buttonVariants(), 'gap-2 font-semibold')}>
          <Plus className="h-4 w-4" />
          Add child
        </Link>
      </div>

      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Add a child profile to start generating personalized learning support plans, building visual schedules, and tracking progress."
          actionLabel="Add your first student"
          actionHref="/dashboard/children/new/consent"
        />
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
