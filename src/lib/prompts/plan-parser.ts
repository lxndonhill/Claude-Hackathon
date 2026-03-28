import { z } from 'zod'

const planGoalSchema = z.object({
  id: z.string(),
  description: z.string(),
  measurementCriteria: z.string(),
  timeframe: z.string(),
})

const planStrategySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  frequency: z.string().optional(),
})

const weeklyStructureSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  notes: z.string().optional(),
})

const parsedPlanSchema = z.object({
  title: z.string(),
  goals: z.array(planGoalSchema),
  strategies: z.array(planStrategySchema),
  accommodations: z.array(z.string()),
  materials: z.array(z.string()),
  weeklyStructure: weeklyStructureSchema,
  assessmentMethods: z.array(z.string()),
})

export type ParsedPlan = z.infer<typeof parsedPlanSchema>

export function parsePlanResponse(rawResponse: string): ParsedPlan {
  // Strip markdown code blocks if present
  let cleaned = rawResponse.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Try to extract JSON from the response
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) {
      throw new Error('Could not parse plan response as JSON')
    }
    parsed = JSON.parse(match[0])
  }

  const result = parsedPlanSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(`Invalid plan structure: ${result.error.message}`)
  }

  return result.data
}
