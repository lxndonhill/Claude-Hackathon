'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChildProfile, CreateChildInput } from '@/types/child'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Props {
  child?: ChildProfile
  onSuccess?: (child: ChildProfile) => void
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {values.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChildProfileForm({ child, onSuccess }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<CreateChildInput>({
    name: child?.name ?? '',
    dateOfBirth: child?.dateOfBirth?.slice(0, 10) ?? '',
    ageGroup: child?.ageGroup ?? 'EARLY_CHILDHOOD_5_7',
    diagnosisDetails: child?.diagnosisDetails ?? '',
    supportLevel: child?.supportLevel ?? 'LEVEL_1',
    strengths: child?.strengths ?? [],
    challenges: child?.challenges ?? [],
    sensoryPreferences: child?.sensoryPreferences ?? { avoids: [], seeks: [] },
    communicationStyle: child?.communicationStyle ?? 'VERBAL',
    learningStyle: child?.learningStyle ?? 'VISUAL',
    interests: child?.interests ?? [],
    notes: child?.notes ?? '',
  })

  function update<K extends keyof CreateChildInput>(key: K, value: CreateChildInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = child ? `/api/children/${child.id}` : '/api/children'
    const method = child ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      return
    }

    const saved = await res.json()
    if (onSuccess) {
      onSuccess(saved)
    } else {
      router.push(`/dashboard/children/${saved.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Child&apos;s name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of birth *</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update('dateOfBirth', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Age group *</Label>
              <Select value={form.ageGroup} onValueChange={(v) => update('ageGroup', v as CreateChildInput['ageGroup'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EARLY_CHILDHOOD_5_7">Early Childhood (5-7)</SelectItem>
                  <SelectItem value="MIDDLE_CHILDHOOD_8_10">Middle Childhood (8-10)</SelectItem>
                  <SelectItem value="EARLY_ADOLESCENCE_11_13">Early Adolescence (11-13)</SelectItem>
                  <SelectItem value="ADOLESCENCE_14_18">Adolescence (14-18)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>DSM-5 Support Level *</Label>
            <Select value={form.supportLevel} onValueChange={(v) => update('supportLevel', v as CreateChildInput['supportLevel'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEVEL_1">Level 1 — Requiring Support</SelectItem>
                <SelectItem value="LEVEL_2">Level 2 — Requiring Substantial Support</SelectItem>
                <SelectItem value="LEVEL_3">Level 3 — Requiring Very Substantial Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Communication Style *</Label>
              <Select value={form.communicationStyle} onValueChange={(v) => update('communicationStyle', v as CreateChildInput['communicationStyle'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VERBAL">Verbal</SelectItem>
                  <SelectItem value="MINIMAL_VERBAL">Minimal Verbal</SelectItem>
                  <SelectItem value="NON_VERBAL">Non-Verbal</SelectItem>
                  <SelectItem value="AAC_USER">AAC Device User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Learning Style *</Label>
              <Select value={form.learningStyle} onValueChange={(v) => update('learningStyle', v as CreateChildInput['learningStyle'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VISUAL">Visual</SelectItem>
                  <SelectItem value="AUDITORY">Auditory</SelectItem>
                  <SelectItem value="KINESTHETIC">Kinesthetic</SelectItem>
                  <SelectItem value="READING_WRITING">Reading/Writing</SelectItem>
                  <SelectItem value="MULTIMODAL">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Strengths, Challenges & Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TagInput
            label="Strengths"
            values={form.strengths}
            onChange={(v) => update('strengths', v)}
            placeholder="e.g. excellent memory, detail-oriented"
          />
          <TagInput
            label="Challenges"
            values={form.challenges}
            onChange={(v) => update('challenges', v)}
            placeholder="e.g. transitions, sensory overload"
          />
          <TagInput
            label="Special Interests"
            values={form.interests}
            onChange={(v) => update('interests', v)}
            placeholder="e.g. trains, dinosaurs, Minecraft"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sensory Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TagInput
            label="Sensory Avoidances"
            values={form.sensoryPreferences.avoids}
            onChange={(v) =>
              update('sensoryPreferences', { ...form.sensoryPreferences, avoids: v })
            }
            placeholder="e.g. loud noises, bright lights"
          />
          <TagInput
            label="Sensory Seeks"
            values={form.sensoryPreferences.seeks}
            onChange={(v) =>
              update('sensoryPreferences', { ...form.sensoryPreferences, seeks: v })
            }
            placeholder="e.g. deep pressure, movement breaks"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="diagnosis">Additional Support Information</Label>
            <Textarea
              id="diagnosis"
              value={form.diagnosisDetails ?? ''}
              onChange={(e) => update('diagnosisDetails', e.target.value)}
              placeholder="Any relevant information about this child's support needs (optional)"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Educator Notes</Label>
            <Textarea
              id="notes"
              value={form.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Additional context for the AI (optional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : child ? 'Update profile' : 'Create profile'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
