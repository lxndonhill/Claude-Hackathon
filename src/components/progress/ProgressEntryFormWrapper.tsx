'use client'

import { useRouter } from 'next/navigation'
import { ProgressEntryForm } from './ProgressEntryForm'

export function ProgressEntryFormWrapper({ childId, planId }: { childId: string; planId?: string }) {
  const router = useRouter()

  return (
    <ProgressEntryForm
      childId={childId}
      planId={planId}
      onSuccess={() => router.refresh()}
    />
  )
}
