'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Progress } from '@clasing/ui/progress'
import { Textarea } from '@clasing/ui/textarea'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  SunIcon,
  CalendarXIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import { MOCK_ABSENCE_REQUESTS, MOCK_ABSENCE_TYPES, MOCK_VACATION_BALANCES } from '@/lib/mock/absences'
import type { AbsenceRequest, AbsenceStatus } from '@/lib/types/absences'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-1'

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function calcBusinessDays(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (e < s) return 0
  let count = 0
  const cur = new Date(s)
  while (cur <= e) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

// ─── Form schema ──────────────────────────────────────────────────────────────

const absenceRequestSchema = z.object({
  absence_type_id: z.string().min(1, 'Selecciona un tipo de ausencia'),
  start_date: z.string().min(1, 'La fecha de inicio es obligatoria'),
  end_date: z.string().min(1, 'La fecha de fin es obligatoria'),
  notes: z.string().optional(),
})
type AbsenceRequestForm = z.infer<typeof absenceRequestSchema>

// ─── Multi-step dialog ────────────────────────────────────────────────────────

function RequestDialog({
  open,
  onClose,
  onSubmit: onSubmitProp,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: AbsenceRequestForm) => void
}) {
  const [step, setStep] = useState(1)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<AbsenceRequestForm>({
    resolver: zodResolver(absenceRequestSchema),
    defaultValues: { absence_type_id: '', start_date: '', end_date: '', notes: '' },
  })

  const watchedTypeId = watch('absence_type_id')
  const watchedStart = watch('start_date')
  const watchedEnd = watch('end_date')

  const selectedType = MOCK_ABSENCE_TYPES.find((t) => t.id === watchedTypeId)
  const calculatedDays = calcBusinessDays(watchedStart, watchedEnd)

  function handleNext() {
    if (step === 1) {
      if (!watchedTypeId) return
      setStep(2)
    } else if (step === 2) {
      if (!watchedStart || !watchedEnd) return
      setStep(3)
    }
  }

  function handleBack() {
    setStep((s) => s - 1)
  }

  function handleClose() {
    reset()
    setStep(1)
    onClose()
  }

  function onSubmit(data: AbsenceRequestForm) {
    onSubmitProp(data)
    reset()
    setStep(1)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) handleClose() }}>
      <DialogContent showCloseButton className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar ausencia</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'size-7 rounded-full flex items-center justify-center label-xs font-semibold',
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={cn('h-px w-8', step > s ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          ))}
          <div className="ml-2">
            <span className="paragraph-xs text-muted-foreground">
              {step === 1 ? 'Tipo de ausencia' : step === 2 ? 'Fechas' : 'Confirmación'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Type selection */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {MOCK_ABSENCE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setValue('absence_type_id', type.id)}
                  className={cn(
                    'rounded-xl border-2 p-3 text-left transition-all',
                    watchedTypeId === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/40 bg-background'
                  )}
                >
                  <div
                    className="size-8 rounded-lg mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    <span className="size-3 rounded-full" style={{ backgroundColor: type.color }} />
                  </div>
                  <p className="label-sm font-medium text-foreground leading-tight">{type.name}</p>
                  <p className="paragraph-xs text-muted-foreground mt-0.5">
                    {type.paid ? 'Remunerado' : 'Sin remunerar'}
                    {type.max_days_per_year != null && ` · ${type.max_days_per_year}d/año`}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div className="space-y-4">
              {selectedType && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
                  <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: selectedType.color }} />
                  <span className="label-sm font-medium text-foreground">{selectedType.name}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-sm font-medium text-foreground block mb-1.5">
                    Inicio <span className="text-destructive">*</span>
                  </label>
                  <Input {...register('start_date')} type="date" size="md" />
                  {errors.start_date && (
                    <p className="paragraph-xs text-destructive mt-1">{errors.start_date.message}</p>
                  )}
                </div>
                <div>
                  <label className="label-sm font-medium text-foreground block mb-1.5">
                    Fin <span className="text-destructive">*</span>
                  </label>
                  <Input {...register('end_date')} type="date" size="md" />
                  {errors.end_date && (
                    <p className="paragraph-xs text-destructive mt-1">{errors.end_date.message}</p>
                  )}
                </div>
              </div>
              {watchedStart && watchedEnd && calculatedDays > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-info/10 border border-info/20">
                  <CalendarXIcon className="size-4 text-info-foreground shrink-0" />
                  <p className="paragraph-sm text-foreground">
                    <span className="font-medium">
                      {calculatedDays} día{calculatedDays !== 1 ? 's' : ''} laborable{calculatedDays !== 1 ? 's' : ''}
                    </span>
                  </p>
                </div>
              )}
              <div>
                <label className="label-sm font-medium text-foreground block mb-1.5">
                  Notas (opcional)
                </label>
                <Textarea
                  {...register('notes')}
                  placeholder="Añade información adicional..."
                  resize="none"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedType && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: selectedType.color }} />
                  <span className="label-md font-semibold text-foreground">{selectedType.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="paragraph-xs text-muted-foreground mb-0.5">Inicio</p>
                    <p className="label-sm font-medium text-foreground">{formatDate(watchedStart)}</p>
                  </div>
                  <div>
                    <p className="paragraph-xs text-muted-foreground mb-0.5">Fin</p>
                    <p className="label-sm font-medium text-foreground">{formatDate(watchedEnd)}</p>
                  </div>
                  <div>
                    <p className="paragraph-xs text-muted-foreground mb-0.5">Días laborables</p>
                    <p className="label-sm font-semibold text-foreground">{calculatedDays}</p>
                  </div>
                  <div>
                    <p className="paragraph-xs text-muted-foreground mb-0.5">Aprobación</p>
                    <Badge
                      variant={selectedType.requires_approval ? 'warning' : 'success'}
                      size="xs"
                    >
                      {selectedType.requires_approval ? 'Requiere aprobación' : 'Automático'}
                    </Badge>
                  </div>
                </div>
                {watch('notes') && (
                  <div>
                    <p className="paragraph-xs text-muted-foreground mb-0.5">Notas</p>
                    <p className="paragraph-sm text-foreground">{watch('notes')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            {step > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeftIcon className="size-4" />
                Atrás
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={step === 1 && !watchedTypeId}
              >
                Siguiente
                <ArrowRightIcon className="size-4" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="sm">
                <CheckCircleIcon className="size-4" />
                Enviar solicitud
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeAbsencesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [myRequests, setMyRequests] = useState<AbsenceRequest[]>(
    MOCK_ABSENCE_REQUESTS.filter((r) => r.employee_id === CURRENT_EMPLOYEE_ID)
  )

  const balance = MOCK_VACATION_BALANCES.find((b) => b.employee_id === CURRENT_EMPLOYEE_ID)

  function handleSubmitRequest(data: AbsenceRequestForm) {
    const type = MOCK_ABSENCE_TYPES.find((t) => t.id === data.absence_type_id)
    if (!type) return
    const days = calcBusinessDays(data.start_date, data.end_date)
    const newRequest: AbsenceRequest = {
      id: `ar-new-${Date.now()}`,
      employee_id: CURRENT_EMPLOYEE_ID,
      employee_name: 'Carlos Martínez',
      absence_type_id: type.id,
      absence_type_name: type.name,
      absence_type_color: type.color,
      start_date: data.start_date,
      end_date: data.end_date,
      days,
      status: 'pending',
      notes: data.notes,
      created_at: new Date().toISOString(),
    }
    setMyRequests((prev) => [newRequest, ...prev])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Mis Ausencias</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Solicitudes y balance de vacaciones
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setDialogOpen(true)}>
          <PlusIcon className="size-4" />
          Solicitar ausencia
        </Button>
      </div>

      {/* Vacation balance */}
      {balance && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
              <SunIcon className="size-4 text-warning-foreground" />
              Balance de vacaciones {balance.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">{balance.total_days}</p>
                <p className="paragraph-xs text-muted-foreground">Total días</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-success-foreground">{balance.used_days}</p>
                <p className="paragraph-xs text-muted-foreground">Disfrutados</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-warning-foreground">{balance.pending_days}</p>
                <p className="paragraph-xs text-muted-foreground">Pendientes</p>
              </div>
              <div className="text-center">
                <p className="title-2xs font-semibold text-foreground">{balance.remaining_days}</p>
                <p className="paragraph-xs text-muted-foreground">Disponibles</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between mb-1">
                <span className="paragraph-xs text-muted-foreground">Uso vacaciones</span>
                <span className="paragraph-xs text-foreground font-medium">
                  {balance.used_days + balance.pending_days}/{balance.total_days} días
                </span>
              </div>
              <Progress
                value={((balance.used_days + balance.pending_days) / balance.total_days) * 100}
                className="h-2"
              />
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 paragraph-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary inline-block" />
                  Disfrutados
                </span>
                <span className="flex items-center gap-1.5 paragraph-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-warning inline-block" />
                  En solicitud
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My requests */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <CalendarXIcon className="size-4 text-muted-foreground" />
            Mis solicitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <CalendarXIcon className="size-10 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">No tienes solicitudes aún</p>
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                Solicitar primera ausencia
              </Button>
            </div>
          ) : (
            <div>
              {myRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <div
                    className="size-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${r.absence_type_color}20` }}
                  >
                    <span className="size-3 rounded-full" style={{ backgroundColor: r.absence_type_color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="label-sm font-medium text-foreground">{r.absence_type_name}</p>
                    <p className="paragraph-xs text-muted-foreground">
                      {formatDate(r.start_date)}
                      {r.start_date !== r.end_date && ` – ${formatDate(r.end_date)}`}
                      {' · '}{r.days} día{r.days !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANTS[r.status]} size="sm">
                    {STATUS_LABELS[r.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Types overview */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground">
            Tipos de ausencia disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {MOCK_ABSENCE_TYPES.filter((t) => t.paid).map((type) => (
              <div
                key={type.id}
                className="rounded-xl border border-border p-3 hover:bg-muted/20 transition-colors cursor-default"
              >
                <div
                  className="size-8 rounded-lg mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <span className="size-3 rounded-full" style={{ backgroundColor: type.color }} />
                </div>
                <p className="label-sm font-medium text-foreground leading-tight">{type.name}</p>
                {type.max_days_per_year != null && (
                  <p className="paragraph-xs text-muted-foreground mt-0.5">
                    Hasta {type.max_days_per_year} días/año
                  </p>
                )}
                <Badge
                  variant={type.requires_approval ? 'warning' : 'success'}
                  size="xs"
                  className="mt-1"
                >
                  {type.requires_approval ? 'Con aprobación' : 'Automático'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmitRequest}
      />
    </div>
  )
}
