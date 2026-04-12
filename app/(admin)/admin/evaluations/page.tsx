'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import {
  PlusIcon,
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UserCircleIcon,
  CalendarIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { MOCK_EVALUATIONS } from '@/lib/mock/evaluations'
import { MOCK_QUESTIONNAIRES } from '@/lib/mock/questionnaires'
import { MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { Evaluation, EvaluationType, EvaluationStatus } from '@/lib/types/evaluations'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<EvaluationStatus, string> = {
  draft: 'Borrador',
  in_progress: 'En curso',
  completed: 'Completada',
  archived: 'Archivada',
}
const STATUS_VARIANTS: Record<EvaluationStatus, 'neutral' | 'warning' | 'success' | 'error'> = {
  draft: 'neutral',
  in_progress: 'warning',
  completed: 'success',
  archived: 'error',
}

const TYPE_LABELS: Record<EvaluationType, string> = {
  self: 'Autoevaluación',
  manager: 'Evaluación de manager',
  peer: 'Evaluación entre pares',
  '360': 'Evaluación 360°',
}

const TYPE_VARIANTS: Record<EvaluationType, string> = {
  self: 'bg-blue-100 text-blue-700',
  manager: 'bg-violet-100 text-violet-700',
  peer: 'bg-amber-100 text-amber-700',
  '360': 'bg-emerald-100 text-emerald-700',
}

function getEmployeeName(id: string) {
  const emp = MOCK_EMPLOYEES.find((e) => e.id === id)
  return emp ? `${emp.first_name} ${emp.last_name}` : id
}

// ─── New Evaluation Dialog (multi-step) ───────────────────────────────────

interface NewEvalForm {
  title: string
  type: EvaluationType
  period_start: string
  period_end: string
  employee_ids: string[]
  questionnaire_id: string
  include_manager: boolean
  include_peers: boolean
  include_self: boolean
  peers_count: number
}

function NewEvaluationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<NewEvalForm>({
    title: '',
    type: 'self',
    period_start: '2026-04-01',
    period_end: '2026-06-30',
    employee_ids: [],
    questionnaire_id: '',
    include_manager: false,
    include_peers: false,
    include_self: true,
    peers_count: 2,
  })

  const totalSteps = 4

  function toggleEmployee(id: string) {
    setForm((f) => ({
      ...f,
      employee_ids: f.employee_ids.includes(id) ? f.employee_ids.filter((e) => e !== id) : [...f.employee_ids, id],
    }))
  }

  function handleClose() {
    setStep(1)
    setForm({
      title: '',
      type: 'self',
      period_start: '2026-04-01',
      period_end: '2026-06-30',
      employee_ids: [],
      questionnaire_id: '',
      include_manager: false,
      include_peers: false,
      include_self: true,
      peers_count: 2,
    })
    onClose()
  }

  const canContinue =
    (step === 1 && form.title && form.type) ||
    (step === 2 && form.employee_ids.length > 0) ||
    (step === 3 && form.questionnaire_id) ||
    step === 4

  const evalQuestionnaires = MOCK_QUESTIONNAIRES.filter((q) => q.usage.includes('evaluation'))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva evaluación</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  'size-6 rounded-full flex items-center justify-center label-xs font-semibold shrink-0',
                  i + 1 < step
                    ? 'bg-primary text-primary-foreground'
                    : i + 1 === step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {i + 1 < step ? <CheckCircleIcon className="size-3.5" weight="fill" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={cn('h-px flex-1', i + 1 < step ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>
        <p className="paragraph-xs text-muted-foreground">
          Paso {step} de {totalSteps}:{' '}
          {step === 1 ? 'Información básica' : step === 2 ? 'Empleados' : step === 3 ? 'Cuestionario' : 'Evaluadores'}
        </p>

        {/* Step 1 — Basic info */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Nombre de la evaluación *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Evaluación 360° Q2 2026"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Tipo de evaluación *</label>
              <Select value={form.type} onValueChange={(v: EvaluationType) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Fecha inicio</label>
                <Input
                  type="date"
                  value={form.period_start}
                  onChange={(e) => setForm({ ...form, period_start: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Fecha fin</label>
                <Input
                  type="date"
                  value={form.period_end}
                  onChange={(e) => setForm({ ...form, period_end: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Employees */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <p className="paragraph-sm text-muted-foreground">
              Selecciona los empleados a evaluar ({form.employee_ids.length} seleccionados)
            </p>
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto border border-border rounded-lg p-2">
              {MOCK_EMPLOYEES.filter((e) => e.status === 'active').map((emp) => (
                <label
                  key={emp.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                    form.employee_ids.includes(emp.id) ? 'bg-primary/5 border border-primary/20' : 'hover:bg-accent',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={form.employee_ids.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                    className="rounded border-border"
                  />
                  <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="label-xs font-semibold">{emp.first_name[0]}{emp.last_name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="label-sm font-medium text-foreground">{emp.first_name} {emp.last_name}</p>
                    <p className="paragraph-xs text-muted-foreground">{emp.position} · {emp.department_name}</p>
                  </div>
                </label>
              ))}
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                setForm({
                  ...form,
                  employee_ids: MOCK_EMPLOYEES.filter((e) => e.status === 'active').map((e) => e.id),
                })
              }
              className="self-start"
            >
              Seleccionar todos
            </Button>
          </div>
        )}

        {/* Step 3 — Questionnaire */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="paragraph-sm text-muted-foreground">Selecciona el cuestionario para esta evaluación</p>
            <div className="flex flex-col gap-2">
              {evalQuestionnaires.map((q) => (
                <label
                  key={q.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    form.questionnaire_id === q.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent',
                  )}
                >
                  <input
                    type="radio"
                    name="questionnaire"
                    value={q.id}
                    checked={form.questionnaire_id === q.id}
                    onChange={() => setForm({ ...form, questionnaire_id: q.id })}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="label-sm font-semibold text-foreground">{q.title}</p>
                    {q.description && <p className="paragraph-xs text-muted-foreground">{q.description}</p>}
                    <p className="paragraph-xs text-muted-foreground mt-1">
                      {q.questions.length} preguntas
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Evaluators config */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <p className="paragraph-sm text-muted-foreground">Configura quiénes realizarán la evaluación</p>

            {(['self', 'manager', 'peer'] as const).map((evType) => (
              <div key={evType} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <input
                  type="checkbox"
                  checked={
                    evType === 'self'
                      ? form.include_self
                      : evType === 'manager'
                      ? form.include_manager
                      : form.include_peers
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ...(evType === 'self'
                        ? { include_self: e.target.checked }
                        : evType === 'manager'
                        ? { include_manager: e.target.checked }
                        : { include_peers: e.target.checked }),
                    })
                  }
                  className="mt-0.5 rounded border-border"
                />
                <div className="flex-1">
                  <p className="label-sm font-semibold text-foreground">{TYPE_LABELS[evType]}</p>
                  <p className="paragraph-xs text-muted-foreground">
                    {evType === 'self'
                      ? 'El propio empleado se evalúa a sí mismo'
                      : evType === 'manager'
                      ? 'El responsable directo evalúa al empleado'
                      : 'Compañeros del equipo evalúan al empleado'}
                  </p>
                  {evType === 'peer' && form.include_peers && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="paragraph-xs text-muted-foreground">Número de pares:</span>
                      <Input
                        type="number"
                        value={form.peers_count}
                        onChange={(e) => setForm({ ...form, peers_count: Number(e.target.value) })}
                        className="w-16"
                        min={1}
                        max={10}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {form.type === '360' && (
              <p className="paragraph-xs text-success flex items-center gap-1.5">
                <CheckCircleIcon className="size-3.5" weight="fill" />
                La evaluación 360° incluye los cuatro tipos de evaluadores
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="md"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
            >
              <ArrowLeftIcon className="size-4" />
              {step > 1 ? 'Anterior' : 'Cancelar'}
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!canContinue}
              onClick={() => (step < totalSteps ? setStep((s) => s + 1) : handleClose())}
            >
              {step < totalSteps ? (
                <>
                  Siguiente
                  <ArrowRightIcon className="size-4" />
                </>
              ) : (
                'Crear evaluación'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Evaluation card ───────────────────────────────────────────────────────

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  const avgScore =
    evaluation.results && evaluation.results.length > 0
      ? Math.round(evaluation.results.reduce((sum, r) => sum + r.score, 0) / evaluation.results.length)
      : null

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="label-md font-semibold text-foreground truncate">{evaluation.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full label-xs font-medium', TYPE_VARIANTS[evaluation.type])}>
              {TYPE_LABELS[evaluation.type]}
            </span>
          </div>
        </div>
        <Badge variant={STATUS_VARIANTS[evaluation.status]} size="sm" className="shrink-0">
          {STATUS_LABELS[evaluation.status]}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="size-3.5 text-muted-foreground" />
          <span className="paragraph-xs text-muted-foreground">
            {new Date(evaluation.period.start).toLocaleDateString('es-ES')} –{' '}
            {new Date(evaluation.period.end).toLocaleDateString('es-ES')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <UsersIcon className="size-3.5 text-muted-foreground" />
          <span className="paragraph-xs text-muted-foreground">
            {evaluation.employees.length} empleado{evaluation.employees.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Results if completed */}
      {evaluation.status === 'completed' && avgScore !== null && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <StarIcon className="size-5 text-primary" weight="fill" />
          </div>
          <div>
            <p className="paragraph-xs text-muted-foreground">Puntuación media</p>
            <p className="label-lg font-semibold text-foreground">{avgScore}/100</p>
          </div>
          <div className="ml-auto">
            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${avgScore}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Participants */}
      {evaluation.status === 'completed' && evaluation.results && (
        <div className="flex flex-col gap-1">
          <p className="label-xs font-medium text-muted-foreground">Participantes</p>
          <div className="flex -space-x-2">
            {evaluation.employees.slice(0, 5).map((empId) => {
              const emp = MOCK_EMPLOYEES.find((e) => e.id === empId)
              return (
                <div
                  key={empId}
                  className="size-7 rounded-full bg-accent border-2 border-card flex items-center justify-center"
                  title={emp ? `${emp.first_name} ${emp.last_name}` : empId}
                >
                  <span className="label-xs font-semibold text-foreground">
                    {emp ? `${emp.first_name[0]}${emp.last_name[0]}` : '?'}
                  </span>
                </div>
              )
            })}
            {evaluation.employees.length > 5 && (
              <div className="size-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                <span className="label-xs text-muted-foreground">+{evaluation.employees.length - 5}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvaluationsPage() {
  const [newEvalOpen, setNewEvalOpen] = useState(false)
  const [filter, setFilter] = useState<EvaluationStatus | 'all'>('all')

  const filtered = filter === 'all' ? MOCK_EVALUATIONS : MOCK_EVALUATIONS.filter((e) => e.status === filter)

  const completedEvals = MOCK_EVALUATIONS.filter((e) => e.status === 'completed')
  const inProgressEvals = MOCK_EVALUATIONS.filter((e) => e.status === 'in_progress')

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Evaluaciones</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestiona las evaluaciones de desempeño del equipo
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setNewEvalOpen(true)}>
          <PlusIcon className="size-4" />
          Nueva evaluación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total evaluaciones', value: MOCK_EVALUATIONS.length },
          { label: 'En curso', value: inProgressEvals.length },
          { label: 'Completadas', value: completedEvals.length },
          { label: 'Borradores', value: MOCK_EVALUATIONS.filter((e) => e.status === 'draft').length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <p className="paragraph-xs text-muted-foreground">{stat.label}</p>
            <p className="title-xs font-semibold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'in_progress', 'completed', 'draft', 'archived'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-3 py-1 rounded-full label-xs font-medium transition-colors border',
              filter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {s === 'all' ? 'Todas' : STATUS_LABELS[s]}
            <span className="ml-1.5 opacity-70">
              {s === 'all' ? MOCK_EVALUATIONS.length : MOCK_EVALUATIONS.filter((e) => e.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Evaluations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-16">
            <StarIcon className="size-12 text-muted-foreground" />
            <p className="label-md font-medium text-muted-foreground">No hay evaluaciones en esta categoría</p>
          </div>
        )}
      </div>

      <NewEvaluationDialog open={newEvalOpen} onClose={() => setNewEvalOpen(false)} />
    </div>
  )
}
