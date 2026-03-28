import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, BookOpen, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session!.user.name.split(' ')[0]}</h1>
          <p className="text-gray-500">Here&apos;s an overview of your students</p>
        </div>
        <Link href="/dashboard/children/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add child
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Children</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{childCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Learning Plans</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{planCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Progress Entries</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{recentEntries.length}</p>
          </CardContent>
        </Card>
      </div>

      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentEntries.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between text-sm">
                  <div>
                    <span className="font-medium">{entry.child.name}</span>
                    <span className="text-gray-500"> — {entry.goalDescription}</span>
                  </div>
                  <span className="ml-4 flex-shrink-0 text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {childCount === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No children yet</h3>
          <p className="mb-6 text-gray-500">Add your first child to start creating personalized learning plans</p>
          <Link href="/dashboard/children/new">
            <Button>Add your first child</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
