import { z } from 'zod'

const planGoalSchema = z.object({
  id: z.string(),
  description: z.string(),
  measurementCriteria: z.string(),
  timeframe: z.string(),
  rationale: z.string().optional(),
})

const planStrategySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  frequency: z.string().optional(),
  rationale: z.string().optional(),
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
  const cleaned = stripMarkdownFences(rawResponse)

  // Try clean parse first
  let parsed = tryJsonParse(cleaned)

  // If clean parse failed, try extracting the outermost JSON object
  if (parsed === null) {
    const extracted = extractJsonObject(cleaned)
    if (extracted !== null) {
      parsed = tryJsonParse(extracted)
    }
  }

  // If still null, try to repair truncated JSON
  if (parsed === null) {
    const repaired = repairTruncatedJson(cleaned)
    parsed = tryJsonParse(repaired)
  }

  if (parsed === null) {
    throw new Error('Could not parse Lumen response as JSON. Raw response length: ' + rawResponse.length)
  }

  const result = parsedPlanSchema.safeParse(parsed)
  if (!result.success) {
    // Log the issues and try to salvage what we can with defaults
    console.error('[plan-parser] Schema validation failed:', result.error.message)
    const fallback = applyDefaults(parsed as Record<string, unknown>)
    const fallbackResult = parsedPlanSchema.safeParse(fallback)
    if (!fallbackResult.success) {
      throw new Error(`Invalid plan structure after fallback: ${fallbackResult.error.message}`)
    }
    return fallbackResult.data
  }

  return result.data
}

function stripMarkdownFences(text: string): string {
  let s = text.trim()
  // Strip opening fence: ```json or ```
  s = s.replace(/^```(?:json)?\s*\n?/, '')
  // Strip closing fence
  s = s.replace(/\n?```\s*$/, '')
  return s.trim()
}

function tryJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{')
  if (start === -1) return null
  // Find the matching closing brace by counting depth
  let depth = 0
  let end = -1
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) return null
  return text.slice(start, end + 1)
}

function repairTruncatedJson(text: string): string {
  const start = text.indexOf('{')
  if (start === -1) return text
  let s = text.slice(start)

  // Remove trailing incomplete key-value pair (ends mid-string or mid-value)
  // Strip everything after the last complete comma-terminated value or closing bracket
  s = s.replace(/,\s*$/, '')
  s = s.replace(/,\s*"[^"]*"\s*:\s*[^,}\]]*$/, '')
  s = s.replace(/,\s*"[^"]*"\s*$/, '')

  // Count open braces and arrays, close them
  let braces = 0
  let brackets = 0
  let inString = false
  let escape = false
  for (const ch of s) {
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') braces++
    else if (ch === '}') braces--
    else if (ch === '[') brackets++
    else if (ch === ']') brackets--
  }

  // Close open structures
  while (brackets > 0) { s += ']'; brackets-- }
  while (braces > 0) { s += '}'; braces-- }

  return s
}

function applyDefaults(obj: Record<string, unknown>): Record<string, unknown> {
  return {
    title: typeof obj.title === 'string' ? obj.title : 'Learning Plan',
    goals: Array.isArray(obj.goals) ? obj.goals : [],
    strategies: Array.isArray(obj.strategies) ? obj.strategies : [],
    accommodations: Array.isArray(obj.accommodations) ? obj.accommodations : [],
    materials: Array.isArray(obj.materials) ? obj.materials : [],
    weeklyStructure: typeof obj.weeklyStructure === 'object' && obj.weeklyStructure !== null
      ? obj.weeklyStructure
      : {},
    assessmentMethods: Array.isArray(obj.assessmentMethods) ? obj.assessmentMethods : [],
  }
}
