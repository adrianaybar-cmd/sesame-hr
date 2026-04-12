'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@clasing/ui/card'
import {
  CalendarIcon,
  WarningCircleIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import { MOCK_CLOCK_INS } from '@/lib/mock/time'
import { MOCK_DEPARTMENTS } from '@/lib/mock/employees'
import type { ClockIn, ClockingStatus } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const GANTT_START_HOUR = 6  // 06:00
const GANTT_END_HOUR = 22   // 22:00
const GANTT_TOTAL_HOURS = GANTT_END_HOUR - GANTT_START_HOUR // 16h

const STATUS_LABELS: Record<ClockingStatus, string> = {
  working: 'Trabajando',
  break: 'Descanso',
  out: 'Salió',
  not_started: 'Sin fichar',
}

const STATUS_VARIANTS: Record<ClockingStatus, 'success' | 'warning' | 'neutral' | 'not-started'> = {
  working: 'success',
  break: 'warning',
  out: 'neutral',
  not_started: 'not-started',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function isoToHHMM(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

function minutesToWidth(startMinutes: number, endMinutes: number): { left: string; width: string } {
  const ganttStartMin = GANTT_START_HOUR * 60
  const ganttTotalMin = GANTT_TOTAL_HOURS * 60
  const left = ((startMinutes - ganttStartMin) / ganttTotalMin) * 100
  const width = ((endMinutes - startMinutes) / ganttTotalMin) * 100
  return {
    left: `${Math.max(0, left).toFixed(2)}%`,
    width: `${Math.max(0, Math.min(width, 100 - Math.max(0, left))).toFixed(2)}%`,
  }
}

function formatMinutes(mins: number): string {
  if (mins <= 0) return '0h 00m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// ─── Gantt Bar ────────────────────────────────────────────────────────────────

function GanttBar({ clockIn }: { clockIn: ClockIn }) {
  const blocks: Array<{ left: string; width: string; color: string; label: string }> = []
  let workStart: number | null = null
  let breakStart: number | null = null

  for (const entry of clockIn.entries) {
    const mins = timeToMinutes(isoToHHMM(entry.timestamp))
    if (entry.type === 'in') {
      workStart = mins
    } else if (entry.type === 'break_start' && workStart !== null) {
      const pos = minutesToWidth(workStart, mins)
      blocks.push({ ...pos, color: 'bg-primary', label: 'Trabajo' })
      workStart = null
      breakStart = mins
    } else if (entry.type === 'break_end') {
      if (breakStart !== null) {
        const pos = minutesToWidth(breakStart, mins)
        blocks.push({ ...pos, color: 'bg-warning', label: 'Descanso' })
        breakStart = null
      }
      workStart = mins
    } else if (entry.type === 'out' && workStart !== null) {
      const pos = minutesToWidth(workStart, mins)
      blocks.push({ ...pos, color: 'bg-primary', label: 'Trabajo' })
      workStart = null
    }
  }

  // In progress — extend to "now" (use fixed 14:28 for demo)
  if (workStart !== null && clockIn.status === 'working') {
    const nowMins = 14 * 60 + 28
    const pos = minutesToWidth(workStart, nowMins)
    blocks.push({ ...pos, color: 'bg-primary/70', label: 'En curso' })
  }
  if (breakStart !== null && clockIn.status === 'break') {
    const nowMins = 14 * 60 + 28
    const pos = minutesToWidth(breakStart, nowMins)
    blocks.push({ ...pos, color: 'bg-warning/70', label: 'Descanso activo' })
  }

  return (
    <div className="relative h-6 rounded bg-muted overflow-hidden">
      {blocks.map((b, i) => (
        <div
          key={i}
          title={b.label}
          className={cn('absolute top-0 h-full rounded', b.color)}
          style={{ left: b.left, width: b.width }}
        />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTimePage() {
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week'>('today')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const today = '2026-04-12'
  const yesterday = '2026-04-11'

  const filtered = useMemo(() => {
    return MOCK_CLOCK_INS.filter((ci) => {
      const matchDate =
        dateFilter === 'week' ||
        (dateFilter === 'today' && ci.date === today) ||
        (dateFilter === 'yesterday' && ci.date === yesterday)
      const matchDept = deptFilter === 'all' || ci.department_name === deptFilter
      const matchStatus = statusFilter === 'all' || ci.status === statusFilter
      return matchDate && matchDept && matchStatus
    })
  }, [dateFilter, deptFilter, statusFilter])

  const pendingCount = MOCK_CLOCK_INS.filter(
    (ci) => ci.incidence && ci.status === 'out'
  ).length

  // Hour labels for gantt header
  const hourLabels = Array.from({ length: GANTT_TOTAL_HOURS + 1 }, (_, i) => GANTT_START_HOUR + i)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Control Horario</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Vista Gantt de fichajes del equipo
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/time/incidences">
                <WarningCircleIcon className="size-4 text-warning-foreground" />
                Ver incidencias
                <Badge variant="warning" size="xs" className="ml-1">
                  {pendingCount}
                </Badge>
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/time/schedules">
              <CalendarIcon className="size-4" />
              Horarios
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['today', 'yesterday', 'week'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={cn(
                'px-3 py-1.5 label-sm font-medium transition-colors',
                dateFilter === d
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {d === 'today' ? 'Hoy' : d === 'yesterday' ? 'Ayer' : 'Esta semana'}
            </button>
          ))}
        </div>

        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {MOCK_DEPARTMENTS.map((d) => (
              <SelectItem key={d.id} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="working">Trabajando</SelectItem>
            <SelectItem value="break">Descanso</SelectItem>
            <SelectItem value="out">Salió</SelectItem>
            <SelectItem value="not_started">Sin fichar</SelectItem>
          </SelectContent>
        </Select>

        <span className="paragraph-xs text-muted-foreground ml-auto">
          {filtered.length} empleado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Gantt Chart */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            Gantt de fichajes
          </CardTitle>
          <CardAction>
            <div className="flex items-center gap-3 label-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-primary inline-block" />
                Trabajo
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-warning inline-block" />
                Descanso
              </span>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {/* Hour axis */}
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-56 shrink-0 px-4 py-2">
              <span className="label-xs text-muted-foreground">Empleado</span>
            </div>
            <div className="flex-1 relative px-2 py-2">
              <div className="relative h-4">
                {hourLabels.map((h, i) => (
                  <span
                    key={h}
                    className="absolute label-xs text-muted-foreground tabular-nums -translate-x-1/2"
                    style={{ left: `${(i / GANTT_TOTAL_HOURS) * 100}%` }}
                  >
                    {String(h).padStart(2, '0')}h
                  </span>
                ))}
              </div>
            </div>
            <div className="w-28 shrink-0 px-3 py-2 text-right">
              <span className="label-xs text-muted-foreground">Total</span>
            </div>
            <div className="w-20 shrink-0 px-3 py-2 text-center">
              <span className="label-xs text-muted-foreground">Estado</span>
            </div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <ClockIcon className="size-10 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">
                No hay registros para los filtros seleccionados
              </p>
            </div>
          ) : (
            filtered.map((ci) => (
              <div
                key={ci.id}
                className="flex items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                {/* Employee */}
                <div className="w-56 shrink-0 flex items-center gap-2.5 px-4 py-3">
                  <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="label-xs font-semibold text-foreground">
                      {getInitials(ci.employee_name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="label-sm font-medium text-foreground truncate">
                      {ci.employee_name}
                    </p>
                    <p className="paragraph-xs text-muted-foreground truncate">
                      {ci.department_name}
                    </p>
                  </div>
                </div>

                {/* Gantt bar */}
                <div className="flex-1 px-2 py-3">
                  <GanttBar clockIn={ci} />
                  {/* Vertical hour grid lines */}
                </div>

                {/* Total */}
                <div className="w-28 shrink-0 px-3 py-3 text-right">
                  <span className="label-sm font-semibold text-foreground tabular-nums">
                    {formatMinutes(ci.total_minutes)}
                  </span>
                  {ci.incidence && (
                    <p className="paragraph-xs text-warning-foreground truncate mt-0.5">
                      {ci.incidence}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="w-20 shrink-0 px-3 py-3 flex justify-center">
                  <Badge variant={STATUS_VARIANTS[ci.status]} size="xs">
                    {STATUS_LABELS[ci.status]}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            { label: 'Trabajando ahora', status: 'working', variant: 'success' },
            { label: 'En descanso', status: 'break', variant: 'warning' },
            { label: 'Han salido', status: 'out', variant: 'neutral' },
            { label: 'Sin fichar', status: 'not_started', variant: 'not-started' },
          ] as const
        ).map(({ label, status, variant }) => {
          const count = MOCK_CLOCK_INS.filter(
            (ci) =>
              (dateFilter === 'today' ? ci.date === today : dateFilter === 'yesterday' ? ci.date === yesterday : true) &&
              ci.status === status
          ).length
          return (
            <Card key={status} className="border-border">
              <CardContent className="pt-4 pb-4">
                <p className="paragraph-xs text-muted-foreground mb-1">{label}</p>
                <div className="flex items-center gap-2">
                  <span className="title-2xs font-semibold text-foreground">{count}</span>
                  <Badge variant={variant} size="xs">
                    {STATUS_LABELS[status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
