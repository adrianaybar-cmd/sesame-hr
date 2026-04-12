'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  CheckIcon,
  XIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilSimpleIcon,
  TrashIcon,
  ToggleRightIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea'
type FieldModule = 'empleado' | 'solicitud'

interface CustomField {
  id: string
  name: string
  key: string
  type: FieldType
  module: FieldModule
  required: boolean
  active: boolean
  options?: string[]
  placeholder?: string
  created_at: string
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Texto',
  number: 'Número',
  date: 'Fecha',
  select: 'Lista desplegable',
  checkbox: 'Casilla',
  textarea: 'Texto largo',
}

const FIELD_TYPE_VARIANTS: Record<FieldType, 'info' | 'success' | 'warning' | 'secondary' | 'neutral' | 'in-progress'> = {
  text: 'info',
  number: 'success',
  date: 'warning',
  select: 'in-progress',
  checkbox: 'secondary',
  textarea: 'neutral',
}

const MODULE_LABELS: Record<FieldModule, string> = {
  empleado: 'Perfil de empleado',
  solicitud: 'Solicitudes',
}

const INITIAL_FIELDS: CustomField[] = [
  {
    id: 'cf-1',
    name: 'Número de talla (ropa)',
    key: 'clothing_size',
    type: 'select',
    module: 'empleado',
    required: false,
    active: true,
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    created_at: '2024-06-01',
  },
  {
    id: 'cf-2',
    name: 'Discapacidad reconocida',
    key: 'disability',
    type: 'checkbox',
    module: 'empleado',
    required: false,
    active: true,
    created_at: '2024-06-01',
  },
  {
    id: 'cf-3',
    name: 'Vehículo propio',
    key: 'has_vehicle',
    type: 'checkbox',
    module: 'empleado',
    required: false,
    active: true,
    created_at: '2024-07-15',
  },
  {
    id: 'cf-4',
    name: 'Número de seguridad privada',
    key: 'security_badge',
    type: 'text',
    module: 'empleado',
    required: false,
    active: false,
    placeholder: 'Número de habilitación',
    created_at: '2024-08-01',
  },
  {
    id: 'cf-5',
    name: 'Motivo detallado',
    key: 'detailed_reason',
    type: 'textarea',
    module: 'solicitud',
    required: false,
    active: true,
    placeholder: 'Describe con detalle...',
    created_at: '2024-09-10',
  },
  {
    id: 'cf-6',
    name: 'Coste estimado (€)',
    key: 'estimated_cost',
    type: 'number',
    module: 'solicitud',
    required: false,
    active: true,
    placeholder: '0',
    created_at: '2024-09-10',
  },
]

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({
  field,
  idx,
  total,
  onMoveUp,
  onMoveDown,
  onToggle,
  onDelete,
  onEdit,
}: {
  field: CustomField
  idx: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 border-b border-border last:border-0 transition-colors',
      !field.active && 'opacity-60 bg-muted/30'
    )}>
      {/* Move controls */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={onMoveUp}
          disabled={idx === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
        >
          <ArrowUpIcon className="size-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={idx === total - 1}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
        >
          <ArrowDownIcon className="size-3.5" />
        </button>
      </div>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="label-sm font-semibold text-foreground">{field.name}</p>
          {field.required && <Badge variant="warning" size="xs">Obligatorio</Badge>}
          {!field.active && <Badge variant="neutral" size="xs">Inactivo</Badge>}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <code className="label-xs text-muted-foreground bg-accent px-1.5 py-0.5 rounded font-mono">{field.key}</code>
          <Badge variant={FIELD_TYPE_VARIANTS[field.type]} size="xs">{FIELD_TYPE_LABELS[field.type]}</Badge>
          <Badge variant="secondary" size="xs">{MODULE_LABELS[field.module]}</Badge>
          {field.options && (
            <span className="label-xs text-muted-foreground">{field.options.length} opciones</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="xs" onClick={onEdit}>
          <PencilSimpleIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="xs" onClick={onToggle}>
          <ToggleRightIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="xs" onClick={onDelete} className="text-destructive-foreground hover:bg-destructive/10">
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomFieldsSettingsPage() {
  const [fields, setFields] = useState<CustomField[]>(INITIAL_FIELDS)
  const [showDialog, setShowDialog] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [moduleFilter, setModuleFilter] = useState<'all' | FieldModule>('all')

  // Form state
  const [fName, setFName] = useState('')
  const [fKey, setFKey] = useState('')
  const [fType, setFType] = useState<FieldType>('text')
  const [fModule, setFModule] = useState<FieldModule>('empleado')
  const [fRequired, setFRequired] = useState(false)
  const [fPlaceholder, setFPlaceholder] = useState('')
  const [fOptions, setFOptions] = useState('')

  function openNew() {
    setEditingField(null)
    setFName(''); setFKey(''); setFType('text'); setFModule('empleado')
    setFRequired(false); setFPlaceholder(''); setFOptions('')
    setShowDialog(true)
  }

  function openEdit(field: CustomField) {
    setEditingField(field)
    setFName(field.name); setFKey(field.key); setFType(field.type); setFModule(field.module)
    setFRequired(field.required); setFPlaceholder(field.placeholder ?? '')
    setFOptions(field.options?.join(', ') ?? '')
    setShowDialog(true)
  }

  function saveField() {
    const opts = fType === 'select' ? fOptions.split(',').map((o) => o.trim()).filter(Boolean) : undefined
    if (editingField) {
      setFields(fields.map((f) => f.id === editingField.id ? {
        ...f, name: fName, key: fKey, type: fType, module: fModule,
        required: fRequired, placeholder: fPlaceholder || undefined, options: opts,
      } : f))
    } else {
      setFields([...fields, {
        id: `cf-${Date.now()}`, name: fName, key: fKey, type: fType, module: fModule,
        required: fRequired, active: true, placeholder: fPlaceholder || undefined, options: opts,
        created_at: new Date().toISOString().split('T')[0],
      }])
    }
    setShowDialog(false)
  }

  function moveField(idx: number, dir: 'up' | 'down') {
    const arr = [...fields]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]]
    setFields(arr)
  }

  const displayed = moduleFilter === 'all' ? fields : fields.filter((f) => f.module === moduleFilter)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Campos personalizados</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Define campos adicionales para perfiles de empleados y formularios de solicitudes.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openNew}>
          <PlusIcon className="size-4" />
          Nuevo campo
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'empleado', 'solicitud'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModuleFilter(m)}
            className={cn(
              'px-3 py-1.5 rounded-full label-xs font-medium transition-colors',
              moduleFilter === m
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-muted-foreground hover:bg-accent'
            )}
          >
            {m === 'all' ? 'Todos' : MODULE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total campos', value: fields.length },
          { label: 'Activos', value: fields.filter((f) => f.active).length },
          { label: 'En perfiles', value: fields.filter((f) => f.module === 'empleado').length },
          { label: 'En solicitudes', value: fields.filter((f) => f.module === 'solicitud').length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4 text-center">
              <p className="title-2xs font-semibold text-foreground">{stat.value}</p>
              <p className="paragraph-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fields list */}
      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold text-foreground">
            Campos ({displayed.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {displayed.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <p className="label-md font-medium text-foreground">Sin campos</p>
              <p className="paragraph-sm text-muted-foreground">Crea el primer campo personalizado.</p>
              <Button variant="outline" size="md" onClick={openNew}>
                <PlusIcon className="size-4" />
                Nuevo campo
              </Button>
            </div>
          ) : (
            displayed.map((field, idx) => (
              <FieldRow
                key={field.id}
                field={field}
                idx={idx}
                total={displayed.length}
                onMoveUp={() => moveField(idx, 'up')}
                onMoveDown={() => moveField(idx, 'down')}
                onToggle={() => setFields(fields.map((f) => f.id === field.id ? { ...f, active: !f.active } : f))}
                onDelete={() => setFields(fields.filter((f) => f.id !== field.id))}
                onEdit={() => openEdit(field)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={(v: boolean) => !v && setShowDialog(false)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingField ? 'Editar campo' : 'Nuevo campo personalizado'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Nombre visible *</label>
                <Input value={fName} onChange={(e) => { setFName(e.target.value); if (!editingField) setFKey(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')) }} placeholder="Ej: Talla de ropa" />
              </div>
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Clave interna *</label>
                <Input value={fKey} onChange={(e) => setFKey(e.target.value)} placeholder="talla_ropa" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Tipo de campo</label>
                <select
                  value={fType}
                  onChange={(e) => setFType(e.target.value as FieldType)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(Object.keys(FIELD_TYPE_LABELS) as FieldType[]).map((t) => (
                    <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Módulo</label>
                <select
                  value={fModule}
                  onChange={(e) => setFModule(e.target.value as FieldModule)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(Object.keys(MODULE_LABELS) as FieldModule[]).map((m) => (
                    <option key={m} value={m}>{MODULE_LABELS[m]}</option>
                  ))}
                </select>
              </div>
            </div>

            {fType === 'select' && (
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Opciones (separadas por coma)</label>
                <Input value={fOptions} onChange={(e) => setFOptions(e.target.value)} placeholder="Opción 1, Opción 2, Opción 3" />
              </div>
            )}

            {(fType === 'text' || fType === 'textarea' || fType === 'number') && (
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Placeholder</label>
                <Input value={fPlaceholder} onChange={(e) => setFPlaceholder(e.target.value)} placeholder="Texto de ayuda..." />
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fRequired}
                onChange={(e) => setFRequired(e.target.checked)}
                className="rounded border-border size-4"
              />
              <span className="paragraph-sm text-foreground">Campo obligatorio</span>
            </label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="md">Cancelar</Button>
            </DialogClose>
            <Button variant="primary" size="md" onClick={saveField} disabled={!fName.trim() || !fKey.trim()}>
              <CheckIcon className="size-4" />
              {editingField ? 'Guardar cambios' : 'Crear campo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
