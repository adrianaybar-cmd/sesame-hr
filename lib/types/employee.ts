import type { Role } from '@/types'

export interface Employee {
  id: string
  user_id: string
  tenant_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  position: string
  department_id: string
  department_name: string
  work_center_id: string
  work_center_name: string
  manager_id?: string
  hire_date: string
  termination_date?: string
  contract_type: 'indefinido' | 'temporal' | 'practicas' | 'freelance'
  role: Role
  custom_fields?: Record<string, unknown>
}

// ─── Extended profile types ───────────────────────────────────────────────────

export interface Education {
  id: string
  degree: string
  institution: string
  year: number
  field?: string
}

export interface Language {
  language: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry_date?: string
  url?: string
}

export interface HistoryEntry {
  id: string
  date: string
  type: 'position_change' | 'department_change' | 'salary_change' | 'status_change' | 'location_change'
  previous_value: string
  new_value: string
  changed_by: string
}

export interface EmployeeEvaluation {
  id: string
  date: string
  evaluator_name: string
  type: string
  score: number
  max_score: number
  comments?: string
}

export interface EmployeeDocument {
  id: string
  name: string
  type: string
  uploaded_at: string
  size_kb: number
  url?: string
}

export interface EmployeeProfile extends Employee {
  // Información personal
  birth_date?: string
  nationality?: string
  dni?: string
  gender?: string
  address?: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  emergency_contact?: {
    name: string
    relationship: string
    phone: string
  }

  // Contrato y nómina
  salary?: number
  salary_currency?: string
  irpf?: number
  social_security_number?: string
  bank_account?: string

  // Educación
  education: Education[]
  languages: Language[]
  skills: string[]
  certifications: Certification[]

  // Documentos y evaluaciones
  documents: EmployeeDocument[]
  evaluations: EmployeeEvaluation[]

  // Historial
  history: HistoryEntry[]
}

export interface Department {
  id: string
  name: string
  manager_id?: string
  employee_count: number
  parent_department_id?: string
  color?: string
}

export interface WorkCenter {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  country: string
  employee_count: number
  timezone: string
}

export interface CompanySettings {
  id: string
  name: string
  cif: string
  address: string
  city: string
  postal_code: string
  country: string
  logo_url?: string
  language: string
  timezone: string
}
