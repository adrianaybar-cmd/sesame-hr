'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@clasing/ui/table'
import { Input } from '@clasing/ui/input'
import { Textarea } from '@clasing/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Switch } from '@clasing/ui/switch'
import {
  PlusIcon,
  GraduationCapIcon,
  ClockIcon,
  CurrencyEurIcon,
  UsersIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  XCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import { MOCK_TRAININGS, MOCK_ENROLLMENTS } from '@/lib/mock/training'
import type { Training, TrainingEnrollment, TrainingType, TrainingStatus } from '@/lib/types/training'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<TrainingType, string> = {
  internal: 'Interno',
  external: 'Externo',
  online: 'Online',
  certification: 'Certificación',
}

const TYPE_VARIANTS: Record<TrainingType, string> = {
  internal: 'bg-blue-100 text-blue-700',
  external: 'bg-violet-100 text-violet-700',
  online: 'bg-emerald-100 text-emerald-700',
  certification: 'bg-amber-100 text-amber-700',
}

const STATUS_LABELS: Record<TrainingStatus, string> = {
  not_started: 'Sin iniciar',
  in_progress: 'En curso',
  completed: 'Completada',
  expired: 'Caducada',
}

const STATUS_VARIANTS: Record<TrainingStatus, 'neutral' | 'warning' | 'success' | 'error'> = {
  not_started: 'neutral',
  in_progress: 'warning',
  completed: 'success',
  expired: 'error',
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

// ─── TrainingCard ─────────────────────────────────────────────────────────────

interface TrainingCardProps {
  training: Training
  enrollmentCount: number
  onClick: () => void
}

function TrainingCard({ training, enrollmentCount, onClick }: TrainingCardProps) {
  return (
    <Card className="cursor-pointer hover:border-ring transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="label-sm font-semibold text-foreground line-clamp-2">{training.title}</span>
          <div className="flex flex-col gap-1 items-end shrink-0">
            <span className={cn('label-xs font-medium px-2 py-0.5 rounded-md', TYPE_VARIANTS[training.type])}>
              {TYPE_LABELS[training.type]}
            </span>
            {training.fundae_eligible && (
              <Badge variant="success" size="xs">FUNDAE</Badge>
            )}
          </div>
        </div>
        <p className="paragraph-xs text-muted-foreground mb-3 line-clamp-2">{training.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ClockIcon className="size-3.5" />
            <span className="label-xs">{training.duration_hours}h</span>
          </div>
          {training.cost_per_person !== undefined && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CurrencyEurIcon className="size-3.5" />
              <span className="label-xs">{training.cost_per_person === 0 ? 'Gratuito' : formatEuro(training.cost_per_person)}/persona</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <UsersIcon className="size-3.5" />
            <span className="label-xs">{enrollmentCount} inscritos{training.max_participants ? `/${training.max_participants}` : ''}</span>
          </div>
        </div>
        {(training.start_date || training.end_date) && (
          <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <CalendarIcon className="size-3.5" />
            <span className="label-xs">
              {training.start_date && new Date(training.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              {training.start_date && training.end_date && ' — '}
              {training.end_date && new Date(training.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        )}
        <div className="mt-2">
          <span className="label-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{training.category}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── New Training Dialog ──────────────────────────────────────────────────────

interface NewTrainingDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Partial<Training>) => void
}

function NewTrainingDialog({ open, onClose, onSave }: NewTrainingDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TrainingType>('internal')
  const [provider, setProvider] = useState('')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [category, setCategory] = useState('')
  const [fundae, setFundae] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  function handleSave() {
    if (!title.trim() || !description.trim() || !duration || !category.trim()) return
    onSave({
      title,
      description,
      type,
      provider: provider || undefined,
      duration_hours: parseInt(duration),
      cost_per_person: cost ? parseInt(cost) : 0,
      category,
      fundae_eligible: fundae,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
    })
    setTitle('')
    setDescription('')
    setType('internal')
    setProvider('')
    setDuration('')
    setCost('')
    setCategory('')
    setFundae(false)
    setStartDate('')
    setEndDate('')
    setMaxParticipants('')
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva formación</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la formación" />
          </div>
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Descripción</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe el contenido y objetivos de la formación" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Tipo</label>
              <Select value={type} onValueChange={(v: string) => setType(v as TrainingType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([k, l]) => (
                    <SelectItem key={k} value={k}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Categoría</label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Liderazgo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Duración (horas)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="8" />
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Coste por persona (€)</label>
              <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0" />
            </div>
          </div>
          {type !== 'internal' && (
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Proveedor</label>
              <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Nombre del proveedor" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Fecha inicio</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="label-sm font-medium text-foreground block mb-1.5">Fecha fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Plazas máximas</label>
            <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} placeholder="Sin límite" />
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 border border-border">
            <div>
              <span className="label-sm font-medium text-foreground block">Financiable por FUNDAE</span>
              <span className="label-xs text-muted-foreground">Formación bonificada para empresas</span>
            </div>
            <Switch checked={fundae} onCheckedChange={setFundae} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !description.trim() || !duration || !category.trim()}>
            Guardar formación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>(MOCK_TRAININGS)
  const [enrollments] = useState<TrainingEnrollment[]>(MOCK_ENROLLMENTS)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [tab, setTab] = useState('catalog')
  const [search, setSearch] = useState('')

  const enrollCountByTraining = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const e of enrollments) {
      counts[e.training_id] = (counts[e.training_id] ?? 0) + 1
    }
    return counts
  }, [enrollments])

  const filteredTrainings = useMemo(() => {
    if (!search.trim()) return trainings
    const q = search.toLowerCase()
    return trainings.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }, [trainings, search])

  // Stats
  const stats = useMemo(() => {
    const completed = enrollments.filter((e) => e.status === 'completed').length
    const inProgress = enrollments.filter((e) => e.status === 'in_progress').length
    const total = enrollments.length
    const fundaeCount = trainings.filter((t) => t.fundae_eligible).length
    return { completed, inProgress, total, fundaeCount }
  }, [enrollments, trainings])

  function handleSave(data: Partial<Training>) {
    const newTraining: Training = {
      id: `train-new-${Date.now()}`,
      title: data.title!,
      description: data.description!,
      type: data.type!,
      provider: data.provider,
      duration_hours: data.duration_hours!,
      cost_per_person: data.cost_per_person,
      start_date: data.start_date,
      end_date: data.end_date,
      max_participants: data.max_participants,
      category: data.category!,
      fundae_eligible: data.fundae_eligible ?? false,
      created_at: new Date().toISOString(),
    }
    setTrainings((prev) => [newTraining, ...prev])
    setNewDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Gestión de Formación</h1>
          <p className="paragraph-sm text-muted-foreground mt-0.5">
            Catálogo, inscripciones y estadísticas de formación
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)}>
          <PlusIcon className="size-4 mr-1.5" />
          Nueva formación
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList {...({} as any)}>
          <TabsTrigger value="catalog">
            Catálogo
            <Badge variant="neutral" size="xs" className="ml-1.5">{trainings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="enrollments">
            Inscripciones
            <Badge variant="neutral" size="xs" className="ml-1.5">{enrollments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        {/* Catalog */}
        <TabsContent value="catalog" className="mt-4">
          <div className="mb-4 relative max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar formaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filteredTrainings.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCapIcon className="size-10 text-muted-foreground mx-auto mb-3" />
              <span className="label-md font-medium text-foreground block">Sin resultados</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTrainings.map((training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  enrollmentCount={enrollCountByTraining[training.id] ?? 0}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Enrollments */}
        <TabsContent value="enrollments" className="mt-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Formación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inscripción</TableHead>
                  <TableHead>Puntuación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enr) => (
                  <TableRow key={enr.id}>
                    <TableCell>
                      <span className="label-sm font-medium text-foreground">{enr.employee_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="paragraph-sm text-foreground line-clamp-1">{enr.training_title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[enr.status]} size="sm">
                        {STATUS_LABELS[enr.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="paragraph-xs text-muted-foreground">
                        {new Date(enr.enrolled_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {enr.score !== undefined ? (
                        <span className={cn('label-sm font-semibold', enr.score >= 75 ? 'text-emerald-600' : 'text-amber-600')}>
                          {enr.score}/100
                        </span>
                      ) : (
                        <span className="paragraph-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCapIcon className="size-6 text-blue-500 mx-auto mb-1.5" />
                <span className="title-lg font-semibold text-foreground block">{stats.total}</span>
                <span className="label-xs text-muted-foreground">Inscripciones totales</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircleIcon className="size-6 text-emerald-500 mx-auto mb-1.5" />
                <span className="title-lg font-semibold text-foreground block">{stats.completed}</span>
                <span className="label-xs text-muted-foreground">Completadas</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <ClockCountdownIcon className="size-6 text-amber-500 mx-auto mb-1.5" />
                <span className="title-lg font-semibold text-foreground block">{stats.inProgress}</span>
                <span className="label-xs text-muted-foreground">En curso</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CurrencyEurIcon className="size-6 text-violet-500 mx-auto mb-1.5" />
                <span className="title-lg font-semibold text-foreground block">{stats.fundaeCount}</span>
                <span className="label-xs text-muted-foreground">Formaciones FUNDAE</span>
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="label-md font-semibold">Por categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {Object.entries(
                  trainings.reduce<Record<string, number>>((acc, t) => {
                    acc[t.category] = (acc[t.category] ?? 0) + (enrollCountByTraining[t.id] ?? 0)
                    return acc
                  }, {})
                ).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="label-sm text-foreground w-40 shrink-0">{cat}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (count / stats.total) * 100)}%` }}
                      />
                    </div>
                    <span className="label-xs text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <NewTrainingDialog
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
