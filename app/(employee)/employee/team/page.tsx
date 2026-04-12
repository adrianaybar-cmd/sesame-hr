'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { Card, CardContent } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import {
  UsersIcon,
  HouseIcon,
  LaptopIcon,
  SignOutIcon,
  SunIcon,
  ThermometerIcon,
  MapPinIcon,
} from '@phosphor-icons/react'
import { MOCK_WHOS_IN } from '@/lib/mock/time'
import type { WhosInStatus } from '@/lib/types/time'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

// Simulated current employee's department
const CURRENT_EMPLOYEE_DEPT = 'Tecnología'
const CURRENT_EMPLOYEE_ID = 'emp-1'

const STATUS_LABELS: Record<WhosInStatus['status'], string> = {
  in: 'En oficina',
  remote: 'Remoto',
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

const STATUS_BADGE_VARIANTS: Record<
  WhosInStatus['status'],
  'success' | 'neutral' | 'warning' | 'error' | 'info'
> = {
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

function TeamMemberCard({
  employee,
  isCurrentUser,
}: {
  employee: WhosInStatus
  isCurrentUser: boolean
}) {
  const Icon = STATUS_ICONS[employee.status]

  return (
    <Card
      className={cn(
        'border-border hover:shadow-sm transition-shadow',
        isCurrentUser && 'border-primary/40 bg-primary/5'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
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

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="label-sm font-medium text-foreground truncate">
                {employee.employee_name}
              </p>
              {isCurrentUser && (
                <Badge variant="neutral" size="xs">Tú</Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Badge variant={STATUS_BADGE_VARIANTS[employee.status]} size="xs">
                {STATUS_LABELS[employee.status]}
              </Badge>
              {employee.since && (
                <span className="paragraph-xs text-muted-foreground">
                  {sinceLabel(employee.since)}
                </span>
              )}
            </div>
            {employee.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPinIcon className="size-3 text-muted-foreground" />
                <span className="paragraph-xs text-muted-foreground">{employee.location}</span>
              </div>
            )}
          </div>

          <Icon className="size-4 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeTeamPage() {
  const teamMembers = useMemo(
    () => MOCK_WHOS_IN.filter((e) => e.department === CURRENT_EMPLOYEE_DEPT),
    []
  )

  const inCount = teamMembers.filter((e) => e.status === 'in').length
  const remoteCount = teamMembers.filter((e) => e.status === 'remote').length
  const availableCount = inCount + remoteCount

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mi equipo</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          {CURRENT_EMPLOYEE_DEPT} —{' '}
          <span className="font-medium text-foreground">{availableCount}</span> de{' '}
          <span className="font-medium text-foreground">{teamMembers.length}</span> disponibles hoy
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5">
          <span className="size-2 rounded-full bg-success" />
          <span className="label-xs font-medium text-success-foreground">
            {inCount} en oficina
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
          <span className="size-2 rounded-full bg-primary" />
          <span className="label-xs font-medium text-primary">
            {remoteCount} en remoto
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <span className="size-2 rounded-full bg-muted-foreground" />
          <span className="label-xs font-medium text-muted-foreground">
            {teamMembers.length - availableCount} no disponibles
          </span>
        </div>
      </div>

      {/* Team grid */}
      {teamMembers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12">
          <UsersIcon className="size-10 text-muted-foreground" />
          <p className="paragraph-sm text-muted-foreground">
            No hay compañeros en tu equipo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teamMembers.map((emp) => (
            <TeamMemberCard
              key={emp.employee_id}
              employee={emp}
              isCurrentUser={emp.employee_id === CURRENT_EMPLOYEE_ID}
            />
          ))}
        </div>
      )}
    </div>
  )
}
