export type EvaluationType = 'self' | 'manager' | 'peer' | '360'
export type EvaluationStatus = 'draft' | 'in_progress' | 'completed' | 'archived'

export interface Evaluation {
  id: string
  title: string
  type: EvaluationType
  questionnaire_id: string
  status: EvaluationStatus
  period: { start: string; end: string }
  employees: string[]
  evaluators: EvaluatorConfig[]
  results?: EvaluationResult[]
  created_at: string
}

export interface EvaluatorConfig {
  type: EvaluationType
  employee_ids?: string[]
  include_manager: boolean
  include_peers: boolean
  peers_count?: number
}

export interface EvaluationResult {
  employee_id: string
  evaluator_id: string
  evaluator_type: EvaluationType
  questionnaire_response_id: string
  score: number
  completed_at: string
}
