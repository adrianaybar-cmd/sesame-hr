'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@clasing/ui/table'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS, MOCK_WORK_CENTERS } from '@/lib/mock/employees'
import type { Employee } from '@/lib/types/employee'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<Employee['status'], string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  on_leave: 'De baja',
  terminated: 'Baja definitiva',
}

const STATUS_VARIANTS: Record<Employee['status'], 'success' | 'neutral' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'neutral',
  on_leave: 'warning',
  terminated: 'error',
}

const PAGE_SIZE = 8

function EmployeeAvatar({ employee }: { employee: Employee }) {
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`
  return (
    <div className="size-8 rounded-full bg-accent flex items-center justify-center shrink-0">
      {employee.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={employee.avatar_url} alt="" className="size-8 rounded-full object-cover" />
      ) : (
        <span className="label-xs font-semibold text-foreground">{initials}</span>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [centerFilter, setCenterFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase()
      const matchSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase())
      const matchDept = deptFilter === 'all' || emp.department_id === deptFilter
      const matchCenter = centerFilter === 'all' || emp.work_center_id === centerFilter
      const matchStatus = statusFilter === 'all' || emp.status === statusFilter
      return matchSearch && matchDept && matchCenter && matchStatus
    })
  }, [search, deptFilter, centerFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange() {
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Empleados</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {MOCK_EMPLOYEES.length} empleado{MOCK_EMPLOYEES.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button variant="primary" size="md" asChild>
          <Link href="/admin/employees/new">
            <PlusIcon className="size-4" />
            Añadir empleado
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <Input
            icon={<MagnifyingGlassIcon className="size-4" />}
            iconPosition="left"
            placeholder="Buscar por nombre, email o cargo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange()
            }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="size-4 text-muted-foreground shrink-0" />
          <Select
            value={deptFilter}
            onValueChange={(v: string) => {
              setDeptFilter(v)
              handleFilterChange()
            }}
          >
            <SelectTrigger size="md" className="w-44">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              {MOCK_DEPARTMENTS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={centerFilter}
            onValueChange={(v: string) => {
              setCenterFilter(v)
              handleFilterChange()
            }}
          >
            <SelectTrigger size="md" className="w-48">
              <SelectValue placeholder="Centro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los centros</SelectItem>
              {MOCK_WORK_CENTERS.map((wc) => (
                <SelectItem key={wc.id} value={wc.id}>
                  {wc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v: string) => {
              setStatusFilter(v)
              handleFilterChange()
            }}
          >
            <SelectTrigger size="md" className="w-36">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
              <SelectItem value="on_leave">De baja</SelectItem>
              <SelectItem value="terminated">Baja definitiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Centro</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <UserCircleIcon className="size-10 text-muted-foreground" />
                    <p className="paragraph-sm text-muted-foreground">
                      No se encontraron empleados con los filtros aplicados
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar employee={emp} />
                      <div className="min-w-0">
                        <p className="label-md font-medium text-foreground truncate">
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="paragraph-xs text-muted-foreground truncate">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-foreground">{emp.department_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-muted-foreground">{emp.position}</span>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-muted-foreground">{emp.work_center_name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[emp.status]} size="sm">
                      {STATUS_LABELS[emp.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="xs" asChild>
                        <Link href={`/admin/employees/${emp.id}`}>Ver perfil</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="paragraph-sm text-muted-foreground">
            Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de{' '}
            {filtered.length} empleado{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <span className="label-md font-medium text-foreground px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconOnly
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
