'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Schedule, ScheduleBlock } from '@/types/schedule'

interface Props {
  childId: string
  activityText: string
}

export function AddToScheduleButton({ childId, activityText }: Props) {
  const [open, setOpen] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('09:30')

  async function handleOpen() {
    setOpen(true)
    setSaved(false)
    setError('')
    setSelectedScheduleId('')
    if (schedules.length === 0) {
      setLoading(true)
      const res = await fetch(`/api/schedules?childId=${childId}`)
      if (res.ok) {
        const data: Schedule[] = await res.json()
        setSchedules(data)
        if (data.length > 0) setSelectedScheduleId(data[0].id)
      }
      setLoading(false)
    } else if (schedules.length > 0 && !selectedScheduleId) {
      setSelectedScheduleId(schedules[0].id)
    }
  }

  async function handleSave() {
    if (!selectedScheduleId) return
    setSaving(true)
    setError('')

    const schedule = schedules.find((s) => s.id === selectedScheduleId)
    if (!schedule) { setSaving(false); return }

    const newBlock: ScheduleBlock = {
      id: uuidv4(),
      activity: activityText.length > 60 ? activityText.slice(0, 57) + '…' : activityText,
      startTime,
      endTime,
      iconKey: 'book',
      color: '#a78bfa',
      order: schedule.blocks.length,
    }

    const updatedBlocks = [...schedule.blocks, newBlock]

    const res = await fetch(`/api/schedules/${selectedScheduleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks: updatedBlocks }),
    })

    setSaving(false)

    if (!res.ok) {
      setError('Failed to add to schedule')
      return
    }

    // Update local state so re-opens show the new block
    setSchedules((prev) =>
      prev.map((s) => (s.id === selectedScheduleId ? { ...s, blocks: updatedBlocks } : s))
    )
    setSaved(true)
    setTimeout(() => { setOpen(false); setSaved(false) }, 1200)
  }

  return (
    <>
      <button
        type="button"
        title="Add to schedule"
        onClick={handleOpen}
        className="flex-shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors no-print"
      >
        <CalendarPlus className="h-3.5 w-3.5" />
        Schedule
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4 text-primary" />
              Add to Schedule
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-secondary/30 border p-3">
              <p className="text-sm text-muted-foreground line-clamp-3">{activityText}</p>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading schedules…</p>
            ) : schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No schedules found for this student. Create one first on the Schedules page.
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Schedule</Label>
                  <Select value={selectedScheduleId} onValueChange={(v) => setSelectedScheduleId(v ?? '')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a schedule">
                        {schedules.find((s) => s.id === selectedScheduleId)
                          ? (() => {
                              const s = schedules.find((s) => s.id === selectedScheduleId)!
                              return `${s.title} (${s.dayOfWeek.charAt(0) + s.dayOfWeek.slice(1).toLowerCase()})`
                            })()
                          : null
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title} ({s.dayOfWeek.charAt(0) + s.dayOfWeek.slice(1).toLowerCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="start-time">Start time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end-time">End time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {saved && <p className="text-sm text-green-600 font-semibold">Added to schedule!</p>}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {schedules.length > 0 && (
              <Button onClick={handleSave} disabled={saving || !selectedScheduleId || saved}>
                {saving ? 'Saving…' : 'Add to Schedule'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
