export interface Room {
  id: string
  name: string
  location: string // centro de trabajo
  capacity: number
  amenities: ('projector' | 'whiteboard' | 'video_conf' | 'ac' | 'accessible')[]
  image_url?: string
  is_active: boolean
}

export interface RoomBooking {
  id: string
  room_id: string
  room_name: string
  employee_id: string
  employee_name: string
  date: string
  start_time: string // HH:mm
  end_time: string
  title: string
  attendees_count: number
  notes?: string
  status: 'confirmed' | 'cancelled'
}
