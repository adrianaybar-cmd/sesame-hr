export interface HRChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_role: 'employee' | 'hr'
  content: string
  created_at: string
  is_read: boolean
  attachments?: { name: string; url: string; type: string }[]
}

export interface HRChatConversation {
  id: string
  employee_id: string
  employee_name: string
  employee_avatar?: string
  last_message?: string
  last_message_at?: string
  unread_count: number
  status: 'open' | 'closed'
}
