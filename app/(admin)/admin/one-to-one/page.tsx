'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Input } from '@clasing/ui/input'
import { Textarea } from '@clasing/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Checkbox } from '@clasing/ui/checkbox'
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  RepeatIcon,
  CheckSquareIcon,
  NotePencilIcon,
} from '@phosphor-icons/react'
import { MOCK_ONE_TO_ONE } from '@/lib/mock/one-to-one'
import type { OneToOneMeeting, OneToOneStatus, OneToOneFrequency, ActionItem } from '@/lib/types/one-to-one'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OneToOneStatus, string> = {
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
}

const STATUS_VARIANTS: Record<OneToOneStatus, 'warning' | 'success' | 'error' | 'neutral'> = {
  scheduled: 'warning',
  completed: 'success',
  cancelled: 'neutral',
  no_show: 'error',
}

const FREQ_LABELS: Record<OneToOneFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  ad_hoc: 'Puntual',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isUpcoming(meeting: OneToOneMeeting): boolean {
  return meeting.status === 'scheduled' && new Date(meeting.scheduled_at) > new Date()
}

function isPast(meeting: OneToOneMeeting): boolean {
  return meeting.status === 'completed' || meeting.status === 'cancelled' || meeting.status === 'no_show' ||
    (meeting.status === 'scheduled' && new Date(meeting.scheduled_at) < new Date())
}

// ─── MeetingCard ──────────────────────────────────────────────────────────────

interface MeetingCardProps {
  meeting: OneToOneMeeting
  onClick: () => void
}

function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const pendingActions = meeting.action_items.filter((a) => !a.completed).length
  return (
    <Card
      className="cursor-pointer hover:border-ring transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <UserIcon className="size-4 text-muted-foreground" />
            </div>
            <span className="label-sm font-semibold text-foreground">{meeting.employee_name}</span>
          </div>
          <Badge variant={STATUS_VARIANTS[meeting.status]} size="sm">
            {STATUS_LABELS[meeting.status]}
          </Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="size-3.5" />
            <span className="paragraph-xs">{formatDate(meeting.scheduled_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon className="size-3.5" />
            <span className="paragraph-xs">{meeting.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <RepeatIcon className="size-3.5" />
            <span className="paragraph-xs">{FREQ_LABELS[meeting.frequency]}</span>
          </div>
        </div>
        {pendingActions > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <CheckSquareIcon className="size-3.5 text-amber-500" />
              <span className="label-xs text-amber-600">{pendingActions} acción{pendingActions > 1 ? 'es' : ''} pendiente{pendingActions > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── MeetingDetail dialog ─────────────────────────────────────────────────────

interface MeetingDetailProps {
  meeting: OneToOneMeeting | null
  onClose: () => void
  onToggleAction: (meetingId: string, actionId: string) => void
}

function MeetingDetailDialog({ meeting, onClose, onToggleAction }: MeetingDetailProps) {
  if (!meeting) return null
  return (
    <Dialog open={!!meeting} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>1-to-1 con {meeting.employee_name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={STATUS_VARIANTS[meeting.status]} size="sm">{STATUS_LABELS[meeting.status]}</Badge>
            <Badge variant="neutral" size="sm">{FREQ_LABELS[meeting.frequency]}</Badge>
            <Badge variant="neutral" size="sm">{meeting.duration_minutes} min</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span className="paragraph-sm">{formatDate(meeting.scheduled_at)}</span>
          </div>

          {/* Agenda */}
          {meeting.agenda && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-1.5">Agenda</span>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="paragraph-sm text-foreground whitespace-pre-line">{meeting.agenda}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {meeting.meeting_notes && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-1.5">
                <NotePencilIcon className="size-4 inline mr-1" />
                Notas de la reunión
              </span>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="paragraph-sm text-foreground whitespace-pre-line">{meeting.meeting_notes}</p>
              </div>
            </div>
          )}

          {/* Action items */}
          {meeting.action_items.length > 0 && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-2">
                <CheckSquareIcon className="size-4 inline mr-1" />
                Action items
              </span>
              <div className="flex flex-col gap-2">
                {meeting.action_items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => onToggleAction(meeting.id, item.id)}
                      id={item.id}
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={item.id}
                        className={cn(
                          'paragraph-sm cursor-pointer',
                          item.completed && 'line-through text-muted-foreground',
                        )}
                      >
                        {item.description}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={item.owner === 'manager' ? 'default' : 'neutral'} size="xs">
                          {item.owner === 'manager' ? 'Manager' : 'Empleado'}
                        </Badge>
                        {item.due_date && (
                          <span className="label-xs text-muted-foreground">
                            {new Date(item.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next meeting */}
          {meeting.next_meeting_at && (
            <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" />
              <span className="paragraph-sm text-muted-foreground">
                Próxima reunión:{' '}
                <span className="font-medium text-foreground">
                  {new Date(meeting.next_meeting_at).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── New meeting dialog ───────────────────────────────────────────────────────

interface NewMeetingDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: { employee: string; date: string; duration: string; frequency: OneToOneFrequency; agenda: string }) => void
}

function NewMeetingDialog({ open, onClose, onSave }: NewMeetingDialogProps) {
  const [employee, setEmployee] = useState('')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('30')
  const [frequency, setFrequency] = useState<OneToOneFrequency>('biweekly')
  const [agenda, setAgenda] = useState('')

  function handleSave() {
    if (!employee.trim() || !date) return
    onSave({ employee, date, duration, frequency, agenda })
    setEmployee('')
    setDate('')
    setDuration('30')
    setFrequency('biweekly')
    setAgenda('')
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Programar nuevo 1-to-1</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Empleado</label>
            <Input
              placeholder="Nombre del empleado"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            />
          </div>
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Fecha y hora</label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Duración</label>
              <Select value={duration} onValueChange={(v: string) => setDuration(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Frecuencia</label>
              <Select value={frequency} onValueChange={(v: string) => setFrequency(v as OneToOneFrequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQ_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Agenda (opcional)</label>
            <Textarea
              placeholder="Puntos a tratar en la reunión..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!employee.trim() || !date}>
            Programar reunión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CURRENT_MANAGER_ID = 'mgr-1'

export default function OneToOnePage() {
  const [meetings, setMeetings] = useState<OneToOneMeeting[]>(MOCK_ONE_TO_ONE)
  const [selectedMeeting, setSelectedMeeting] = useState<OneToOneMeeting | null>(null)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [tab, setTab] = useState('upcoming')

  const myMeetings = meetings.filter((m) => m.manager_id === CURRENT_MANAGER_ID)
  const upcoming = myMeetings.filter(isUpcoming)
  const past = myMeetings.filter(isPast)

  function handleToggleAction(meetingId: string, actionId: string) {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              action_items: m.action_items.map((a) =>
                a.id === actionId ? { ...a, completed: !a.completed } : a,
              ),
            }
          : m,
      ),
    )
    // Update selected meeting too
    if (selectedMeeting?.id === meetingId) {
      setSelectedMeeting((prev) =>
        prev
          ? {
              ...prev,
              action_items: prev.action_items.map((a) =>
                a.id === actionId ? { ...a, completed: !a.completed } : a,
              ),
            }
          : null,
      )
    }
  }

  function handleNewMeeting(data: { employee: string; date: string; duration: string; frequency: OneToOneFrequency; agenda: string }) {
    const newMeeting: OneToOneMeeting = {
      id: `oto-new-${Date.now()}`,
      manager_id: CURRENT_MANAGER_ID,
      manager_name: 'Laura Martínez',
      employee_id: `emp-new-${Date.now()}`,
      employee_name: data.employee,
      scheduled_at: new Date(data.date).toISOString(),
      duration_minutes: parseInt(data.duration),
      frequency: data.frequency,
      status: 'scheduled',
      agenda: data.agenda || undefined,
      action_items: [],
    }
    setMeetings((prev) => [newMeeting, ...prev])
    setNewDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">1-to-1 Meetings</h1>
          <p className="paragraph-sm text-muted-foreground mt-0.5">
            Gestión de reuniones individuales con tu equipo
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)}>
          <PlusIcon className="size-4 mr-1.5" />
          Programar 1-to-1
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Próximas</span>
            <span className="title-lg font-semibold text-foreground">{upcoming.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Completadas</span>
            <span className="title-lg font-semibold text-foreground">
              {myMeetings.filter((m) => m.status === 'completed').length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Pendientes de acción</span>
            <span className="title-lg font-semibold text-foreground">
              {myMeetings.reduce((acc, m) => acc + m.action_items.filter((a) => !a.completed).length, 0)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList {...({} as any)}>
          <TabsTrigger value="upcoming">
            Próximas
            {upcoming.length > 0 && (
              <Badge variant="default" size="xs" className="ml-1.5">{upcoming.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Pasadas</TabsTrigger>
          <TabsTrigger value="all">Todos mis equipos</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="size-10 text-muted-foreground mx-auto mb-3" />
              <span className="label-md font-medium text-foreground block">Sin reuniones próximas</span>
              <span className="paragraph-sm text-muted-foreground">Programa un nuevo 1-to-1 con tu equipo.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcoming.map((m) => (
                <MeetingCard key={m.id} meeting={m} onClick={() => setSelectedMeeting(m)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <div className="text-center py-12">
              <span className="paragraph-sm text-muted-foreground">Sin reuniones pasadas.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {past.map((m) => (
                <MeetingCard key={m.id} meeting={m} onClick={() => setSelectedMeeting(m)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myMeetings.map((m) => (
              <MeetingCard key={m.id} meeting={m} onClick={() => setSelectedMeeting(m)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <MeetingDetailDialog
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onToggleAction={handleToggleAction}
      />
      <NewMeetingDialog
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onSave={handleNewMeeting}
      />
    </div>
  )
}
