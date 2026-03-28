import { z } from 'zod'

export const focusAreaValues = [
  'Social Skills',
  'Academic - Math',
  'Academic - Reading',
  'Self-Regulation',
  'Life Skills',
  'Communication',
  'Motor Skills',
  'Sensory Integration',
] as const

export const generatePlanSchema = z.object({
  childId: z.string().min(1, 'Child ID is required'),
  focusArea: z.enum(focusAreaValues),
  additionalContext: z.string().max(1000).optional(),
})

export type GeneratePlanInput = z.infer<typeof generatePlanSchema>
