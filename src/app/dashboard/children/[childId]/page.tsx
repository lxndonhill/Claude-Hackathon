import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Brain, Calendar, BarChart3, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ChildDetailPage({ params }: { params: { childId: string } }) {
  const session = await getServerSession(authOptions)

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session!.user.id },
    include: {
      learningPlans: { orderBy: { createdAt: 'desc' }, take: 5 },
      schedules: { orderBy: { createdAt: 'desc' }, take: 5 },
      progressEntries: { orderBy: { date: 'desc' }, take: 5 },
    },
  })

  if (!child) notFound()

  const strengths: string[] = JSON.parse(child.strengths)
  const challenges: string[] = JSON.parse(child.challenges)
  const interests: string[] = JSON.parse(child.interests)

  const age = (() => {
    const birth = new Date(child.dateOfBirth)
    const now = new Date()
    let a = now.getFullYear() - birth.getFullYear()
    if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) a--
    return a
  })()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{child.name}</h1>
          <p className="text-gray-500">{age} years old · Support Level {child.supportLevel.replace('LEVEL_', '')}</p>
        </div>
        <Link href={`/dashboard/children/${child.id}/edit`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {strengths.map((s) => (
                  <Badge key={s} className="bg-green-100 text-green-700 hover:bg-green-100">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {challenges.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {challenges.map((c) => (
                  <Badge key={c} className="bg-orange-100 text-orange-700 hover:bg-orange-100">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {interests.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {interests.map((i) => (
                  <Badge key={i} variant="secondary">{i}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans" className="gap-2">
            <Brain className="h-4 w-4" /> Plans ({child.learningPlans.length})
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-2">
            <Calendar className="h-4 w-4" /> Schedules ({child.schedules.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Progress ({child.progressEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Link href={`/dashboard/children/${child.id}/plans/new`}>
              <Button size="sm">Generate new plan</Button>
            </Link>
          </div>
          {child.learningPlans.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No learning plans yet</p>
          ) : (
            child.learningPlans.map((plan) => (
              <Link key={plan.id} href={`/dashboard/children/${child.id}/plans/${plan.id}`}>
                <Card className="cursor-pointer hover:shadow-sm">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-sm text-gray-500">{plan.focusArea}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Link href={`/dashboard/children/${child.id}/schedules/new`}>
              <Button size="sm">Create schedule</Button>
            </Link>
          </div>
          {child.schedules.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No schedules yet</p>
          ) : (
            child.schedules.map((s) => (
              <Link key={s.id} href={`/dashboard/children/${child.id}/schedules/${s.id}`}>
                <Card className="cursor-pointer hover:shadow-sm">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-gray-500">{s.dayOfWeek}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="progress" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Link href={`/dashboard/children/${child.id}/progress`}>
              <Button size="sm">View full progress</Button>
            </Link>
          </div>
          {child.progressEntries.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No progress entries yet</p>
          ) : (
            child.progressEntries.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-sm">{e.goalDescription}</p>
                    <p className="text-xs text-gray-500">Rating: {e.rating}/5</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
