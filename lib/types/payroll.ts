export type PayrollStatus = 'draft' | 'calculated' | 'reviewed' | 'closed' | 'paid'

export interface PayrollPeriod {
  id: string
  year: number
  month: number // 1-12
  status: PayrollStatus
  employees_count: number
  total_gross: number
  total_net: number
  total_company_cost: number
  closed_at?: string
}

export interface Payslip {
  id: string
  period_id: string
  employee_id: string
  employee_name: string
  employee_nif: string
  position: string
  department: string

  // Devengos (ingresos)
  base_salary: number
  overtime_pay: number
  bonuses: number
  other_income: number
  gross_salary: number

  // Deducciones
  irpf_rate: number
  irpf_amount: number
  social_security_employee: number
  other_deductions: number
  total_deductions: number

  net_salary: number
  company_ss_contribution: number
  total_company_cost: number

  status: 'draft' | 'reviewed' | 'paid'
  paid_at?: string
  bank_account?: string // últimos 4 dígitos
}

export interface SalaryContract {
  id: string
  employee_id: string
  base_salary: number
  salary_type: 'annual' | 'monthly'
  contract_type: 'indefinido' | 'temporal' | 'practicas' | 'freelance'
  irpf_rate: number
  social_security_group: number // 1-11
  start_date: string
  end_date?: string
  is_active: boolean
}
