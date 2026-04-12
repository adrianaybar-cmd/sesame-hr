export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  name: string
  description?: string
  color: string // hex
  owner_id: string
  owner_name: string
  members: string[] // employee_ids
  status: 'active' | 'archived' | 'completed'
  task_count: number
  completed_task_count: number
  created_at: string
}

export interface Task {
  id: string
  project_id: string
  project_name: string
  title: string
  description?: string
  assignee_id?: string
  assignee_name?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  tags: string[]
  subtasks: Subtask[]
  time_spent_minutes: number
  estimated_minutes?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface TimeEntry {
  id: string
  task_id: string
  employee_id: string
  start: string // ISO
  end?: string
  duration_minutes?: number
  notes?: string
}
