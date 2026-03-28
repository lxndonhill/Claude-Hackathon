import useSWR, { mutate } from 'swr'
import { LearningPlan } from '@/types/plan'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function usePlans(childId: string) {
  const { data, error, isLoading } = useSWR<LearningPlan[]>(
    childId ? `/api/plans?childId=${childId}` : null,
    fetcher
  )
  return { plans: data ?? [], error, isLoading }
}

export function usePlan(id: string) {
  const { data, error, isLoading } = useSWR<LearningPlan>(
    id ? `/api/plans/${id}` : null,
    fetcher
  )
  return { plan: data, error, isLoading }
}

export function refreshPlans(childId: string) {
  mutate(`/api/plans?childId=${childId}`)
}
