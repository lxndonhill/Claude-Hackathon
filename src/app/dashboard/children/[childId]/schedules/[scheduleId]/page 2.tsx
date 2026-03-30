import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Schedule } from '@/types/schedule'
import { ScheduleBuilder } from '@/components/schedules/ScheduleBuilder'

export default async function ScheduleDetailPage({
  params,
}: {
  params: { childId: string; scheduleId: string }
}) {
  const session = await getServerSession(authOptions)

  const raw = await prisma.schedule.findUnique({
    where: { id: params.scheduleId },
    include: { child: true },
  })

  if (!raw || raw.child.userId !== session!.user.id || raw.childId !== params.childId) {
    notFound()
  }

  const schedule = {
    ...raw,
    blocks: JSON.parse(raw.blocks),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  } as Schedule

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Schedule</h1>
        <p className="text-gray-500">{schedule.title}</p>
      </div>
      <ScheduleBuilder childId={params.childId} schedule={schedule} />
    </div>
  )
}
