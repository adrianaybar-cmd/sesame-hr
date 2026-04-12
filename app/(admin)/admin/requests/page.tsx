'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilSimpleIcon,
  TrashIcon,
  ToggleRightIcon,
  CalendarIcon,
  UserIcon,
  NoteIcon,
} from '@phosphor-icons/react'
import { MOCK_REQUESTS, MOCK_REQUEST_TYPES } from '@/lib/mock/requests'
import type { CustomRequest, CustomRequestStatus, CustomRequestType, FormFieldDefinition } from '@/lib/types/requests'
import { cn } from '@/lib/utils'

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

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// ─── Review Dialog ────────────────────────────────────────────────────────────

function ReviewDialog({
  request,
  open,
  onClose,
}: {
  request: CustomRequest
  open: boolean
  onClose: () => void
}) {
  const [response, setResponse] = useState(request.response ?? '')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const requestType = MOCK_REQUEST_TYPES.find((t) => t.id === request.request_type_id)
  const fields = requestType?.form_fields ?? []

  function getFieldLabel(fieldId: string) {
    return fields.find((f) => f.id === fieldId)?.label ?? fieldId
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {request.request_type_icon} {request.request_type_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-accent flex items-center justify-center">
                <span className="label-xs font-semibold text-foreground">{getInitials(request.employee_name)}</span>
              </div>
              <span className="label-sm font-medium text-foreground">{request.employee_name}</span>
            </div>
            <Badge variant={STATUS_VARIANTS[request.status]} size="sm">{STATUS_LABELS[request.status]}</Badge>
            <span className="label-xs text-muted-foreground">{formatDateShort(request.submitted_at ?? request.created_at)}</span>
          </div>

          {/* Form data */}
          <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
            <p className="label-sm font-semibold text-foreground">Datos de la solicitud</p>
            {Object.entries(request.form_data).map(([key, val]) => (
              <div key={key}>
                <p className="label-xs text-muted-foreground">{getFieldLabel(key)}</p>
                <p className="paragraph-sm text-foreground font-medium">
                  {val === true ? 'Sí' : val === false ? 'No' : String(val || '—')}
                </p>
              </div>
            ))}
          </div>

          {/* Response */}
          {(request.status === 'submitted' || request.status === 'in_review') && (
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Respuesta / comentario</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 paragraph-sm text-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Añade un comentario para el empleado..."
              />
            </div>
          )}

          {/* Previous response */}
          {request.response && request.status !== 'submitted' && request.status !== 'in_review' && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="label-xs text-muted-foreground mb-1">Respuesta emitida</p>
              <p className="paragraph-sm text-foreground">{request.response}</p>
              {request.reviewed_by && (
                <p className="label-xs text-muted-foreground mt-2">Por {request.reviewed_by} · {formatDateShort(request.reviewed_at)}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md" onClick={onClose}>Cerrar</Button>
          </DialogClose>
          {(request.status === 'submitted' || request.status === 'in_review') && (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={() => { setAction('reject'); onClose() }}
                className="border-destructive-foreground text-destructive-foreground hover:bg-destructive/10"
              >
                <XIcon className="size-4" />
                Rechazar
              </Button>
              <Button variant="primary" size="md" onClick={() => { setAction('approve'); onClose() }}>
                <CheckIcon className="size-4" />
                Aprobar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Request row ──────────────────────────────────────────────────────────────

function RequestRow({ request, onReview }: { request: CustomRequest; onReview: (r: CustomRequest) => void }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
      <div className="size-9 rounded-lg bg-card border border-border flex items-center justify-center text-lg shrink-0">
        {request.request_type_icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="label-sm font-semibold text-foreground">{request.request_type_name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="paragraph-xs text-muted-foreground">{request.employee_name}</span>
          <span className="text-border">·</span>
          <span className="paragraph-xs text-muted-foreground">{formatDateShort(request.submitted_at ?? request.created_at)}</span>
        </div>
      </div>
      <Badge variant={STATUS_VARIANTS[request.status]} size="sm">{STATUS_LABELS[request.status]}</Badge>
      <Button variant="ghost" size="xs" onClick={() => onReview(request)}>
        <EyeIcon className="size-4" />
        Ver
      </Button>
    </div>
  )
}

// ─── Tab: Pendientes ─────────────────────────────────────────────────────────

function TabPendientes({ onReview }: { onReview: (r: CustomRequest) => void }) {
  const pending = MOCK_REQUESTS.filter((r) => r.status === 'submitted' || r.status === 'in_review')

  if (pending.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 flex flex-col items-center gap-3">
          <CheckIcon className="size-10 text-muted-foreground" />
          <p className="label-md font-medium text-foreground">Sin solicitudes pendientes</p>
          <p className="paragraph-sm text-muted-foreground">Todas las solicitudes están al día.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold">
          Solicitudes pendientes ({pending.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {pending.map((r) => <RequestRow key={r.id} request={r} onReview={onReview} />)}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Todas ──────────────────────────────────────────────────────────────

function TabTodas({ onReview }: { onReview: (r: CustomRequest) => void }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<CustomRequestStatus | 'all'>('all')

  const filtered = MOCK_REQUESTS.filter((r) => {
    const matchesSearch =
      !search ||
      r.request_type_name.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Input
            placeholder="Buscar solicitudes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<MagnifyingGlassIcon />}
            iconPosition="left"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'submitted', 'in_review', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-full label-xs font-medium transition-colors',
                filterStatus === s
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {s === 'all' ? 'Todas' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <NoteIcon className="size-10 text-muted-foreground" />
              <p className="label-md font-medium text-foreground">Sin resultados</p>
            </div>
          ) : (
            filtered.map((r) => <RequestRow key={r.id} request={r} onReview={onReview} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab: Tipos de solicitud ──────────────────────────────────────────────────

function TabTipos() {
  const [types, setTypes] = useState<CustomRequestType[]>(MOCK_REQUEST_TYPES)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [editingType, setEditingType] = useState<CustomRequestType | null>(null)
  const [newFields, setNewFields] = useState<FormFieldDefinition[]>([])
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeIcon, setNewTypeIcon] = useState('📋')
  const [newTypeDescription, setNewTypeDescription] = useState('')
  const [newTypeCategory, setNewTypeCategory] = useState('')

  function moveField(fields: FormFieldDefinition[], idx: number, dir: 'up' | 'down'): FormFieldDefinition[] {
    const arr = [...fields]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= arr.length) return arr;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]]
    return arr
  }

  function addField() {
    setNewFields([...newFields, {
      id: `ff-new-${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    }])
  }

  function resetDialog() {
    setNewTypeName('')
    setNewTypeIcon('📋')
    setNewTypeDescription('')
    setNewTypeCategory('')
    setNewFields([])
    setEditingType(null)
    setShowNewDialog(false)
  }

  function saveType() {
    if (editingType) {
      setTypes(types.map((t) =>
        t.id === editingType.id
          ? { ...editingType, name: newTypeName, icon: newTypeIcon, description: newTypeDescription, category: newTypeCategory, form_fields: newFields }
          : t
      ))
    } else {
      const newType: CustomRequestType = {
        id: `rt-${Date.now()}`,
        name: newTypeName,
        icon: newTypeIcon,
        description: newTypeDescription,
        category: newTypeCategory,
        form_fields: newFields,
        is_active: true,
        allow_attachments: false,
      }
      setTypes([...types, newType])
    }
    resetDialog()
  }

  function openEdit(type: CustomRequestType) {
    setEditingType(type)
    setNewTypeName(type.name)
    setNewTypeIcon(type.icon)
    setNewTypeDescription(type.description ?? '')
    setNewTypeCategory(type.category)
    setNewFields([...type.form_fields])
    setShowNewDialog(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="paragraph-sm text-muted-foreground">{types.length} tipos configurados</p>
        <Button variant="primary" size="md" onClick={() => { resetDialog(); setShowNewDialog(true) }}>
          <PlusIcon className="size-4" />
          Nuevo tipo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => (
          <Card key={type.id}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="label-md font-semibold text-foreground">{type.name}</p>
                    <Badge variant={type.is_active ? 'success' : 'neutral'} size="xs">
                      {type.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="paragraph-xs text-muted-foreground mt-0.5">{type.category}</p>
                  {type.description && <p className="paragraph-xs text-muted-foreground mt-1 line-clamp-2">{type.description}</p>}
                  <p className="label-xs text-muted-foreground mt-2">{type.form_fields.length} campo(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button variant="ghost" size="xs" onClick={() => openEdit(type)}>
                  <PencilSimpleIcon className="size-4" />
                  Editar
                </Button>
                <Button variant="ghost" size="xs" onClick={() => setTypes(types.map((t) => t.id === type.id ? { ...t, is_active: !t.is_active } : t))}>
                  <ToggleRightIcon className="size-4" />
                  {type.is_active ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New/Edit dialog */}
      <Dialog open={showNewDialog} onOpenChange={(v: boolean) => !v && resetDialog()}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingType ? 'Editar tipo de solicitud' : 'Nuevo tipo de solicitud'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Icono</label>
                <Input value={newTypeIcon} onChange={(e) => setNewTypeIcon(e.target.value)} className="text-center text-lg" />
              </div>
              <div className="col-span-3">
                <label className="label-xs text-muted-foreground mb-1 block">Nombre *</label>
                <Input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} placeholder="Ej: Cambio de horario" />
              </div>
            </div>
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Categoría</label>
              <Input value={newTypeCategory} onChange={(e) => setNewTypeCategory(e.target.value)} placeholder="Ej: Organización" />
            </div>
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Descripción</label>
              <Input value={newTypeDescription} onChange={(e) => setNewTypeDescription(e.target.value)} placeholder="Descripción breve..." />
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="label-sm font-semibold text-foreground">Campos del formulario</p>
                <Button variant="ghost" size="xs" onClick={addField}>
                  <PlusIcon className="size-4" />
                  Añadir campo
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {newFields.map((field, idx) => (
                  <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card">
                    <div className="flex flex-col gap-1 mr-1">
                      <button
                        onClick={() => setNewFields(moveField(newFields, idx, 'up'))}
                        disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUpIcon className="size-3" />
                      </button>
                      <button
                        onClick={() => setNewFields(moveField(newFields, idx, 'down'))}
                        disabled={idx === newFields.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDownIcon className="size-3" />
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={field.label}
                        onChange={(e) => setNewFields(newFields.map((f, i) => i === idx ? { ...f, label: e.target.value } : f))}
                        placeholder="Etiqueta del campo"
                        size="sm"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => setNewFields(newFields.map((f, i) => i === idx ? { ...f, type: e.target.value as FormFieldDefinition['type'] } : f))}
                        className="rounded-lg border border-border bg-background px-2 py-1 label-sm text-foreground"
                      >
                        {['text', 'textarea', 'date', 'select', 'number', 'checkbox'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setNewFields(newFields.filter((_, i) => i !== idx))}
                      className="text-muted-foreground hover:text-destructive-foreground mt-1"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ))}
                {newFields.length === 0 && (
                  <p className="paragraph-xs text-muted-foreground text-center py-4">Sin campos. Añade al menos uno.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="md" onClick={resetDialog}>Cancelar</Button>
            </DialogClose>
            <Button variant="primary" size="md" onClick={saveType} disabled={!newTypeName.trim()}>
              <CheckIcon className="size-4" />
              {editingType ? 'Guardar cambios' : 'Crear tipo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminRequestsPage() {
  const [reviewRequest, setReviewRequest] = useState<CustomRequest | null>(null)
  const pendingCount = MOCK_REQUESTS.filter((r) => r.status === 'submitted' || r.status === 'in_review').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Solicitudes personalizadas</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Gestiona las solicitudes de los empleados y configura los tipos disponibles.
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <TabsList size="md" {...({} as any)}>
          <TabsTrigger value="pendientes">
            Pendientes
            {pendingCount > 0 && (
              <Badge variant="info" size="xs" className="ml-1">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de solicitud</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="pendientes">
            <TabPendientes onReview={setReviewRequest} />
          </TabsContent>
          <TabsContent value="todas">
            <TabTodas onReview={setReviewRequest} />
          </TabsContent>
          <TabsContent value="tipos">
            <TabTipos />
          </TabsContent>
        </div>
      </Tabs>

      {reviewRequest && (
        <ReviewDialog
          request={reviewRequest}
          open={!!reviewRequest}
          onClose={() => setReviewRequest(null)}
        />
      )}
    </div>
  )
}
