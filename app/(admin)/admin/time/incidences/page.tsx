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
import { Textarea } from '@clasing/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@clasing/ui/table'
import {
  WarningCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { MOCK_INCIDENCES } from '@/lib/mock/time'
import type { ClockIncidence } from '@/lib/types/time'

// ─── Types ────────────────────────────────────────────────────────────────────

type IncidenceWithStatus = ClockIncidence & { _localStatus?: 'approved' | 'rejected' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INCIDENCE_TYPE_LABELS: Record<ClockIncidence['type'], string> = {
  missing_exit: 'Falta salida',
  retroactive_request: 'Solicitud retroactiva',
  anomaly: 'Anomalía',
  overtime: 'Horas extra',
}

const INCIDENCE_STATUS_LABELS: Record<ClockIncidence['status'], string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
}

const INCIDENCE_STATUS_VARIANTS: Record<ClockIncidence['status'], 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

function formatISODate(iso?: string): string {
  if (!iso) return '-'
  const d = new Date(iso)
  const date = `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')}/${d.getUTCFullYear()}`
  const time = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
  return `${date} ${time}`
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// ─── Review schema ────────────────────────────────────────────────────────────

const reviewSchema = z.object({
  comment: z.string().min(1, 'El comentario es obligatorio'),
})
type ReviewForm = z.infer<typeof reviewSchema>

// ─── Dialog ───────────────────────────────────────────────────────────────────

function ReviewDialog({
  incidence,
  open,
  onClose,
  onResolve,
}: {
  incidence: ClockIncidence | null
  open: boolean
  onClose: () => void
  onResolve: (id: string, action: 'approved' | 'rejected', comment: string) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({ resolver: zodResolver(reviewSchema) })

  function submit(action: 'approved' | 'rejected') {
    return handleSubmit((data) => {
      if (!incidence) return
      onResolve(incidence.id, action, data.comment)
      reset()
      onClose()
    })()
  }

  if (!incidence) return null

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) { reset(); onClose() } }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Revisar incidencia</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
            <div className="size-9 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="label-sm font-semibold text-foreground">
                {getInitials(incidence.employee_name)}
              </span>
            </div>
            <div>
              <p className="label-md font-medium text-foreground">{incidence.employee_name}</p>
              <p className="paragraph-xs text-muted-foreground">{formatDate(incidence.date)}</p>
            </div>
            <Badge
              variant={INCIDENCE_STATUS_VARIANTS[incidence.status]}
              size="xs"
              className="ml-auto"
            >
              {INCIDENCE_STATUS_LABELS[incidence.status]}
            </Badge>
          </div>

          {/* Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="label-xs text-muted-foreground mb-1">Tipo</p>
              <p className="label-sm font-medium text-foreground">
                {INCIDENCE_TYPE_LABELS[incidence.type]}
              </p>
            </div>
            {incidence.requested_entry && (
              <div>
                <p className="label-xs text-muted-foreground mb-1">Entrada solicitada</p>
                <p className="label-sm font-medium text-foreground tabular-nums">
                  {formatISODate(incidence.requested_entry)}
                </p>
              </div>
            )}
            {incidence.requested_exit && (
              <div>
                <p className="label-xs text-muted-foreground mb-1">Salida solicitada</p>
                <p className="label-sm font-medium text-foreground tabular-nums">
                  {formatISODate(incidence.requested_exit)}
                </p>
              </div>
            )}
          </div>

          {/* Employee notes */}
          {incidence.notes && (
            <div>
              <p className="label-xs text-muted-foreground mb-1">Notas del empleado</p>
              <p className="paragraph-sm text-foreground bg-muted/40 rounded-lg p-3">
                {incidence.notes}
              </p>
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">
              Comentario del revisor <span className="text-destructive">*</span>
            </label>
            <Textarea
              {...register('comment')}
              placeholder="Escribe un comentario..."
              resize="none"
              rows={3}
            />
            {errors.comment && (
              <p className="paragraph-xs text-destructive mt-1">{errors.comment.message}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => { reset(); onClose() }}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => submit('rejected')}
          >
            <XCircleIcon className="size-4" />
            Rechazar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => submit('approved')}
          >
            <CheckCircleIcon className="size-4" />
            Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IncidencesPage() {
  const [incidences, setIncidences] = useState<IncidenceWithStatus[]>(MOCK_INCIDENCES)
  const [selected, setSelected] = useState<ClockIncidence | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const pendingCount = incidences.filter((i) => i.status === 'pending').length

  function openReview(inc: ClockIncidence) {
    setSelected(inc)
    setDialogOpen(true)
  }

  function handleResolve(id: string, action: 'approved' | 'rejected') {
    setIncidences((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: action, reviewed_at: new Date().toISOString() } : inc
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="sm" iconOnly asChild>
          <Link href="/admin/time">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="title-2xs font-semibold text-foreground">Incidencias de fichaje</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestiona las solicitudes de corrección y anomalías
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="warning" size="md">
            <WarningCircleIcon className="size-3.5 mr-1" />
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            Todas las incidencias
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-24 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidences.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <span className="label-xs font-semibold text-foreground">
                          {getInitials(inc.employee_name)}
                        </span>
                      </div>
                      <span className="label-sm font-medium text-foreground">
                        {inc.employee_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="label-sm text-foreground tabular-nums">
                      {formatDate(inc.date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-foreground">
                      {INCIDENCE_TYPE_LABELS[inc.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="paragraph-xs text-muted-foreground max-w-48 truncate">
                      {inc.notes ?? '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={INCIDENCE_STATUS_VARIANTS[inc.status]} size="sm">
                      {INCIDENCE_STATUS_LABELS[inc.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {inc.status === 'pending' ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => openReview(inc)}
                        >
                          Revisar
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openReview(inc)}
                        >
                          Ver
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReviewDialog
        incidence={selected}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onResolve={handleResolve}
      />
    </div>
  )
}
