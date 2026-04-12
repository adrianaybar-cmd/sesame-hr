export interface Shift {
  id: string
  name: string
  color: string
  start_time: string // HH:mm
  end_time: string
  break_minutes: number
  total_hours: number
  days_of_week: number[] // 0=lunes, 6=domingo
  is_predefined: boolean // 6 turnos predefinidos del sistema
}

export interface ShiftAssignment {
  id: string
  employee_id: string
  employee_name: string
  shift_id: string
  shift_name: string
  shift_color: string
  week_start: string // ISO Monday
  day_assignments: DayAssignment[]
}

export interface DayAssignment {
  date: string
  shift_id?: string // null = día libre
  is_holiday?: boolean
}
