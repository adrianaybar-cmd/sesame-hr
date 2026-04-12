export type OneToOneStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type OneToOneFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'ad_hoc'

export interface ActionItem {
  id: string
  description: string
  owner: 'manager' | 'employee'
  due_date?: string
  completed: boolean
}

export interface OneToOneMeeting {
  id: string
  manager_id: string
  manager_name: string
  employee_id: string
  employee_name: string
  scheduled_at: string
  duration_minutes: number
  frequency: OneToOneFrequency
  status: OneToOneStatus
  agenda?: string
  meeting_notes?: string
  action_items: ActionItem[]
  next_meeting_at?: string
}
