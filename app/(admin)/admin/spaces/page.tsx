'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  BuildingsIcon,
  UsersIcon,
  MonitorIcon,
  ChalkboardIcon,
  VideoCameraIcon,
  WindIcon,
  WheelchairIcon,
} from '@phosphor-icons/react'
import { MOCK_ROOMS, MOCK_BOOKINGS } from '@/lib/mock/spaces'
import type { Room, RoomBooking } from '@/lib/types/spaces'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEEK_DAYS = [
  { label: 'Lun 14 abr', date: '2026-04-14' },
  { label: 'Mar 15 abr', date: '2026-04-15' },
  { label: 'Mié 16 abr', date: '2026-04-16' },
  { label: 'Jue 17 abr', date: '2026-04-17' },
  { label: 'Vie 18 abr', date: '2026-04-18' },
]

const AMENITY_ICONS = {
  projector: MonitorIcon,
  whiteboard: ChalkboardIcon,
  video_conf: VideoCameraIcon,
  ac: WindIcon,
  accessible: WheelchairIcon,
}

const AMENITY_LABELS = {
  projector: 'Proyector',
  whiteboard: 'Pizarra',
  video_conf: 'Videoconf.',
  ac: 'Aire acondi.',
  accessible: 'Accesible',
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const DAY_START = 8 * 60 // 8:00
const DAY_END = 19 * 60  // 19:00
const DAY_MINUTES = DAY_END - DAY_START

// ─── Booking Block ────────────────────────────────────────────────────────────

function BookingBlock({ booking }: { booking: RoomBooking }) {
  const startMin = timeToMinutes(booking.start_time) - DAY_START
  const endMin = timeToMinutes(booking.end_time) - DAY_START
  const top = (startMin / DAY_MINUTES) * 100
  const height = ((endMin - startMin) / DAY_MINUTES) * 100

  return (
    <div
      className="absolute inset-x-0.5 rounded-md bg-primary/15 border border-primary/30 px-1.5 py-1 overflow-hidden"
      style={{ top: `${top}%`, height: `${Math.max(height, 8)}%` }}
      title={`${booking.title} — ${booking.employee_name} (${booking.start_time}-${booking.end_time})`}
    >
      <p className="paragraph-xs font-medium text-primary leading-tight truncate">{booking.start_time}</p>
      <p className="paragraph-xs text-primary/80 leading-tight truncate">{booking.title}</p>
    </div>
  )
}

// ─── New Room Dialog ──────────────────────────────────────────────────────────

function NewRoomDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [amenities, setAmenities] = useState<Set<string>>(new Set())

  function toggleAmenity(a: string) {
    setAmenities((prev) => {
      const next = new Set(prev)
      if (next.has(a)) next.delete(a)
      else next.add(a)
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
    setName('')
    setLocation('')
    setCapacity('')
    setAmenities(new Set())
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva sala</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Nombre de la sala</label>
            <Input placeholder="Ej: Sala Newton" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Ubicación</label>
              <Input placeholder="Centro de trabajo" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Capacidad (personas)</label>
              <Input type="number" min="1" placeholder="12" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="label-sm font-medium text-foreground">Equipamiento</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AMENITY_LABELS).map(([key, label]) => {
                const Icon = AMENITY_ICONS[key as keyof typeof AMENITY_ICONS]
                const active = amenities.has(key)
                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full border paragraph-xs transition-colors',
                      active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    )}
                    onClick={() => toggleAmenity(key)}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={!name || !location || !capacity}>Crear sala</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSpacesPage() {
  const [showNewRoom, setShowNewRoom] = useState(false)

  const activeRooms = MOCK_ROOMS.filter((r) => r.is_active)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Gestión de Espacios</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {activeRooms.length} salas activas · Vista semanal 14–18 abril 2026
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowNewRoom(true)}>
          <PlusIcon className="size-4" />
          Nueva sala
        </Button>
      </div>

      {/* Weekly grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="grid border-b border-border" style={{ gridTemplateColumns: '200px repeat(5, 1fr)' }}>
          <div className="px-4 py-3 border-r border-border">
            <span className="label-xs font-medium text-muted-foreground">SALA</span>
          </div>
          {WEEK_DAYS.map((day) => (
            <div key={day.date} className="px-3 py-3 border-r border-border last:border-r-0 text-center">
              <span className="label-xs font-medium text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>

        {/* Room rows */}
        {activeRooms.map((room) => (
          <div
            key={room.id}
            className="grid border-b border-border last:border-b-0"
            style={{ gridTemplateColumns: '200px repeat(5, 1fr)' }}
          >
            {/* Room info */}
            <div className="px-4 py-3 border-r border-border flex flex-col gap-1 justify-start">
              <div className="flex items-center gap-1.5">
                <BuildingsIcon className="size-3.5 text-muted-foreground shrink-0" />
                <span className="label-sm font-semibold text-foreground">{room.name}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <UsersIcon className="size-3 shrink-0" />
                <span className="paragraph-xs">{room.capacity} personas</span>
              </div>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {room.amenities.slice(0, 3).map((a) => {
                  const Icon = AMENITY_ICONS[a]
                  return <Icon key={a} className="size-3 text-muted-foreground" aria-label={AMENITY_LABELS[a]} />
                })}
              </div>
            </div>

            {/* Day columns */}
            {WEEK_DAYS.map((day) => {
              const dayBookings = MOCK_BOOKINGS.filter(
                (b) => b.room_id === room.id && b.date === day.date && b.status === 'confirmed'
              )
              return (
                <div key={day.date} className="border-r border-border last:border-r-0 relative" style={{ minHeight: '120px' }}>
                  {dayBookings.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="paragraph-xs text-muted-foreground/40">Libre</span>
                    </div>
                  ) : (
                    <div className="relative h-full min-h-32 p-1">
                      {dayBookings.map((b) => (
                        <BookingBlock key={b.id} booking={b} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Inactive rooms notice */}
      {MOCK_ROOMS.some((r) => !r.is_active) && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent/50 border border-border">
          <BuildingsIcon className="size-4 text-muted-foreground shrink-0" />
          <p className="paragraph-sm text-muted-foreground">
            {MOCK_ROOMS.filter((r) => !r.is_active).length} sala{MOCK_ROOMS.filter((r) => !r.is_active).length !== 1 ? 's' : ''} inactiva{MOCK_ROOMS.filter((r) => !r.is_active).length !== 1 ? 's' : ''} oculta{MOCK_ROOMS.filter((r) => !r.is_active).length !== 1 ? 's' : ''} de la vista
          </p>
        </div>
      )}

      <NewRoomDialog open={showNewRoom} onClose={() => setShowNewRoom(false)} />
    </div>
  )
}
