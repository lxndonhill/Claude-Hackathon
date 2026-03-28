export interface ProgressEntry {
  id: string
  childId: string
  planId?: string
  goalDescription: string
  rating: number
  notes?: string
  date: string
  createdAt: string
}

export interface CreateProgressEntryInput {
  childId: string
  planId?: string
  goalDescription: string
  rating: number
  notes?: string
  date: string
}

export const RATING_LABELS: Record<number, string> = {
  1: 'Not Yet',
  2: 'Emerging',
  3: 'Developing',
  4: 'Achieving',
  5: 'Mastered',
}
