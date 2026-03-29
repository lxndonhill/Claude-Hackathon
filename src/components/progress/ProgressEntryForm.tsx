'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RATING_LABELS } from '@/types/progress'

interface Props {
  childId: string
  planId?: string
  onSuccess?: () => void
}

export function ProgressEntryForm({ childId, planId, onSuccess }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    goalDescription: '',
    rating: '',
    notes: '',
    date: today,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId,
        planId,
        goalDescription: form.goalDescription,
        rating: parseInt(form.rating),
        notes: form.notes,
        date: form.date,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to save')
      return
    }

    setForm({ goalDescription: '', rating: '', notes: '', date: today })
    setSuccess(true)
    onSuccess?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Log Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal">Goal / Skill *</Label>
            <Input
              id="goal"
              value={form.goalDescription}
              onChange={(e) => update('goalDescription', e.target.value)}
              placeholder="Describe the goal or skill being tracked"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Rating *</Label>
              <Select value={form.rating} onValueChange={(v) => update('rating', v ?? '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r} — {RATING_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Any observations or context"
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Progress logged successfully!</p>}
          <Button type="submit" disabled={loading || !form.goalDescription || !form.rating}>
            {loading ? 'Saving…' : 'Log Progress'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
