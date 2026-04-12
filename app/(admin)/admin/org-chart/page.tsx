'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent } from '@clasing/ui/card'
import { Input } from '@clasing/ui/input'
import {
  MagnifyingGlassIcon,
  TreeViewIcon,
  ListIcon,
  CaretDownIcon,
  CaretRightIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { Employee } from '@/lib/types/employee'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getHierarchyLevel(emp: Employee, allEmployees: Employee[]): number {
  if (!emp.manager_id) return 0
  const manager = allEmployees.find((e) => e.id === emp.manager_id)
  if (!manager) return 1
  return getHierarchyLevel(manager, allEmployees) + 1
}

// ─── Employee Avatar ──────────────────────────────────────────────────────────

function EmpAvatar({ emp, size = 'md' }: { emp: Employee; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-12' : 'size-9'
  const textClass = size === 'sm' ? 'label-xs' : size === 'lg' ? 'label-md' : 'label-sm'
  return (
    <div className={cn(sizeClass, 'rounded-full bg-accent flex items-center justify-center shrink-0')}>
      {emp.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={emp.avatar_url} alt="" className={cn(sizeClass, 'rounded-full object-cover')} />
      ) : (
        <span className={cn(textClass, 'font-semibold text-foreground')}>
          {getInitials(emp.first_name, emp.last_name)}
        </span>
      )}
    </div>
  )
}

// ─── Org tree node ────────────────────────────────────────────────────────────

function OrgNode({
  employee,
  employees,
  depth,
  highlightId,
  highlightChain,
}: {
  employee: Employee
  employees: Employee[]
  depth: number
  highlightId: string | null
  highlightChain: Set<string>
}) {
  const [collapsed, setCollapsed] = useState(false)
  const reports = employees.filter((e) => e.manager_id === employee.id && e.status !== 'terminated')
  const isHighlighted = highlightId === employee.id
  const isInChain = highlightChain.has(employee.id)

  return (
    <div className={cn('relative', depth > 0 && 'ml-8 border-l border-border pl-4')}>
      <div className="relative">
        {/* Connector dot */}
        {depth > 0 && (
          <div className="absolute -left-[18px] top-5 size-2 rounded-full bg-border" />
        )}

        <div
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border transition-all mb-2',
            isHighlighted
              ? 'border-blue-500 dark:border-blue-400 bg-info shadow-sm'
              : isInChain
                ? 'border-border bg-accent/50'
                : 'border-border bg-card'
          )}
        >
          <EmpAvatar emp={employee} />
          <div className="flex-1 min-w-0">
            <p className="label-sm font-semibold text-foreground truncate">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="paragraph-xs text-muted-foreground truncate">{employee.position}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" size="xs">{employee.department_name}</Badge>
              <Badge variant={STATUS_VARIANTS[employee.status]} size="xs">{STATUS_LABELS[employee.status]}</Badge>
            </div>
          </div>
          {reports.length > 0 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="shrink-0 text-muted-foreground hover:text-foreground mt-1"
            >
              {collapsed
                ? <CaretRightIcon className="size-4" />
                : <CaretDownIcon className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {!collapsed && reports.map((report) => (
        <OrgNode
          key={report.id}
          employee={report}
          employees={employees}
          depth={depth + 1}
          highlightId={highlightId}
          highlightChain={highlightChain}
        />
      ))}
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({ employees }: { employees: Employee[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Empleado</th>
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Cargo</th>
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Manager</th>
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Departamento</th>
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Nivel</th>
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {employees.filter((e) => e.status !== 'terminated').map((emp) => {
            const manager = employees.find((e) => e.id === emp.manager_id)
            const level = getHierarchyLevel(emp, employees)
            return (
              <tr key={emp.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <EmpAvatar emp={emp} size="sm" />
                    <div>
                      <p className="label-sm font-medium text-foreground">{emp.first_name} {emp.last_name}</p>
                      <p className="paragraph-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="paragraph-sm text-foreground">{emp.position}</p>
                </td>
                <td className="py-3 px-4">
                  {manager ? (
                    <p className="paragraph-sm text-foreground">{manager.first_name} {manager.last_name}</p>
                  ) : (
                    <span className="paragraph-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" size="sm">{emp.department_name}</Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="label-sm text-muted-foreground">Nivel {level + 1}</span>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={STATUS_VARIANTS[emp.status]} size="sm">{STATUS_LABELS[emp.status]}</Badge>
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

export default function AdminOrgChartPage() {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')

  const allEmployees = MOCK_EMPLOYEES

  // Build highlight chain for searched employee
  const foundEmployee = search.trim()
    ? allEmployees.find((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase())
      )
    : null

  function buildChain(empId: string | undefined, chain: Set<string> = new Set()): Set<string> {
    if (!empId) return chain
    chain.add(empId)
    const emp = allEmployees.find((e) => e.id === empId)
    if (emp?.manager_id) buildChain(emp.manager_id, chain)
    return chain
  }

  const highlightChain = foundEmployee ? buildChain(foundEmployee.id) : new Set<string>()

  // Department filter
  const departments = ['all', ...Array.from(new Set(allEmployees.map((e) => e.department_name)))]

  const filteredEmployees = deptFilter === 'all'
    ? allEmployees
    : allEmployees.filter((e) => e.department_name === deptFilter)

  // Root nodes (no manager or manager not in filtered set)
  const filteredIds = new Set(filteredEmployees.map((e) => e.id))
  const rootEmployees = filteredEmployees.filter(
    (e) => !e.manager_id || !filteredIds.has(e.manager_id)
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Organigrama</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Estructura organizativa de la empresa — {allEmployees.filter((e) => e.status === 'active').length} empleados activos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('tree')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg label-sm font-medium transition-colors',
              viewMode === 'tree' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:bg-accent'
            )}
          >
            <TreeViewIcon className="size-4" />
            Vista árbol
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg label-sm font-medium transition-colors',
              viewMode === 'list' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:bg-accent'
            )}
          >
            <ListIcon className="size-4" />
            Vista lista
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Input
            placeholder="Buscar empleado o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<MagnifyingGlassIcon />}
            iconPosition="left"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={cn(
                'px-3 py-1.5 rounded-full label-xs font-medium transition-colors',
                deptFilter === dept
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {dept === 'all' ? 'Todos' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Found employee highlight */}
      {foundEmployee && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-info border border-blue-500/30 dark:border-blue-400/30">
          <EmpAvatar emp={foundEmployee} size="sm" />
          <div>
            <p className="label-sm font-semibold text-foreground">{foundEmployee.first_name} {foundEmployee.last_name}</p>
            <p className="paragraph-xs text-muted-foreground">{foundEmployee.position} · {foundEmployee.department_name}</p>
          </div>
          <div className="ml-auto">
            <Badge variant="info" size="sm">Encontrado — resaltado en el árbol</Badge>
          </div>
        </div>
      )}

      {/* Tree / List */}
      <Card>
        <CardContent className={viewMode === 'tree' ? 'pt-6 overflow-x-auto' : 'p-0'}>
          {viewMode === 'tree' ? (
            <div className="min-w-max">
              {rootEmployees.map((root) => (
                <OrgNode
                  key={root.id}
                  employee={root}
                  employees={filteredEmployees}
                  depth={0}
                  highlightId={foundEmployee?.id ?? null}
                  highlightChain={highlightChain}
                />
              ))}
            </div>
          ) : (
            <ListView employees={filteredEmployees} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
