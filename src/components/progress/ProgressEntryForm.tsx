'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RATING_LABELS } from '@/types/progress'
import { cn } from '@/lib/utils'

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
          <div className="space-y-1.5">
            <Label>How is it going? *</Label>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as const).map((r) => {
                const colors: Record<number, string> = {
                  1: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
                  2: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
                  3: 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
                  4: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
                  5: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                }
                const selectedColors: Record<number, string> = {
                  1: 'border-red-400 bg-red-100 text-red-800 ring-2 ring-red-300',
                  2: 'border-orange-400 bg-orange-100 text-orange-800 ring-2 ring-orange-300',
                  3: 'border-yellow-400 bg-yellow-100 text-yellow-800 ring-2 ring-yellow-300',
                  4: 'border-green-400 bg-green-100 text-green-800 ring-2 ring-green-300',
                  5: 'border-emerald-400 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300',
                }
                const isSelected = form.rating === String(r)
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => update('rating', String(r))}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2.5 text-center transition-all',
                      isSelected ? selectedColors[r] : colors[r]
                    )}
                  >
                    <span className="text-lg font-extrabold">{r}</span>
                    <span className="text-[10px] font-semibold leading-tight">{RATING_LABELS[r]}</span>
                  </button>
                )
              })}
            </div>
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
