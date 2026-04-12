'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@clasing/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@clasing/ui/dialog'
import {
  UsersIcon,
  ClipboardTextIcon,
  CheckCircleIcon,
  CircleIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  CheckSquareIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_ONBOARDING_PROCESSES, MOCK_ONBOARDING_TEMPLATES } from '@/lib/mock/onboarding'
import type { OnboardingProcess, OnboardingTemplate, ProcessTask } from '@/lib/types/onboarding'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS = {
  documentation: 'Documentación',
  setup: 'Configuración',
  training: 'Formación',
  meeting: 'Reunión',
  other: 'Otro',
}

const CATEGORY_VARIANTS = {
  documentation: 'primary',
  setup: 'warning',
  training: 'success',
  meeting: 'neutral',
  other: 'neutral',
} as const

const RESPONSIBLE_LABELS = {
  employee: 'Empleado',
  hr: 'RRHH',
  manager: 'Manager',
  it: 'IT',
}

// ─── Process Card ─────────────────────────────────────────────────────────────

function ProcessCard({
  process,
  onClick,
}: {
  process: OnboardingProcess
  onClick: () => void
}) {
  const startDate = new Date(process.start_date)
  const daysElapsed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const completedTasks = process.tasks.filter((t) => t.completed).length

  const initials = process.employee_name.split(' ').slice(0, 2).map((n) => n[0]).join('')

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            <span className="label-sm font-semibold text-foreground">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="label-md font-semibold text-foreground truncate">{process.employee_name}</p>
            <p className="paragraph-xs text-muted-foreground">{process.template_name}</p>
          </div>
        </div>
        <Badge
          variant={process.type === 'onboarding' ? 'success' : 'warning'}
          size="sm"
        >
          {process.type === 'onboarding' ? 'Onboarding' : 'Offboarding'}
        </Badge>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="paragraph-xs text-muted-foreground">Progreso</span>
          <span className="label-xs font-medium text-foreground">{process.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${process.progress}%` }}
          />
        </div>
        <p className="paragraph-xs text-muted-foreground">
          {completedTasks} de {process.tasks.length} tareas
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="size-3.5" />
          <span className="paragraph-xs">
            Inicio: {startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <ClipboardTextIcon className="size-3.5" />
          <span className="paragraph-xs">Día {daysElapsed + 1}</span>
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
        Ver checklist completo
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  )
}

// ─── Process Detail Dialog ────────────────────────────────────────────────────

function ProcessDetailDialog({
  process,
  onClose,
}: {
  process: OnboardingProcess | null
  onClose: () => void
}) {
  if (!process) return null

  const categories = [...new Set(process.tasks.map((t) => t.category))]

  return (
    <Dialog open={!!process} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {process.type === 'onboarding' ? 'Onboarding' : 'Offboarding'} — {process.employee_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="label-sm font-medium text-foreground">Progreso general</span>
              <span className="label-sm font-semibold text-foreground">{process.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${process.progress}%` }} />
            </div>
          </div>

          {/* Tasks by category */}
          {categories.map((category) => {
            const catTasks = process.tasks.filter((t) => t.category === category)
            return (
              <div key={category} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={CATEGORY_VARIANTS[category]} size="sm">
                    {CATEGORY_LABELS[category]}
                  </Badge>
                  <span className="paragraph-xs text-muted-foreground">
                    {catTasks.filter((t) => t.completed).length}/{catTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {catTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3 px-3 py-3 rounded-lg border',
                        task.completed ? 'bg-success/5 border-success/20' : 'bg-card border-border'
                      )}
                    >
                      {task.completed ? (
                        <CheckCircleIcon className="size-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <CircleIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={cn('label-sm font-medium', task.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="paragraph-xs text-muted-foreground mt-0.5">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="paragraph-xs text-muted-foreground">Responsable: {RESPONSIBLE_LABELS[task.responsible]}</span>
                          <span className="paragraph-xs text-muted-foreground">Día {task.due_day}</span>
                          {task.required && <span className="paragraph-xs text-destructive">Obligatorio</span>}
                        </div>
                        {task.completed_at && task.completed_by && (
                          <p className="paragraph-xs text-success mt-1">
                            Completado por {task.completed_by} el {new Date(task.completed_at).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Templates Tab ────────────────────────────────────────────────────────────

function TemplatesTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="label-sm font-medium text-foreground">{MOCK_ONBOARDING_TEMPLATES.length} plantillas</p>
        <Button variant="outline" size="sm">
          <PlusIcon className="size-4" />
          Nueva plantilla
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_ONBOARDING_TEMPLATES.map((template) => (
          <div key={template.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-start justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="label-md font-semibold text-foreground">{template.name}</p>
                {template.description && (
                  <p className="paragraph-xs text-muted-foreground mt-0.5">{template.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ClipboardTextIcon className="size-3.5" />
                    <span className="paragraph-xs">{template.duration_days} días</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CheckSquareIcon className="size-3.5" />
                    <span className="paragraph-xs">{template.tasks.length} tareas</span>
                  </div>
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
            <div className="divide-y divide-border">
              {template.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                  <Badge variant={CATEGORY_VARIANTS[task.category]} size="sm">{CATEGORY_LABELS[task.category]}</Badge>
                  <span className="paragraph-sm text-foreground flex-1">{task.title}</span>
                  <span className="paragraph-xs text-muted-foreground shrink-0">Día {task.due_day}</span>
                  <span className="paragraph-xs text-muted-foreground shrink-0">{RESPONSIBLE_LABELS[task.responsible]}</span>
                  {task.required && <Badge variant="error" size="sm">Requerida</Badge>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOnboardingPage() {
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null)

  const allProcesses = MOCK_ONBOARDING_PROCESSES
  const activeProcesses = allProcesses.filter((p) => p.status === 'in_progress')
  const completedProcesses = allProcesses.filter((p) => p.status === 'completed')

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Onboarding & Offboarding</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {activeProcesses.length} proceso{activeProcesses.length !== 1 ? 's' : ''} activo{activeProcesses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" size="md">
          <PlusIcon className="size-4" />
          Nuevo proceso
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList {...({} as any)}>
          <TabsTrigger value="active">
            <UsersIcon className="size-4" />
            Procesos activos
            <span className="ml-1.5 bg-primary/10 text-primary label-xs font-semibold px-1.5 py-0.5 rounded-full">
              {activeProcesses.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="templates">
            <ClipboardTextIcon className="size-4" />
            Plantillas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeProcesses.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <UsersIcon className="size-12 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">No hay procesos activos en este momento</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeProcesses.map((p) => (
                  <ProcessCard key={p.id} process={p} onClick={() => setSelectedProcess(p)} />
                ))}
              </div>

              {completedProcesses.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-muted-foreground" />
                    <p className="label-sm font-medium text-muted-foreground">Completados recientemente</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {completedProcesses.map((p) => (
                      <ProcessCard key={p.id} process={p} onClick={() => setSelectedProcess(p)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplatesTab />
        </TabsContent>
      </Tabs>

      <ProcessDetailDialog process={selectedProcess} onClose={() => setSelectedProcess(null)} />
    </div>
  )
}
