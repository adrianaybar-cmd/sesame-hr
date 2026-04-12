export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'expired'
export type TrainingType = 'internal' | 'external' | 'online' | 'certification'

export interface Training {
  id: string
  title: string
  description: string
  type: TrainingType
  provider?: string
  duration_hours: number
  cost_per_person?: number
  start_date?: string
  end_date?: string
  max_participants?: number
  category: string
  fundae_eligible: boolean
  created_at: string
}

export interface TrainingEnrollment {
  id: string
  training_id: string
  training_title: string
  employee_id: string
  employee_name: string
  status: TrainingStatus
  enrolled_at: string
  completed_at?: string
  score?: number
  certificate_url?: string
}
