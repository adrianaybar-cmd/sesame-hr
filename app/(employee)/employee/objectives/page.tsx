'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  TargetIcon,
  CaretDownIcon,
  CaretRightIcon,
  PencilSimpleIcon,
  TrophyIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { getObjectivesByEmployee } from '@/lib/mock/objectives'
import type { Objective, KeyResult, ObjectiveStatus } from '@/lib/types/objectives'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ObjectiveStatus, string> = {
  on_track: 'En camino',
  at_risk: 'En riesgo',
  behind: 'Retrasado',
  completed: 'Completado',
}

const STATUS_VARIANTS: Record<ObjectiveStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  on_track: 'success',
  at_risk: 'warning',
  behind: 'error',
  completed: 'neutral',
}

const STATUS_PROGRESS_COLOR: Record<ObjectiveStatus, string> = {
  on_track: 'bg-success',
  at_risk: 'bg-warning',
  behind: 'bg-error',
  completed: 'bg-muted-foreground',
}

// ─── Update progress dialog ────────────────────────────────────────────────

function UpdateProgressDialog({
  objective,
  kr,
  open,
  onClose,
  onSave,
}: {
  objective: Objective
  kr: KeyResult
  open: boolean
  onClose: () => void
  onSave: (newValue: number) => void
}) {
  const [value, setValue] = useState(kr.current_value.toString())

  function formatLabel() {
    if (kr.metric_type === 'percentage') return `% (objetivo: ${kr.target_value}%)`
    if (kr.metric_type === 'boolean') return '1 = Sí, 0 = No'
    if (kr.metric_type === 'currency') return `EUR (objetivo: ${kr.target_value.toLocaleString('es-ES')} EUR)`
    return kr.unit ? `${kr.unit} (objetivo: ${kr.target_value})` : `(objetivo: ${kr.target_value})`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Actualizar progreso</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-accent/50 p-3">
            <p className="label-sm font-medium text-foreground">{kr.title}</p>
            <p className="paragraph-xs text-muted-foreground mt-0.5">{objective.title}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">
              Valor actual {formatLabel()}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min={kr.metric_type === 'boolean' ? 0 : undefined}
              max={kr.metric_type === 'boolean' ? 1 : undefined}
              step={kr.metric_type === 'percentage' ? 1 : undefined}
            />
          </div>
          {kr.metric_type !== 'boolean' && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="paragraph-xs text-muted-foreground">Progreso calculado</span>
                <span className="label-xs font-semibold text-foreground">
                  {Math.min(100, Math.round((Number(value) / kr.target_value) * 100))}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (Number(value) / kr.target_value) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onSave(Number(value))
              onClose()
            }}
          >
            Guardar progreso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Key result row ────────────────────────────────────────────────────────

function KeyResultRow({
  objective,
  kr,
  onUpdate,
}: {
  objective: Objective
  kr: KeyResult
  onUpdate: (krId: string, newValue: number) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function formatValue() {
    if (kr.metric_type === 'boolean') return kr.current_value === 1 ? 'Completado' : 'Pendiente'
    if (kr.metric_type === 'currency') {
      return `${(kr.current_value / 1000).toFixed(0)}k€ / ${(kr.target_value / 1000).toFixed(0)}k€`
    }
    return `${kr.current_value}${kr.unit ? ' ' + kr.unit : ''} / ${kr.target_value}${kr.unit ? ' ' + kr.unit : ''}`
  }

  return (
    <>
      <div className="flex items-center gap-3 py-2.5 pl-4 border-l-2 border-border group">
        <div className="flex-1 min-w-0">
          <p className="paragraph-sm text-foreground">{kr.title}</p>
          <p className="paragraph-xs text-muted-foreground">{formatValue()}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                kr.progress >= 100 ? 'bg-success' : kr.progress >= 60 ? 'bg-primary' : 'bg-warning',
              )}
              style={{ width: `${Math.min(kr.progress, 100)}%` }}
            />
          </div>
          <span className="label-xs font-medium text-muted-foreground w-8 text-right">{kr.progress}%</span>
          <button
            onClick={() => setDialogOpen(true)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all"
            title="Actualizar progreso"
          >
            <PencilSimpleIcon className="size-3.5" />
          </button>
        </div>
      </div>

      <UpdateProgressDialog
        objective={objective}
        kr={kr}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={(newValue) => onUpdate(kr.id, newValue)}
      />
    </>
  )
}

// ─── Objective card ────────────────────────────────────────────────────────

function MyObjectiveCard({
  objective,
  onUpdateKr,
}: {
  objective: Objective
  onUpdateKr: (objId: string, krId: string, newValue: number) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="label-lg font-semibold text-foreground">{objective.title}</h3>
            {objective.description && (
              <p className="paragraph-sm text-muted-foreground mt-0.5">{objective.description}</p>
            )}
          </div>
          <Badge variant={STATUS_VARIANTS[objective.status]} size="sm" className="shrink-0">
            {STATUS_LABELS[objective.status]}
          </Badge>
        </div>

        {/* Period */}
        <p className="paragraph-xs text-muted-foreground">
          {new Date(objective.period.start).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} –{' '}
          {new Date(objective.period.end).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </p>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="label-sm font-medium text-foreground">Progreso general</span>
            <span className="label-lg font-semibold text-foreground">{objective.progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', STATUS_PROGRESS_COLOR[objective.status])}
              style={{ width: `${objective.progress}%` }}
            />
          </div>
        </div>

        {/* KR toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          {expanded ? <CaretDownIcon className="size-3.5" /> : <CaretRightIcon className="size-3.5" />}
          <span className="label-xs font-medium">
            {objective.key_results.length} resultado{objective.key_results.length !== 1 ? 's' : ''} clave
          </span>
        </button>
      </div>

      {/* Key results */}
      {expanded && (
        <div className="px-5 pb-4 flex flex-col gap-1 border-t border-border pt-3">
          {objective.key_results.map((kr) => (
            <KeyResultRow
              key={kr.id}
              objective={objective}
              kr={kr}
              onUpdate={(krId, newValue) => onUpdateKr(objective.id, krId, newValue)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Simulating logged-in employee: emp-6 (Sofía Moreno)
const MY_EMPLOYEE_ID = 'emp-6'

export default function MyObjectivesPage() {
  const [objectives, setObjectives] = useState(() => getObjectivesByEmployee(MY_EMPLOYEE_ID))

  function handleUpdateKr(objId: string, krId: string, newValue: number) {
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id !== objId) return obj
        const updatedKrs = obj.key_results.map((kr) => {
          if (kr.id !== krId) return kr
          const progress =
            kr.metric_type === 'boolean'
              ? newValue === 1
                ? 100
                : 0
              : Math.min(100, Math.round((newValue / kr.target_value) * 100))
          return { ...kr, current_value: newValue, progress }
        })
        const avgProgress = Math.round(updatedKrs.reduce((s, kr) => s + kr.progress, 0) / updatedKrs.length)
        const status: ObjectiveStatus =
          avgProgress >= 100 ? 'completed' : avgProgress >= 70 ? 'on_track' : avgProgress >= 40 ? 'at_risk' : 'behind'
        return { ...obj, key_results: updatedKrs, progress: avgProgress, status }
      }),
    )
  }

  const completedCount = objectives.filter((o) => o.status === 'completed').length
  const avgProgress =
    objectives.length > 0 ? Math.round(objectives.reduce((s, o) => s + o.progress, 0) / objectives.length) : 0

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mis objetivos</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Sigue el progreso de tus objetivos del trimestre actual
        </p>
      </div>

      {/* Summary banner */}
      {objectives.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {completedCount === objectives.length ? (
              <TrophyIcon className="size-6 text-primary" weight="fill" />
            ) : (
              <TargetIcon className="size-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="label-md font-semibold text-foreground">
              {completedCount === objectives.length
                ? '¡Todos los objetivos completados!'
                : `${completedCount} de ${objectives.length} objetivo${objectives.length !== 1 ? 's' : ''} completado${completedCount !== 1 ? 's' : ''}`}
            </p>
            <p className="paragraph-xs text-muted-foreground">Progreso medio: {avgProgress}%</p>
          </div>
          <div className="w-24 h-2.5 rounded-full bg-muted overflow-hidden shrink-0">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${avgProgress}%` }} />
          </div>
          <span className="label-sm font-semibold text-foreground shrink-0">{avgProgress}%</span>
        </div>
      )}

      {/* Status pills */}
      {objectives.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {(['on_track', 'at_risk', 'behind', 'completed'] as const).map((status) => {
            const count = objectives.filter((o) => o.status === status).length
            if (count === 0) return null
            return (
              <div key={status} className="flex items-center gap-1.5">
                <Badge variant={STATUS_VARIANTS[status]} size="sm">
                  {STATUS_LABELS[status]}
                </Badge>
                <span className="label-xs text-muted-foreground">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Objectives */}
      {objectives.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <TargetIcon className="size-14 text-muted-foreground" />
          <div>
            <p className="label-md font-semibold text-foreground">Sin objetivos asignados</p>
            <p className="paragraph-sm text-muted-foreground mt-1">
              Tu manager o el equipo de RRHH te asignará objetivos próximamente
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {objectives.map((obj) => (
            <MyObjectiveCard key={obj.id} objective={obj} onUpdateKr={handleUpdateKr} />
          ))}
        </div>
      )}
    </div>
  )
}
