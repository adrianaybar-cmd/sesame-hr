export type QuestionType =
  | 'text'
  | 'rating'
  | 'multiple_choice'
  | 'checkbox'
  | 'yes_no'
  | 'file_upload'
  | 'date'

export interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  options?: string[]
  scale?: { min: number; max: number; min_label?: string; max_label?: string }
  placeholder?: string
  order: number
}

export interface Questionnaire {
  id: string
  title: string
  description?: string
  questions: Question[]
  usage: ('ats' | 'evaluation' | 'survey')[]
  created_at: string
  is_active: boolean
}

export interface QuestionnaireResponse {
  id: string
  questionnaire_id: string
  respondent_id: string
  respondent_name: string
  answers: Answer[]
  completed_at?: string
  score?: number
}

export interface Answer {
  question_id: string
  value: string | string[] | number | boolean | null
}
