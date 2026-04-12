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
import { PlusIcon, PencilSimpleIcon, TrashIcon, MapPinIcon } from '@phosphor-icons/react'
import { MOCK_WORK_CENTERS } from '@/lib/mock/employees'
import type { WorkCenter } from '@/lib/types/employee'

// ─── Schema ───────────────────────────────────────────────────────────────────

const workCenterSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string().min(5, 'Introduce una dirección válida'),
  city: z.string().min(2, 'Introduce una ciudad'),
  postal_code: z.string().min(5, 'Código postal inválido'),
  country: z.string().min(1, 'Selecciona un país'),
  timezone: z.string().min(1, 'Selecciona una zona horaria'),
})

type WorkCenterFormValues = z.infer<typeof workCenterSchema>

const COUNTRIES = [
  { value: 'es', label: 'España' },
  { value: 'pt', label: 'Portugal' },
  { value: 'fr', label: 'Francia' },
  { value: 'de', label: 'Alemania' },
  { value: 'mx', label: 'México' },
  { value: 'ar', label: 'Argentina' },
  { value: 'co', label: 'Colombia' },
  { value: 'cl', label: 'Chile' },
]

const TIMEZONES = [
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)' },
  { value: 'Europe/Lisbon', label: 'Lisboa (UTC+0/+1)' },
  { value: 'Europe/London', label: 'Londres (UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'París (UTC+1/+2)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6/-5)' },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-3)' },
  { value: 'America/Santiago', label: 'Santiago (UTC-4/-3)' },
]

// ─── Delete confirm dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  center,
  open,
  onOpenChange,
  onConfirm,
}: {
  center: WorkCenter | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Eliminar centro de trabajo</DialogTitle>
        </DialogHeader>
        <p className="paragraph-sm text-muted-foreground">
          ¿Seguro que quieres eliminar el centro{' '}
          <span className="font-semibold text-foreground">{center?.name}</span>? Esta acción no
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

// ─── Work center form dialog ──────────────────────────────────────────────────

function WorkCenterFormDialog({
  open,
  onOpenChange,
  center,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  center: WorkCenter | null
  onSave: (values: WorkCenterFormValues) => void
}) {
  const isEditing = !!center

  const form = useForm<WorkCenterFormValues>({
    resolver: zodResolver(workCenterSchema),
    defaultValues: {
      name: center?.name ?? '',
      address: center?.address ?? '',
      city: center?.city ?? '',
      postal_code: center?.postal_code ?? '',
      country: center?.country === 'España' ? 'es' : (center?.country ?? 'es'),
      timezone: center?.timezone ?? 'Europe/Madrid',
    },
  })

  function handleSubmit(values: WorkCenterFormValues) {
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
          <DialogTitle>{isEditing ? 'Editar centro de trabajo' : 'Nuevo centro de trabajo'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del centro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Oficina Central Madrid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Principal 1, 2ª planta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Madrid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal</FormLabel>
                    <FormControl>
                      <Input placeholder="28001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="País" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona horaria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Zona horaria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="md" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button variant="primary" size="md" type="submit">
                {isEditing ? 'Guardar cambios' : 'Crear centro'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkCentersPage() {
  const [centers, setCenters] = useState<WorkCenter[]>(MOCK_WORK_CENTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<WorkCenter | null>(null)

  function handleNew() {
    setSelected(null)
    setFormOpen(true)
  }

  function handleEdit(center: WorkCenter) {
    setSelected(center)
    setFormOpen(true)
  }

  function handleDeleteClick(center: WorkCenter) {
    setSelected(center)
    setDeleteOpen(true)
  }

  function handleSave(values: WorkCenterFormValues) {
    const countryLabel = COUNTRIES.find((c) => c.value === values.country)?.label ?? values.country
    if (selected) {
      setCenters((prev) =>
        prev.map((c) =>
          c.id === selected.id ? { ...c, ...values, country: countryLabel } : c
        )
      )
    } else {
      const newCenter: WorkCenter = {
        id: `wc-${Date.now()}`,
        ...values,
        country: countryLabel,
        employee_count: 0,
      }
      setCenters((prev) => [...prev, newCenter])
    }
  }

  function handleDeleteConfirm() {
    if (selected) {
      setCenters((prev) => prev.filter((c) => c.id !== selected.id))
      setSelected(null)
    }
    setDeleteOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="label-lg font-semibold text-foreground">Centros de trabajo</h2>
          <p className="paragraph-sm text-muted-foreground">
            {centers.length} centro{centers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleNew}>
          <PlusIcon className="size-4" />
          Nuevo centro
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Empleados</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground paragraph-sm">
                  No hay centros de trabajo. Crea el primero.
                </TableCell>
              </TableRow>
            ) : (
              centers.map((center) => (
                <TableRow key={center.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="size-4 text-muted-foreground shrink-0" />
                      <span className="label-md font-medium text-foreground">{center.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-muted-foreground">{center.address}</span>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-foreground">{center.city}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">
                      {center.employee_count} empleado{center.employee_count !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        onClick={() => handleEdit(center)}
                        tooltip="Editar"
                      >
                        <PencilSimpleIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        onClick={() => handleDeleteClick(center)}
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
      <WorkCenterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        center={selected}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        center={selected}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
