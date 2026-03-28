import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ScheduleBuilder } from '@/components/schedules/ScheduleBuilder'

export default async function NewSchedulePage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions)

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session!.user.id },
  })

  if (!child) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Visual Schedule</h1>
        <p className="text-gray-500">For {child.name}</p>
      </div>
      <ScheduleBuilder childId={child.id} />
    </div>
  )
}
