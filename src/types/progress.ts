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
  1: 'Just Starting',
  2: 'Making Attempts',
  3: 'Developing',
  4: 'Progressing Well',
  5: 'Thriving',
}
