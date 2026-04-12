'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import {
  ClockIcon,
  TrendUpIcon,
  CalendarCheckIcon,
  UmbrellaIcon,
} from '@phosphor-icons/react'
import { MOCK_PERSONAL_STATS } from '@/lib/mock/time'
import type { PersonalStats, DailyStats } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-1'

type Period = 'week' | 'month' | 'year'

const DAY_STATUS_COLORS: Record<DailyStats['status'], string> = {
  complete: 'bg-success',
  incomplete: 'bg-warning',
  absent: 'bg-destructive',
  holiday: 'bg-primary',
  weekend: 'bg-muted',
}

const DAY_STATUS_TOOLTIP: Record<DailyStats['status'], string> = {
  complete: 'Completo',
  incomplete: 'Incompleto',
  absent: 'Ausente',
  holiday: 'Festivo',
  weekend: 'Fin de semana',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10
}

function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

// ─── Progress Ring (SVG) ──────────────────────────────────────────────────────

function ProgressRing({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
}: {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label: string
  sublabel: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const dash = circumference * pct
  const gap = circumference - dash

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-primary transition-all duration-500"
            strokeDasharray={`${dash} ${gap}`}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="label-md font-semibold text-foreground">{label}</span>
          <span className="paragraph-xs text-muted-foreground">{sublabel}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ days }: { days: DailyStats[] }) {
  const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  // Figure out padding for first day
  const firstDayOfWeek = new Date('2026-03-01').getDay()
  // JS getDay: 0=Sun, so convert to Mon-based
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  const paddingCells = Array.from({ length: offset })

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center">
            <span className="label-xs font-medium text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {paddingCells.map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const dayNum = new Date(day.date).getUTCDate()
          return (
            <div
              key={day.date}
              title={`${day.date}: ${DAY_STATUS_TOOLTIP[day.status]}`}
              className={cn(
                'aspect-square rounded-sm flex items-center justify-center',
                DAY_STATUS_COLORS[day.status],
                day.status === 'weekend' ? 'opacity-30' : 'opacity-80 hover:opacity-100 cursor-default'
              )}
            >
              <span
                className={cn(
                  'paragraph-xs font-medium tabular-nums',
                  day.status === 'weekend' ? 'text-muted-foreground' : 'text-white'
                )}
              >
                {dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {(
          [
            { status: 'complete', label: 'Completo' },
            { status: 'incomplete', label: 'Incompleto' },
            { status: 'absent', label: 'Ausente' },
            { status: 'holiday', label: 'Festivo' },
          ] as const
        ).map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1">
            <span className={cn('size-2.5 rounded-sm inline-block opacity-80', DAY_STATUS_COLORS[status])} />
            <span className="paragraph-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeStatisticsPage() {
  const [period, setPeriod] = useState<Period>('month')

  const stats: PersonalStats | undefined = useMemo(
    () => MOCK_PERSONAL_STATS.find((s) => s.employee_id === CURRENT_EMPLOYEE_ID),
    []
  )

  if (!stats) return null

  // Simulate different values per period tab
  const periodStats: Record<Period, { worked: number; expected: number; overtime: number; punctuality: number }> = {
    week: {
      worked: 38,
      expected: 37.5,
      overtime: 0.5,
      punctuality: 100,
    },
    month: {
      worked: stats.worked_hours,
      expected: stats.expected_hours,
      overtime: stats.overtime_hours,
      punctuality: stats.punctuality_rate,
    },
    year: {
      worked: 412,
      expected: 400,
      overtime: 12,
      punctuality: 93,
    },
  }

  const current = periodStats[period]

  const metrics = [
    {
      label: 'Horas trabajadas',
      value: formatHours(current.worked),
      sub: `de ${formatHours(current.expected)} esperadas`,
      icon: ClockIcon,
      variant: (current.worked >= current.expected ? 'success' : 'warning') as 'success' | 'warning',
    },
    {
      label: 'Horas extra',
      value: formatHours(current.overtime),
      sub: 'acumuladas',
      icon: TrendUpIcon,
      variant: (current.overtime > 0 ? 'success' : 'neutral') as 'success' | 'neutral',
    },
    {
      label: '% Puntualidad',
      value: `${current.punctuality}%`,
      sub: 'días puntuales',
      icon: CalendarCheckIcon,
      variant: (
        current.punctuality >= 90 ? 'success' : current.punctuality >= 75 ? 'warning' : 'error'
      ) as 'success' | 'warning' | 'error',
    },
    {
      label: 'Vacaciones',
      value: `${stats.vacation_days_remaining}d`,
      sub: `${stats.vacation_days_used} usados`,
      icon: UmbrellaIcon,
      variant: 'info' as 'info',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mis estadísticas</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Resumen de tu actividad y tiempo trabajado
        </p>
      </div>

      {/* Period Tabs */}
      <div className="flex rounded-lg border border-border overflow-hidden w-fit">
        {(['week', 'month', 'year'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-4 py-2 label-sm font-medium transition-colors',
              period === p
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            {p === 'week' ? 'Esta semana' : p === 'month' ? 'Este mes' : 'Este año'}
          </button>
        ))}
      </div>

      {/* Progress Ring + Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Progress Ring */}
        <Card className="border-border">
          <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
            <ProgressRing
              value={current.worked}
              max={current.expected}
              size={140}
              strokeWidth={12}
              label={formatHours(current.worked)}
              sublabel="trabajadas"
            />
            <div className="text-center">
              <p className="label-sm font-medium text-foreground">
                {current.worked >= current.expected ? 'Objetivo cumplido' : 'En progreso'}
              </p>
              <p className="paragraph-xs text-muted-foreground mt-0.5">
                {formatHours(current.expected)} esperadas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(({ label, value, sub, icon: Icon, variant }) => (
            <Card key={label} className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-1 mb-2">
                  <p className="paragraph-xs text-muted-foreground leading-snug">{label}</p>
                  <Icon className="size-3.5 text-muted-foreground shrink-0" />
                </div>
                <p className="label-lg font-semibold text-foreground">{value}</p>
                <Badge variant={variant} size="xs" className="mt-1">
                  {sub}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mini Calendar */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground">
            Marzo 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <MiniCalendar days={stats.daily_breakdown} />
        </CardContent>
      </Card>
    </div>
  )
}
