'use client'

import { useState } from 'react'
import { LearningPlan } from '@/types/plan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Printer, Target, Lightbulb, Settings, Package,
  Calendar, ClipboardCheck, Sparkles, ChevronDown, ChevronUp, X, RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddToScheduleButton } from './AddToScheduleDialog'

function RationaleBlock({ rationale, note, onNoteChange }: {
  rationale: string
  note?: string
  onNoteChange?: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <Sparkles className="h-3 w-3" />
        Why Lumen suggested this
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <>
          <p className="mt-1.5 rounded-lg bg-primary/5 p-2.5 text-xs leading-relaxed text-muted-foreground border border-primary/10">
            {rationale}
          </p>
          {onNoteChange && (
            <div className="mt-2 no-print">
              <label className="text-xs font-semibold text-muted-foreground">Your notes</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                rows={2}
                placeholder="Add your thoughts or educator notes..."
                value={note ?? ''}
                onChange={(e) => onNoteChange(e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function PlanDisplay({ plan, childId }: { plan: LearningPlan; childId?: string }) {
  const [rejectedGoals, setRejectedGoals] = useState<Set<string>>(new Set())
  const [rejectedStrategies, setRejectedStrategies] = useState<Set<string>>(new Set())
  const [rejectedAccommodations, setRejectedAccommodations] = useState<Set<number>>(new Set())
  const [goalNotes, setGoalNotes] = useState<Record<string, string>>({})
  const [strategyNotes, setStrategyNotes] = useState<Record<string, string>>({})

  const toggleGoal = (id: string) =>
    setRejectedGoals((s) => {
      const n = new Set(s)
      if (n.has(id)) { n.delete(id) } else { n.add(id) }
      return n
    })
  const toggleStrategy = (id: string) =>
    setRejectedStrategies((s) => {
      const n = new Set(s)
      if (n.has(id)) { n.delete(id) } else { n.add(id) }
      return n
    })
  const toggleAccommodation = (i: number) =>
    setRejectedAccommodations((s) => {
      const n = new Set(s)
      if (n.has(i)) { n.delete(i) } else { n.add(i) }
      return n
    })

  const acceptedGoals = plan.goals.filter((g) => !rejectedGoals.has(g.id)).length
  const acceptedStrategies = plan.strategies.filter((s) => !rejectedStrategies.has(s.id)).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">{plan.title}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge className="font-semibold">{plan.focusArea}</Badge>
            <span className="text-sm text-muted-foreground">
              Generated {new Date(plan.createdAt).toLocaleDateString()}
            </span>
            {(rejectedGoals.size > 0 || rejectedStrategies.size > 0 || rejectedAccommodations.size > 0) && (
              <Badge variant="secondary" className="text-xs">
                {rejectedGoals.size + rejectedStrategies.size + rejectedAccommodations.size} overridden
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2 no-print"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Educational disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-xs text-amber-800">
        <strong>Educator review required:</strong> These suggestions are AI-generated starting points based on research-informed strategies. Use your professional judgement — you can override or dismiss any item below.
      </div>

      <div className="grid gap-6 print:gap-4">
        {/* Goals */}
        {plan.goals.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Goals
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {acceptedGoals}/{plan.goals.length} accepted
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-5">
                {plan.goals.map((goal, i) => (
                  <li
                    key={goal.id}
                    className={cn(
                      'flex gap-3 rounded-xl p-3 transition-all',
                      rejectedGoals.has(goal.id)
                        ? 'bg-muted/40 opacity-50'
                        : 'bg-transparent'
                    )}
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-semibold text-foreground', rejectedGoals.has(goal.id) && 'line-through text-muted-foreground')}>
                        {goal.description}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Measure:</span> {goal.measurementCriteria}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Timeframe:</span> {goal.timeframe}
                      </p>
                      {goal.rationale && !rejectedGoals.has(goal.id) && (
                        <RationaleBlock
                          rationale={goal.rationale}
                          note={goalNotes[goal.id]}
                          onNoteChange={(v) => setGoalNotes((n) => ({ ...n, [goal.id]: v }))}
                        />
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1 no-print">
                      {childId && !rejectedGoals.has(goal.id) && (
                        <AddToScheduleButton childId={childId} activityText={goal.description} />
                      )}
                      <button
                        type="button"
                        title={rejectedGoals.has(goal.id) ? 'Restore goal' : 'Override goal'}
                        onClick={() => toggleGoal(goal.id)}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                          rejectedGoals.has(goal.id)
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                        )}
                      >
                        {rejectedGoals.has(goal.id) ? <RotateCcw className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Strategies */}
        {plan.strategies.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Strategies
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {acceptedStrategies}/{plan.strategies.length} accepted
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
                {plan.strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={cn(
                      'rounded-xl border p-4 transition-all relative min-w-0 overflow-hidden',
                      rejectedStrategies.has(strategy.id)
                        ? 'bg-muted/40 opacity-50'
                        : 'bg-secondary/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('font-semibold text-foreground break-words min-w-0', rejectedStrategies.has(strategy.id) && 'line-through text-muted-foreground')}>
                        {strategy.title}
                      </p>
                      <div className="flex flex-shrink-0 items-center gap-1 no-print">
                        {childId && !rejectedStrategies.has(strategy.id) && (
                          <AddToScheduleButton childId={childId} activityText={strategy.title} />
                        )}
                        <button
                          type="button"
                          title={rejectedStrategies.has(strategy.id) ? 'Restore strategy' : 'Override strategy'}
                          onClick={() => toggleStrategy(strategy.id)}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-lg transition-colors',
                            rejectedStrategies.has(strategy.id)
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                          )}
                        >
                          {rejectedStrategies.has(strategy.id) ? <RotateCcw className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    {strategy.frequency && (
                      <Badge variant="secondary" className="mt-1 text-xs">{strategy.frequency}</Badge>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed break-words">{strategy.description}</p>
                    {strategy.rationale && !rejectedStrategies.has(strategy.id) && (
                      <RationaleBlock
                        rationale={strategy.rationale}
                        note={strategyNotes[strategy.id]}
                        onNoteChange={(v) => setStrategyNotes((n) => ({ ...n, [strategy.id]: v }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accommodations */}
        {plan.accommodations.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4 text-green-600" />
                Accommodations & Supports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.accommodations.map((item, i) => (
                  <li
                    key={i}
                    className={cn(
                      'flex items-center gap-2 text-sm rounded-lg p-2 transition-all',
                      rejectedAccommodations.has(i) ? 'opacity-50' : ''
                    )}
                  >
                    <span className={cn(
                      'mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                      rejectedAccommodations.has(i) ? 'bg-muted-foreground' : 'bg-green-500'
                    )} />
                    <span className={cn('flex-1', rejectedAccommodations.has(i) && 'line-through text-muted-foreground')}>
                      {item}
                    </span>
                    <button
                      type="button"
                      title={rejectedAccommodations.has(i) ? 'Restore' : 'Override'}
                      onClick={() => toggleAccommodation(i)}
                      className={cn(
                        'flex-shrink-0 flex h-5 w-5 items-center justify-center rounded transition-colors no-print',
                        rejectedAccommodations.has(i)
                          ? 'text-primary hover:bg-primary/10'
                          : 'text-muted-foreground hover:text-destructive'
                      )}
                    >
                      {rejectedAccommodations.has(i) ? <RotateCcw className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </button>
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
                    <li key={i} className="text-sm text-muted-foreground">
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
                    <li key={i} className="text-sm text-muted-foreground">
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
                <Calendar className="h-4 w-4 text-primary" />
                Weekly Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-5">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => {
                  const content = plan.weeklyStructure[day]
                  if (!content) return null
                  return (
                    <div key={day} className="rounded-xl bg-primary/5 p-3 border border-primary/10">
                      <p className="mb-1 text-xs font-extrabold tracking-wide text-primary">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                    </div>
                  )
                })}
              </div>
              {plan.weeklyStructure.notes && (
                <p className="mt-3 text-sm text-muted-foreground">{plan.weeklyStructure.notes}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
