'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChildProfile } from '@/types/child'
import { focusAreaValues } from '@/lib/validators/plan'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2 } from 'lucide-react'

interface Props {
  child: ChildProfile
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
              <span className="font-medium">{child.learningStyle}</span>
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

      {loading && (
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-blue-700">Lumen is generating your personalized plan…</p>
          <p className="text-xs text-blue-500 mt-1">This takes 15-30 seconds</p>
        </div>
      )}

      <Button type="submit" disabled={loading || !focusArea} className="gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
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
