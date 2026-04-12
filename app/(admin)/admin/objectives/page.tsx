'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  TargetIcon,
  CaretDownIcon,
  CaretRightIcon,
  BuildingIcon,
  UsersThreeIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { MOCK_OBJECTIVES } from '@/lib/mock/objectives'
import type { Objective, ObjectiveLevel, ObjectiveStatus, KeyResult } from '@/lib/types/objectives'

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

const STATUS_COLORS: Record<ObjectiveStatus, string> = {
  on_track: 'bg-success',
  at_risk: 'bg-warning',
  behind: 'bg-error',
  completed: 'bg-muted-foreground',
}

const LEVEL_ICONS: Record<ObjectiveLevel, React.ElementType> = {
  company: BuildingIcon,
  department: UsersThreeIcon,
  individual: UserCircleIcon,
}

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1-Q2 2026', 'Anual 2026'] as const

// ─── Key Result row ────────────────────────────────────────────────────────

function KeyResultRow({ kr }: { kr: KeyResult }) {
  function formatValue(kr: KeyResult) {
    if (kr.metric_type === 'boolean') {
      return kr.current_value === 1 ? 'Sí' : 'No'
    }
    if (kr.metric_type === 'currency') {
      return `${(kr.current_value / 1000).toFixed(0)}k€ / ${(kr.target_value / 1000).toFixed(0)}k€`
    }
    return `${kr.current_value}${kr.unit ? ' ' + kr.unit : ''} / ${kr.target_value}${kr.unit ? ' ' + kr.unit : ''}`
  }

  return (
    <div className="flex items-center gap-3 py-2 pl-4 border-l-2 border-border">
      <div className="flex-1 min-w-0">
        <p className="paragraph-sm text-foreground truncate">{kr.title}</p>
        <p className="paragraph-xs text-muted-foreground">{formatValue(kr)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', kr.progress >= 100 ? 'bg-success' : kr.progress >= 50 ? 'bg-primary' : 'bg-warning')}
            style={{ width: `${Math.min(kr.progress, 100)}%` }}
          />
        </div>
        <span className="label-xs font-medium text-muted-foreground w-8 text-right">{kr.progress}%</span>
      </div>
    </div>
  )
}

// ─── Objective card ────────────────────────────────────────────────────────

function ObjectiveCard({ objective }: { objective: Objective }) {
  const [expanded, setExpanded] = useState(false)
  const LevelIcon = LEVEL_ICONS[objective.level]

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <LevelIcon className="size-4 text-muted-foreground shrink-0" />
              <h3 className="label-md font-semibold text-foreground">{objective.title}</h3>
            </div>
            {objective.description && (
              <p className="paragraph-xs text-muted-foreground">{objective.description}</p>
            )}
          </div>
          <Badge variant={STATUS_VARIANTS[objective.status]} size="sm" className="shrink-0">
            {STATUS_LABELS[objective.status]}
          </Badge>
        </div>

        {/* Owner + period */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-full bg-accent flex items-center justify-center">
              <span className="text-[9px] font-semibold">{objective.owner_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
            </div>
            <span className="paragraph-xs text-muted-foreground">{objective.owner_name}</span>
          </div>
          <span className="paragraph-xs text-muted-foreground">
            {new Date(objective.period.start).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} –{' '}
            {new Date(objective.period.end).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="paragraph-xs text-muted-foreground">Progreso general</span>
            <span className="label-sm font-semibold text-foreground">{objective.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', STATUS_COLORS[objective.status])}
              style={{ width: `${objective.progress}%` }}
            />
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          {expanded ? <CaretDownIcon className="size-3.5" /> : <CaretRightIcon className="size-3.5" />}
          <span className="label-xs">
            {objective.key_results.length} resultado{objective.key_results.length !== 1 ? 's' : ''} clave
          </span>
        </button>
      </div>

      {/* Key results (expandable) */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-1 border-t border-border pt-3">
          {objective.key_results.map((kr) => (
            <KeyResultRow key={kr.id} kr={kr} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── New Objective Dialog ──────────────────────────────────────────────────

function NewObjectiveDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'individual' as ObjectiveLevel,
    period_start: '2026-04-01',
    period_end: '2026-06-30',
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo objetivo</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Título del objetivo *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: Incrementar el NPS en 15 puntos"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Descripción</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción opcional..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Nivel</label>
            <Select value={form.level} onValueChange={(v: ObjectiveLevel) => setForm({ ...form, level: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Empresa</SelectItem>
                <SelectItem value="department">Departamento</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
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
          <DialogFooter>
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={!form.title}>
              Crear objetivo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: ObjectiveLevel | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'company', label: 'Empresa' },
  { id: 'department', label: 'Departamentos' },
  { id: 'individual', label: 'Individual' },
]

export default function ObjectivesPage() {
  const [activeTab, setActiveTab] = useState<ObjectiveLevel | 'all'>('all')
  const [period, setPeriod] = useState('Q2 2026')
  const [newOpen, setNewOpen] = useState(false)

  const filtered = activeTab === 'all' ? MOCK_OBJECTIVES : MOCK_OBJECTIVES.filter((o) => o.level === activeTab)

  const avgProgress =
    filtered.length > 0 ? Math.round(filtered.reduce((sum, o) => sum + o.progress, 0) / filtered.length) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Objetivos OKR</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Seguimiento de objetivos y resultados clave del equipo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="primary" size="md" onClick={() => setNewOpen(true)}>
            <PlusIcon className="size-4" />
            Nuevo objetivo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total objetivos', value: MOCK_OBJECTIVES.length },
          { label: 'En camino', value: MOCK_OBJECTIVES.filter((o) => o.status === 'on_track').length },
          { label: 'En riesgo', value: MOCK_OBJECTIVES.filter((o) => o.status === 'at_risk' || o.status === 'behind').length },
          { label: 'Completados', value: MOCK_OBJECTIVES.filter((o) => o.status === 'completed').length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <p className="paragraph-xs text-muted-foreground">{stat.label}</p>
            <p className="title-xs font-semibold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
        <div className="relative size-14 shrink-0">
          <svg className="size-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--muted)" strokeWidth="6" />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - avgProgress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center label-xs font-semibold text-foreground">
            {avgProgress}%
          </span>
        </div>
        <div>
          <p className="label-md font-semibold text-foreground">Progreso medio — {period}</p>
          <p className="paragraph-sm text-muted-foreground">
            {filtered.length} objetivo{filtered.length !== 1 ? 's' : ''} ·{' '}
            {filtered.reduce((sum, o) => sum + o.key_results.length, 0)} resultados clave
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 label-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70 label-xs">
              {tab.id === 'all' ? MOCK_OBJECTIVES.length : MOCK_OBJECTIVES.filter((o) => o.level === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Objectives grid */}
      <div className="flex flex-col gap-4">
        {filtered.map((obj) => (
          <ObjectiveCard key={obj.id} objective={obj} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <TargetIcon className="size-12 text-muted-foreground" />
            <p className="label-md font-medium text-muted-foreground">No hay objetivos en esta categoría</p>
            <Button variant="outline" size="md" onClick={() => setNewOpen(true)}>
              <PlusIcon className="size-4" />
              Crear primer objetivo
            </Button>
          </div>
        )}
      </div>

      <NewObjectiveDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}
