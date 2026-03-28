import { z } from 'zod'

export const createProgressEntrySchema = z.object({
  childId: z.string().min(1),
  planId: z.string().optional(),
  goalDescription: z.string().min(1).max(300),
  rating: z.number().int().min(1).max(5),
  notes: z.string().max(500).optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Invalid date',
  }),
})

export const updateProgressEntrySchema = createProgressEntrySchema
  .partial()
  .omit({ childId: true })

export type CreateProgressEntryInput = z.infer<typeof createProgressEntrySchema>
