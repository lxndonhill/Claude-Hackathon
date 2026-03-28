'use client'

import { ScheduleBlock, DayOfWeek } from '@/types/schedule'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

const ICON_EMOJIS: Record<string, string> = {
  book: '📚', math: '🔢', art: '🎨', music: '🎵', pe: '⚽',
  lunch: '🍽️', snack: '🍎', recess: '🛝', computer: '💻',
  circle: '🔵', break: '☕', therapy: '🏥', bathroom: '🚻',
  arrival: '🏫', dismissal: '🚌',
}

interface Props {
  title: string
  dayOfWeek: DayOfWeek
  blocks: ScheduleBlock[]
  onClose: () => void
}

export function SchedulePreview({ title, dayOfWeek, blocks, onClose }: Props) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title} — {dayOfWeek}</span>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 print:space-y-1">
          {sorted.length === 0 && (
            <p className="py-8 text-center text-gray-400">No blocks to preview</p>
          )}
          {sorted.map((block) => (
            <div
              key={block.id}
              className="flex items-center gap-3 rounded-xl p-3 text-white"
              style={{ backgroundColor: block.color }}
            >
              <span className="text-3xl print:text-2xl">{ICON_EMOJIS[block.iconKey] ?? '📌'}</span>
              <div className="flex-1">
                <p className="font-bold text-lg print:text-base leading-tight">{block.activity}</p>
                <p className="text-sm opacity-90">
                  {block.startTime} – {block.endTime}
                </p>
                {block.transitionCue && (
                  <p className="text-xs opacity-75">Transition: {block.transitionCue}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
