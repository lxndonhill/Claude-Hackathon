'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteChildButtonProps {
  childId: string
  childName: string
}

export function DeleteChildButton({ childId, childName }: DeleteChildButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/children/${childId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete')
      }
      router.push('/dashboard/children')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        className="gap-2 font-semibold"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete profile
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete student profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{childName}</span>?
              This will permanently remove their profile, all learning plans, schedules, and progress entries.
              This action cannot be undone.
            </p>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {loading ? 'Deleting…' : 'Delete permanently'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
