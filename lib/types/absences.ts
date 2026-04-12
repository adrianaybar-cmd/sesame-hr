export type AbsenceStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type AbsenceTypeName =
  | 'vacation'
  | 'sick_leave'
  | 'personal'
  | 'maternity'
  | 'paternity'
  | 'bereavement'
  | 'marriage'
  | 'medical_appointment'
  | 'moving'
  | 'force_majeure'
  | 'unpaid'
  | 'other'

export interface AbsenceType {
  id: string
  name: string
  type: AbsenceTypeName
  color: string // hex
  requires_approval: boolean
  max_days_per_year?: number
  paid: boolean
  icon: string
}

export interface AbsenceRequest {
  id: string
  employee_id: string
  employee_name: string
  absence_type_id: string
  absence_type_name: string
  absence_type_color: string
  start_date: string
  end_date: string
  days: number
  status: AbsenceStatus
  notes?: string
  approved_by?: string
  approved_at?: string
  created_at: string
}

export interface VacationBalance {
  employee_id: string
  year: number
  total_days: number
  used_days: number
  pending_days: number
  remaining_days: number
}
