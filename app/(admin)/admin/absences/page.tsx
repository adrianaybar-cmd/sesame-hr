'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@clasing/ui/table'
import { Input } from '@clasing/ui/input'
import { Textarea } from '@clasing/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Switch } from '@clasing/ui/switch'
import {
  PlusIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarXIcon,
} from '@phosphor-icons/react'
import { MOCK_ABSENCE_REQUESTS, MOCK_ABSENCE_TYPES } from '@/lib/mock/absences'
import type { AbsenceRequest, AbsenceType, AbsenceStatus } from '@/lib/types/absences'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AbsenceStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
}

const STATUS_VARIANTS: Record<AbsenceStatus, 'warning' | 'success' | 'error' | 'neutral'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'neutral',
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday=0
}

// ─── Calendar Tab ─────────────────────────────────────────────────────────────

function CalendarTab({ requests }: { requests: AbsenceRequest[] }) {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(3) // April (0-indexed)

  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = getFirstDayOfWeek(year, month)
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  function getEventsForDay(day: number): AbsenceRequest[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return requests.filter((r) => {
      if (r.status === 'rejected' || r.status === 'cancelled') return false
      return r.start_date <= dateStr && r.end_date >= dateStr
    })
  }

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="outline" size="sm" iconOnly onClick={prev}>
          <span className="label-xs">{'<'}</span>
        </Button>
        <span className="label-md font-semibold text-foreground min-w-32 text-center">
          {MONTH_NAMES[month]} {year}
        </span>
        <Button variant="outline" size="sm" iconOnly onClick={next}>
          <span className="label-xs">{'>'}</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
            <div key={d} className="py-2 text-center label-xs font-semibold text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }, (_, i) => {
            const day = i - firstDayOfWeek + 1
            const isValid = day >= 1 && day <= daysInMonth
            const events = isValid ? getEventsForDay(day) : []
            const isToday = year === 2026 && month === 3 && day === 12

            return (
              <div
                key={i}
                className={cn(
                  'min-h-[80px] p-1.5 border-b border-r border-border last:border-r-0',
                  '[&:nth-child(7n)]:border-r-0',
                  !isValid && 'bg-muted/20',
                  isToday && 'bg-primary/5'
                )}
              >
                {isValid && (
                  <>
                    <span
                      className={cn(
                        'label-xs font-medium block mb-1 w-6 h-6 flex items-center justify-center rounded-full',
                        isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                      )}
                    >
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {events.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="truncate rounded px-1 py-0.5"
                          style={{ backgroundColor: `${ev.absence_type_color}20`, borderLeft: `2px solid ${ev.absence_type_color}` }}
                          title={`${ev.employee_name} — ${ev.absence_type_name}`}
                        >
                          <span className="paragraph-xs truncate" style={{ color: ev.absence_type_color }}>
                            {ev.employee_name.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                      {events.length > 3 && (
                        <span className="paragraph-xs text-muted-foreground">+{events.length - 3} más</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Review schema ────────────────────────────────────────────────────────────

const reviewSchema = z.object({
  comment: z.string().optional(),
})
type ReviewForm = z.infer<typeof reviewSchema>

// ─── List Tab ─────────────────────────────────────────────────────────────────

function ListTab({ requests, onUpdate }: { requests: AbsenceRequest[]; onUpdate: (id: string, status: AbsenceStatus) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selected, setSelected] = useState<AbsenceRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<ReviewForm>({ resolver: zodResolver(reviewSchema) })

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      const matchType = typeFilter === 'all' || r.absence_type_id === typeFilter
      return matchStatus && matchType
    })
  }, [requests, statusFilter, typeFilter])

  function openDialog(r: AbsenceRequest) {
    setSelected(r)
    setDialogOpen(true)
  }

  function handleAction(action: 'approved' | 'rejected') {
    handleSubmit(() => {
      if (!selected) return
      onUpdate(selected.id, action)
      reset()
      setDialogOpen(false)
    })()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {MOCK_ABSENCE_TYPES.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="paragraph-xs text-muted-foreground self-center ml-auto">
          {filtered.length} solicitudes
        </span>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <span className="label-xs font-semibold text-foreground">{getInitials(r.employee_name)}</span>
                    </div>
                    <span className="label-sm font-medium text-foreground">{r.employee_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: r.absence_type_color }}
                    />
                    <span className="paragraph-sm text-foreground">{r.absence_type_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="paragraph-sm text-foreground tabular-nums">
                    {formatDate(r.start_date)}
                    {r.start_date !== r.end_date && ` – ${formatDate(r.end_date)}`}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="label-sm font-medium text-foreground">{r.days}d</span>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[r.status]} size="sm">
                    {STATUS_LABELS[r.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button variant={r.status === 'pending' ? 'outline' : 'ghost'} size="xs" onClick={() => openDialog(r)}>
                      {r.status === 'pending' ? 'Revisar' : 'Ver'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(v: boolean) => { if (!v) { reset(); setDialogOpen(false) } }}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Solicitud de ausencia</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-9 rounded-full bg-accent flex items-center justify-center">
                  <span className="label-sm font-semibold text-foreground">{getInitials(selected.employee_name)}</span>
                </div>
                <div className="flex-1">
                  <p className="label-md font-medium text-foreground">{selected.employee_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: selected.absence_type_color }} />
                    <p className="paragraph-xs text-muted-foreground">{selected.absence_type_name}</p>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANTS[selected.status]} size="xs">
                  {STATUS_LABELS[selected.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="label-xs text-muted-foreground mb-1">Inicio</p>
                  <p className="label-sm font-medium text-foreground">{formatDate(selected.start_date)}</p>
                </div>
                <div>
                  <p className="label-xs text-muted-foreground mb-1">Fin</p>
                  <p className="label-sm font-medium text-foreground">{formatDate(selected.end_date)}</p>
                </div>
                <div>
                  <p className="label-xs text-muted-foreground mb-1">Días</p>
                  <p className="label-sm font-medium text-foreground">{selected.days} días laborables</p>
                </div>
              </div>
              {selected.notes && (
                <div>
                  <p className="label-xs text-muted-foreground mb-1">Notas</p>
                  <p className="paragraph-sm text-foreground bg-muted/40 rounded-lg p-3">{selected.notes}</p>
                </div>
              )}
              {selected.status === 'pending' && (
                <div>
                  <label className="label-sm font-medium text-foreground block mb-1.5">Comentario (opcional)</label>
                  <Textarea {...register('comment')} placeholder="Añade un comentario..." resize="none" rows={2} />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { reset(); setDialogOpen(false) }}>
              {selected?.status === 'pending' ? 'Cancelar' : 'Cerrar'}
            </Button>
            {selected?.status === 'pending' && (
              <>
                <Button variant="destructive" size="sm" onClick={() => handleAction('rejected')}>
                  <XCircleIcon className="size-4" />
                  Rechazar
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleAction('approved')}>
                  <CheckCircleIcon className="size-4" />
                  Aprobar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Absence type schema ──────────────────────────────────────────────────────

const typeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  color: z.string().min(4, 'El color es obligatorio'),
  requires_approval: z.boolean(),
  max_days_per_year: z.string().optional(),
  paid: z.boolean(),
})
type AbsenceTypeForm = z.infer<typeof typeSchema>

// ─── Types Tab ────────────────────────────────────────────────────────────────

function TypesTab() {
  const [types, setTypes] = useState<AbsenceType[]>(MOCK_ABSENCE_TYPES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<AbsenceType | null>(null)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<AbsenceTypeForm>({
    resolver: zodResolver(typeSchema),
    defaultValues: { name: '', color: '#3B82F6', requires_approval: true, paid: true },
  })

  function openCreate() {
    setEditingType(null)
    reset({ name: '', color: '#3B82F6', requires_approval: true, paid: true })
    setDialogOpen(true)
  }

  function openEdit(t: AbsenceType) {
    setEditingType(t)
    reset({
      name: t.name,
      color: t.color,
      requires_approval: t.requires_approval,
      max_days_per_year: t.max_days_per_year?.toString(),
      paid: t.paid,
    })
    setDialogOpen(true)
  }

  function onSubmit(data: AbsenceTypeForm) {
    const newType: AbsenceType = {
      id: editingType?.id ?? `at-${Date.now()}`,
      name: data.name,
      type: editingType?.type ?? 'other',
      color: data.color,
      requires_approval: data.requires_approval,
      max_days_per_year: data.max_days_per_year ? parseInt(data.max_days_per_year) : undefined,
      paid: data.paid,
      icon: editingType?.icon ?? 'dots',
    }
    setTypes((prev) => {
      const idx = prev.findIndex((t) => t.id === newType.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = newType; return next }
      return [...prev, newType]
    })
    reset()
    setDialogOpen(false)
  }

  const requiresApproval = watch('requires_approval')
  const isPaid = watch('paid')

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Nuevo tipo
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de ausencia</TableHead>
              <TableHead>Máx. días/año</TableHead>
              <TableHead>Aprobación</TableHead>
              <TableHead>Remunerado</TableHead>
              <TableHead className="w-20 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="label-sm font-medium text-foreground">{t.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="paragraph-sm text-foreground">
                    {t.max_days_per_year ?? '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={t.requires_approval ? 'warning' : 'neutral'} size="sm">
                    {t.requires_approval ? 'Requiere' : 'Automático'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.paid ? 'success' : 'neutral'} size="sm">
                    {t.paid ? 'Remunerado' : 'Sin remunerar'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="xs" iconOnly onClick={() => openEdit(t)} tooltip="Editar">
                      <PencilIcon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(v: boolean) => { if (!v) { reset(); setDialogOpen(false) } }}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingType ? 'Editar tipo' : 'Nuevo tipo de ausencia'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input {...register('name')} placeholder="Ej: Vacaciones" size="md" />
              {errors.name && <p className="paragraph-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-sm font-medium text-foreground block mb-1.5">Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" {...register('color')} className="size-9 rounded cursor-pointer border border-border" />
                  <Input {...register('color')} placeholder="#3B82F6" size="md" />
                </div>
              </div>
              <div>
                <label className="label-sm font-medium text-foreground block mb-1.5">Máx. días/año</label>
                <Input
                  {...register('max_days_per_year')}
                  type="number"
                  placeholder="Sin límite"
                  size="md"
                  min={1}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="label-sm font-medium text-foreground">Requiere aprobación</p>
                <p className="paragraph-xs text-muted-foreground">El responsable debe aprobar la solicitud</p>
              </div>
              <Switch
                checked={requiresApproval}
                onCheckedChange={(v) => setValue('requires_approval', v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="label-sm font-medium text-foreground">Remunerado</p>
                <p className="paragraph-xs text-muted-foreground">El empleado cobra durante esta ausencia</p>
              </div>
              <Switch
                checked={isPaid}
                onCheckedChange={(v) => setValue('paid', v)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => { reset(); setDialogOpen(false) }}>Cancelar</Button>
              <Button type="submit" variant="primary" size="sm">
                {editingType ? 'Guardar cambios' : 'Crear tipo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAbsencesPage() {
  const [requests, setRequests] = useState<AbsenceRequest[]>(MOCK_ABSENCE_REQUESTS)

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  function updateRequest(id: string, status: AbsenceStatus) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, approved_at: new Date().toISOString(), approved_by: 'Admin' }
          : r
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Ausencias</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestiona vacaciones y ausencias del equipo
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="warning" size="md">
            <CalendarXIcon className="size-3.5 mr-1" />
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="calendar">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <TabsList size="sm" {...({} as any)}>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="types">Tipos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <Card className="border-border">
            <CardContent className="pt-4">
              <CalendarTab requests={requests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <ListTab requests={requests} onUpdate={updateRequest} />
        </TabsContent>

        <TabsContent value="types" className="mt-4">
          <TypesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
