export type BoostCategory =
  | 'teamwork'
  | 'innovation'
  | 'leadership'
  | 'customer'
  | 'excellence'
  | 'values'

export interface BoostCard {
  id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  recipient_id: string
  recipient_name: string
  category: BoostCategory
  message: string
  is_public: boolean
  created_at: string
  reactions: { emoji: string; count: number; user_ids: string[] }[]
}
