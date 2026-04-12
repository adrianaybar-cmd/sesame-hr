'use client'

export const dynamic = 'force-dynamic'

import { useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  XIcon,
  CaretRightIcon,
  CaretLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  NotePencilIcon,
  TagIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { MOCK_VACANCIES, MOCK_CANDIDATES, getCandidatesByVacancy } from '@/lib/mock/recruitment'
import type { Candidate, CandidateStage } from '@/lib/types/recruitment'

// ─── Stage config ──────────────────────────────────────────────────────────

const STAGES: { id: CandidateStage; label: string; color: string }[] = [
  { id: 'applied', label: 'Solicitud', color: 'bg-muted text-muted-foreground' },
  { id: 'screening', label: 'Revisión CV', color: 'bg-blue-100 text-blue-700' },
  { id: 'interview_1', label: '1ª Entrevista', color: 'bg-violet-100 text-violet-700' },
  { id: 'interview_2', label: '2ª Entrevista', color: 'bg-purple-100 text-purple-700' },
  { id: 'technical', label: 'Prueba técnica', color: 'bg-amber-100 text-amber-700' },
  { id: 'offer', label: 'Oferta', color: 'bg-orange-100 text-orange-700' },
  { id: 'hired', label: 'Contratado', color: 'bg-green-100 text-green-700' },
  { id: 'rejected', label: 'Descartado', color: 'bg-red-100 text-red-700' },
]

// ─── Candidate card ────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  onClick,
  onMoveStage,
}: {
  candidate: Candidate
  onClick: () => void
  onMoveStage: (dir: 'prev' | 'next') => void
}) {
  const currentIdx = STAGES.findIndex((s) => s.id === candidate.stage)
  const canMovePrev = currentIdx > 0
  const canMoveNext = currentIdx < STAGES.length - 1

  return (
    <div
      className="rounded-lg border border-border bg-card p-3 flex flex-col gap-2 cursor-pointer hover:shadow-sm hover:border-primary/30 transition-all"
      onClick={onClick}
    >
      {/* Name + email */}
      <div className="flex items-start gap-2">
        <div className="size-8 rounded-full bg-accent flex items-center justify-center shrink-0">
          <span className="label-xs font-semibold text-foreground">
            {candidate.first_name[0]}{candidate.last_name[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="label-sm font-semibold text-foreground truncate">
            {candidate.first_name} {candidate.last_name}
          </p>
          <p className="paragraph-xs text-muted-foreground truncate">{candidate.email}</p>
        </div>
      </div>

      {/* Rating */}
      {candidate.rating && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={cn('text-xs', i < candidate.rating! ? 'text-warning' : 'text-muted')}>
              ★
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {candidate.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {candidate.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {candidate.tags.length > 3 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">
              +{candidate.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Move actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-border" onClick={(e) => e.stopPropagation()}>
        <button
          disabled={!canMovePrev}
          onClick={() => onMoveStage('prev')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Fase anterior"
        >
          <CaretLeftIcon className="size-3" />
          <span className="label-xs">Anterior</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          disabled={!canMoveNext}
          onClick={() => onMoveStage('next')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Fase siguiente"
        >
          <span className="label-xs">Siguiente</span>
          <CaretRightIcon className="size-3" />
        </button>
      </div>
    </div>
  )
}

// ─── Candidate profile slide-over ─────────────────────────────────────────

function CandidateSlideOver({
  candidate,
  onClose,
  onMoveStage,
}: {
  candidate: Candidate
  onClose: () => void
  onMoveStage: (dir: 'prev' | 'next') => void
}) {
  const currentIdx = STAGES.findIndex((s) => s.id === candidate.stage)
  const currentStage = STAGES[currentIdx]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="w-[420px] bg-background border-l border-border flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="label-lg font-semibold text-foreground">Perfil del candidato</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-5">
          {/* Avatar + basic info */}
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="title-xs font-semibold text-foreground">
                {candidate.first_name[0]}{candidate.last_name[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="label-lg font-semibold text-foreground">
                {candidate.first_name} {candidate.last_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full label-xs font-medium', currentStage.color)}>
                  {currentStage.label}
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="label-sm font-semibold text-foreground">Contacto</p>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="size-4 text-muted-foreground shrink-0" />
              <a href={`mailto:${candidate.email}`} className="paragraph-sm text-primary hover:underline truncate">
                {candidate.email}
              </a>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-muted-foreground shrink-0" />
                <a href={`tel:${candidate.phone}`} className="paragraph-sm text-foreground">
                  {candidate.phone}
                </a>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <p className="label-sm font-semibold text-foreground">Valoración</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={cn('text-xl', candidate.rating && i < candidate.rating ? 'text-warning' : 'text-muted')}>
                  ★
                </span>
              ))}
              {!candidate.rating && <span className="paragraph-sm text-muted-foreground">Sin valorar</span>}
            </div>
          </div>

          {/* Tags */}
          {candidate.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <TagIcon className="size-4 text-muted-foreground" />
                <p className="label-sm font-semibold text-foreground">Etiquetas</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full label-xs font-medium bg-accent text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <NotePencilIcon className="size-4 text-muted-foreground" />
              <p className="label-sm font-semibold text-foreground">Notas</p>
            </div>
            {candidate.notes ? (
              <p className="paragraph-sm text-foreground bg-accent/50 rounded-lg p-3">{candidate.notes}</p>
            ) : (
              <p className="paragraph-sm text-muted-foreground italic">Sin notas</p>
            )}
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-2">
            <p className="label-sm font-semibold text-foreground">Historial de fases</p>
            <div className="flex flex-col gap-1">
              {STAGES.slice(0, currentIdx + 1).map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'size-2 rounded-full shrink-0',
                      idx === currentIdx ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                  />
                  <span
                    className={cn(
                      'paragraph-xs',
                      idx === currentIdx ? 'text-foreground font-medium' : 'text-muted-foreground',
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => onMoveStage('prev')}
              disabled={currentIdx === 0}
              className="flex-1"
            >
              <CaretLeftIcon className="size-4" />
              Fase anterior
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onMoveStage('next')}
              disabled={currentIdx === STAGES.length - 1}
              className="flex-1"
            >
              Siguiente fase
              <CaretRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VacancyPipelinePage({ params }: { params: Promise<{ vacancyId: string }> }) {
  const { vacancyId } = use(params)
  const vacancy = MOCK_VACANCIES.find((v) => v.id === vacancyId)
  const [candidates, setCandidates] = useState<Candidate[]>(() => getCandidatesByVacancy(vacancyId))
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  if (!vacancy) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <UserCircleIcon className="size-12 text-muted-foreground" />
        <p className="label-md text-muted-foreground">Vacante no encontrada</p>
        <Button variant="outline" size="md" asChild>
          <Link href="/admin/recruitment">Volver a reclutamiento</Link>
        </Button>
      </div>
    )
  }

  function moveCandidate(candidateId: string, dir: 'prev' | 'next') {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c
        const currentIdx = STAGES.findIndex((s) => s.id === c.stage)
        const newIdx = dir === 'next' ? currentIdx + 1 : currentIdx - 1
        if (newIdx < 0 || newIdx >= STAGES.length) return c
        const updated = { ...c, stage: STAGES[newIdx].id }
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(updated)
        }
        return updated
      }),
    )
  }

  return (
    <div className="flex flex-col gap-5 min-h-0">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" iconOnly asChild className="mt-0.5">
          <Link href="/admin/recruitment">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="title-2xs font-semibold text-foreground">{vacancy.title}</h1>
            <Badge variant={vacancy.status === 'published' ? 'success' : vacancy.status === 'closed' ? 'error' : 'warning'} size="sm">
              {vacancy.status === 'published' ? 'Publicada' : vacancy.status === 'closed' ? 'Cerrada' : 'Pausada'}
            </Badge>
          </div>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {vacancy.department_name} · {vacancy.location} · {candidates.length} candidato{candidates.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-3 min-w-max pb-4">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage.id)
            return (
              <div key={stage.id} className="w-56 flex flex-col gap-2 shrink-0">
                {/* Column header */}
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className={cn('label-xs font-semibold px-2 py-0.5 rounded-full', stage.color)}>
                    {stage.label}
                  </span>
                  <span className="label-xs font-medium text-muted-foreground">{stageCandidates.length}</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 min-h-[120px] rounded-lg bg-muted/30 p-2">
                  {stageCandidates.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-6">
                      <p className="paragraph-xs text-muted-foreground">Sin candidatos</p>
                    </div>
                  ) : (
                    stageCandidates.map((c) => (
                      <CandidateCard
                        key={c.id}
                        candidate={c}
                        onClick={() => setSelectedCandidate(c)}
                        onMoveStage={(dir) => moveCandidate(c.id, dir)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Slide-over */}
      {selectedCandidate && (
        <CandidateSlideOver
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onMoveStage={(dir) => moveCandidate(selectedCandidate.id, dir)}
        />
      )}
    </div>
  )
}
