'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChildProfile } from '@/types/child'
import { focusAreaValues } from '@/lib/validators/plan'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles } from 'lucide-react'

interface Props {
  child: ChildProfile
}

function LumenLoadingScreen() {
  const messages = [
    'Lumen is thinking…',
    'Building your plan…',
    'Crafting personalized strategies…',
    'Almost ready…',
  ]
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
          <Sparkles className="h-6 w-6 animate-pulse text-white" />
        </div>
      </div>
      <p className="text-base font-semibold text-primary">{messages[msgIdx]}</p>
      <p className="text-xs text-muted-foreground">This takes 15–30 seconds</p>
    </div>
  )
}

export function PlanGeneratorForm({ child }: Props) {
  const router = useRouter()
  const [focusArea, setFocusArea] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: child.id, focusArea, additionalContext }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to generate plan')
        return
      }

      const plan = await res.json()
      router.push(`/dashboard/children/${child.id}/plans/${plan.id}`)
    } catch {
      setError('Network error — please check your connection and try again')
    } finally {
      setLoading(false)
    }
  }

  const learningStyles = Array.isArray(child.learningStyle)
    ? child.learningStyle
    : typeof child.learningStyle === 'string'
    ? (child.learningStyle as string).split(',').filter(Boolean)
    : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            Child Profile Preview
          </CardTitle>
          <p className="text-xs text-gray-500">This data will be sent to Lumen to personalize the plan</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-gray-500">Support Level:</span>{' '}
              <span className="font-medium">{child.supportLevel.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-500">Communication:</span>{' '}
              <span className="font-medium">{child.communicationStyle.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-500">Learning Style:</span>{' '}
              <span className="font-medium">{learningStyles.join(', ')}</span>
            </div>
          </div>
          {child.strengths.length > 0 && (
            <div>
              <p className="mb-1 text-gray-500">Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {child.strengths.map((s) => (
                  <Badge key={s} className="bg-green-100 text-green-700 text-xs hover:bg-green-100">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {child.interests.length > 0 && (
            <div>
              <p className="mb-1 text-gray-500">Interests (Lumen will leverage these):</p>
              <div className="flex flex-wrap gap-1">
                {child.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Focus Area *</Label>
            <Select value={focusArea} onValueChange={(v) => setFocusArea(v ?? '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a focus area for this plan" />
              </SelectTrigger>
              <SelectContent>
                {focusAreaValues.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="context">Additional Context (optional)</Label>
            <Textarea
              id="context"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any specific goals, recent events, or context that would help Lumen generate a better plan…"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && <LumenLoadingScreen />}

      <Button type="submit" disabled={loading || !focusArea} className="gap-2">
        {loading ? (
          <>
            <Sparkles className="h-4 w-4 animate-pulse" />
            Generating…
          </>
        ) : (
          <>
            <Brain className="h-4 w-4" />
            Generate Learning Plan
          </>
        )}
      </Button>
    </form>
  )
}
