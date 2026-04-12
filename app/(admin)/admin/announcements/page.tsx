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
  MegaphoneIcon,
  EyeIcon,
  PencilSimpleIcon,
  TrashIcon,
  PaperPlaneTiltIcon,
  ClockIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { MOCK_ANNOUNCEMENTS } from '@/lib/mock/announcements'
import type { Announcement, AnnouncementStatus } from '@/lib/types/announcements'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AnnouncementStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  published: 'Publicado',
  archived: 'Archivado',
}

const STATUS_VARIANTS: Record<AnnouncementStatus, 'neutral' | 'warning' | 'success' | 'error'> = {
  draft: 'neutral',
  scheduled: 'warning',
  published: 'success',
  archived: 'error',
}

// ─── New Announcement Dialog ──────────────────────────────────────────────────

function NewAnnouncementDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [target, setTarget] = useState('all')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
    setTitle('')
    setContent('')
    setTarget('all')
    setScheduleDate('')
    setScheduleMode('now')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo comunicado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Título</label>
            <Input
              placeholder="Asunto del comunicado..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Contenido</label>
            <textarea
              className="w-full min-h-36 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground paragraph-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              placeholder="Escribe el contenido del comunicado..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Destinatarios</label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toda la empresa</SelectItem>
                  <SelectItem value="dept-1">Tecnología</SelectItem>
                  <SelectItem value="dept-2">Recursos Humanos</SelectItem>
                  <SelectItem value="dept-3">Marketing</SelectItem>
                  <SelectItem value="dept-4">Ventas</SelectItem>
                  <SelectItem value="dept-5">Finanzas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Publicación</label>
              <Select value={scheduleMode} onValueChange={(v: string) => setScheduleMode(v as 'now' | 'schedule')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Publicar ahora</SelectItem>
                  <SelectItem value="schedule">Programar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {scheduleMode === 'schedule' && (
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Fecha y hora de publicación</label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Guardar borrador</Button>
            <Button variant="primary" type="submit" disabled={!title.trim() || !content.trim()}>
              <PaperPlaneTiltIcon className="size-4" />
              {scheduleMode === 'now' ? 'Publicar' : 'Programar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnnouncementsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = MOCK_ANNOUNCEMENTS.filter((a) =>
    statusFilter === 'all' || a.status === statusFilter
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Comunicados</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {MOCK_ANNOUNCEMENTS.length} comunicados en total
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowNew(true)}>
          <PlusIcon className="size-4" />
          Nuevo comunicado
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="scheduled">Programados</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="archived">Archivados</SelectItem>
          </SelectContent>
        </Select>
        <span className="paragraph-sm text-muted-foreground">
          {filtered.length} comunicado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <MegaphoneIcon className="size-12 text-muted-foreground" />
          <p className="paragraph-sm text-muted-foreground">No hay comunicados con el filtro aplicado</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((ann) => (
              <div key={ann.id} className="flex items-start gap-4 px-5 py-4 bg-card hover:bg-accent/20 transition-colors">
                <div
                  className={cn(
                    'size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    ann.status === 'published' ? 'bg-success/10' : ann.status === 'scheduled' ? 'bg-warning/10' : 'bg-accent'
                  )}
                >
                  <MegaphoneIcon className={cn(
                    'size-4',
                    ann.status === 'published' ? 'text-success' : ann.status === 'scheduled' ? 'text-warning' : 'text-muted-foreground'
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label-md font-semibold text-foreground truncate">{ann.title}</p>
                      <p className="paragraph-xs text-muted-foreground mt-0.5">
                        Por {ann.author_name}
                        {ann.published_at && (
                          <> · {new Date(ann.published_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</>
                        )}
                        {ann.scheduled_at && !ann.published_at && (
                          <> · Programado: {new Date(ann.scheduled_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={STATUS_VARIANTS[ann.status]} size="sm">
                        {STATUS_LABELS[ann.status]}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <UsersIcon className="size-3.5" />
                      <span className="paragraph-xs">
                        {ann.target_employees === 'all' ? 'Toda la empresa' : `${Array.isArray(ann.target_employees) ? ann.target_employees.length : 0} destinatarios`}
                      </span>
                    </div>
                    {ann.status === 'published' && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <EyeIcon className="size-3.5" />
                        <span className="paragraph-xs">{ann.views_count} vistas</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="xs" iconOnly tooltip="Editar">
                    <PencilSimpleIcon className="size-4" />
                  </Button>
                  <Button variant="ghost" size="xs" iconOnly tooltip="Eliminar" className="text-destructive hover:text-destructive">
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NewAnnouncementDialog open={showNew} onClose={() => setShowNew(false)} />
    </div>
  )
}
