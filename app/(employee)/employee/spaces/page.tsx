'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  BuildingsIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  MonitorIcon,
  ChalkboardIcon,
  VideoCameraIcon,
  WindIcon,
  WheelchairIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_ROOMS, MOCK_BOOKINGS } from '@/lib/mock/spaces'
import type { Room, RoomBooking } from '@/lib/types/spaces'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-6'
const CURRENT_EMPLOYEE_NAME = 'Sofía Moreno Jiménez'

const AMENITY_ICONS = {
  projector: MonitorIcon,
  whiteboard: ChalkboardIcon,
  video_conf: VideoCameraIcon,
  ac: WindIcon,
  accessible: WheelchairIcon,
}

const AMENITY_LABELS: Record<string, string> = {
  projector: 'Proyector',
  whiteboard: 'Pizarra',
  video_conf: 'Videoconferencia',
  ac: 'Aire acondicionado',
  accessible: 'Accesible',
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({ room, date, onBook }: { room: Room; date: string; onBook: (room: Room) => void }) {
  const todayBookings = MOCK_BOOKINGS.filter(
    (b) => b.room_id === room.id && b.date === date && b.status === 'confirmed'
  )
  const busySlots = todayBookings.length
  const isAvailable = busySlots < 3

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <BuildingsIcon className="size-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="label-md font-semibold text-foreground truncate">{room.name}</p>
            <p className="paragraph-xs text-muted-foreground">{room.location}</p>
          </div>
        </div>
        <Badge variant={isAvailable ? 'success' : 'warning'} size="sm">
          {isAvailable ? 'Disponible' : 'Ocupada'}
        </Badge>
      </div>

      <div className="flex items-center gap-1 text-muted-foreground">
        <UsersIcon className="size-3.5 shrink-0" />
        <span className="paragraph-xs">{room.capacity} personas</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {room.amenities.map((a) => {
          const Icon = AMENITY_ICONS[a as keyof typeof AMENITY_ICONS]
          return (
            <span key={a} className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent border border-border paragraph-xs text-muted-foreground">
              <Icon className="size-3" />
              {AMENITY_LABELS[a]}
            </span>
          )
        })}
      </div>

      {todayBookings.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="label-xs font-medium text-muted-foreground uppercase tracking-wide">Reservas hoy</p>
          {todayBookings.map((b) => (
            <div key={b.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-accent/50">
              <ClockIcon className="size-3.5 text-muted-foreground shrink-0" />
              <span className="paragraph-xs text-muted-foreground">{b.start_time}–{b.end_time}</span>
              <span className="paragraph-xs text-foreground truncate">{b.title}</span>
            </div>
          ))}
        </div>
      )}

      <Button
        variant={isAvailable ? 'primary' : 'outline'}
        size="sm"
        className="w-full"
        onClick={() => onBook(room)}
      >
        <PlusIcon className="size-4" />
        Reservar sala
      </Button>
    </div>
  )
}

// ─── Book Dialog ──────────────────────────────────────────────────────────────

function BookDialog({
  room,
  date,
  open,
  onClose,
  onConfirm,
}: {
  room: Room | null
  date: string
  open: boolean
  onClose: () => void
  onConfirm: (booking: Omit<RoomBooking, 'id' | 'status'>) => void
}) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [attendees, setAttendees] = useState('4')
  const [notes, setNotes] = useState('')

  if (!room) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!room) return
    onConfirm({
      room_id: room.id,
      room_name: room.name,
      employee_id: CURRENT_EMPLOYEE_ID,
      employee_name: CURRENT_EMPLOYEE_NAME,
      date,
      start_time: startTime,
      end_time: endTime,
      title,
      attendees_count: parseInt(attendees),
      notes: notes || undefined,
    })
    setTitle('')
    setStartTime('09:00')
    setEndTime('10:00')
    setAttendees('4')
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reservar {room.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/50 border border-border">
            <CalendarIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="paragraph-sm text-foreground">{date}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <UsersIcon className="size-4 text-muted-foreground shrink-0" />
            <span className="paragraph-sm text-muted-foreground">Capacidad: {room.capacity} personas</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Título de la reunión</label>
            <Input placeholder="Ej: Reunión de equipo Sprint 12" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Hora de inicio</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Hora de fin</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Número de asistentes</label>
            <Input
              type="number"
              min="1"
              max={room.capacity}
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Notas (opcional)</label>
            <Input placeholder="Material necesario, instrucciones especiales..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={!title || !startTime || !endTime}>
              Confirmar reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeSpacesPage() {
  const [selectedDate, setSelectedDate] = useState('2026-04-14')
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null)
  const [myBookings, setMyBookings] = useState<RoomBooking[]>(
    MOCK_BOOKINGS.filter((b) => b.employee_id === CURRENT_EMPLOYEE_ID && b.status === 'confirmed')
  )
  const [cancelId, setCancelId] = useState<string | null>(null)

  const activeRooms = MOCK_ROOMS.filter((r) => r.is_active)

  function handleBook(booking: Omit<RoomBooking, 'id' | 'status'>) {
    const newBooking: RoomBooking = {
      ...booking,
      id: `book-${Date.now()}`,
      status: 'confirmed',
    }
    setMyBookings((prev) => [...prev, newBooking])
    setBookingRoom(null)
  }

  function handleCancel(id: string) {
    setMyBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b))
    setCancelId(null)
  }

  const futureBookings = myBookings
    .filter((b) => b.status === 'confirmed' && b.date >= '2026-04-12')
    .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Reserva de Espacios</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Reserva salas de reuniones en nuestras oficinas
        </p>
      </div>

      {/* Date selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="label-sm font-medium text-foreground">Selecciona una fecha</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-44"
          />
          <span className="paragraph-sm text-muted-foreground">
            {activeRooms.length} salas disponibles
          </span>
        </div>
      </div>

      {/* Room cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            date={selectedDate}
            onBook={(r) => setBookingRoom(r)}
          />
        ))}
      </div>

      {/* My upcoming bookings */}
      <div className="flex flex-col gap-4">
        <h2 className="label-md font-semibold text-foreground">Mis reservas futuras</h2>
        {futureBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 rounded-xl border border-border bg-card text-center">
            <BuildingsIcon className="size-8 text-muted-foreground" />
            <p className="paragraph-sm text-muted-foreground">No tienes reservas próximas</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {futureBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card"
              >
                <div className="flex-1 min-w-0">
                  <p className="label-sm font-semibold text-foreground">{booking.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BuildingsIcon className="size-3.5" />
                      <span className="paragraph-xs">{booking.room_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CalendarIcon className="size-3.5" />
                      <span className="paragraph-xs">{new Date(booking.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ClockIcon className="size-3.5" />
                      <span className="paragraph-xs">{booking.start_time}–{booking.end_time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <UsersIcon className="size-3.5" />
                      <span className="paragraph-xs">{booking.attendees_count} personas</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
                  onClick={() => setCancelId(booking.id)}
                >
                  <XIcon className="size-4" />
                  Cancelar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book dialog */}
      <BookDialog
        room={bookingRoom}
        date={selectedDate}
        open={!!bookingRoom}
        onClose={() => setBookingRoom(null)}
        onConfirm={handleBook}
      />

      {/* Cancel confirm dialog */}
      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
          </DialogHeader>
          <p className="paragraph-sm text-muted-foreground py-2">
            ¿Seguro que quieres cancelar esta reserva? Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>Volver</Button>
            <Button variant="destructive" onClick={() => cancelId && handleCancel(cancelId)}>
              Cancelar reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
