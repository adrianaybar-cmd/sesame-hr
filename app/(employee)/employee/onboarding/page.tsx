'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import {
  CheckCircleIcon,
  CircleIcon,
  CheckSquareIcon,
  SquareIcon,
  ClipboardTextIcon,
  CalendarIcon,
  InfoIcon,
} from '@phosphor-icons/react'
import { MOCK_ONBOARDING_PROCESSES } from '@/lib/mock/onboarding'
import type { ProcessTask } from '@/lib/types/onboarding'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_EMPLOYEE_ID = 'emp-10'

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
  employee: 'Tú',
  hr: 'RRHH',
  manager: 'Tu manager',
  it: 'IT',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeOnboardingPage() {
  const process = MOCK_ONBOARDING_PROCESSES.find(
    (p) => p.employee_id === CURRENT_EMPLOYEE_ID && p.status === 'in_progress'
  )

  const [taskStates, setTaskStates] = useState<Record<string, boolean>>(
    () => Object.fromEntries((process?.tasks ?? []).map((t) => [t.id, t.completed]))
  )

  if (!process) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <CheckCircleIcon className="size-12 text-success" />
        <h1 className="title-2xs font-semibold text-foreground">¡Todo listo!</h1>
        <p className="paragraph-sm text-muted-foreground">No tienes procesos de onboarding activos en este momento.</p>
      </div>
    )
  }

  function toggleTask(taskId: string) {
    setTaskStates((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const completedCount = Object.values(taskStates).filter(Boolean).length
  const totalCount = process.tasks.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const categories = [...new Set(process.tasks.map((t) => t.category))]
  const startDate = new Date(process.start_date)
  const daysElapsed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mi Onboarding</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          {process.template_name} · Día {daysElapsed + 1} de {30}
        </p>
      </div>

      {/* Progress summary */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="label-md font-semibold text-foreground">Progreso total</p>
            <p className="paragraph-xs text-muted-foreground">
              {completedCount} de {totalCount} tareas completadas
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="title-xs font-semibold text-foreground">{progressPct}%</p>
            <Badge
              variant={progressPct === 100 ? 'success' : progressPct > 50 ? 'primary' : 'warning'}
              size="sm"
            >
              {progressPct === 100 ? 'Completado' : 'En progreso'}
            </Badge>
          </div>
        </div>
        <div className="h-3 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarIcon className="size-4" />
            <span className="paragraph-xs">
              Incorporación: {startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ClipboardTextIcon className="size-4" />
            <span className="paragraph-xs">{process.template_name}</span>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
        <InfoIcon className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="paragraph-xs text-foreground">
          Marca las tareas como completadas según las vayas realizando. Las tareas asignadas a otros equipos (RRHH, IT, Manager) las marcarán ellos automáticamente.
        </p>
      </div>

      {/* Tasks by category */}
      <div className="flex flex-col gap-6">
        {categories.map((category) => {
          const catTasks = process.tasks.filter((t) => t.category === category)
          const catDone = catTasks.filter((t) => taskStates[t.id]).length

          return (
            <div key={category} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={CATEGORY_VARIANTS[category]} size="sm">
                  {CATEGORY_LABELS[category]}
                </Badge>
                <span className="paragraph-xs text-muted-foreground">{catDone}/{catTasks.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                {catTasks.map((task) => {
                  const isCompleted = taskStates[task.id]
                  const canToggle = task.responsible === 'employee'

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-4 rounded-xl border transition-colors',
                        isCompleted ? 'bg-success/5 border-success/20' : 'bg-card border-border',
                        canToggle && 'cursor-pointer hover:bg-accent/30'
                      )}
                      onClick={() => canToggle && toggleTask(task.id)}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="size-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <CircleIcon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'label-sm font-medium',
                            isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            {task.required && !isCompleted && (
                              <Badge variant="error" size="sm">Requerida</Badge>
                            )}
                            <span className="paragraph-xs text-muted-foreground">Día {task.due_day}</span>
                          </div>
                        </div>

                        {task.description && (
                          <p className="paragraph-xs text-muted-foreground mt-1">{task.description}</p>
                        )}

                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={cn(
                            'paragraph-xs px-2 py-0.5 rounded-full',
                            task.responsible === 'employee'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent text-muted-foreground'
                          )}>
                            {RESPONSIBLE_LABELS[task.responsible]}
                          </span>
                          {!canToggle && (
                            <span className="paragraph-xs text-muted-foreground">
                              Esta tarea la gestiona {RESPONSIBLE_LABELS[task.responsible]}
                            </span>
                          )}
                        </div>

                        {isCompleted && task.completed_at && (
                          <p className="paragraph-xs text-success mt-1.5">
                            ✓ Completado el {new Date(task.completed_at).toLocaleDateString('es-ES')}
                            {task.completed_by ? ` por ${task.completed_by}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
