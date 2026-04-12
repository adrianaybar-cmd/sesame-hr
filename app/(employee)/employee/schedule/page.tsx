'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Progress } from '@clasing/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@clasing/ui/collapsible'
import {
  CalendarIcon,
  ClockIcon,
  SunIcon,
  CaretDownIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_SCHEDULES } from '@/lib/mock/time'
import { MOCK_CLOCK_INS } from '@/lib/mock/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-1'
const CURRENT_SCHEDULE_ID = 'sched-3' // Jornada Partida

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DAY_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// Spanish public holidays for 2026
const HOLIDAYS_2026: Record<string, string> = {
  '2026-01-01': 'Año Nuevo',
  '2026-01-06': 'Reyes Magos',
  '2026-04-02': 'Jueves Santo',
  '2026-04-03': 'Viernes Santo',
  '2026-05-01': 'Día del Trabajo',
  '2026-10-12': 'Fiesta Nacional',
  '2026-11-01': 'Todos los Santos',
  '2026-12-06': 'Día de la Constitución',
  '2026-12-08': 'Inmaculada Concepción',
  '2026-12-25': 'Navidad',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMinutes(mins: number): string {
  if (mins <= 0) return '0h'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${h}h`
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function getDayMinutes(start: string, end: string, breakStart?: string, breakEnd?: string): number {
  const total = timeToMinutes(end) - timeToMinutes(start)
  if (!breakStart || !breakEnd) return total
  const breakMins = timeToMinutes(breakEnd) - timeToMinutes(breakStart)
  return total - breakMins
}

function getMondayOfWeek(dateStr: string): Date {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// ─── Week card ────────────────────────────────────────────────────────────────

interface WeekData {
  weekLabel: string
  dates: string[]
  isCurrentWeek: boolean
}

function getWeekData(mondayDate: Date, label: string, isCurrent: boolean): WeekData {
  const dates = DAY_KEYS.map((_, i) => toDateStr(addDays(mondayDate, i)))
  return { weekLabel: label, dates, isCurrentWeek: isCurrent }
}

function WeekCard({
  week,
  schedule,
  workedMinutesByDate,
  collapsed = false,
}: {
  week: WeekData
  schedule: typeof MOCK_SCHEDULES[0]
  workedMinutesByDate: Record<string, number>
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(!collapsed)

  const totalExpected = DAY_KEYS.reduce((acc, key, i) => {
    const day = schedule[key]
    if (!day?.is_workday) return acc
    return acc + getDayMinutes(day.start, day.end, day.break_start, day.break_end)
  }, 0)

  const totalWorked = week.dates.reduce((acc, date) => acc + (workedMinutesByDate[date] ?? 0), 0)

  const content = (
    <div className="space-y-2">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <span className="label-sm font-medium text-foreground">
            {formatMinutes(totalWorked)}
          </span>
          <span className="paragraph-xs text-muted-foreground">
            / {formatMinutes(totalExpected)} esperadas
          </span>
        </div>
        {totalExpected > 0 && (
          <span className="label-xs text-muted-foreground">
            {Math.round((totalWorked / totalExpected) * 100)}%
          </span>
        )}
      </div>
      <Progress
        value={totalExpected > 0 ? Math.min((totalWorked / totalExpected) * 100, 100) : 0}
        className="h-1.5 mb-3"
      />

      {/* Day rows */}
      <div className="space-y-0">
        {DAY_KEYS.map((key, i) => {
          const day = schedule[key]
          const date = week.dates[i]
          const isHoliday = !!HOLIDAYS_2026[date]
          const holidayName = HOLIDAYS_2026[date]
          const workedMins = workedMinutesByDate[date] ?? 0
          const isWeekend = !day?.is_workday
          const todayStr = '2026-04-12'
          const isFuture = date > todayStr
          const isToday = date === todayStr

          const expectedMins = day?.is_workday
            ? getDayMinutes(day.start, day.end, day.break_start, day.break_end)
            : 0

          return (
            <div
              key={key}
              className={cn(
                'flex items-center gap-3 py-2.5 border-b border-border last:border-0',
                isWeekend && 'opacity-50'
              )}
            >
              {/* Day */}
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center shrink-0 label-xs font-semibold',
                  isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {DAY_SHORT[i]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn('label-sm font-medium', isToday ? 'text-primary' : 'text-foreground')}>
                    {DAY_LABELS[i]}
                  </p>
                  {isHoliday && (
                    <Badge variant="neutral" size="xs">
                      <SunIcon className="size-2.5 mr-0.5" />
                      {holidayName}
                    </Badge>
                  )}
                </div>
                {day?.is_workday && !isHoliday && (
                  <p className="paragraph-xs text-muted-foreground">
                    {day.start} – {day.end}
                    {day.break_start && ` · Pausa ${day.break_start}–${day.break_end}`}
                  </p>
                )}
                {!day?.is_workday && (
                  <p className="paragraph-xs text-muted-foreground">Día libre</p>
                )}
              </div>

              {/* Worked */}
              {day?.is_workday && !isHoliday && (
                <div className="text-right shrink-0">
                  {isFuture && !isToday ? (
                    <span className="label-sm text-muted-foreground">{formatMinutes(expectedMins)}</span>
                  ) : workedMins > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="label-sm font-semibold text-foreground tabular-nums">
                        {formatMinutes(workedMins)}
                      </span>
                      {workedMins >= expectedMins * 0.9 && (
                        <CheckCircleIcon className="size-3.5 text-success-foreground" />
                      )}
                    </div>
                  ) : (
                    <Badge variant="warning" size="xs">Pendiente</Badge>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  if (!collapsed) {
    return content
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between py-2 hover:bg-muted/20 transition-colors rounded-lg px-2 -mx-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className="label-sm font-medium text-foreground">{week.weekLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="paragraph-xs text-muted-foreground">
              {formatMinutes(totalWorked)} / {formatMinutes(totalExpected)}
            </span>
            <CaretDownIcon
              className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
            />
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2">{content}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeSchedulePage() {
  const schedule = MOCK_SCHEDULES.find((s) => s.id === CURRENT_SCHEDULE_ID) ?? MOCK_SCHEDULES[0]

  const todayStr = '2026-04-12'
  const currentMonday = getMondayOfWeek(todayStr)

  const workedMinutesByDate: Record<string, number> = {}
  MOCK_CLOCK_INS.filter((ci) => ci.employee_id === CURRENT_EMPLOYEE_ID).forEach((ci) => {
    workedMinutesByDate[ci.date] = ci.total_minutes
  })

  const currentWeek = getWeekData(currentMonday, 'Semana actual', true)
  const nextWeek = getWeekData(addDays(currentMonday, 7), 'Próxima semana', false)
  const week3 = getWeekData(addDays(currentMonday, 14), '19 – 25 abr', false)
  const week4 = getWeekData(addDays(currentMonday, 21), '26 abr – 2 may', false)

  // Month holidays
  const aprilHolidays = Object.entries(HOLIDAYS_2026)
    .filter(([date]) => date.startsWith('2026-04'))

  // Total weekly hours for progress
  const totalExpectedMins = DAY_KEYS.reduce((acc, key) => {
    const day = schedule[key]
    if (!day?.is_workday) return acc
    return acc + getDayMinutes(day.start, day.end, day.break_start, day.break_end)
  }, 0)

  const totalWorkedThisWeek = currentWeek.dates.reduce(
    (acc, date) => acc + (workedMinutesByDate[date] ?? 0),
    0
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mis Horarios</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Tu jornada laboral semanal y calendario
        </p>
      </div>

      {/* Current schedule info + progress */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 shrink-0">
                <CalendarIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="paragraph-xs text-muted-foreground">Horario asignado</p>
                <p className="label-md font-semibold text-foreground mt-0.5">{schedule.name}</p>
                <p className="paragraph-xs text-muted-foreground mt-0.5">
                  {schedule.total_weekly_hours}h/semana · {schedule.type === 'fixed' ? 'Fijo' : schedule.type === 'flexible' ? 'Flexible' : 'Turnos'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-success/20 p-2.5 shrink-0">
                <ClockIcon className="size-5 text-success-foreground" />
              </div>
              <div className="flex-1">
                <p className="paragraph-xs text-muted-foreground">Esta semana</p>
                <p className="label-md font-semibold text-foreground mt-0.5">
                  {formatMinutes(totalWorkedThisWeek)} / {formatMinutes(totalExpectedMins)}
                </p>
                <Progress
                  value={totalExpectedMins > 0 ? Math.min((totalWorkedThisWeek / totalExpectedMins) * 100, 100) : 0}
                  className="h-1.5 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current week */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            Semana del {new Date(currentWeek.dates[0]).getDate()} al {new Date(currentWeek.dates[4]).getDate()} de abril
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <WeekCard
            week={currentWeek}
            schedule={schedule}
            workedMinutesByDate={workedMinutesByDate}
            collapsed={false}
          />
        </CardContent>
      </Card>

      {/* Upcoming weeks */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground">
            Próximas semanas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-2">
          {[nextWeek, week3, week4].map((week) => (
            <WeekCard
              key={week.weekLabel}
              week={week}
              schedule={schedule}
              workedMinutesByDate={workedMinutesByDate}
              collapsed={true}
            />
          ))}
        </CardContent>
      </Card>

      {/* Month holidays */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <SunIcon className="size-4 text-warning-foreground" />
            Festivos de abril
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          {aprilHolidays.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground">No hay festivos este mes.</p>
          ) : (
            <div className="space-y-0">
              {aprilHolidays.map(([date, name]) => {
                const d = new Date(date)
                const dayStr = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]
                return (
                  <div key={date} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                    <div className="size-9 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                      <span className="label-xs font-semibold text-warning-foreground">
                        {d.getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="label-sm font-medium text-foreground">{name}</p>
                      <p className="paragraph-xs text-muted-foreground">{dayStr}, {d.getDate()} de abril</p>
                    </div>
                    <Badge variant="warning" size="xs" className="ml-auto">Festivo</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
