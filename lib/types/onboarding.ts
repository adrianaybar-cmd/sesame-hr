export interface OnboardingTemplate {
  id: string
  name: string
  description?: string
  tasks: OnboardingTask[]
  duration_days: number
}

export interface OnboardingTask {
  id: string
  title: string
  description?: string
  responsible: 'employee' | 'hr' | 'manager' | 'it'
  due_day: number // día desde incorporación
  required: boolean
  category: 'documentation' | 'setup' | 'training' | 'meeting' | 'other'
}

export interface OnboardingProcess {
  id: string
  template_id: string
  template_name: string
  employee_id: string
  employee_name: string
  start_date: string
  type: 'onboarding' | 'offboarding'
  tasks: ProcessTask[]
  progress: number // 0-100
  status: 'not_started' | 'in_progress' | 'completed'
}

export interface ProcessTask extends OnboardingTask {
  completed: boolean
  completed_at?: string
  completed_by?: string
}
