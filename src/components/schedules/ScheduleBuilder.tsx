'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Schedule, ScheduleBlock, DayOfWeek } from '@/types/schedule'
import { dayOfWeekValues } from '@/lib/validators/schedule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, GripVertical, Trash2, Pencil, Save, Eye } from 'lucide-react'
import { SchedulePreview } from './SchedulePreview'

const BLOCK_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
]

const ICON_OPTIONS = [
  { key: 'book', label: 'Reading' },
  { key: 'math', label: 'Math' },
  { key: 'art', label: 'Art' },
  { key: 'music', label: 'Music' },
  { key: 'pe', label: 'PE' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snack', label: 'Snack' },
  { key: 'recess', label: 'Recess' },
  { key: 'computer', label: 'Computer' },
  { key: 'circle', label: 'Circle Time' },
  { key: 'break', label: 'Break' },
  { key: 'therapy', label: 'Therapy' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'arrival', label: 'Arrival' },
  { key: 'dismissal', label: 'Dismissal' },
]

const ICON_EMOJIS: Record<string, string> = {
  book: '📚', math: '🔢', art: '🎨', music: '🎵', pe: '⚽',
  lunch: '🍽️', snack: '🍎', recess: '🛝', computer: '💻',
  circle: '🔵', break: '☕', therapy: '🏥', bathroom: '🚻',
  arrival: '🏫', dismissal: '🚌',
}

interface BlockEditorState {
  block: ScheduleBlock
  isNew: boolean
}

interface Props {
  childId: string
  schedule?: Schedule
}

export function ScheduleBuilder({ childId, schedule }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(schedule?.title ?? '')
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(schedule?.dayOfWeek ?? 'MONDAY')
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(schedule?.blocks ?? [])
  const [editing, setEditing] = useState<BlockEditorState | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addBlock() {
    const newBlock: ScheduleBlock = {
      id: uuidv4(),
      startTime: '09:00',
      endTime: '09:30',
      activity: '',
      iconKey: 'book',
      color: BLOCK_COLORS[blocks.length % BLOCK_COLORS.length],
      order: blocks.length,
    }
    setEditing({ block: newBlock, isNew: true })
  }

  function saveBlock(block: ScheduleBlock, isNew: boolean) {
    if (isNew) {
      setBlocks((prev) => [...prev, { ...block, order: prev.length }])
    } else {
      setBlocks((prev) => prev.map((b) => (b.id === block.id ? block : b)))
    }
    setEditing(null)
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })))
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(blocks)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setBlocks(reordered.map((b, i) => ({ ...b, order: i })))
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('Please enter a schedule title')
      return
    }
    setError('')
    setSaving(true)

    const url = schedule ? `/api/schedules/${schedule.id}` : '/api/schedules'
    const method = schedule ? 'PUT' : 'POST'
    const body = schedule
      ? { title, dayOfWeek, blocks }
      : { childId, title, dayOfWeek, blocks }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to save')
      return
    }

    const saved = await res.json()
    router.push(`/dashboard/children/${childId}/schedules/${saved.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-48 space-y-1.5">
          <Label>Schedule Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Monday School Schedule"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Day</Label>
          <Select value={dayOfWeek} onValueChange={(v) => setDayOfWeek(v as DayOfWeek)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekValues.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button className="gap-2" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {blocks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
                  <p className="text-gray-500">No activities yet. Add your first block below.</p>
                </div>
              )}
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        borderLeft: `4px solid ${block.color}`,
                        ...provided.draggableProps.style,
                      }}
                    >
                      <CardContent className="flex items-center gap-3 py-3">
                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <span className="text-2xl">{ICON_EMOJIS[block.iconKey] ?? '📌'}</span>
                        <div className="flex-1">
                          <p className="font-medium">{block.activity || 'Untitled'}</p>
                          <p className="text-sm text-gray-500">
                            {block.startTime} – {block.endTime}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing({ block, isNew: false })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="outline" className="w-full gap-2" onClick={addBlock}>
        <Plus className="h-4 w-4" />
        Add Activity Block
      </Button>

      {editing && (
        <BlockEditorDialog
          block={editing.block}
          isNew={editing.isNew}
          onSave={saveBlock}
          onClose={() => setEditing(null)}
        />
      )}

      {showPreview && (
        <SchedulePreview
          title={title || 'Schedule Preview'}
          dayOfWeek={dayOfWeek}
          blocks={blocks}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

function BlockEditorDialog({
  block: initialBlock,
  isNew,
  onSave,
  onClose,
}: {
  block: ScheduleBlock
  isNew: boolean
  onSave: (block: ScheduleBlock, isNew: boolean) => void
  onClose: () => void
}) {
  const [block, setBlock] = useState<ScheduleBlock>(initialBlock)

  function update<K extends keyof ScheduleBlock>(key: K, value: ScheduleBlock[K]) {
    setBlock((b) => ({ ...b, [key]: value }))
  }

  function handleSave() {
    if (!block.activity.trim()) return
    onSave(block, isNew)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add Activity' : 'Edit Activity'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Activity Name *</Label>
            <Input
              value={block.activity}
              onChange={(e) => update('activity', e.target.value)}
              placeholder="e.g. Reading Time"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={block.startTime}
                onChange={(e) => update('startTime', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Time</Label>
              <Input
                type="time"
                value={block.endTime}
                onChange={(e) => update('endTime', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => update('iconKey', opt.key)}
                  className={`rounded-lg p-2 text-center text-2xl hover:bg-gray-100 ${
                    block.iconKey === opt.key ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  title={opt.label}
                >
                  {ICON_EMOJIS[opt.key]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {BLOCK_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update('color', color)}
                  className={`h-8 w-8 rounded-full ${
                    block.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Transition Cue (optional)</Label>
            <Input
              value={block.transitionCue ?? ''}
              onChange={(e) => update('transitionCue', e.target.value)}
              placeholder="e.g. timer, countdown, bell"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              value={block.notes ?? ''}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!block.activity.trim()}>
              {isNew ? 'Add' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
