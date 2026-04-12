export type NotificationType =
  | 'absence_approved'
  | 'absence_rejected'
  | 'clocking_incidence'
  | 'document_shared'
  | 'document_sign_request'
  | 'evaluation_assigned'
  | 'onboarding_task'
  | 'announcement'
  | 'payslip_available'
  | 'birthday'
  | 'task_assigned'
  | 'mention'
  | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  action_url?: string
  is_read: boolean
  created_at: string
  actor_name?: string
  actor_avatar?: string
}
