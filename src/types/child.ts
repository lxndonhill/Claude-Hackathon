export type AgeGroup =
  | 'EARLY_CHILDHOOD_5_7'
  | 'MIDDLE_CHILDHOOD_8_10'
  | 'EARLY_ADOLESCENCE_11_13'
  | 'ADOLESCENCE_14_18'

export type SupportLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'

export type CommunicationStyle = 'VERBAL' | 'MINIMAL_VERBAL' | 'NON_VERBAL' | 'AAC_USER'

export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING_WRITING' | 'MULTIMODAL'

export interface SensoryPreferences {
  avoids: string[]
  seeks: string[]
}

export interface ChildProfile {
  id: string
  userId: string
  name: string
  dateOfBirth: string
  ageGroup: AgeGroup
  diagnosisDetails?: string
  supportLevel: SupportLevel
  strengths: string[]
  challenges: string[]
  sensoryPreferences: SensoryPreferences
  communicationStyle: CommunicationStyle
  learningStyle: LearningStyle
  interests: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateChildInput {
  name: string
  dateOfBirth: string
  ageGroup: AgeGroup
  diagnosisDetails?: string
  supportLevel: SupportLevel
  strengths: string[]
  challenges: string[]
  sensoryPreferences: SensoryPreferences
  communicationStyle: CommunicationStyle
  learningStyle: LearningStyle
  interests: string[]
  notes?: string
}
