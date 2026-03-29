import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, BookOpen, BarChart3, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'

const RATING_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-emerald-100 text-emerald-700',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [childCount, planCount, recentEntries] = await Promise.all([
    prisma.child.count({ where: { userId: session!.user.id } }),
    prisma.learningPlan.count({ where: { child: { userId: session!.user.id } } }),
    prisma.progressEntry.findMany({
      where: { child: { userId: session!.user.id } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { child: true },
    }),
  ])

  const firstName = session!.user.name.split(' ')[0]

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Welcome back, {firstName} 👋</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your students</p>
        </div>
        <Link href="/dashboard/children/new/consent">
          <Button className="gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Add child
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Students</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-foreground">{childCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">active profiles</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Learning Plans</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-foreground">{planCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">plans generated</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Recent Progress</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <BarChart3 className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-foreground">{recentEntries.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">entries this week</p>
          </CardContent>
        </Card>
      </div>

      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentEntries.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground">{entry.child.name}</span>
                    <span className="text-muted-foreground"> — {entry.goalDescription}</span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Badge className={`text-xs ${RATING_COLORS[entry.rating] ?? 'bg-gray-100 text-gray-700'}`}>
                      {entry.rating}/5
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {childCount === 0 && (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Add your first child profile to start creating personalized learning plans, schedules, and tracking progress."
          actionLabel="Add your first student"
          actionHref="/dashboard/children/new/consent"
        />
      )}
    </div>
  )
}
