'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@clasing/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  ListIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  TagIcon,
  CheckSquareIcon,
  SquareIcon,
} from '@phosphor-icons/react'
import { MOCK_TASKS, MOCK_PROJECTS } from '@/lib/mock/tasks'
import type { Task, TaskStatus, TaskPriority, Subtask, TimeEntry } from '@/lib/types/tasks'
import { TaskTimer } from '@/components/tasks/task-timer'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

// Demo: empleado emp-6 (Sofía Moreno) como sesión actual
const CURRENT_EMPLOYEE_ID = 'emp-6'

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  review: 'En revisión',
  done: 'Hecho',
  cancelled: 'Cancelado',
}

const STATUS_VARIANTS: Record<TaskStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'error'> = {
  todo: 'neutral',
  in_progress: 'primary',
  review: 'warning',
  done: 'success',
  cancelled: 'error',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

const PRIORITY_VARIANTS: Record<TaskPriority, 'neutral' | 'primary' | 'warning' | 'error'> = {
  low: 'neutral',
  medium: 'primary',
  high: 'warning',
  urgent: 'error',
}

const STATUS_GROUPS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'Por hacer' },
  { status: 'in_progress', label: 'En progreso' },
  { status: 'review', label: 'En revisión' },
  { status: 'done', label: 'Hecho' },
]

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const project = MOCK_PROJECTS.find((p) => p.id === task.project_id)
  const overdue = task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date()

  return (
    <button
      className="w-full text-left rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-shadow flex flex-col gap-3"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="label-sm font-medium text-foreground leading-snug">{task.title}</p>
        <Badge variant={PRIORITY_VARIANTS[task.priority]} size="sm">
          {PRIORITY_LABELS[task.priority]}
        </Badge>
      </div>

      {project && (
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
          <span className="paragraph-xs text-muted-foreground truncate">{project.name}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {task.due_date && (
          <div className={cn('flex items-center gap-1', overdue ? 'text-destructive' : 'text-muted-foreground')}>
            <CalendarIcon className="size-3.5" />
            <span className="paragraph-xs">
              {new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        )}
        {task.subtasks.length > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckSquareIcon className="size-3.5" />
            <span className="paragraph-xs">
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </span>
          </div>
        )}
        {task.time_spent_minutes > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ClockIcon className="size-3.5" />
            <span className="paragraph-xs">{Math.floor(task.time_spent_minutes / 60)}h {task.time_spent_minutes % 60}m</span>
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Task Detail SlideOver ────────────────────────────────────────────────────

function TaskDetailDialog({
  task,
  onClose,
}: {
  task: Task | null
  onClose: () => void
}) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks ?? [])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  if (!task) return null

  const project = MOCK_PROJECTS.find((p) => p.id === task.project_id)

  function toggleSubtask(id: string) {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }

  const completedCount = subtasks.filter((s) => s.completed).length

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-6">
            <CheckCircleIcon className="size-5 text-muted-foreground mt-0.5 shrink-0" />
            <DialogTitle className="text-left leading-snug">{task.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {project && (
              <Badge variant="neutral" size="sm">
                <span className="size-2 rounded-full inline-block mr-1" style={{ backgroundColor: project.color }} />
                {project.name}
              </Badge>
            )}
            <Badge variant={STATUS_VARIANTS[task.status]} size="sm">{STATUS_LABELS[task.status]}</Badge>
            <Badge variant={PRIORITY_VARIANTS[task.priority]} size="sm">{PRIORITY_LABELS[task.priority]}</Badge>
          </div>

          {/* Description */}
          {task.description && (
            <div className="flex flex-col gap-1">
              <p className="label-sm font-medium text-foreground">Descripción</p>
              <p className="paragraph-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {task.due_date && (
              <div className="flex flex-col gap-0.5">
                <p className="label-xs text-muted-foreground">Fecha límite</p>
                <p className="paragraph-sm text-foreground">
                  {new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
            {task.assignee_name && (
              <div className="flex flex-col gap-0.5">
                <p className="label-xs text-muted-foreground">Asignado a</p>
                <p className="paragraph-sm text-foreground">{task.assignee_name}</p>
              </div>
            )}
            {task.estimated_minutes && (
              <div className="flex flex-col gap-0.5">
                <p className="label-xs text-muted-foreground">Estimación</p>
                <p className="paragraph-sm text-foreground">
                  {Math.floor(task.estimated_minutes / 60)}h {task.estimated_minutes % 60}m
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <TagIcon className="size-3.5 text-muted-foreground mt-0.5" />
              {task.tags.map((tag) => (
                <span key={tag} className="paragraph-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="label-sm font-medium text-foreground">Subtareas</p>
                <span className="paragraph-xs text-muted-foreground">{completedCount}/{subtasks.length}</span>
              </div>
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {subtasks.map((subtask) => (
                  <button
                    key={subtask.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-left w-full"
                    onClick={() => toggleSubtask(subtask.id)}
                  >
                    {subtask.completed ? (
                      <CheckSquareIcon className="size-4 text-primary shrink-0" />
                    ) : (
                      <SquareIcon className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={cn(
                        'paragraph-sm',
                        subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      )}
                    >
                      {subtask.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="flex flex-col gap-2">
            <p className="label-sm font-medium text-foreground">Registro de tiempo</p>
            <TaskTimer
              taskId={task.id}
              employeeId={CURRENT_EMPLOYEE_ID}
              existingMinutes={task.time_spent_minutes}
              onEntryAdded={(entry) => setTimeEntries((prev) => [...prev, entry])}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ tasks }: { tasks: Task[] }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const adjustedFirstDay = (firstDay + 6) % 7 // Monday-first

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  const tasksByDay: Record<number, Task[]> = {}
  tasks.forEach((task) => {
    if (!task.due_date) return
    const d = new Date(task.due_date)
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate()
      if (!tasksByDay[day]) tasksByDay[day] = []
      tasksByDay[day].push(task)
    }
  })

  const cells: (number | null)[] = [
    ...Array(adjustedFirstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthName = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4">
      <p className="label-md font-semibold text-foreground capitalize">{monthName}</p>
      <div className="grid grid-cols-7 gap-px">
        {dayNames.map((d) => (
          <div key={d} className="text-center py-2">
            <span className="label-xs font-medium text-muted-foreground">{d}</span>
          </div>
        ))}
        {cells.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              'min-h-20 p-1.5 border border-border rounded-md flex flex-col gap-1',
              day === now.getDate() ? 'bg-accent/40' : 'bg-card',
              !day && 'bg-transparent border-transparent'
            )}
          >
            {day && (
              <>
                <span className={cn('label-xs font-medium', day === now.getDate() ? 'text-primary' : 'text-foreground')}>
                  {day}
                </span>
                {(tasksByDay[day] ?? []).slice(0, 3).map((task) => {
                  const project = MOCK_PROJECTS.find((p) => p.id === task.project_id)
                  return (
                    <div
                      key={task.id}
                      className="rounded px-1.5 py-0.5 truncate"
                      style={{ backgroundColor: `${project?.color ?? '#94a3b8'}20`, borderLeft: `2px solid ${project?.color ?? '#94a3b8'}` }}
                    >
                      <span className="paragraph-xs text-foreground truncate block">{task.title}</span>
                    </div>
                  )
                })}
                {(tasksByDay[day]?.length ?? 0) > 3 && (
                  <span className="paragraph-xs text-muted-foreground pl-1">+{(tasksByDay[day]?.length ?? 0) - 3} más</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeTasksPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskProject, setNewTaskProject] = useState('')

  const myTasks = MOCK_TASKS.filter((t) => t.assignee_id === CURRENT_EMPLOYEE_ID)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Mis Tareas</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {myTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length} tareas pendientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 paragraph-sm transition-colors',
                view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setView('list')}
            >
              <ListIcon className="size-4" />
              Lista
            </button>
            <button
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 paragraph-sm transition-colors border-l border-border',
                view === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="size-4" />
              Calendario
            </button>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowNewTask(true)}>
            <PlusIcon className="size-4" />
            Nueva tarea
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="flex flex-col gap-6">
          {STATUS_GROUPS.map(({ status, label }) => {
            const groupTasks = myTasks.filter((t) => t.status === status)
            if (groupTasks.length === 0) return null
            return (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CircleIcon className="size-3.5 text-muted-foreground" />
                  <span className="label-sm font-semibold text-foreground">{label}</span>
                  <span className="label-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                    {groupTasks.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {groupTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </div>
              </div>
            )
          })}
          {myTasks.filter((t) => t.status !== 'cancelled').length === 0 && (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <CheckSquareIcon className="size-12 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">No tienes tareas asignadas</p>
            </div>
          )}
        </div>
      ) : (
        <CalendarView tasks={myTasks} />
      )}

      {/* Task Detail */}
      <TaskDetailDialog task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* New Task Dialog */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4 py-2"
            onSubmit={(e) => {
              e.preventDefault()
              setShowNewTask(false)
              setNewTaskTitle('')
              setNewTaskProject('')
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">¿Qué hay que hacer?</label>
              <Input
                placeholder="Título de la tarea..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Proyecto</label>
              <Select value={newTaskProject} onValueChange={setNewTaskProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Asignar a proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setShowNewTask(false)}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={!newTaskTitle.trim()}>Crear tarea</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
