'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@clasing/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  CheckSquareIcon,
  FolderIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
} from '@phosphor-icons/react'
import { MOCK_PROJECTS, MOCK_TASKS } from '@/lib/mock/tasks'
import { MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { Project, Task, TaskStatus, TaskPriority } from '@/lib/types/tasks'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const progressPct = project.task_count > 0
    ? Math.round((project.completed_task_count / project.task_count) * 100)
    : 0

  const members = MOCK_EMPLOYEES.filter((e) => project.members.includes(e.id))

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="size-3 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <div className="min-w-0">
            <p className="label-md font-semibold text-foreground truncate">{project.name}</p>
            {project.description && (
              <p className="paragraph-xs text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
            )}
          </div>
        </div>
        <Badge
          variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'neutral' : 'warning'}
          size="sm"
        >
          {project.status === 'active' ? 'Activo' : project.status === 'completed' ? 'Completado' : 'Archivado'}
        </Badge>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="paragraph-xs text-muted-foreground">Progreso</span>
          <span className="label-xs font-medium text-foreground">{progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="paragraph-xs text-muted-foreground">
          {project.completed_task_count} de {project.task_count} tareas completadas
        </p>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {members.slice(0, 4).map((emp) => (
            <div
              key={emp.id}
              className="size-7 rounded-full bg-accent border-2 border-card flex items-center justify-center"
              title={`${emp.first_name} ${emp.last_name}`}
            >
              <span className="label-xs font-semibold text-foreground">
                {emp.first_name[0]}{emp.last_name[0]}
              </span>
            </div>
          ))}
          {members.length > 4 && (
            <div className="size-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
              <span className="label-xs font-medium text-muted-foreground">+{members.length - 4}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <CheckSquareIcon className="size-3.5" />
          <span className="paragraph-xs">{project.task_count} tareas</span>
        </div>
      </div>
    </div>
  )
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <div
        className="size-2 rounded-full shrink-0"
        style={{
          backgroundColor: MOCK_PROJECTS.find((p) => p.id === task.project_id)?.color ?? '#94a3b8',
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="label-md font-medium text-foreground truncate">{task.title}</p>
        <p className="paragraph-xs text-muted-foreground truncate">{task.project_name}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={PRIORITY_VARIANTS[task.priority]} size="sm">
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        <Badge variant={STATUS_VARIANTS[task.status]} size="sm">
          {STATUS_LABELS[task.status]}
        </Badge>
        {task.due_date && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="size-3.5" />
            <span className="paragraph-xs">
              {new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        )}
        {task.assignee_name && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <UserIcon className="size-3.5" />
            <span className="paragraph-xs truncate max-w-24">{task.assignee_name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Statistics Tab ───────────────────────────────────────────────────────────

function StatsTab() {
  const totalTasks = MOCK_TASKS.length
  const byStatus = MOCK_TASKS.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalMinutes = MOCK_TASKS.reduce((sum, t) => sum + t.time_spent_minutes, 0)
  const totalHours = Math.floor(totalMinutes / 60)

  const byProject = MOCK_PROJECTS.map((p) => ({
    project: p,
    tasks: MOCK_TASKS.filter((t) => t.project_id === p.id),
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total tareas', value: totalTasks, icon: CheckSquareIcon },
          { label: 'Completadas', value: byStatus['done'] ?? 0, icon: CheckSquareIcon },
          { label: 'En progreso', value: byStatus['in_progress'] ?? 0, icon: ClockIcon },
          { label: 'Horas registradas', value: `${totalHours}h`, icon: ClockIcon },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
            <kpi.icon className="size-5 text-muted-foreground" />
            <p className="title-xs font-semibold text-foreground">{kpi.value}</p>
            <p className="paragraph-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Por proyecto */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="label-md font-semibold text-foreground">Resumen por proyecto</p>
        </div>
        <div className="divide-y divide-border">
          {byProject.map(({ project, tasks }) => {
            const done = tasks.filter((t) => t.status === 'done').length
            const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
            return (
              <div key={project.id} className="px-5 py-4 flex items-center gap-4">
                <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                <div className="flex-1 min-w-0">
                  <p className="label-sm font-medium text-foreground">{project.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="paragraph-xs text-muted-foreground shrink-0">{pct}%</span>
                  </div>
                </div>
                <span className="paragraph-xs text-muted-foreground shrink-0">{done}/{tasks.length} tareas</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── New Project Dialog ───────────────────────────────────────────────────────

function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')

  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316', '#8b5cf6', '#14b8a6']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
    setName('')
    setDescription('')
    setColor('#6366f1')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo proyecto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Nombre del proyecto</label>
            <Input
              placeholder="Ej: Rediseño de la web corporativa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Descripción (opcional)</label>
            <Input
              placeholder="Describe brevemente el proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label-sm font-medium text-foreground">Color identificativo</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    'size-7 rounded-full border-2 transition-all',
                    color === c ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={!name.trim()}>Crear proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── New Task Dialog ──────────────────────────────────────────────────────────

function NewTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
    setTitle('')
    setProjectId('')
    setAssigneeId('')
    setPriority('medium')
    setDueDate('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Título de la tarea</label>
            <Input
              placeholder="¿Qué hay que hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Proyecto</label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROJECTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Asignado a</label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Asignar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_EMPLOYEES.filter((e) => e.status === 'active').map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Prioridad</label>
              <Select value={priority} onValueChange={(v: string) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-sm font-medium text-foreground">Fecha límite (opcional)</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={!title.trim()}>Crear tarea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTasksPage() {
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Admin tasks: tasks assigned to admin (emp-2 for demo)
  const adminTasks = MOCK_TASKS.filter((t) => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchStatus && matchPriority
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Tareas y Proyectos</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {MOCK_PROJECTS.length} proyectos activos · {MOCK_TASKS.length} tareas en total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={() => setShowNewTask(true)}>
            <PlusIcon className="size-4" />
            Nueva tarea
          </Button>
          <Button variant="primary" size="md" onClick={() => setShowNewProject(true)}>
            <PlusIcon className="size-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects">
        <TabsList {...({} as any)}>
          <TabsTrigger value="projects">
            <FolderIcon className="size-4" />
            Todos los proyectos
          </TabsTrigger>
          <TabsTrigger value="my-tasks">
            <CheckSquareIcon className="size-4" />
            Mis tareas
          </TabsTrigger>
          <TabsTrigger value="reports">
            <ChartBarIcon className="size-4" />
            Informes
          </TabsTrigger>
        </TabsList>

        {/* Proyectos */}
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </TabsContent>

        {/* Mis tareas */}
        <TabsContent value="my-tasks" className="mt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="review">En revisión</SelectItem>
                  <SelectItem value="done">Hecho</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
              <span className="paragraph-sm text-muted-foreground ml-auto">
                {adminTasks.length} tarea{adminTasks.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {adminTasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <CheckSquareIcon className="size-10 text-muted-foreground" />
                  <p className="paragraph-sm text-muted-foreground">No hay tareas con los filtros aplicados</p>
                </div>
              ) : (
                adminTasks.map((task) => <TaskRow key={task.id} task={task} />)
              )}
            </div>
          </div>
        </TabsContent>

        {/* Informes */}
        <TabsContent value="reports" className="mt-6">
          <StatsTab />
        </TabsContent>
      </Tabs>

      <NewProjectDialog open={showNewProject} onClose={() => setShowNewProject(false)} />
      <NewTaskDialog open={showNewTask} onClose={() => setShowNewTask(false)} />
    </div>
  )
}
