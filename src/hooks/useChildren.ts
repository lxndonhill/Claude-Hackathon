import useSWR, { mutate } from 'swr'
import { ChildProfile } from '@/types/child'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useChildren() {
  const { data, error, isLoading } = useSWR<ChildProfile[]>('/api/children', fetcher)
  return { children: data ?? [], error, isLoading }
}

export function useChild(id: string) {
  const { data, error, isLoading } = useSWR<ChildProfile>(
    id ? `/api/children/${id}` : null,
    fetcher
  )
  return { child: data, error, isLoading }
}

export function refreshChildren() {
  mutate('/api/children')
}
