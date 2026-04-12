// ─── Roles ────────────────────────────────────────────────────────────────────

export type Role =
  | 'super_admin'
  | 'admin'
  | 'hr_manager'
  | 'department_manager'
  | 'team_leader'
  | 'employee'
  | 'intern'
  | 'external'
  | 'read_only'
  | 'recruiter'
  | 'payroll_manager'

export const ADMIN_ROLES: Role[] = [
  'super_admin',
  'admin',
  'hr_manager',
  'department_manager',
  'team_leader',
  'payroll_manager',
  'recruiter',
]

export const EMPLOYEE_ROLES: Role[] = ['employee', 'intern', 'external', 'read_only']

export function isAdminRole(role: Role): boolean {
  return ADMIN_ROLES.includes(role)
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export type Permission = 'visibility' | 'read' | 'write' | 'approve' | 'config'

export type ModulePermissions = Record<Permission, boolean>

// ─── Tenant ───────────────────────────────────────────────────────────────────

export type TenantPlan = 'starter' | 'growth' | 'enterprise'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: TenantPlan
  installed_addons: string[]
  logo_url?: string
  primary_color?: string
  timezone?: string
  locale?: string
  country?: string
  created_at?: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  role: Role
  tenant_id: string
  employee_id?: string
  department_id?: string
  center_id?: string
  position?: string
  is_active?: boolean
  created_at?: string
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Employee {
  id: string
  user_id: string
  tenant_id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  avatar_url?: string
  role: Role
  department_id?: string
  department_name?: string
  center_id?: string
  center_name?: string
  position?: string
  phone?: string
  hire_date?: string
  is_active: boolean
  manager_id?: string
  custom_fields?: Record<string, unknown>
}

// ─── Department / Organization ────────────────────────────────────────────────

export interface Department {
  id: string
  tenant_id: string
  name: string
  description?: string
  manager_id?: string
  parent_id?: string
  employee_count?: number
}

export interface WorkCenter {
  id: string
  tenant_id: string
  name: string
  address?: string
  city?: string
  country?: string
  timezone?: string
}

// ─── Sidebar Navigation ───────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  badge?: string | number
  requiredAddon?: string
  requiredRole?: Role[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}
