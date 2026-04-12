'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@clasing/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@clasing/ui/table'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@clasing/ui/form'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { Department } from '@/lib/types/employee'

// ─── Schema ───────────────────────────────────────────────────────────────────

const departmentSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  manager_id: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getManagerName(managerId?: string): string {
  if (!managerId) return '—'
  const emp = MOCK_EMPLOYEES.find((e) => e.id === managerId)
  return emp ? `${emp.first_name} ${emp.last_name}` : '—'
}

// ─── Delete confirmation dialog ───────────────────────────────────────────────

function DeleteConfirmDialog({
  department,
  open,
  onOpenChange,
  onConfirm,
}: {
  department: Department | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Eliminar departamento</DialogTitle>
        </DialogHeader>
        <p className="paragraph-sm text-muted-foreground">
          ¿Seguro que quieres eliminar el departamento{' '}
          <span className="font-semibold text-foreground">{department?.name}</span>? Esta acción no
          se puede deshacer.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md">
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="destructive" size="md" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Department form dialog ───────────────────────────────────────────────────

function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  department: Department | null
  onSave: (values: DepartmentFormValues) => void
}) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? '',
      manager_id: department?.manager_id ?? '',
    },
  })

  const isEditing = !!department

  function handleSubmit(values: DepartmentFormValues) {
    onSave(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v: boolean) => {
        if (!v) form.reset()
        onOpenChange(v)
      }}
    >
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar departamento' : 'Nuevo departamento'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Tecnología" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <Select onValueChange={(v: string) => field.onChange(v)} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sin responsable asignado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_EMPLOYEES.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="md" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button variant="primary" size="md" type="submit">
                {isEditing ? 'Guardar cambios' : 'Crear departamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Department | null>(null)

  function handleNew() {
    setSelected(null)
    setFormOpen(true)
  }

  function handleEdit(dept: Department) {
    setSelected(dept)
    setFormOpen(true)
  }

  function handleDeleteClick(dept: Department) {
    setSelected(dept)
    setDeleteOpen(true)
  }

  function handleSave(values: DepartmentFormValues) {
    if (selected) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === selected.id
            ? { ...d, name: values.name, manager_id: values.manager_id }
            : d
        )
      )
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: values.name,
        manager_id: values.manager_id,
        employee_count: 0,
      }
      setDepartments((prev) => [...prev, newDept])
    }
  }

  function handleDeleteConfirm() {
    if (selected) {
      setDepartments((prev) => prev.filter((d) => d.id !== selected.id))
      setSelected(null)
    }
    setDeleteOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="label-lg font-semibold text-foreground">Departamentos</h2>
          <p className="paragraph-sm text-muted-foreground">
            {departments.length} departamento{departments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleNew}>
          <PlusIcon className="size-4" />
          Nuevo departamento
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Empleados</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground paragraph-sm">
                  No hay departamentos. Crea el primero.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    <span className="label-md font-medium text-foreground">{dept.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-muted-foreground">
                      {getManagerName(dept.manager_id)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">
                      {dept.employee_count} empleado{dept.employee_count !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        onClick={() => handleEdit(dept)}
                        tooltip="Editar"
                      >
                        <PencilSimpleIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        onClick={() => handleDeleteClick(dept)}
                        tooltip="Eliminar"
                      >
                        <TrashIcon className="size-4 text-destructive-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={selected}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        department={selected}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
