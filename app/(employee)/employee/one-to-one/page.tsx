'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Checkbox } from '@clasing/ui/checkbox'
import {
  CalendarIcon,
  ClockIcon,
  RepeatIcon,
  CheckSquareIcon,
  NotePencilIcon,
  UserIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_ONE_TO_ONE } from '@/lib/mock/one-to-one'
import type { OneToOneMeeting, OneToOneStatus, OneToOneFrequency } from '@/lib/types/one-to-one'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-1' // Carlos Ruiz

const STATUS_LABELS: Record<OneToOneStatus, string> = {
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistí',
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return 'Ya pasó'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `en ${days} día${days > 1 ? 's' : ''}`
  return `en ${hours} hora${hours !== 1 ? 's' : ''}`
}

// ─── MeetingDetailDialog ──────────────────────────────────────────────────────

interface MeetingDetailProps {
  meeting: OneToOneMeeting | null
  onClose: () => void
  onToggleAction: (meetingId: string, actionId: string) => void
}

function MeetingDetailDialog({ meeting, onClose, onToggleAction }: MeetingDetailProps) {
  if (!meeting) return null

  const myActions = meeting.action_items.filter((a) => a.owner === 'employee')
  const managerActions = meeting.action_items.filter((a) => a.owner === 'manager')

  return (
    <Dialog open={!!meeting} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>1-to-1 con {meeting.manager_name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={STATUS_VARIANTS[meeting.status]} size="sm">{STATUS_LABELS[meeting.status]}</Badge>
            <Badge variant="neutral" size="sm">{FREQ_LABELS[meeting.frequency]}</Badge>
            <Badge variant="neutral" size="sm">{meeting.duration_minutes} min</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span className="paragraph-sm">{formatDate(meeting.scheduled_at)}</span>
          </div>

          {meeting.agenda && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-1.5">Agenda</span>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="paragraph-sm text-foreground whitespace-pre-line">{meeting.agenda}</p>
              </div>
            </div>
          )}

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

          {myActions.length > 0 && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-2">Mis tareas</span>
              <div className="flex flex-col gap-2">
                {myActions.map((item) => (
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
                      {item.due_date && (
                        <span className="label-xs text-muted-foreground block mt-0.5">
                          Vence: {new Date(item.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {managerActions.length > 0 && (
            <div>
              <span className="label-sm font-semibold text-foreground block mb-2">Tareas de mi manager</span>
              <div className="flex flex-col gap-2">
                {managerActions.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-muted/20">
                    <CheckSquareIcon className={cn('size-4 mt-0.5 shrink-0', item.completed ? 'text-emerald-500' : 'text-muted-foreground')} />
                    <div className="flex-1 min-w-0">
                      <span className={cn('paragraph-sm block', item.completed && 'line-through text-muted-foreground')}>
                        {item.description}
                      </span>
                      {item.due_date && (
                        <span className="label-xs text-muted-foreground block mt-0.5">
                          Vence: {new Date(item.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    {item.completed && (
                      <Badge variant="success" size="xs">Hecho</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeOneToOnePage() {
  const [meetings, setMeetings] = useState<OneToOneMeeting[]>(MOCK_ONE_TO_ONE)
  const [selectedMeeting, setSelectedMeeting] = useState<OneToOneMeeting | null>(null)

  const myMeetings = meetings.filter((m) => m.employee_id === CURRENT_EMPLOYEE_ID)
  const nextMeeting = myMeetings
    .filter((m) => m.status === 'scheduled' && new Date(m.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]
  const history = myMeetings.filter(
    (m) => m.status === 'completed' || m.status === 'cancelled' || m.status === 'no_show',
  )
  const myPendingActions = myMeetings.flatMap((m) =>
    m.action_items.filter((a) => a.owner === 'employee' && !a.completed).map((a) => ({ ...a, meetingId: m.id, employeeName: m.employee_name }))
  )

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

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="title-lg font-semibold text-foreground">Mis 1-to-1</h1>
        <p className="paragraph-sm text-muted-foreground mt-0.5">
          Reuniones individuales con tu manager
        </p>
      </div>

      {/* Next meeting highlight */}
      {nextMeeting ? (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="warning" size="sm">Próxima reunión</Badge>
                  <span className="label-sm font-semibold text-blue-700">
                    {formatCountdown(nextMeeting.scheduled_at)}
                  </span>
                </div>
                <span className="label-md font-semibold text-foreground block">
                  1-to-1 con {nextMeeting.manager_name}
                </span>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarIcon className="size-3.5" />
                    <span className="paragraph-xs">{formatDate(nextMeeting.scheduled_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ClockIcon className="size-3.5" />
                    <span className="paragraph-xs">{nextMeeting.duration_minutes} min</span>
                  </div>
                </div>
                {nextMeeting.agenda && (
                  <div className="mt-3 p-3 bg-background rounded-lg border border-blue-100">
                    <span className="label-xs font-medium text-muted-foreground block mb-1">Agenda</span>
                    <p className="paragraph-xs text-foreground whitespace-pre-line line-clamp-3">
                      {nextMeeting.agenda}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMeeting(nextMeeting)}
                className="shrink-0"
              >
                Ver detalle
                <ArrowRightIcon className="size-3.5 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <CalendarIcon className="size-8 text-muted-foreground mx-auto mb-2" />
            <span className="label-sm font-medium text-foreground block">No hay próximas reuniones</span>
            <span className="paragraph-xs text-muted-foreground">Tu manager programará la próxima sesión.</span>
          </CardContent>
        </Card>
      )}

      {/* Pending actions */}
      {myPendingActions.length > 0 && (
        <div>
          <span className="label-md font-semibold text-foreground block mb-3">
            Mis acciones pendientes ({myPendingActions.length})
          </span>
          <div className="flex flex-col gap-2">
            {myPendingActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card"
              >
                <Checkbox
                  checked={action.completed}
                  onCheckedChange={() => handleToggleAction(action.meetingId, action.id)}
                  id={`action-${action.id}`}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`action-${action.id}`}
                    className="paragraph-sm cursor-pointer text-foreground"
                  >
                    {action.description}
                  </label>
                  {action.due_date && (
                    <span className="label-xs text-muted-foreground block mt-0.5">
                      Vence: {new Date(action.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <span className="label-md font-semibold text-foreground block mb-3">
          Historial ({history.length})
        </span>
        {history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <span className="paragraph-sm text-muted-foreground">Sin reuniones pasadas aún.</span>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((meeting) => (
              <Card
                key={meeting.id}
                className="cursor-pointer hover:border-ring transition-colors"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <UserIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="label-sm font-medium text-foreground block">
                          Con {meeting.manager_name}
                        </span>
                        <span className="paragraph-xs text-muted-foreground">
                          {formatDate(meeting.scheduled_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {meeting.meeting_notes && (
                        <NotePencilIcon className="size-4 text-muted-foreground" />
                      )}
                      <Badge variant={STATUS_VARIANTS[meeting.status]} size="sm">
                        {STATUS_LABELS[meeting.status]}
                      </Badge>
                    </div>
                  </div>
                  {meeting.meeting_notes && (
                    <p className="paragraph-xs text-muted-foreground mt-2 line-clamp-2">
                      {meeting.meeting_notes}
                    </p>
                  )}
                  {meeting.action_items.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                      <CheckSquareIcon className="size-3.5 text-muted-foreground" />
                      <span className="label-xs text-muted-foreground">
                        {meeting.action_items.filter((a) => a.completed).length}/{meeting.action_items.length} acciones completadas
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <MeetingDetailDialog
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onToggleAction={handleToggleAction}
      />
    </div>
  )
}
