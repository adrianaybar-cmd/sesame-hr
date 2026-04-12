'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  UsersIcon,
  HouseIcon,
  LaptopIcon,
  SignOutIcon,
  SunIcon,
  ThermometerIcon,
  ArrowsClockwiseIcon,
  MapPinIcon,
} from '@phosphor-icons/react'
import { MOCK_WHOS_IN } from '@/lib/mock/time'
import type { WhosInStatus } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<WhosInStatus['status'], string> = {
  in: 'En oficina',
  remote: 'En remoto',
  out: 'Fuera',
  vacation: 'Vacaciones',
  sick: 'Baja',
}

const STATUS_COLORS: Record<WhosInStatus['status'], string> = {
  in: 'bg-success',
  remote: 'bg-primary',
  out: 'bg-muted-foreground',
  vacation: 'bg-warning',
  sick: 'bg-destructive',
}

const STATUS_BADGE_VARIANTS: Record<WhosInStatus['status'], 'success' | 'neutral' | 'warning' | 'error' | 'info'> = {
  in: 'success',
  remote: 'info',
  out: 'neutral',
  vacation: 'warning',
  sick: 'error',
}

const STATUS_ICONS: Record<WhosInStatus['status'], React.ElementType> = {
  in: HouseIcon,
  remote: LaptopIcon,
  out: SignOutIcon,
  vacation: SunIcon,
  sick: ThermometerIcon,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function sinceLabel(since?: string): string {
  if (!since) return ''
  const now = new Date('2026-04-12T14:30:00.000Z')
  const then = new Date(since)
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000)
  if (diffMin < 60) return `hace ${diffMin}m`
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  return m === 0 ? `hace ${h}h` : `hace ${h}h ${m}m`
}

// ─── Employee Card ────────────────────────────────────────────────────────────

function EmployeeCard({ employee }: { employee: WhosInStatus }) {
  const Icon = STATUS_ICONS[employee.status]
  return (
    <Card className="border-border hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="size-10 rounded-full bg-accent flex items-center justify-center">
              <span className="label-sm font-semibold text-foreground">
                {getInitials(employee.employee_name)}
              </span>
            </div>
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card',
                STATUS_COLORS[employee.status]
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="label-sm font-medium text-foreground truncate">
              {employee.employee_name}
            </p>
            <p className="paragraph-xs text-muted-foreground">{employee.department}</p>
            {employee.since && (
              <p className="paragraph-xs text-muted-foreground mt-0.5">
                {sinceLabel(employee.since)}
              </p>
            )}
            {employee.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPinIcon className="size-3 text-muted-foreground" />
                <span className="paragraph-xs text-muted-foreground">{employee.location}</span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  title,
  employees,
  status,
}: {
  title: string
  employees: WhosInStatus[]
  status: WhosInStatus['status']
}) {
  if (employees.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('size-2 rounded-full', STATUS_COLORS[status])} />
        <h2 className="label-md font-semibold text-foreground">{title}</h2>
        <Badge variant={STATUS_BADGE_VARIANTS[status]} size="xs">
          {employees.length}
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {employees.map((emp) => (
          <EmployeeCard key={emp.employee_id} employee={emp} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminWhosInPage() {
  const [data, setData] = useState<WhosInStatus[]>(MOCK_WHOS_IN)
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(new Date('2026-04-12T14:30:00.000Z'))

  // Simulate refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      // Shuffle remote/in for a couple of employees to simulate real-time changes
      setData((prev) =>
        prev.map((emp) => {
          if (emp.employee_id === 'emp-3' && emp.status === 'remote') {
            return { ...emp, since: new Date().toISOString() }
          }
          return emp
        })
      )
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const departments = useMemo(
    () => Array.from(new Set(MOCK_WHOS_IN.map((e) => e.department))).sort(),
    []
  )

  const filtered = useMemo(
    () =>
      data.filter((emp) => {
        const matchDept = deptFilter === 'all' || emp.department === deptFilter
        const matchStatus = statusFilter === 'all' || emp.status === statusFilter
        return matchDept && matchStatus
      }),
    [data, deptFilter, statusFilter]
  )

  const inOffice = filtered.filter((e) => e.status === 'in')
  const remote = filtered.filter((e) => e.status === 'remote')
  const out = filtered.filter((e) => e.status === 'out' || e.status === 'vacation' || e.status === 'sick')
  const totalInOffice = data.filter((e) => e.status === 'in').length
  const totalEmployees = data.length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">¿Quién está?</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">{totalInOffice}</span> de{' '}
            <span className="font-semibold text-foreground">{totalEmployees}</span> empleados en oficina
          </p>
        </div>
        <div className="flex items-center gap-2 paragraph-xs text-muted-foreground">
          <ArrowsClockwiseIcon className="size-3.5" />
          <span>
            Actualizado{' '}
            {lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="paragraph-xs text-muted-foreground">(auto-refresh 30s)</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(
          [
            { label: 'En oficina', status: 'in' as const, count: data.filter((e) => e.status === 'in').length },
            { label: 'En remoto', status: 'remote' as const, count: data.filter((e) => e.status === 'remote').length },
            { label: 'Fuera', status: 'out' as const, count: data.filter((e) => e.status === 'out').length },
            { label: 'Vacaciones', status: 'vacation' as const, count: data.filter((e) => e.status === 'vacation').length },
            { label: 'Baja', status: 'sick' as const, count: data.filter((e) => e.status === 'sick').length },
          ]
        ).map(({ label, status, count }) => (
          <Card key={status} className="border-border">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <span className={cn('size-2.5 rounded-full shrink-0', STATUS_COLORS[status])} />
              <div>
                <p className="paragraph-xs text-muted-foreground">{label}</p>
                <p className="label-md font-semibold text-foreground">{count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
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
            <SelectItem value="in">En oficina</SelectItem>
            <SelectItem value="remote">En remoto</SelectItem>
            <SelectItem value="out">Fuera</SelectItem>
            <SelectItem value="vacation">Vacaciones</SelectItem>
            <SelectItem value="sick">Baja</SelectItem>
          </SelectContent>
        </Select>

        <span className="paragraph-xs text-muted-foreground self-center ml-auto">
          {filtered.length} empleado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        <Section title="En la oficina" employees={inOffice} status="in" />
        <Section title="En remoto" employees={remote} status="remote" />
        {out.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="label-md font-semibold text-foreground">Fuera</h2>
              <Badge variant="neutral" size="xs">{out.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {out.map((emp) => (
                <EmployeeCard key={emp.employee_id} employee={emp} />
              ))}
            </div>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <UsersIcon className="size-10 text-muted-foreground" />
            <p className="paragraph-sm text-muted-foreground">
              No hay empleados para los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
