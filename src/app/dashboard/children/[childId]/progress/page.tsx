import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProgressEntry } from '@/types/progress'
import { ProgressChart } from '@/components/progress/ProgressChart'
import { GoalCard } from '@/components/progress/GoalCard'
import { ProgressEntryFormWrapper } from '@/components/progress/ProgressEntryFormWrapper'

export default async function ProgressPage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions)

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session!.user.id },
  })

  if (!child) notFound()

  const rawEntries = await prisma.progressEntry.findMany({
    where: { childId: params.childId },
    orderBy: { date: 'desc' },
  })

  const entries: ProgressEntry[] = rawEntries.map((e) => ({
    ...e,
    planId: e.planId ?? undefined,
    notes: e.notes ?? undefined,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }))

  // Group by goal for GoalCards
  const goalMap = new Map<string, ProgressEntry[]>()
  for (const entry of entries) {
    if (!goalMap.has(entry.goalDescription)) goalMap.set(entry.goalDescription, [])
    goalMap.get(entry.goalDescription)!.push(entry)
  }

  const goals = Array.from(goalMap.entries())

  // Milestone: goals where latest rating >= 4
  const milestones = goals.filter(([, entries]) => {
    const latest = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
    return latest && latest.rating >= 4
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{child.name}&apos;s Progress</h1>
        <p className="text-gray-500">{entries.length} total entries across {goals.length} goals</p>
      </div>

      <ProgressChart entries={entries} />

      {milestones.length > 0 && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
          <h3 className="font-semibold text-green-800 mb-2">Milestones Achieved</h3>
          <ul className="space-y-1">
            {milestones.map(([goal]) => (
              <li key={goal} className="text-sm text-green-700 flex items-center gap-2">
                <span>🏆</span> {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {goals.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900">Goals Overview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map(([goal, goalEntries]) => (
              <GoalCard key={goal} goalDescription={goal} entries={goalEntries} />
            ))}
          </div>
        </div>
      )}

      <ProgressEntryFormWrapper childId={child.id} />
    </div>
  )
}
