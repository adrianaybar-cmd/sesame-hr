export type VacancyStatus = 'draft' | 'published' | 'paused' | 'closed'
export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'interview_1'
  | 'interview_2'
  | 'technical'
  | 'offer'
  | 'hired'
  | 'rejected'

export interface Vacancy {
  id: string
  title: string
  department_id: string
  department_name: string
  location: string
  type: 'full_time' | 'part_time' | 'remote' | 'hybrid'
  status: VacancyStatus
  description: string
  requirements: string[]
  salary_range?: { min: number; max: number; currency: string }
  questionnaire_id?: string
  candidates_count: number
  published_at?: string
  created_at: string
}

export interface Candidate {
  id: string
  vacancy_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  cv_url?: string
  stage: CandidateStage
  rating?: number
  notes?: string
  applied_at: string
  tags: string[]
}
