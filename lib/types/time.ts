export type ClockingStatus = 'working' | 'break' | 'out' | 'not_started'
export type ClockingType = 'office' | 'remote' | 'travel' | 'field'

export interface ClockIn {
  id: string
  employee_id: string
  employee_name: string
  department_name: string
  date: string // YYYY-MM-DD
  entries: ClockEntry[]
  total_minutes: number
  expected_minutes: number
  status: ClockingStatus
  incidence?: string
}

export interface ClockEntry {
  id: string
  type: 'in' | 'out' | 'break_start' | 'break_end'
  timestamp: string // ISO
  location?: { lat: number; lng: number }
  device?: 'web' | 'mobile' | 'kiosk' | 'biometric' | 'nfc'
  clocking_type: ClockingType
}

export interface ClockIncidence {
  id: string
  employee_id: string
  employee_name: string
  date: string
  type: 'missing_exit' | 'retroactive_request' | 'anomaly' | 'overtime'
  status: 'pending' | 'approved' | 'rejected'
  requested_entry?: string
  requested_exit?: string
  notes?: string
  reviewed_by?: string
  reviewed_at?: string
}

export interface WorkSchedule {
  id: string
  name: string
  type: 'fixed' | 'flexible' | 'shift'
  monday?: DaySchedule
  tuesday?: DaySchedule
  wednesday?: DaySchedule
  thursday?: DaySchedule
  friday?: DaySchedule
  saturday?: DaySchedule
  sunday?: DaySchedule
  total_weekly_hours: number
}

export interface DaySchedule {
  start: string // HH:mm
  end: string
  break_start?: string
  break_end?: string
  is_workday: boolean
}

// ─── Who's In ─────────────────────────────────────────────────────────────────

export interface WhosInStatus {
  employee_id: string
  employee_name: string
  avatar_url?: string
  department: string
  status: 'in' | 'remote' | 'out' | 'vacation' | 'sick'
  since?: string // ISO timestamp
  location?: string
}

// ─── Personal Statistics ───────────────────────────────────────────────────────

export interface PersonalStats {
  employee_id: string
  period: 'week' | 'month' | 'year'
  worked_hours: number
  expected_hours: number
  overtime_hours: number
  absence_days: number
  vacation_days_used: number
  vacation_days_remaining: number
  punctuality_rate: number // % días puntuales
  daily_breakdown: DailyStats[]
}

export interface DailyStats {
  date: string
  worked_minutes: number
  expected_minutes: number
  status: 'complete' | 'incomplete' | 'absent' | 'holiday' | 'weekend'
}
