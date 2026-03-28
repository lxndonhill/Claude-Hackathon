import { ChildProfile } from '@/types/child'

export const SYSTEM_PROMPT = `You are an expert autism education specialist with deep knowledge of:
- Applied Behavior Analysis (ABA) and evidence-based autism interventions
- Differentiated instruction for students on the autism spectrum
- DSM-5 support levels and corresponding educational strategies
- Sensory processing differences and sensory-friendly teaching approaches
- AAC (Augmentative and Alternative Communication) strategies
- Visual supports and structured teaching (TEACCH methodology)
- Social stories and social skills curricula
- Self-regulation strategies (Zones of Regulation, etc.)

Your role is to create highly personalized, practical learning plans that educators and parents can immediately implement. Always base recommendations on the specific child's profile — their strengths, challenges, communication style, sensory preferences, learning style, and special interests.

IMPORTANT: You MUST respond with valid JSON only. No markdown, no explanation, just the JSON object.`

export function buildLearningPlanPrompt(
  child: ChildProfile,
  focusArea: string,
  additionalContext?: string
): string {
  const age = calculateAge(child.dateOfBirth)

  return `Create a personalized learning plan for a student with autism based on this profile:

STUDENT PROFILE:
- Age: ${age} years old (${formatAgeGroup(child.ageGroup)})
- DSM-5 Support Level: ${formatSupportLevel(child.supportLevel)}
- Communication Style: ${formatCommunicationStyle(child.communicationStyle)}
- Learning Style: ${child.learningStyle}
- Strengths: ${child.strengths.join(', ') || 'Not specified'}
- Challenges: ${child.challenges.join(', ') || 'Not specified'}
- Sensory Preferences:
  - Avoids: ${child.sensoryPreferences.avoids.join(', ') || 'None noted'}
  - Seeks: ${child.sensoryPreferences.seeks.join(', ') || 'None noted'}
- Special Interests: ${child.interests.join(', ') || 'Not specified'}
${child.diagnosisDetails ? `- Additional Diagnosis Notes: ${child.diagnosisDetails}` : ''}
${child.notes ? `- Educator Notes: ${child.notes}` : ''}

FOCUS AREA: ${focusArea}
${additionalContext ? `\nADDITIONAL CONTEXT FROM EDUCATOR: ${additionalContext}` : ''}

Generate a comprehensive learning plan. Respond with ONLY this JSON structure:

{
  "title": "Descriptive plan title",
  "goals": [
    {
      "id": "g1",
      "description": "Specific, measurable goal",
      "measurementCriteria": "How to measure success (e.g., 4 out of 5 trials)",
      "timeframe": "Expected timeframe (e.g., 6-8 weeks)"
    }
  ],
  "strategies": [
    {
      "id": "s1",
      "title": "Strategy name",
      "description": "Detailed description of how to implement",
      "frequency": "How often to use (e.g., Daily, 3x per week)"
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

Include 3-5 goals, 4-6 strategies, 4-6 accommodations, 3-5 materials, and 2-3 assessment methods. Make all recommendations specific to this student's profile, leveraging their strengths and interests.`
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
    LEVEL_1: 'Level 1 - Requiring Support',
    LEVEL_2: 'Level 2 - Requiring Substantial Support',
    LEVEL_3: 'Level 3 - Requiring Very Substantial Support',
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
