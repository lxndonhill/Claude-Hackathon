import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Brain, Calendar, BarChart3, Pencil, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { DeleteChildButton } from '@/components/children/DeleteChildButton'

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

  const supportLabel = child.supportLevel.replace('LEVEL_', 'Level ')

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{child.name}</h1>
          <p className="text-muted-foreground">{age} years old · Support {supportLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/children/${child.id}/edit`} className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 font-semibold')}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </Link>
          <DeleteChildButton childId={child.id} childName={child.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((s) => (
                  <Badge key={s} className="bg-green-100 text-green-700 hover:bg-green-100 font-medium">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {challenges.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Areas for Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {challenges.map((c) => (
                  <Badge key={c} className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-medium">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {interests.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Special Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <Badge key={i} variant="secondary" className="font-medium">{i}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="plans" className="gap-1.5 font-semibold">
            <Brain className="h-4 w-4" /> Plans ({child.learningPlans.length})
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-1.5 font-semibold">
            <Calendar className="h-4 w-4" /> Schedules ({child.schedules.length})
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-1.5 font-semibold">
            <BarChart3 className="h-4 w-4" /> Progress ({child.progressEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Link href={`/dashboard/children/${child.id}/plans/new`} className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 font-semibold')}>
              <Plus className="h-4 w-4" /> Generate new plan
            </Link>
          </div>
          {child.learningPlans.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="No learning plans yet"
              description="Generate an AI-powered learning support plan tailored to this student's profile, strengths, and interests."
              actionLabel="Generate first plan"
              actionHref={`/dashboard/children/${child.id}/plans/new`}
            />
          ) : (
            child.learningPlans.map((plan) => (
              <Link key={plan.id} href={`/dashboard/children/${child.id}/plans/${plan.id}`}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold text-foreground">{plan.title}</p>
                      <p className="text-sm text-muted-foreground">{plan.focusArea}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
            <Link href={`/dashboard/children/${child.id}/schedules/new`} className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 font-semibold')}>
              <Plus className="h-4 w-4" /> Create schedule
            </Link>
          </div>
          {child.schedules.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No schedules yet"
              description="Build a visual daily schedule to help this student navigate their day with predictability and confidence."
              actionLabel="Build first schedule"
              actionHref={`/dashboard/children/${child.id}/schedules/new`}
            />
          ) : (
            child.schedules.map((s) => (
              <Link key={s.id} href={`/dashboard/children/${child.id}/schedules/${s.id}`}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold text-foreground">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.dayOfWeek.charAt(0) + s.dayOfWeek.slice(1).toLowerCase()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
            <Link href={`/dashboard/children/${child.id}/progress`} className={cn(buttonVariants({ size: 'sm' }), 'font-semibold')}>
              View full progress
            </Link>
          </div>
          {child.progressEntries.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No progress entries yet"
              description="Start logging progress toward learning goals to build a picture of growth over time."
              actionLabel="View progress tracker"
              actionHref={`/dashboard/children/${child.id}/progress`}
            />
          ) : (
            child.progressEntries.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{e.goalDescription}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Rating: {e.rating}/5</p>
                  </div>
                  <p className="text-sm text-muted-foreground flex-shrink-0">
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
