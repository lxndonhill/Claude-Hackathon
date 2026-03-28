import useSWR, { mutate } from 'swr'
import { ProgressEntry } from '@/types/progress'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useProgress(childId: string, planId?: string) {
  const url = childId
    ? `/api/progress?childId=${childId}${planId ? `&planId=${planId}` : ''}`
    : null
  const { data, error, isLoading } = useSWR<ProgressEntry[]>(url, fetcher)
  return { entries: data ?? [], error, isLoading }
}

export function refreshProgress(childId: string) {
  mutate(`/api/progress?childId=${childId}`)
}
