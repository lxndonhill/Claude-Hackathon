import { ChildProfile } from '@/types/child'

export interface PreviousPlanSummary {
  title: string
  focusArea: string
  goalDescriptions: string[]
  createdAt: string
}

export interface PreviousProgressSummary {
  goalDescription: string
  rating: number
  ratingLabel: string
  date: string
}

export const SYSTEM_PROMPT = `You are an expert autism education specialist with deep knowledge of:
- Applied Behavior Analysis (ABA) and evidence-based autism interventions
- Differentiated instruction for students on the autism spectrum
- Support levels and corresponding educational strategies
- Sensory processing differences and sensory-friendly teaching approaches
- AAC (Augmentative and Alternative Communication) strategies
- Visual supports and structured teaching (TEACCH methodology)
- Social stories and social skills curricula
- Self-regulation strategies (Zones of Regulation, etc.)

Your role is to create highly personalized, practical learning support plans that educators and parents can immediately implement. Always base recommendations on the specific student's profile — their strengths, areas for growth, communication style, sensory preferences, learning style, and special interests.

LANGUAGE GUIDELINES:
- Use strengths-based, person-first language throughout
- Frame challenges as "areas for growth" or "areas where the student benefits from support"
- Avoid clinical diagnostic terminology — write for educators and families, not clinicians
- Lead with what the student CAN do and HOW their strengths can be leveraged

PRIVACY: The student profile you receive does NOT include the student's name. Refer to the student as "the student" throughout the plan.

RATIONALE REQUIREMENT: For every goal and every strategy, you MUST include a "rationale" field explaining WHY this specific recommendation fits THIS student's unique profile. Reference their specific strengths, interests, sensory preferences, or areas for growth in the rationale.

IMPORTANT: You MUST respond with valid JSON only. No markdown, no explanation, just the JSON object.`

export function buildLearningPlanPrompt(
  child: ChildProfile,
  focusArea: string,
  additionalContext?: string,
  previousPlans?: PreviousPlanSummary[],
  previousProgress?: PreviousProgressSummary[]
): string {
  const age = calculateAge(child.dateOfBirth)

  // PRIVACY SAFEGUARD: Child name is intentionally excluded from this prompt.
  // Only anonymised profile data is sent to the Claude API.
  return `Create a personalized learning support plan for a student based on this profile:

STUDENT PROFILE:
- Age: ${age} years old (${formatAgeGroup(child.ageGroup)})
- Support Level: ${formatSupportLevel(child.supportLevel)}
- Communication Style: ${formatCommunicationStyle(child.communicationStyle)}
- Learning Style: ${child.learningStyle}
- Strengths: ${child.strengths.join(', ') || 'Not specified'}
- Areas for Growth: ${child.challenges.join(', ') || 'Not specified'}
- Sensory Profile:
  - Avoids: ${child.sensoryPreferences.avoids.join(', ') || 'None noted'}
  - Seeks: ${child.sensoryPreferences.seeks.join(', ') || 'None noted'}
- Special Interests: ${child.interests.join(', ') || 'Not specified'}
${child.diagnosisDetails ? `- Additional Support Information: ${child.diagnosisDetails}` : ''}
${child.notes ? `- Educator Notes: ${child.notes}` : ''}

FOCUS AREA: ${focusArea}
${additionalContext ? `\nADDITIONAL CONTEXT FROM EDUCATOR: ${additionalContext}` : ''}
${previousPlans && previousPlans.length > 0 ? `
PREVIOUS PLANS (build on these, avoid repeating goals already mastered):
${previousPlans.map((p, i) => `${i + 1}. "${p.title}" (Focus: ${p.focusArea}, created ${new Date(p.createdAt).toLocaleDateString()})
   Goals covered: ${p.goalDescriptions.slice(0, 3).join('; ')}${p.goalDescriptions.length > 3 ? ` +${p.goalDescriptions.length - 3} more` : ''}`).join('\n')}` : ''}
${previousProgress && previousProgress.length > 0 ? `
RECENT PROGRESS DATA (use to inform where the student currently is):
${previousProgress.map((e) => `- ${e.goalDescription}: ${e.ratingLabel} (${e.rating}/5) on ${new Date(e.date).toLocaleDateString()}`).join('\n')}` : ''}

Generate a comprehensive learning support plan. Respond with ONLY this JSON structure:

{
  "title": "Descriptive plan title",
  "goals": [
    {
      "id": "g1",
      "description": "Specific, measurable goal using strengths-based language",
      "measurementCriteria": "How to measure success (e.g., 4 out of 5 trials)",
      "timeframe": "Expected timeframe (e.g., 6-8 weeks)",
      "rationale": "WHY this goal fits this specific student — reference their profile strengths, interests, or areas for growth"
    }
  ],
  "strategies": [
    {
      "id": "s1",
      "title": "Strategy name",
      "description": "Detailed description of how to implement this strategy",
      "frequency": "How often to use (e.g., Daily, 3x per week)",
      "rationale": "WHY this strategy is well-suited for this specific student — reference their learning style, sensory preferences, or special interests"
    }
  ],
  "accommodations": [
    "Specific accommodation or modification"
  ],
  "materials": [
    "Required material or resource"
  ],
  "weeklyStructure": {
    "monday": "Monday focus/activity",
    "tuesday": "Tuesday focus/activity",
    "wednesday": "Wednesday focus/activity",
    "thursday": "Thursday focus/activity",
    "friday": "Friday focus/activity",
    "notes": "Additional scheduling notes"
  },
  "assessmentMethods": [
    "How to track and assess progress"
  ]
}

Include 3-5 goals, 4-6 strategies, 4-6 accommodations, 3-5 materials, and 2-3 assessment methods. Make all recommendations specific to this student's profile, leveraging their strengths and interests. Use supportive, non-diagnostic language throughout.`
}

function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function formatAgeGroup(ageGroup: string): string {
  const map: Record<string, string> = {
    EARLY_CHILDHOOD_5_7: 'Early Childhood, ages 5-7',
    MIDDLE_CHILDHOOD_8_10: 'Middle Childhood, ages 8-10',
    EARLY_ADOLESCENCE_11_13: 'Early Adolescence, ages 11-13',
    ADOLESCENCE_14_18: 'Adolescence, ages 14-18',
  }
  return map[ageGroup] ?? ageGroup
}

function formatSupportLevel(level: string): string {
  const map: Record<string, string> = {
    LEVEL_1: 'Level 1 — Requiring Support',
    LEVEL_2: 'Level 2 — Requiring Substantial Support',
    LEVEL_3: 'Level 3 — Requiring Very Substantial Support',
  }
  return map[level] ?? level
}

function formatCommunicationStyle(style: string): string {
  const map: Record<string, string> = {
    VERBAL: 'Verbal',
    MINIMAL_VERBAL: 'Minimal Verbal',
    NON_VERBAL: 'Non-Verbal',
    AAC_USER: 'AAC Device User',
  }
  return map[style] ?? style
}
