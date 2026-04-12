'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import { Switch } from '@clasing/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  PlusIcon,
  PencilIcon,
  CalendarIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { MOCK_SCHEDULES } from '@/lib/mock/time'
import type { WorkSchedule, DaySchedule } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS: Array<{ key: keyof WorkSchedule; label: string; short: string }> = [
  { key: 'monday', label: 'Lunes', short: 'L' },
  { key: 'tuesday', label: 'Martes', short: 'M' },
  { key: 'wednesday', label: 'Miércoles', short: 'X' },
  { key: 'thursday', label: 'Jueves', short: 'J' },
  { key: 'friday', label: 'Viernes', short: 'V' },
  { key: 'saturday', label: 'Sábado', short: 'S' },
  { key: 'sunday', label: 'Domingo', short: 'D' },
]

const SCHEDULE_TYPE_LABELS: Record<WorkSchedule['type'], string> = {
  fixed: 'Fijo',
  flexible: 'Flexible',
  shift: 'Turnos',
}

const SCHEDULE_TYPE_VARIANTS: Record<WorkSchedule['type'], 'primary' | 'info' | 'secondary'> = {
  fixed: 'primary',
  flexible: 'info',
  shift: 'secondary',
}

// ─── Form schema ──────────────────────────────────────────────────────────────

const dayScheduleSchema = z.object({
  is_workday: z.boolean(),
  start: z.string(),
  end: z.string(),
  break_start: z.string().optional(),
  break_end: z.string().optional(),
})

const scheduleSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.enum(['fixed', 'flexible', 'shift']),
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
})

type ScheduleForm = z.infer<typeof scheduleSchema>

const DEFAULT_DAY_WORKDAY: DaySchedule = {
  start: '09:00',
  end: '18:00',
  break_start: '14:00',
  break_end: '15:00',
  is_workday: true,
}
const DEFAULT_DAY_OFFDAY: DaySchedule = { start: '00:00', end: '00:00', is_workday: false }

function scheduleToForm(schedule?: WorkSchedule): ScheduleForm {
  if (!schedule) {
    return {
      name: '',
      type: 'fixed',
      monday: DEFAULT_DAY_WORKDAY,
      tuesday: DEFAULT_DAY_WORKDAY,
      wednesday: DEFAULT_DAY_WORKDAY,
      thursday: DEFAULT_DAY_WORKDAY,
      friday: DEFAULT_DAY_WORKDAY,
      saturday: DEFAULT_DAY_OFFDAY,
      sunday: DEFAULT_DAY_OFFDAY,
    }
  }
  return {
    name: schedule.name,
    type: schedule.type,
    monday: schedule.monday ?? DEFAULT_DAY_OFFDAY,
    tuesday: schedule.tuesday ?? DEFAULT_DAY_OFFDAY,
    wednesday: schedule.wednesday ?? DEFAULT_DAY_OFFDAY,
    thursday: schedule.thursday ?? DEFAULT_DAY_OFFDAY,
    friday: schedule.friday ?? DEFAULT_DAY_OFFDAY,
    saturday: schedule.saturday ?? DEFAULT_DAY_OFFDAY,
    sunday: schedule.sunday ?? DEFAULT_DAY_OFFDAY,
  }
}

// ─── Day row in dialog ────────────────────────────────────────────────────────

function DayRow({
  dayKey,
  label,
  control,
  watch,
}: {
  dayKey: keyof WorkSchedule
  label: string
  control: ReturnType<typeof useForm<ScheduleForm>>['control']
  watch: ReturnType<typeof useForm<ScheduleForm>>['watch']
}) {
  const isWorkday = watch(`${dayKey as 'monday'}.is_workday`)

  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <div className="w-24 shrink-0 flex items-center gap-2 pt-1.5">
        <Controller
          name={`${dayKey as 'monday'}.is_workday`}
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              switchSize="sm"
            />
          )}
        />
        <span className={cn('label-sm font-medium', isWorkday ? 'text-foreground' : 'text-muted-foreground')}>
          {label}
        </span>
      </div>

      {isWorkday ? (
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="paragraph-xs text-muted-foreground w-10">Inicio</span>
            <Controller
              name={`${dayKey as 'monday'}.start`}
              control={control}
              render={({ field }) => (
                <Input {...field} type="time" size="sm" className="w-28" />
              )}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="paragraph-xs text-muted-foreground w-10">Fin</span>
            <Controller
              name={`${dayKey as 'monday'}.end`}
              control={control}
              render={({ field }) => (
                <Input {...field} type="time" size="sm" className="w-28" />
              )}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="paragraph-xs text-muted-foreground w-10">Pausa</span>
            <Controller
              name={`${dayKey as 'monday'}.break_start`}
              control={control}
              render={({ field }) => (
                <Input {...(field as object)} type="time" size="sm" className="w-28" value={field.value ?? ''} />
              )}
            />
            <span className="paragraph-xs text-muted-foreground">–</span>
            <Controller
              name={`${dayKey as 'monday'}.break_end`}
              control={control}
              render={({ field }) => (
                <Input {...(field as object)} type="time" size="sm" className="w-28" value={field.value ?? ''} />
              )}
            />
          </div>
        </div>
      ) : (
        <span className="paragraph-xs text-muted-foreground pt-1.5">Día no laborable</span>
      )}
    </div>
  )
}

// ─── Schedule Dialog ──────────────────────────────────────────────────────────

function ScheduleDialog({
  open,
  onClose,
  editing,
  onSave,
}: {
  open: boolean
  onClose: () => void
  editing: WorkSchedule | null
  onSave: (data: WorkSchedule) => void
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: scheduleToForm(editing ?? undefined),
  })

  // Reset when editing changes
  useState(() => {
    reset(scheduleToForm(editing ?? undefined))
  })

  function onSubmit(data: ScheduleForm) {
    const workdays = DAYS.filter((d) => {
      const day = data[d.key as keyof typeof data] as DaySchedule
      return day?.is_workday
    })
    const totalHours = workdays.reduce((acc, d) => {
      const day = data[d.key as keyof typeof data] as DaySchedule
      const start = day.start.split(':').map(Number)
      const end = day.end.split(':').map(Number)
      const breakMins = day.break_start && day.break_end
        ? (parseInt(day.break_end.split(':')[0]) * 60 + parseInt(day.break_end.split(':')[1])) -
          (parseInt(day.break_start.split(':')[0]) * 60 + parseInt(day.break_start.split(':')[1]))
        : 0
      const dayMins = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]) - breakMins
      return acc + dayMins / 60
    }, 0)

    onSave({
      id: editing?.id ?? `sched-${Date.now()}`,
      name: data.name,
      type: data.type,
      monday: data.monday,
      tuesday: data.tuesday,
      wednesday: data.wednesday,
      thursday: data.thursday,
      friday: data.friday,
      saturday: data.saturday,
      sunday: data.sunday,
      total_weekly_hours: Math.round(totalHours * 10) / 10,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose() }}>
      <DialogContent showCloseButton className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Editar horario' : 'Nuevo horario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input {...register('name')} placeholder="Ej: Jornada de mañana" size="md" />
              {errors.name && (
                <p className="paragraph-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Tipo</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger size="md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fijo</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="shift">Turnos</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <p className="label-sm font-medium text-foreground mb-2">Días y horarios</p>
            <div className="rounded-lg border border-border overflow-hidden">
              {DAYS.map((d) => (
                <DayRow
                  key={d.key}
                  dayKey={d.key}
                  label={d.label}
                  control={control}
                  watch={watch}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Guardar cambios' : 'Crear horario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Schedule Card ────────────────────────────────────────────────────────────

function ScheduleCard({
  schedule,
  onEdit,
}: {
  schedule: WorkSchedule
  onEdit: (s: WorkSchedule) => void
}) {
  const workdays = DAYS.filter((d) => {
    const day = schedule[d.key as keyof WorkSchedule] as DaySchedule | undefined
    return day?.is_workday
  })

  const firstDay = workdays[0]
    ? (schedule[workdays[0].key as keyof WorkSchedule] as DaySchedule)
    : null

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="label-md font-semibold text-foreground">{schedule.name}</p>
            <Badge
              variant={SCHEDULE_TYPE_VARIANTS[schedule.type]}
              size="xs"
              className="mt-1"
            >
              {SCHEDULE_TYPE_LABELS[schedule.type]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="xs"
            iconOnly
            onClick={() => onEdit(schedule)}
            tooltip="Editar horario"
          >
            <PencilIcon className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day chips */}
        <div className="flex gap-1 flex-wrap mb-3">
          {DAYS.map((d) => {
            const day = schedule[d.key as keyof WorkSchedule] as DaySchedule | undefined
            const isWork = day?.is_workday
            return (
              <span
                key={d.key}
                className={cn(
                  'size-7 rounded-full flex items-center justify-center label-xs font-semibold',
                  isWork
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {d.short}
              </span>
            )
          })}
        </div>

        {/* Hours */}
        {firstDay && (
          <p className="paragraph-xs text-muted-foreground">
            {firstDay.start} – {firstDay.end}
            {firstDay.break_start && ` · Pausa ${firstDay.break_start}–${firstDay.break_end}`}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="paragraph-xs text-muted-foreground">
            {workdays.length} días · {schedule.total_weekly_hours}h/semana
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulesConfigPage() {
  const [schedules, setSchedules] = useState<WorkSchedule[]>(MOCK_SCHEDULES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<WorkSchedule | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(s: WorkSchedule) {
    setEditing(s)
    setDialogOpen(true)
  }

  function handleSave(data: WorkSchedule) {
    setSchedules((prev) => {
      const idx = prev.findIndex((s) => s.id === data.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = data
        return next
      }
      return [...prev, data]
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Configuración de Horarios</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestiona los horarios laborales de la empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)}>
            <UsersIcon className="size-4" />
            Asignar horario
          </Button>
          <Button variant="primary" size="sm" onClick={openCreate}>
            <PlusIcon className="size-4" />
            Nuevo horario
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="label-sm font-medium text-foreground">{schedules.length}</span>
          <span className="paragraph-xs text-muted-foreground">horarios configurados</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schedules.map((s) => (
          <ScheduleCard key={s.id} schedule={s} onEdit={openEdit} />
        ))}
      </div>

      {/* Create/Edit dialog */}
      <ScheduleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        onSave={handleSave}
      />

      {/* Assign dialog (simplified) */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Asignar horario a empleados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Horario</label>
              <Select>
                <SelectTrigger size="md">
                  <SelectValue placeholder="Selecciona un horario" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Departamento</label>
              <Select>
                <SelectTrigger size="md">
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  <SelectItem value="dept-1">Tecnología</SelectItem>
                  <SelectItem value="dept-2">Recursos Humanos</SelectItem>
                  <SelectItem value="dept-3">Marketing</SelectItem>
                  <SelectItem value="dept-4">Ventas</SelectItem>
                  <SelectItem value="dept-5">Finanzas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={() => setAssignDialogOpen(false)}>
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
