export interface HourBank {
  employee_id: string
  employee_name: string
  balance_minutes: number // positivo = horas a favor, negativo = debe
  accrued_minutes: number // acumuladas en el periodo
  consumed_minutes: number // consumidas/compensadas
  period_start: string
  period_end: string
}

export interface HourBankEntry {
  id: string
  employee_id: string
  date: string
  type: 'accrual' | 'compensation' | 'adjustment'
  minutes: number
  notes?: string
  approved_by?: string
}
