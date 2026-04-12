export type CustomRequestStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'closed'

export interface CustomRequestType {
  id: string
  name: string
  description?: string
  icon: string // emoji
  category: string
  form_fields: FormFieldDefinition[]
  approval_flow_id?: string
  is_active: boolean
  allow_attachments: boolean
}

export interface FormFieldDefinition {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'number' | 'checkbox'
  required: boolean
  options?: string[] // para select
  placeholder?: string
}

export interface CustomRequest {
  id: string
  request_type_id: string
  request_type_name: string
  request_type_icon: string
  employee_id: string
  employee_name: string
  status: CustomRequestStatus
  form_data: Record<string, unknown>
  notes?: string
  attachments?: string[]
  submitted_at?: string
  reviewed_by?: string
  reviewed_at?: string
  response?: string
  created_at: string
}
