'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import { Textarea } from '@clasing/ui/textarea'
import {
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CoffeeIcon,
} from '@phosphor-icons/react'
import { MOCK_CLOCK_INS } from '@/lib/mock/time'
import type { ClockIn, ClockEntry } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-1'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DAY_NAMES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function formatMinutes(mins: number): string {
  if (mins <= 0) return '-'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function isoToHHMM(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

type DayStatus = 'ok' | 'incidence' | 'vacation' | 'holiday' | 'future' | 'weekend' | 'empty'

function getDayStatus(clockIn: ClockIn | undefined, isWeekend: boolean, isFuture: boolean, isToday: boolean): DayStatus {
  if (isFuture && !isToday) return 'future'
  if (isWeekend) return 'weekend'
  if (!clockIn) return isToday ? 'future' : 'empty'
  if (clockIn.incidence) return 'incidence'
  if (clockIn.total_minutes >= clockIn.expected_minutes * 0.9) return 'ok'
  return 'incidence'
}

const DAY_STATUS_CONFIG: Record<DayStatus, { variant: 'success' | 'error' | 'info' | 'neutral' | 'not-started' | 'warning'; label: string }> = {
  ok: { variant: 'success', label: 'OK' },
  incidence: { variant: 'error', label: 'Incidencia' },
  vacation: { variant: 'info', label: 'Vacaciones' },
  holiday: { variant: 'neutral', label: 'Festivo' },
  future: { variant: 'not-started', label: 'Sin fichar' },
  weekend: { variant: 'neutral', label: 'Fin de semana' },
  empty: { variant: 'warning', label: 'Sin fichar' },
}

// ─── Entry icon ───────────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: ClockEntry }) {
  const icon = {
    in: <ArrowDownIcon className="size-3 text-success-foreground" />,
    out: <ArrowUpIcon className="size-3 text-destructive" />,
    break_start: <CoffeeIcon className="size-3 text-warning-foreground" />,
    break_end: <CoffeeIcon className="size-3 text-muted-foreground" />,
  }[entry.type]

  const label = {
    in: 'Entrada',
    out: 'Salida',
    break_start: 'Inicio descanso',
    break_end: 'Fin descanso',
  }[entry.type]

  const bg = {
    in: 'bg-success',
    out: 'bg-destructive/10',
    break_start: 'bg-warning',
    break_end: 'bg-muted',
  }[entry.type]

  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
      <div className={cn('rounded-full p-1.5', bg)}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="label-sm font-medium text-foreground">{label}</p>
        {entry.device && (
          <p className="paragraph-xs text-muted-foreground capitalize">{entry.device}</p>
        )}
      </div>
      <span className="label-md font-semibold text-foreground tabular-nums">
        {isoToHHMM(entry.timestamp)}
      </span>
    </div>
  )
}

// ─── Request form schema ──────────────────────────────────────────────────────

const requestSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  entry_time: z.string().min(1, 'La hora de entrada es obligatoria'),
  exit_time: z.string().min(1, 'La hora de salida es obligatoria'),
  reason: z.string().min(5, 'El motivo debe tener al menos 5 caracteres'),
})
type RequestForm = z.infer<typeof requestSchema>

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeSigningsPage() {
  const today = new Date()
  const todayStr = '2026-04-12' // Fixed for demo

  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(3) // April
  const [selectedDay, setSelectedDay] = useState<number | null>(12)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submittedRequests, setSubmittedRequests] = useState<RequestForm[]>([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      date: todayStr,
      entry_time: '09:00',
      exit_time: '18:00',
    },
  })

  // Employee clock-ins for this month
  const myClockIns = MOCK_CLOCK_INS.filter(
    (ci) =>
      ci.employee_id === CURRENT_EMPLOYEE_ID &&
      ci.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
  )

  const clockInByDay = Object.fromEntries(myClockIns.map((ci) => {
    const day = parseInt(ci.date.split('-')[2])
    return [day, ci]
  }))

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = getFirstDayOfWeek(year, month)
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const selectedClockIn = selectedDay ? clockInByDay[selectedDay] : undefined
  const selectedDate = selectedDay ? toDateStr(year, month, selectedDay) : null

  // Stats
  const workedMinutes = myClockIns.reduce((acc, ci) => acc + ci.total_minutes, 0)
  const expectedMinutes = myClockIns.reduce((acc, ci) => acc + ci.expected_minutes, 0)
  const incidenceDays = myClockIns.filter((ci) => ci.incidence).length

  function onSubmitRequest(data: RequestForm) {
    setSubmittedRequests((prev) => [...prev, data])
    reset()
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Mis Fichajes</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Historial mensual de tu jornada laboral
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <PlusIcon className="size-4" />
          Solicitar fichaje
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success p-2.5">
                <ClockIcon className="size-5 text-success-foreground" />
              </div>
              <div>
                <p className="paragraph-xs text-muted-foreground">Horas trabajadas</p>
                <p className="label-lg font-semibold text-foreground">{formatMinutes(workedMinutes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-info p-2.5">
                <ClockIcon className="size-5 text-info-foreground" />
              </div>
              <div>
                <p className="paragraph-xs text-muted-foreground">Horas esperadas</p>
                <p className="label-lg font-semibold text-foreground">{formatMinutes(expectedMinutes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning p-2.5">
                <ClockIcon className="size-5 text-warning-foreground" />
              </div>
              <div>
                <p className="paragraph-xs text-muted-foreground">Incidencias</p>
                <p className="label-lg font-semibold text-foreground">{incidenceDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar + Detail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="xs" iconOnly onClick={prev}>
                  <ArrowLeftIcon className="size-4" />
                </Button>
                <CardTitle className="label-lg font-semibold text-foreground flex-1 text-center">
                  {MONTH_NAMES[month]} {year}
                </CardTitle>
                <Button variant="ghost" size="xs" iconOnly onClick={next}>
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="py-1 text-center label-xs font-semibold text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalCells }, (_, i) => {
                  const day = i - firstDayOfWeek + 1
                  const isValid = day >= 1 && day <= daysInMonth
                  if (!isValid) return <div key={i} className="h-16" />

                  const dateStr = toDateStr(year, month, day)
                  const ci = clockInByDay[day]
                  const dayOfWeek = (firstDayOfWeek + day - 1) % 7
                  const isWeekend = dayOfWeek >= 5
                  const isFuture = dateStr > todayStr
                  const isToday = dateStr === todayStr
                  const isSelected = selectedDay === day

                  const status = getDayStatus(ci, isWeekend, isFuture, isToday)
                  const { variant } = DAY_STATUS_CONFIG[status]

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      disabled={isWeekend || (isFuture && !isToday)}
                      className={cn(
                        'h-16 rounded-lg p-1.5 flex flex-col items-center gap-1 transition-colors border',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-border hover:bg-muted/40',
                        (isWeekend || (isFuture && !isToday)) && 'opacity-40 cursor-default'
                      )}
                    >
                      <span
                        className={cn(
                          'size-6 rounded-full flex items-center justify-center label-xs font-medium',
                          isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                        )}
                      >
                        {day}
                      </span>
                      {!isWeekend && !isFuture && (
                        <span className="paragraph-xs text-muted-foreground">
                          {ci ? formatMinutes(ci.total_minutes) : '-'}
                        </span>
                      )}
                      {!isWeekend && !isFuture && (
                        <Badge variant={variant} size="xs" className="text-[10px] px-1 py-0">
                          {DAY_STATUS_CONFIG[status].label}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail panel */}
        <div>
          <Card className="border-border sticky top-20">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="label-lg font-semibold text-foreground">
                {selectedDay
                  ? `${selectedDay} de ${MONTH_NAMES[month]}`
                  : 'Selecciona un día'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {!selectedDay && (
                <p className="paragraph-sm text-muted-foreground">
                  Haz clic en un día del calendario para ver el detalle de fichajes.
                </p>
              )}

              {selectedDay && !selectedClockIn && (
                <div className="text-center py-6">
                  <ClockIcon className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="paragraph-sm text-muted-foreground">
                    Sin registros para este día
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setDialogOpen(true)}
                  >
                    Solicitar fichaje
                  </Button>
                </div>
              )}

              {selectedClockIn && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Badge
                      variant={selectedClockIn.incidence ? 'error' : 'success'}
                      size="sm"
                    >
                      {selectedClockIn.incidence ? 'Incidencia' : 'Correcto'}
                    </Badge>
                    <span className="label-md font-semibold text-foreground tabular-nums">
                      {formatMinutes(selectedClockIn.total_minutes)}
                    </span>
                  </div>

                  {selectedClockIn.incidence && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="paragraph-xs text-warning-foreground">
                        {selectedClockIn.incidence}
                      </p>
                    </div>
                  )}

                  <div>
                    {selectedClockIn.entries.map((entry) => (
                      <EntryRow key={entry.id} entry={entry} />
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="paragraph-xs text-muted-foreground">
                      Esperado: {formatMinutes(selectedClockIn.expected_minutes)}
                    </span>
                    <Button variant="ghost" size="xs" onClick={() => setDialogOpen(true)}>
                      Solicitar corrección
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v: boolean) => { if (!v) { reset(); setDialogOpen(false) } }}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Solicitar fichaje</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">
                Fecha <span className="text-destructive">*</span>
              </label>
              <Input {...register('date')} type="date" size="md" />
              {errors.date && <p className="paragraph-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm font-medium text-foreground block mb-1.5">
                  Hora entrada <span className="text-destructive">*</span>
                </label>
                <Input {...register('entry_time')} type="time" size="md" />
                {errors.entry_time && <p className="paragraph-xs text-destructive mt-1">{errors.entry_time.message}</p>}
              </div>
              <div>
                <label className="label-sm font-medium text-foreground block mb-1.5">
                  Hora salida <span className="text-destructive">*</span>
                </label>
                <Input {...register('exit_time')} type="time" size="md" />
                {errors.exit_time && <p className="paragraph-xs text-destructive mt-1">{errors.exit_time.message}</p>}
              </div>
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">
                Motivo <span className="text-destructive">*</span>
              </label>
              <Textarea
                {...register('reason')}
                placeholder="Explica el motivo de la solicitud..."
                resize="none"
                rows={3}
              />
              {errors.reason && <p className="paragraph-xs text-destructive mt-1">{errors.reason.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setDialogOpen(false) }}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Enviar solicitud
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
