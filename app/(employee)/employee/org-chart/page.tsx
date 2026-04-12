'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent } from '@clasing/ui/card'
import { ArrowRightIcon, UserIcon } from '@phosphor-icons/react'
import { MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { Employee } from '@/lib/types/employee'
import { cn } from '@/lib/utils'

// Simula el empleado actual
const CURRENT_EMPLOYEE_ID = 'emp-6'

const STATUS_VARIANTS: Record<Employee['status'], 'success' | 'neutral' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'neutral',
  on_leave: 'warning',
  terminated: 'error',
}

const STATUS_LABELS: Record<Employee['status'], string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  on_leave: 'De baja',
  terminated: 'Baja definitiva',
}

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase()
}

function EmpCard({
  emp,
  variant = 'normal',
  label,
}: {
  emp: Employee
  variant?: 'normal' | 'self' | 'manager' | 'report'
  label?: string
}) {
  const initials = getInitials(emp.first_name, emp.last_name)

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 p-4 rounded-xl border transition-all text-center',
        variant === 'self'
          ? 'border-blue-500 dark:border-blue-400 bg-info shadow-md scale-105'
          : variant === 'manager'
            ? 'border-border bg-card'
            : 'border-border bg-card hover:bg-accent/30'
      )}
    >
      {label && (
        <span className="label-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      )}
      <div className={cn(
        'rounded-full flex items-center justify-center',
        variant === 'self' ? 'size-16 bg-blue-500 dark:bg-blue-400' : 'size-12 bg-accent',
      )}>
        {emp.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={emp.avatar_url} alt="" className={cn(variant === 'self' ? 'size-16' : 'size-12', 'rounded-full object-cover')} />
        ) : (
          <span className={cn(
            'font-semibold',
            variant === 'self' ? 'title-2xs text-white dark:text-neutral-950' : 'label-md text-foreground'
          )}>
            {initials}
          </span>
        )}
      </div>
      <div>
        <p className={cn('font-semibold text-foreground', variant === 'self' ? 'label-md' : 'label-sm')}>
          {emp.first_name} {emp.last_name}
        </p>
        <p className="paragraph-xs text-muted-foreground mt-0.5">{emp.position}</p>
        <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
          <Badge variant="secondary" size="xs">{emp.department_name}</Badge>
          <Badge variant={STATUS_VARIANTS[emp.status]} size="xs">{STATUS_LABELS[emp.status]}</Badge>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeOrgChartPage() {
  const allEmployees = MOCK_EMPLOYEES
  const me = allEmployees.find((e) => e.id === CURRENT_EMPLOYEE_ID)
  if (!me) return null

  const manager = me.manager_id ? allEmployees.find((e) => e.id === me.manager_id) : null
  const managerManager = manager?.manager_id ? allEmployees.find((e) => e.id === manager.manager_id) : null
  const reports = allEmployees.filter((e) => e.manager_id === me.id)
  const isManager = reports.length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Mi posición en el equipo</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Tu lugar en la estructura organizativa de la empresa.
          </p>
        </div>
        {isManager && (
          <Button variant="outline" size="md" asChild>
            <Link href="/admin/org-chart">
              Ver organigrama completo
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Org chart */}
      <div className="flex flex-col items-center gap-2">
        {/* Manager's manager */}
        {managerManager && (
          <>
            <div className="w-48 sm:w-56">
              <EmpCard emp={managerManager} variant="manager" label="Dirección" />
            </div>
            <div className="w-0.5 h-6 bg-border" />
          </>
        )}

        {/* Manager */}
        {manager ? (
          <>
            <div className="w-48 sm:w-56">
              <EmpCard emp={manager} variant="manager" label="Mi manager" />
            </div>
            <div className="w-0.5 h-6 bg-border" />
          </>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border">
            <UserIcon className="size-4 text-muted-foreground" />
            <p className="paragraph-xs text-muted-foreground">Sin manager asignado</p>
          </div>
        )}

        {/* Me */}
        <div className="w-56 sm:w-64">
          <EmpCard emp={me} variant="self" label="Tú" />
        </div>

        {/* Reports */}
        {reports.length > 0 && (
          <>
            <div className="w-0.5 h-6 bg-border" />

            {/* Horizontal connector */}
            {reports.length > 1 && (
              <div className="relative flex items-start justify-center" style={{ width: `${reports.length * 220}px`, maxWidth: '90vw' }}>
                <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-border" />
              </div>
            )}

            <div className="flex items-start gap-4 flex-wrap justify-center">
              {reports.map((report) => (
                <div key={report.id} className="w-44 sm:w-52">
                  <EmpCard emp={report} variant="report" label="Reporte directo" />
                </div>
              ))}
            </div>
          </>
        )}

        {reports.length === 0 && (
          <div className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border">
            <UserIcon className="size-4 text-muted-foreground" />
            <p className="paragraph-xs text-muted-foreground">Sin reportes directos</p>
          </div>
        )}
      </div>

      {/* Team stats */}
      {(manager || reports.length > 0) && (
        <Card>
          <CardContent className="pt-4">
            <p className="label-sm font-semibold text-foreground mb-3">Resumen de mi equipo</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">{reports.length}</p>
                <p className="paragraph-xs text-muted-foreground">Reportes directos</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">
                  {reports.filter((r) => r.status === 'active').length}
                </p>
                <p className="paragraph-xs text-muted-foreground">Activos</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">{me.department_name}</p>
                <p className="paragraph-xs text-muted-foreground">Departamento</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">{me.work_center_name.split(' ').slice(-1)[0]}</p>
                <p className="paragraph-xs text-muted-foreground">Centro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
