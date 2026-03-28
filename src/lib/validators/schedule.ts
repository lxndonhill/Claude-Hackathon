import { z } from 'zod'

export const dayOfWeekValues = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

export const scheduleBlockSchema = z.object({
  id: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
  activity: z.string().min(1).max(100),
  iconKey: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  transitionCue: z.string().optional(),
  notes: z.string().max(200).optional(),
  order: z.number().int().min(0),
})

export const createScheduleSchema = z.object({
  childId: z.string().min(1),
  title: z.string().min(1).max(100),
  dayOfWeek: z.enum(dayOfWeekValues),
  blocks: z.array(scheduleBlockSchema).default([]),
  isTemplate: z.boolean().default(false),
})

export const updateScheduleSchema = createScheduleSchema.partial().omit({ childId: true })

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>
