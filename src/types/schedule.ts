export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface ScheduleBlock {
  id: string
  startTime: string
  endTime: string
  activity: string
  iconKey: string
  color: string
  transitionCue?: string
  notes?: string
  order: number
}

export interface Schedule {
  id: string
  childId: string
  title: string
  dayOfWeek: DayOfWeek
  blocks: ScheduleBlock[]
  isTemplate: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleInput {
  childId: string
  title: string
  dayOfWeek: DayOfWeek
  blocks?: ScheduleBlock[]
  isTemplate?: boolean
}
