'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PaperPlaneTiltIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_REQUEST_TYPES, MOCK_REQUESTS } from '@/lib/mock/requests'
import type { CustomRequest, CustomRequestStatus, CustomRequestType, FormFieldDefinition } from '@/lib/types/requests'
import { cn } from '@/lib/utils'

// Simula el empleado actual
const CURRENT_EMPLOYEE_ID = 'emp-6'
const CURRENT_EMPLOYEE_NAME = 'Sofía Moreno Jiménez'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<CustomRequestStatus, string> = {
  draft: 'Borrador',
  submitted: 'Enviada',
  in_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  closed: 'Cerrada',
}

const STATUS_VARIANTS: Record<CustomRequestStatus, 'neutral' | 'info' | 'in-progress' | 'success' | 'error' | 'secondary'> = {
  draft: 'neutral',
  submitted: 'info',
  in_review: 'in-progress',
  approved: 'success',
  rejected: 'error',
  closed: 'secondary',
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Dynamic form renderer ────────────────────────────────────────────────────

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: FormFieldDefinition
  value: unknown
  onChange: (val: unknown) => void
}) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-border size-4"
        />
        <span className="paragraph-sm text-foreground">{field.label}</span>
        {field.required && <span className="text-destructive-foreground label-xs">*</span>}
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="label-xs text-muted-foreground mb-1 block">
          {field.label}{field.required && <span className="text-destructive-foreground ml-1">*</span>}
        </label>
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Selecciona una opción...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="label-xs text-muted-foreground mb-1 block">
          {field.label}{field.required && <span className="text-destructive-foreground ml-1">*</span>}
        </label>
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 paragraph-sm text-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="label-xs text-muted-foreground mb-1 block">
        {field.label}{field.required && <span className="text-destructive-foreground ml-1">*</span>}
      </label>
      <Input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  )
}

// ─── New request dialog ────────────────────────────────────────────────────────

function NewRequestDialog({
  requestType,
  open,
  onClose,
  onSubmit,
}: {
  requestType: CustomRequestType | null
  open: boolean
  onClose: () => void
  onSubmit: (typeId: string, formData: Record<string, unknown>) => void
}) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  if (!requestType) return null

  function handleChange(fieldId: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  function canSubmit() {
    return requestType!.form_fields
      .filter((f) => f.required)
      .every((f) => {
        const v = formData[f.id]
        return v !== undefined && v !== '' && v !== false
      })
  }

  function handleSubmit() {
    onSubmit(requestType!.id, formData)
    setFormData({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {requestType.icon} {requestType.name}
          </DialogTitle>
        </DialogHeader>

        {requestType.description && (
          <p className="paragraph-sm text-muted-foreground -mt-2">{requestType.description}</p>
        )}

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {requestType.form_fields.map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(val) => handleChange(field.id, val)}
            />
          ))}
          {requestType.allow_attachments && (
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Adjuntos (opcional)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-accent/30 transition-colors">
                <PaperPlaneTiltIcon className="size-6 text-muted-foreground" />
                <p className="paragraph-sm text-muted-foreground">Arrastra archivos aquí o haz clic para subir</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md" onClick={onClose}>Cancelar</Button>
          </DialogClose>
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={!canSubmit()}>
            <PaperPlaneTiltIcon className="size-4" />
            Enviar solicitud
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Request detail dialog ────────────────────────────────────────────────────

function RequestDetailDialog({
  request,
  open,
  onClose,
}: {
  request: CustomRequest | null
  open: boolean
  onClose: () => void
}) {
  if (!request) return null
  const requestType = MOCK_REQUEST_TYPES.find((t) => t.id === request.request_type_id)
  const fields = requestType?.form_fields ?? []

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {request.request_type_icon} {request.request_type_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex items-center gap-3">
            <Badge variant={STATUS_VARIANTS[request.status]} size="sm">{STATUS_LABELS[request.status]}</Badge>
            <span className="label-xs text-muted-foreground">{formatDateShort(request.submitted_at ?? request.created_at)}</span>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
            <p className="label-sm font-semibold text-foreground">Mi solicitud</p>
            {Object.entries(request.form_data).map(([key, val]) => {
              const fieldLabel = fields.find((f) => f.id === key)?.label ?? key
              return (
                <div key={key}>
                  <p className="label-xs text-muted-foreground">{fieldLabel}</p>
                  <p className="paragraph-sm text-foreground font-medium">
                    {val === true ? 'Sí' : val === false ? 'No' : String(val || '—')}
                  </p>
                </div>
              )
            })}
          </div>

          {request.response && (
            <div className={cn(
              'rounded-lg border p-4',
              request.status === 'approved' ? 'border-green-600/30 bg-success dark:bg-success' : 'border-red-600/30 bg-destructive dark:bg-destructive'
            )}>
              <p className={cn('label-xs mb-1', request.status === 'approved' ? 'text-success-foreground' : 'text-destructive-foreground')}>
                {request.status === 'approved' ? 'Aprobada — Respuesta de RRHH' : 'Rechazada — Respuesta de RRHH'}
              </p>
              <p className="paragraph-sm text-foreground">{request.response}</p>
              {request.reviewed_by && (
                <p className="label-xs text-muted-foreground mt-1">Por {request.reviewed_by} · {formatDateShort(request.reviewed_at)}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md" onClick={onClose}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeRequestsPage() {
  const [selectedType, setSelectedType] = useState<CustomRequestType | null>(null)
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [detailRequest, setDetailRequest] = useState<CustomRequest | null>(null)
  const [myRequests, setMyRequests] = useState<CustomRequest[]>(
    MOCK_REQUESTS.filter((r) => r.employee_id === CURRENT_EMPLOYEE_ID)
  )

  function handleOpenRequestType(type: CustomRequestType) {
    setSelectedType(type)
    setNewRequestOpen(true)
  }

  function handleSubmitRequest(typeId: string, formData: Record<string, unknown>) {
    const type = MOCK_REQUEST_TYPES.find((t) => t.id === typeId)!
    const newRequest: CustomRequest = {
      id: `req-new-${Date.now()}`,
      request_type_id: typeId,
      request_type_name: type.name,
      request_type_icon: type.icon,
      employee_id: CURRENT_EMPLOYEE_ID,
      employee_name: CURRENT_EMPLOYEE_NAME,
      status: 'submitted',
      form_data: formData,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    setMyRequests([newRequest, ...myRequests])
  }

  const activeTypes = MOCK_REQUEST_TYPES.filter((t) => t.is_active)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mis solicitudes</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Realiza solicitudes a tu empresa de forma rápida y sencilla.
        </p>
      </div>

      {/* Request types grid */}
      <section>
        <h2 className="label-md font-semibold text-foreground mb-4">¿Qué necesitas?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleOpenRequestType(type)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-foreground/20 transition-all text-center active:scale-95"
            >
              <span className="text-3xl">{type.icon}</span>
              <p className="label-sm font-medium text-foreground leading-tight">{type.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* My requests */}
      <section>
        <h2 className="label-md font-semibold text-foreground mb-4">
          Mis solicitudes ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center gap-3">
              <ClockIcon className="size-10 text-muted-foreground" />
              <p className="label-md font-medium text-foreground">Sin solicitudes</p>
              <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
                Aún no has enviado ninguna solicitud. Elige una de las opciones de arriba.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {myRequests.map((req) => (
              <Card key={req.id}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{req.request_type_icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="label-sm font-semibold text-foreground">{req.request_type_name}</p>
                      <p className="label-xs text-muted-foreground">
                        {formatDateShort(req.submitted_at ?? req.created_at)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANTS[req.status]} size="sm">
                      {STATUS_LABELS[req.status]}
                    </Badge>
                    <Button variant="ghost" size="xs" onClick={() => setDetailRequest(req)}>
                      <ArrowRightIcon className="size-4" />
                    </Button>
                  </div>
                  {req.response && (
                    <div className={cn(
                      'mt-3 pt-3 border-t border-border',
                    )}>
                      <p className={cn(
                        'paragraph-xs',
                        req.status === 'approved' ? 'text-success-foreground' : 'text-destructive-foreground'
                      )}>
                        {req.status === 'approved' ? '✓ Aprobada: ' : '✗ Rechazada: '}
                        {req.response}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <NewRequestDialog
        requestType={selectedType}
        open={newRequestOpen}
        onClose={() => { setNewRequestOpen(false); setSelectedType(null) }}
        onSubmit={handleSubmitRequest}
      />

      <RequestDetailDialog
        request={detailRequest}
        open={!!detailRequest}
        onClose={() => setDetailRequest(null)}
      />
    </div>
  )
}
