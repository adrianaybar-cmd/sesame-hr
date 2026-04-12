'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  ClockIcon,
  TrendUpIcon,
  CalendarCheckIcon,
  XCircleIcon,
  ChartBarIcon,
} from '@phosphor-icons/react'
import { MOCK_PERSONAL_STATS } from '@/lib/mock/time'
import type { PersonalStats, DailyStats } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPLOYEES = [
  { id: 'emp-1', name: 'Carlos Martínez', dept: 'Tecnología' },
  { id: 'emp-2', name: 'Laura Sánchez', dept: 'Recursos Humanos' },
  { id: 'emp-3', name: 'Miguel Fernández', dept: 'Marketing' },
  { id: 'emp-4', name: 'Ana González', dept: 'Ventas' },
  { id: 'emp-5', name: 'Javier Rodríguez', dept: 'Finanzas' },
]

const DAY_STATUS_COLORS: Record<DailyStats['status'], string> = {
  complete: 'bg-success',
  incomplete: 'bg-warning',
  absent: 'bg-destructive',
  holiday: 'bg-primary',
  weekend: 'bg-muted',
}

const DAY_STATUS_LABELS: Record<DailyStats['status'], string> = {
  complete: 'Completo',
  incomplete: 'Incompleto',
  absent: 'Ausente',
  holiday: 'Festivo',
  weekend: 'Fin de semana',
}

function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10
}

// Group days into weeks
function groupByWeeks(days: DailyStats[]): DailyStats[][] {
  const weeks: DailyStats[][] = []
  let week: DailyStats[] = []
  days.forEach((d, i) => {
    week.push(d)
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week)
      week = []
    }
  })
  return weeks
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ days }: { days: DailyStats[] }) {
  const MAX_HOURS = 10
  const workDays = days.filter((d) => d.status !== 'weekend')

  return (
    <div className="flex flex-col gap-2">
      {/* Y axis labels + bars */}
      <div className="flex gap-1 items-end h-40">
        {/* Y axis */}
        <div className="flex flex-col justify-between h-full text-right w-6 shrink-0 pb-4">
          {[10, 8, 6, 4, 2, 0].map((h) => (
            <span key={h} className="paragraph-xs text-muted-foreground tabular-nums">
              {h}
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-0.5 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full border-t border-border/40" />
            ))}
          </div>
          {workDays.map((day) => {
            const hours = minutesToHours(day.worked_minutes)
            const heightPct = Math.min((hours / MAX_HOURS) * 100, 100)
            const barColor =
              day.status === 'absent'
                ? 'bg-destructive/70'
                : day.status === 'holiday'
                ? 'bg-primary/50'
                : day.status === 'incomplete'
                ? 'bg-warning/80'
                : 'bg-primary'

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end pb-4 gap-0.5"
                title={`${day.date}: ${hours}h (${DAY_STATUS_LABELS[day.status]})`}
              >
                <div
                  className={cn('w-full rounded-t-sm min-h-[2px] transition-all', barColor)}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* X axis: day numbers */}
      <div className="flex gap-0.5 ml-7">
        {workDays.map((day) => (
          <div key={day.date} className="flex-1 text-center">
            <span className="paragraph-xs text-muted-foreground tabular-nums">
              {new Date(day.date).getUTCDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-1 ml-7">
        {(
          [
            { status: 'complete', label: 'Completo' },
            { status: 'incomplete', label: 'Incompleto' },
            { status: 'absent', label: 'Ausente' },
            { status: 'holiday', label: 'Festivo' },
          ] as const
        ).map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1">
            <span className={cn('size-2.5 rounded-sm inline-block', DAY_STATUS_COLORS[status])} />
            <span className="paragraph-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Weekly Table ─────────────────────────────────────────────────────────────

function WeeklyTable({ days }: { days: DailyStats[] }) {
  const weeks = groupByWeeks(days)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2 pr-4 label-xs font-semibold text-muted-foreground">Semana</th>
            <th className="pb-2 pr-4 label-xs font-semibold text-muted-foreground">Días trabajados</th>
            <th className="pb-2 pr-4 label-xs font-semibold text-muted-foreground">Horas trabajadas</th>
            <th className="pb-2 pr-4 label-xs font-semibold text-muted-foreground">Horas esperadas</th>
            <th className="pb-2 label-xs font-semibold text-muted-foreground">Balance</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => {
            const worked = week.reduce((s, d) => s + d.worked_minutes, 0)
            const expected = week.reduce((s, d) => s + d.expected_minutes, 0)
            const balance = worked - expected
            const workedDays = week.filter((d) => d.status === 'complete' || d.status === 'incomplete').length

            return (
              <tr key={wi} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-4 label-sm text-foreground">
                  Semana {wi + 1}
                  <span className="paragraph-xs text-muted-foreground ml-1">
                    ({week[0]?.date?.slice(5)} – {week[week.length - 1]?.date?.slice(5)})
                  </span>
                </td>
                <td className="py-2.5 pr-4 label-sm text-foreground tabular-nums">{workedDays}</td>
                <td className="py-2.5 pr-4 label-sm text-foreground tabular-nums">
                  {formatHours(minutesToHours(worked))}
                </td>
                <td className="py-2.5 pr-4 label-sm text-foreground tabular-nums">
                  {formatHours(minutesToHours(expected))}
                </td>
                <td className="py-2.5">
                  <span
                    className={cn(
                      'label-sm font-semibold tabular-nums',
                      balance >= 0 ? 'text-success-foreground' : 'text-destructive-foreground'
                    )}
                  >
                    {balance >= 0 ? '+' : ''}
                    {formatHours(minutesToHours(balance))}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminStatisticsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('emp-1')
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  const stats: PersonalStats | undefined = useMemo(
    () => MOCK_PERSONAL_STATS.find((s) => s.employee_id === selectedEmployee),
    [selectedEmployee]
  )

  const employee = EMPLOYEES.find((e) => e.id === selectedEmployee)

  if (!stats) return null

  const kpis: Array<{
    label: string
    value: string
    sub: string
    icon: React.ElementType
    variant: 'success' | 'warning' | 'neutral' | 'error'
  }> = [
    {
      label: 'Horas trabajadas',
      value: `${stats.worked_hours}h`,
      sub: `de ${stats.expected_hours}h esperadas`,
      icon: ClockIcon,
      variant: stats.worked_hours >= stats.expected_hours ? 'success' : 'warning',
    },
    {
      label: 'Horas extra',
      value: `${stats.overtime_hours}h`,
      sub: 'acumuladas',
      icon: TrendUpIcon,
      variant: stats.overtime_hours > 0 ? 'success' : 'neutral',
    },
    {
      label: '% Puntualidad',
      value: `${stats.punctuality_rate}%`,
      sub: 'días puntuales',
      icon: CalendarCheckIcon,
      variant: stats.punctuality_rate >= 90 ? 'success' : stats.punctuality_rate >= 75 ? 'warning' : 'error',
    },
    {
      label: 'Días ausencia',
      value: `${stats.absence_days}`,
      sub: 'días',
      icon: XCircleIcon,
      variant: stats.absence_days === 0 ? 'success' : stats.absence_days <= 2 ? 'warning' : 'error',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Estadísticas</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Análisis detallado de tiempo por empleado
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger size="sm" className="w-56">
            <SelectValue placeholder="Seleccionar empleado" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEES.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 label-sm font-medium transition-colors',
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>

        {employee && (
          <div className="ml-auto flex items-center gap-2">
            <div className="size-7 rounded-full bg-accent flex items-center justify-center">
              <span className="label-xs font-semibold text-foreground">
                {employee.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
              </span>
            </div>
            <div>
              <p className="label-sm font-medium text-foreground">{employee.name}</p>
              <p className="paragraph-xs text-muted-foreground">{employee.dept}</p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, variant }) => (
          <Card key={label} className="border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="paragraph-xs text-muted-foreground">{label}</p>
                <Icon className="size-4 text-muted-foreground shrink-0" />
              </div>
              <p className="title-2xs font-semibold text-foreground">{value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant={variant} size="xs">
                  {sub}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <ChartBarIcon className="size-4 text-muted-foreground" />
            Horas por día — Marzo 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <BarChart days={stats.daily_breakdown} />
        </CardContent>
      </Card>

      {/* Weekly summary */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground">
            Resumen semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <WeeklyTable days={stats.daily_breakdown} />
        </CardContent>
      </Card>
    </div>
  )
}
