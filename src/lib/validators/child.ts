import { z } from 'zod'

export const ageGroupValues = [
  'EARLY_CHILDHOOD_5_7',
  'MIDDLE_CHILDHOOD_8_10',
  'EARLY_ADOLESCENCE_11_13',
  'ADOLESCENCE_14_18',
] as const

export const supportLevelValues = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3'] as const

export const communicationStyleValues = [
  'VERBAL',
  'MINIMAL_VERBAL',
  'NON_VERBAL',
  'AAC_USER',
] as const

export const learningStyleValues = [
  'VISUAL',
  'AUDITORY',
  'KINESTHETIC',
  'READING_WRITING',
  'MULTIMODAL',
] as const

export const sensoryPreferencesSchema = z.object({
  avoids: z.array(z.string()),
  seeks: z.array(z.string()),
})

export const createChildSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Invalid date',
  }),
  ageGroup: z.enum(ageGroupValues),
  diagnosisDetails: z.string().max(500).optional(),
  supportLevel: z.enum(supportLevelValues),
  strengths: z.array(z.string()),
  challenges: z.array(z.string()),
  sensoryPreferences: sensoryPreferencesSchema,
  communicationStyle: z.enum(communicationStyleValues),
  learningStyle: z.enum(learningStyleValues),
  interests: z.array(z.string()),
  notes: z.string().max(1000).optional(),
})

export type CreateChildInput = z.infer<typeof createChildSchema>
