export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid'
export type ExpenseCategory =
  | 'travel'
  | 'accommodation'
  | 'meals'
  | 'transport'
  | 'office_supplies'
  | 'training'
  | 'entertainment'
  | 'other'

export interface Expense {
  id: string
  employee_id: string
  employee_name: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  currency: string
  receipt_url?: string
  status: ExpenseStatus
  notes?: string
  approved_by?: string
  approved_at?: string
  paid_at?: string
  created_at: string
}

export interface ExpenseReport {
  id: string
  employee_id: string
  title: string
  expenses: Expense[]
  total_amount: number
  status: ExpenseStatus
  submitted_at?: string
}
