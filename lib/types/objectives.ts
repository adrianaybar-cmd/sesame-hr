export type ObjectiveLevel = 'company' | 'department' | 'individual'
export type ObjectiveStatus = 'on_track' | 'at_risk' | 'behind' | 'completed'

export interface Objective {
  id: string
  title: string
  description?: string
  level: ObjectiveLevel
  owner_id: string
  owner_name: string
  period: { start: string; end: string }
  status: ObjectiveStatus
  progress: number
  key_results: KeyResult[]
  parent_id?: string
  created_at: string
}

export interface KeyResult {
  id: string
  objective_id: string
  title: string
  metric_type: 'percentage' | 'number' | 'boolean' | 'currency'
  target_value: number
  current_value: number
  unit?: string
  progress: number
}
