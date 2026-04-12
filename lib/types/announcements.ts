export type AnnouncementStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface Announcement {
  id: string
  title: string
  content: string // HTML o markdown
  author_id: string
  author_name: string
  status: AnnouncementStatus
  target_employees: 'all' | string[] // todos o ids específicos
  target_departments?: string[]
  published_at?: string
  scheduled_at?: string
  views_count: number
  created_at: string
}
