'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Progress } from '@clasing/ui/progress'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  GraduationCapIcon,
  ClockIcon,
  CurrencyEurIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  CertificateIcon,
  PlusIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_TRAININGS, MOCK_ENROLLMENTS } from '@/lib/mock/training'
import type { Training, TrainingEnrollment, TrainingStatus, TrainingType } from '@/lib/types/training'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-6'

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

const STATUS_PROGRESS: Record<TrainingStatus, number> = {
  not_started: 0,
  in_progress: 50,
  completed: 100,
  expired: 100,
}

const TYPE_LABELS: Record<TrainingType, string> = {
  internal: 'Interno',
  external: 'Externo',
  online: 'Online',
  certification: 'Certificación',
}

const TYPE_COLORS: Record<TrainingType, string> = {
  internal: 'bg-blue-100 text-blue-700',
  external: 'bg-violet-100 text-violet-700',
  online: 'bg-emerald-100 text-emerald-700',
  certification: 'bg-amber-100 text-amber-700',
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

// ─── EnrollmentCard ───────────────────────────────────────────────────────────

function EnrollmentCard({ enrollment }: { enrollment: TrainingEnrollment }) {
  const progress = STATUS_PROGRESS[enrollment.status]
  return (
    <Card className={cn('overflow-hidden', enrollment.status === 'completed' && 'border-emerald-200')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="label-sm font-semibold text-foreground">{enrollment.training_title}</span>
          <Badge variant={STATUS_VARIANTS[enrollment.status]} size="sm">
            {STATUS_LABELS[enrollment.status]}
          </Badge>
        </div>

        {enrollment.status !== 'completed' && enrollment.status !== 'expired' && (
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="label-xs text-muted-foreground">Progreso</span>
              <span className="label-xs text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {enrollment.status === 'completed' && (
          <div className="flex items-center gap-3 flex-wrap">
            {enrollment.score !== undefined && (
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="size-4 text-emerald-500" />
                <span className="label-xs text-foreground font-medium">Puntuación: {enrollment.score}/100</span>
              </div>
            )}
            {enrollment.certificate_url && (
              <div className="flex items-center gap-1.5">
                <CertificateIcon className="size-4 text-amber-500" />
                <span className="label-xs text-blue-600 underline cursor-pointer">Ver certificado</span>
              </div>
            )}
            {enrollment.completed_at && (
              <span className="label-xs text-muted-foreground">
                Completada el {new Date(enrollment.completed_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        )}

        {enrollment.status === 'expired' && (
          <span className="label-xs text-amber-600 block">
            Esta formación ha caducado. Puede ser necesaria una renovación.
          </span>
        )}
      </CardContent>
    </Card>
  )
}

// ─── RequestTrainingDialog ────────────────────────────────────────────────────

interface RequestTrainingDialogProps {
  open: boolean
  onClose: () => void
  trainings: Training[]
  onRequest: (trainingId: string, reason: string) => void
}

function RequestTrainingDialog({ open, onClose, trainings, onRequest }: RequestTrainingDialogProps) {
  const [selectedId, setSelectedId] = useState('')
  const [reason, setReason] = useState('')

  const selected = trainings.find((t) => t.id === selectedId)

  function handleRequest() {
    if (!selectedId) return
    onRequest(selectedId, reason)
    setSelectedId('')
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar formación</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Formación</label>
            <Select value={selectedId} onValueChange={(v: string) => setSelectedId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una formación..." />
              </SelectTrigger>
              <SelectContent>
                {trainings.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('label-xs font-medium px-2 py-0.5 rounded', TYPE_COLORS[selected.type])}>
                  {TYPE_LABELS[selected.type]}
                </span>
                {selected.fundae_eligible && (
                  <Badge variant="success" size="xs">FUNDAE</Badge>
                )}
              </div>
              <p className="paragraph-xs text-muted-foreground">{selected.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ClockIcon className="size-3.5" />
                  <span className="label-xs">{selected.duration_hours}h</span>
                </div>
                {selected.cost_per_person !== undefined && selected.cost_per_person > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CurrencyEurIcon className="size-3.5" />
                    <span className="label-xs">{formatEuro(selected.cost_per_person)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">
              ¿Por qué te interesa esta formación? (opcional)
            </label>
            <Input
              placeholder="Describe cómo te ayudaría en tu rol actual..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleRequest} disabled={!selectedId}>
            Enviar solicitud
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeTrainingPage() {
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>(MOCK_ENROLLMENTS)
  const [requestOpen, setRequestOpen] = useState(false)
  const [search, setSearch] = useState('')

  const myEnrollments = enrollments.filter((e) => e.employee_id === CURRENT_EMPLOYEE_ID)
  const myTrainingIds = new Set(myEnrollments.map((e) => e.training_id))
  const availableCatalog = MOCK_TRAININGS.filter((t) => !myTrainingIds.has(t.id))

  const filteredCatalog = useMemo(() => {
    if (!search.trim()) return availableCatalog
    const q = search.toLowerCase()
    return availableCatalog.filter(
      (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
    )
  }, [availableCatalog, search])

  const activeEnrollments = myEnrollments.filter(
    (e) => e.status === 'in_progress' || e.status === 'not_started',
  )
  const completedEnrollments = myEnrollments.filter(
    (e) => e.status === 'completed' || e.status === 'expired',
  )

  function handleRequest(trainingId: string) {
    const training = MOCK_TRAININGS.find((t) => t.id === trainingId)
    if (!training) return
    const newEnrollment: TrainingEnrollment = {
      id: `enr-new-${Date.now()}`,
      training_id: trainingId,
      training_title: training.title,
      employee_id: CURRENT_EMPLOYEE_ID,
      employee_name: 'Sofía Romero',
      status: 'not_started',
      enrolled_at: new Date().toISOString(),
    }
    setEnrollments((prev) => [...prev, newEnrollment])
    setRequestOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Mi Formación</h1>
          <p className="paragraph-sm text-muted-foreground mt-0.5">
            Formaciones asignadas y disponibles para solicitar
          </p>
        </div>
        <Button onClick={() => setRequestOpen(true)} disabled={availableCatalog.length === 0}>
          <PlusIcon className="size-4 mr-1.5" />
          Solicitar formación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Completadas</span>
            <span className="title-lg font-semibold text-foreground">
              {myEnrollments.filter((e) => e.status === 'completed').length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">En curso</span>
            <span className="title-lg font-semibold text-foreground">
              {myEnrollments.filter((e) => e.status === 'in_progress').length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Sin iniciar</span>
            <span className="title-lg font-semibold text-foreground">
              {myEnrollments.filter((e) => e.status === 'not_started').length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Active enrollments */}
      {activeEnrollments.length > 0 && (
        <div>
          <span className="label-md font-semibold text-foreground block mb-3">
            Formaciones activas ({activeEnrollments.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEnrollments.map((e) => (
              <EnrollmentCard key={e.id} enrollment={e} />
            ))}
          </div>
        </div>
      )}

      {/* Catalog */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="label-md font-semibold text-foreground">
            Catálogo disponible ({filteredCatalog.length})
          </span>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-48 paragraph-xs"
            />
          </div>
        </div>
        {filteredCatalog.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <GraduationCapIcon className="size-8 text-muted-foreground mx-auto mb-2" />
              <span className="paragraph-sm text-muted-foreground">
                {myEnrollments.length > 0
                  ? 'Ya estás inscrito en todas las formaciones disponibles.'
                  : 'Sin formaciones disponibles.'}
              </span>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCatalog.map((training) => (
              <Card key={training.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="label-sm font-semibold text-foreground line-clamp-2">{training.title}</span>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      <span className={cn('label-xs font-medium px-2 py-0.5 rounded', TYPE_COLORS[training.type])}>
                        {TYPE_LABELS[training.type]}
                      </span>
                      {training.fundae_eligible && (
                        <Badge variant="success" size="xs">FUNDAE</Badge>
                      )}
                    </div>
                  </div>
                  <p className="paragraph-xs text-muted-foreground mb-3 line-clamp-2">{training.description}</p>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ClockIcon className="size-3.5" />
                      <span className="label-xs">{training.duration_hours}h</span>
                    </div>
                    {training.cost_per_person !== undefined && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CurrencyEurIcon className="size-3.5" />
                        <span className="label-xs">
                          {training.cost_per_person === 0 ? 'Gratuito' : formatEuro(training.cost_per_person)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="label-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {training.category}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => { handleRequest(training.id) }}
                  >
                    Solicitar inscripción
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {completedEnrollments.length > 0 && (
        <div>
          <span className="label-md font-semibold text-foreground block mb-3">
            Historial ({completedEnrollments.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedEnrollments.map((e) => (
              <EnrollmentCard key={e.id} enrollment={e} />
            ))}
          </div>
        </div>
      )}

      {/* Dialog */}
      <RequestTrainingDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        trainings={availableCatalog}
        onRequest={handleRequest}
      />
    </div>
  )
}
