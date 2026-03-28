import useSWR, { mutate } from 'swr'
import { Schedule } from '@/types/schedule'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSchedules(childId: string) {
  const { data, error, isLoading } = useSWR<Schedule[]>(
    childId ? `/api/schedules?childId=${childId}` : null,
    fetcher
  )
  return { schedules: data ?? [], error, isLoading }
}

export function useSchedule(id: string) {
  const { data, error, isLoading } = useSWR<Schedule>(
    id ? `/api/schedules/${id}` : null,
    fetcher
  )
  return { schedule: data, error, isLoading }
}

export function refreshSchedules(childId: string) {
  mutate(`/api/schedules?childId=${childId}`)
}
