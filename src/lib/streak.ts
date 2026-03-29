import { prisma } from '@/lib/prisma'

/**
 * Computes how many consecutive days ending today the user has logged at least
 * one progress entry. Uses UTC dates for consistency.
 */
export async function computeStreak(userId: string): Promise<number> {
  const entries = await prisma.progressEntry.findMany({
    where: { child: { userId } },
    select: { date: true },
    orderBy: { date: 'desc' },
  })

  if (entries.length === 0) return 0

  // Collect unique date strings (YYYY-MM-DD in UTC)
  const uniqueDates = new Set(
    entries.map((e) => e.date.toISOString().slice(0, 10))
  )

  const todayUTC = new Date().toISOString().slice(0, 10)

  let streak = 0
  const cursor = new Date(todayUTC)

  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10)
    if (!uniqueDates.has(dateStr)) break
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}
