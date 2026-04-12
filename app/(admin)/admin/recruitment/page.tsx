'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@clasing/ui/table'
import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ClipboardTextIcon,
  GearIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyEurIcon,
} from '@phosphor-icons/react'
import { MOCK_VACANCIES, MOCK_CANDIDATES } from '@/lib/mock/recruitment'
import { MOCK_QUESTIONNAIRES } from '@/lib/mock/questionnaires'
import { MOCK_DEPARTMENTS } from '@/lib/mock/employees'
import type { Vacancy, VacancyStatus } from '@/lib/types/recruitment'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<VacancyStatus, string> = {
  draft: 'Borrador',
  published: 'Publicada',
  paused: 'Pausada',
  closed: 'Cerrada',
}
const STATUS_VARIANTS: Record<VacancyStatus, 'neutral' | 'success' | 'warning' | 'error'> = {
  draft: 'neutral',
  published: 'success',
  paused: 'warning',
  closed: 'error',
}

const TYPE_LABELS: Record<Vacancy['type'], string> = {
  full_time: 'Jornada completa',
  part_time: 'Media jornada',
  remote: 'Remoto',
  hybrid: 'Híbrido',
}

// ─── New Vacancy Dialog ────────────────────────────────────────────────────

function NewVacancyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    department_id: '',
    location: '',
    type: 'hybrid' as Vacancy['type'],
    salary_min: '',
    salary_max: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva vacante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Título del puesto *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: Desarrollador/a Full Stack Senior"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Departamento *</label>
              <Select value={form.department_id} onValueChange={(v: string) => setForm({ ...form, department_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Modalidad</label>
              <Select value={form.type} onValueChange={(v: Vacancy['type']) => setForm({ ...form, type: v })}>
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
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Ubicación</label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ej: Madrid, Barcelona, Remoto..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Rango salarial (EUR/año)</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                value={form.salary_min}
                onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                placeholder="Mínimo"
              />
              <Input
                type="number"
                value={form.salary_max}
                onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                placeholder="Máximo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={!form.title || !form.department_id}>
              Crear vacante
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tab: Vacantes ─────────────────────────────────────────────────────────

function VacantesTab() {
  const [filter, setFilter] = useState<VacancyStatus | 'all'>('all')

  const filtered = filter === 'all' ? MOCK_VACANCIES : MOCK_VACANCIES.filter((v) => v.status === filter)

  return (
    <div className="flex flex-col gap-4">
      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'published', 'draft', 'paused', 'closed'] as const).map((s) => (
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
              {s === 'all' ? MOCK_VACANCIES.length : MOCK_VACANCIES.filter((v) => v.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vacancy) => (
          <div key={vacancy.id} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="label-md font-semibold text-foreground truncate">{vacancy.title}</h3>
                <p className="paragraph-xs text-muted-foreground">{vacancy.department_name}</p>
              </div>
              <Badge variant={STATUS_VARIANTS[vacancy.status]} size="sm" className="shrink-0">
                {STATUS_LABELS[vacancy.status]}
              </Badge>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="size-3.5 text-muted-foreground" />
                <span className="paragraph-xs text-muted-foreground">{vacancy.location}</span>
                <span className="paragraph-xs text-muted-foreground">·</span>
                <span className="paragraph-xs text-muted-foreground">{TYPE_LABELS[vacancy.type]}</span>
              </div>
              {vacancy.salary_range && (
                <div className="flex items-center gap-1.5">
                  <CurrencyEurIcon className="size-3.5 text-muted-foreground" />
                  <span className="paragraph-xs text-muted-foreground">
                    {vacancy.salary_range.min.toLocaleString('es-ES')} – {vacancy.salary_range.max.toLocaleString('es-ES')} EUR/año
                  </span>
                </div>
              )}
              {vacancy.published_at && (
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  <span className="paragraph-xs text-muted-foreground">
                    Publicada {new Date(vacancy.published_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border">
              <div className="flex items-center gap-1.5">
                <UsersIcon className="size-3.5 text-muted-foreground" />
                <span className="paragraph-xs text-muted-foreground">
                  {vacancy.candidates_count} candidato{vacancy.candidates_count !== 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="ghost" size="xs" asChild>
                <Link href={`/admin/recruitment/${vacancy.id}`}>
                  Ver pipeline
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Candidatos ───────────────────────────────────────────────────────

function CandidatosTab() {
  const [search, setSearch] = useState('')
  const [vacancyFilter, setVacancyFilter] = useState('all')

  const filtered = MOCK_CANDIDATES.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchVacancy = vacancyFilter === 'all' || c.vacancy_id === vacancyFilter
    return matchSearch && matchVacancy
  })

  const STAGE_LABELS: Record<string, string> = {
    applied: 'Solicitud',
    screening: 'Revisión CV',
    interview_1: '1ª Entrevista',
    interview_2: '2ª Entrevista',
    technical: 'Prueba técnica',
    offer: 'Oferta',
    hired: 'Contratado',
    rejected: 'Descartado',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input
            icon={<MagnifyingGlassIcon className="size-4" />}
            iconPosition="left"
            placeholder="Buscar candidato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Vacante" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las vacantes</SelectItem>
            {MOCK_VACANCIES.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidato</TableHead>
              <TableHead>Vacante</TableHead>
              <TableHead>Fase</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Solicitud</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const vacancy = MOCK_VACANCIES.find((v) => v.id === c.vacancy_id)
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="label-sm font-medium text-foreground">
                        {c.first_name} {c.last_name}
                      </span>
                      <span className="paragraph-xs text-muted-foreground">{c.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-sm text-muted-foreground">{vacancy?.title ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={c.stage === 'hired' ? 'success' : c.stage === 'rejected' ? 'error' : 'neutral'}
                      size="sm"
                    >
                      {STAGE_LABELS[c.stage]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.rating ? (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={cn('text-sm', i < c.rating! ? 'text-warning' : 'text-muted')}>
                            ★
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="paragraph-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="paragraph-xs text-muted-foreground">
                      {new Date(c.applied_at).toLocaleDateString('es-ES')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="xs" asChild>
                        <Link href={`/admin/recruitment/${c.vacancy_id}`}>Ver pipeline</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <p className="paragraph-xs text-muted-foreground">
        {filtered.length} candidato{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// ─── Tab: Cuestionarios ────────────────────────────────────────────────────

function CuestionariosTab() {
  const atsCuestionarios = MOCK_QUESTIONNAIRES.filter((q) => q.usage.includes('ats'))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="paragraph-sm text-muted-foreground">
          {atsCuestionarios.length} cuestionario{atsCuestionarios.length !== 1 ? 's' : ''} disponibles para ATS
        </p>
        <Button variant="outline" size="md">
          <PlusIcon className="size-4" />
          Nuevo cuestionario
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {atsCuestionarios.map((q) => (
          <div key={q.id} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="label-md font-semibold text-foreground">{q.title}</h3>
              <Badge variant={q.is_active ? 'success' : 'neutral'} size="sm">
                {q.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            {q.description && <p className="paragraph-sm text-muted-foreground">{q.description}</p>}
            <div className="flex items-center gap-3 pt-1 border-t border-border">
              <span className="paragraph-xs text-muted-foreground">
                {q.questions.length} pregunta{q.questions.length !== 1 ? 's' : ''}
              </span>
              <span className="paragraph-xs text-muted-foreground">·</span>
              <span className="paragraph-xs text-muted-foreground">
                Creado {new Date(q.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'vacantes', label: 'Vacantes', icon: BriefcaseIcon },
  { id: 'candidatos', label: 'Candidatos', icon: UsersIcon },
  { id: 'cuestionarios', label: 'Cuestionarios', icon: ClipboardTextIcon },
  { id: 'config', label: 'Configuración', icon: GearIcon },
] as const

type TabId = (typeof TABS)[number]['id']

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('vacantes')
  const [newVacancyOpen, setNewVacancyOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Reclutamiento</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestiona vacantes, candidatos y el pipeline de selección
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setNewVacancyOpen(true)}>
          <PlusIcon className="size-4" />
          Nueva vacante
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Vacantes activas', value: MOCK_VACANCIES.filter((v) => v.status === 'published').length },
          { label: 'Total candidatos', value: MOCK_CANDIDATES.length },
          { label: 'En proceso', value: MOCK_CANDIDATES.filter((c) => !['hired', 'rejected'].includes(c.stage)).length },
          { label: 'Contratados este mes', value: MOCK_CANDIDATES.filter((c) => c.stage === 'hired').length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <p className="paragraph-xs text-muted-foreground">{stat.label}</p>
            <p className="title-xs font-semibold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 label-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'vacantes' && <VacantesTab />}
        {activeTab === 'candidatos' && <CandidatosTab />}
        {activeTab === 'cuestionarios' && <CuestionariosTab />}
        {activeTab === 'config' && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <GearIcon className="size-12 text-muted-foreground" />
            <p className="label-md font-medium text-muted-foreground">Configuración de reclutamiento próximamente</p>
          </div>
        )}
      </div>

      <NewVacancyDialog open={newVacancyOpen} onClose={() => setNewVacancyOpen(false)} />
    </div>
  )
}
