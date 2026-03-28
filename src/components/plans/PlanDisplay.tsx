'use client'

import { LearningPlan } from '@/types/plan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Printer, Target, Lightbulb, Settings, Package, Calendar, ClipboardCheck } from 'lucide-react'

export function PlanDisplay({ plan }: { plan: LearningPlan }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{plan.title}</h2>
          <div className="mt-1 flex items-center gap-2">
            <Badge>{plan.focusArea}</Badge>
            <span className="text-sm text-gray-500">
              Generated {new Date(plan.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="grid gap-6 print:gap-4">
        {plan.goals.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-blue-600" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {plan.goals.map((goal, i) => (
                  <li key={goal.id} className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{goal.description}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Measure:</span> {goal.measurementCriteria}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Timeframe:</span> {goal.timeframe}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {plan.strategies.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {plan.strategies.map((strategy) => (
                  <div key={strategy.id} className="rounded-lg border bg-gray-50 p-4">
                    <p className="font-medium text-gray-900">{strategy.title}</p>
                    {strategy.frequency && (
                      <Badge variant="secondary" className="mt-1 text-xs">{strategy.frequency}</Badge>
                    )}
                    <p className="mt-2 text-sm text-gray-600">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {plan.accommodations.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4 text-green-600" />
                Accommodations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.accommodations.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {plan.materials.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-purple-600" />
                  Materials & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.materials.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {plan.assessmentMethods.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardCheck className="h-4 w-4 text-orange-600" />
                  Assessment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.assessmentMethods.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {plan.weeklyStructure && Object.keys(plan.weeklyStructure).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-blue-600" />
                Weekly Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-5">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => {
                  const content = plan.weeklyStructure[day]
                  if (!content) return null
                  return (
                    <div key={day} className="rounded-lg bg-blue-50 p-3">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600">
                        {day}
                      </p>
                      <p className="text-sm text-gray-700">{content}</p>
                    </div>
                  )
                })}
              </div>
              {plan.weeklyStructure.notes && (
                <p className="mt-3 text-sm text-gray-500">{plan.weeklyStructure.notes}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
