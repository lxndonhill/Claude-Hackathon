export type FocusArea =
  | 'Social Skills'
  | 'Academic - Math'
  | 'Academic - Reading'
  | 'Self-Regulation'
  | 'Life Skills'
  | 'Communication'
  | 'Motor Skills'
  | 'Sensory Integration'

export interface PlanGoal {
  id: string
  description: string
  measurementCriteria: string
  timeframe: string
}

export interface PlanStrategy {
  id: string
  title: string
  description: string
  frequency?: string
}

export interface WeeklyStructure {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  notes?: string
}

export interface LearningPlan {
  id: string
  childId: string
  title: string
  focusArea: string
  goals: PlanGoal[]
  strategies: PlanStrategy[]
  accommodations: string[]
  materials: string[]
  weeklyStructure: WeeklyStructure
  assessmentMethods: string[]
  rawResponse: string
  promptUsed: string
  modelVersion: string
  createdAt: string
  updatedAt: string
}

export interface GeneratePlanInput {
  childId: string
  focusArea: FocusArea
  additionalContext?: string
}
