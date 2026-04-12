import { z } from 'zod'

// Patrones de sanitización
const noHtmlPattern = /^[^<>'"&]*$/
const safeName = z.string().min(1).max(100).regex(noHtmlPattern, 'Caracteres no permitidos')
const safeEmail = z.string().email().max(255).toLowerCase()
const safePhone = z.string().regex(/^[+\d\s\-()]{7,20}$/, 'Formato de teléfono inválido').optional()
const safeDni = z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE inválido').optional()

// Schemas de negocio con validación estricta
export const LoginSchema = z.object({
  email: safeEmail,
  password: z.string().min(6).max(128),
})

export const EmployeeCreateSchema = z.object({
  first_name: safeName,
  last_name: safeName,
  email: safeEmail,
  phone: safePhone,
  position: z.string().min(1).max(200),
  department_id: z.string().uuid('ID de departamento inválido'),
  work_center_id: z.string().uuid('ID de centro inválido'),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
  role: z.enum(['admin', 'hr_manager', 'department_manager', 'team_leader', 'employee', 'intern', 'external', 'read_only', 'recruiter', 'payroll_manager']),
  nif: safeDni,
})

export const AbsenceRequestSchema = z.object({
  absence_type_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
}).refine(data => new Date(data.start_date) <= new Date(data.end_date), {
  message: 'La fecha de inicio no puede ser posterior a la de fin',
  path: ['end_date'],
})

export const ExpenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.enum(['travel', 'accommodation', 'meals', 'transport', 'office_supplies', 'training', 'entertainment', 'other']),
  description: z.string().min(3).max(300).regex(noHtmlPattern),
  amount: z.number().positive().max(50000),
  currency: z.string().length(3),
  notes: z.string().max(500).optional(),
})

export const TaskSchema = z.object({
  title: z.string().min(1).max(200).regex(noHtmlPattern),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  assignee_id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
})

// Sanitizador general para strings
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}
