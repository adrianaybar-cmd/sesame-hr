'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  PlusIcon,
  XIcon,
  PencilSimpleIcon,
  TrashIcon,
  CalendarIcon,
  ListIcon,
  TableIcon,
} from '@phosphor-icons/react'
import { MOCK_SHIFTS, MOCK_SHIFT_ASSIGNMENTS } from '@/lib/mock/shifts'
import type { Shift, ShiftAssignment } from '@/lib/types/shifts'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DAY_FULL_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const WEEK_DATES = ['2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// ─── Shift Badge ──────────────────────────────────────────────────────────────

function ShiftBadge({ shift }: { shift: Shift | undefined }) {
  if (!shift) {
    return (
      <span className="paragraph-xs text-muted-foreground">Libre</span>
    )
  }
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 paragraph-xs font-medium text-white"
      style={{ backgroundColor: shift.color }}
    >
      {shift.name}
    </span>
  )
}

// ─── Cell Popover ─────────────────────────────────────────────────────────────

function CellPopover({
  assignment,
  dayIndex,
  onClose,
  onAssign,
}: {
  assignment: ShiftAssignment
  dayIndex: number
  onClose: () => void
  onAssign: (shiftId: string | undefined) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg p-2"
    >
      <p className="label-xs font-semibold text-muted-foreground px-2 pb-1 mb-1 border-b border-border">
        {DAY_FULL_LABELS[dayIndex]}
      </p>
      {MOCK_SHIFTS.map((shift) => (
        <button
          key={shift.id}
          onClick={() => onAssign(shift.id)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-left"
        >
          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: shift.color }}
          />
          <span className="paragraph-sm text-foreground">{shift.name}</span>
          <span className="paragraph-xs text-muted-foreground ml-auto">
            {shift.start_time}–{shift.end_time}
          </span>
        </button>
      ))}
      <button
        onClick={() => onAssign(undefined)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-left mt-1 border-t border-border"
      >
        <span className="size-2.5 rounded-full shrink-0 bg-muted-foreground" />
        <span className="paragraph-sm text-muted-foreground">Día libre</span>
      </button>
    </div>
  )
}

// ─── Planner Tab ──────────────────────────────────────────────────────────────

function PlannerTab() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(MOCK_SHIFT_ASSIGNMENTS)
  const [openCell, setOpenCell] = useState<{ empId: string; dayIdx: number } | null>(null)

  function handleAssign(empId: string, dayIdx: number, shiftId: string | undefined) {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.employee_id !== empId) return a
        return {
          ...a,
          day_assignments: a.day_assignments.map((d, i) =>
            i === dayIdx ? { ...d, shift_id: shiftId } : d
          ),
        }
      })
    )
    setOpenCell(null)
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="flex border-b border-border bg-muted/30">
          <div className="w-48 shrink-0 px-4 py-2.5">
            <span className="label-xs font-semibold text-muted-foreground">Empleado</span>
          </div>
          {DAY_LABELS.map((day, i) => (
            <div key={i} className="flex-1 text-center px-2 py-2.5">
              <p className="label-xs font-semibold text-muted-foreground">{day}</p>
              <p className="paragraph-xs text-muted-foreground">
                {WEEK_DATES[i].slice(8)}
              </p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors"
          >
            {/* Employee */}
            <div className="w-48 shrink-0 flex items-center gap-2 px-4 py-3">
              <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="label-xs font-semibold text-foreground">
                  {getInitials(assignment.employee_name)}
                </span>
              </div>
              <p className="label-sm font-medium text-foreground truncate">
                {assignment.employee_name}
              </p>
            </div>

            {/* Day cells */}
            {assignment.day_assignments.map((day, dayIdx) => {
              const shift = MOCK_SHIFTS.find((s) => s.id === day.shift_id)
              const isOpen =
                openCell?.empId === assignment.employee_id && openCell.dayIdx === dayIdx

              return (
                <div key={dayIdx} className="flex-1 px-1.5 py-3 relative">
                  <button
                    onClick={() =>
                      setOpenCell(isOpen ? null : { empId: assignment.employee_id, dayIdx })
                    }
                    className={cn(
                      'w-full flex items-center justify-center rounded-md py-1 px-1 min-h-[32px] transition-colors border',
                      isOpen
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-border hover:bg-muted/40'
                    )}
                  >
                    <ShiftBadge shift={shift} />
                  </button>
                  {isOpen && (
                    <CellPopover
                      assignment={assignment}
                      dayIndex={dayIdx}
                      onClose={() => setOpenCell(null)}
                      onAssign={(shiftId) =>
                        handleAssign(assignment.employee_id, dayIdx, shiftId)
                      }
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shifts Tab ───────────────────────────────────────────────────────────────

function ShiftFormDialog({
  shift,
  onClose,
}: {
  shift?: Shift
  onClose: () => void
}) {
  const [name, setName] = useState(shift?.name ?? '')
  const [color, setColor] = useState(shift?.color ?? '#3b82f6')
  const [startTime, setStartTime] = useState(shift?.start_time ?? '09:00')
  const [endTime, setEndTime] = useState(shift?.end_time ?? '17:00')
  const [breakMins, setBreakMins] = useState(String(shift?.break_minutes ?? 30))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="label-lg font-semibold text-foreground">
              {shift ? 'Editar turno' : 'Nuevo turno'}
            </h2>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mañana"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 rounded-md border border-border bg-background p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Hora inicio</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label-sm font-medium text-foreground">Hora fin</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Descanso (minutos)</label>
              <input
                type="number"
                min="0"
                step="15"
                value={breakMins}
                onChange={(e) => setBreakMins(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={!name}>
                {shift ? 'Guardar cambios' : 'Crear turno'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

function ShiftsTab() {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS)
  const [editShift, setEditShift] = useState<Shift | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  function handleDelete(id: string) {
    setShifts((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { setEditShift(undefined); setShowForm(true) }}>
          <PlusIcon className="size-4" />
          Nuevo turno
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map((shift) => (
          <Card key={shift.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: shift.color }}
                  />
                  <p className="label-md font-semibold text-foreground">{shift.name}</p>
                  {shift.is_predefined && (
                    <Badge variant="neutral" size="xs">Sistema</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditShift(shift); setShowForm(true) }}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <PencilSimpleIcon className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive-foreground"
                  >
                    <TrashIcon className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="paragraph-xs text-muted-foreground">Horario</span>
                  <span className="label-sm font-medium text-foreground">
                    {shift.start_time} – {shift.end_time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="paragraph-xs text-muted-foreground">Descanso</span>
                  <span className="label-sm font-medium text-foreground">{shift.break_minutes}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="paragraph-xs text-muted-foreground">Total horas</span>
                  <span className="label-sm font-medium text-foreground">{shift.total_hours}h</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {DAY_LABELS.map((day, i) => (
                  <span
                    key={i}
                    className={cn(
                      'rounded px-1.5 py-0.5 paragraph-xs font-medium',
                      shift.days_of_week.includes(i)
                        ? 'text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                    style={
                      shift.days_of_week.includes(i)
                        ? { backgroundColor: shift.color }
                        : undefined
                    }
                  >
                    {day}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <ShiftFormDialog
          shift={editShift}
          onClose={() => { setShowForm(false); setEditShift(undefined) }}
        />
      )}
    </div>
  )
}

// ─── Assignments Tab ──────────────────────────────────────────────────────────

function AssignmentsTab() {
  const [weekFilter, setWeekFilter] = useState('2026-04-07')

  const filtered = MOCK_SHIFT_ASSIGNMENTS.filter((a) => a.week_start === weekFilter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Select value={weekFilter} onValueChange={setWeekFilter}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-04-07">Semana 07/04/2026</SelectItem>
            <SelectItem value="2026-03-31">Semana 31/03/2026</SelectItem>
          </SelectContent>
        </Select>
        <span className="paragraph-xs text-muted-foreground">
          {filtered.length} asignaciones
        </span>
      </div>

      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex-1 label-xs font-semibold text-muted-foreground">Empleado</div>
            <div className="w-36 label-xs font-semibold text-muted-foreground">Turno principal</div>
            <div className="w-28 label-xs font-semibold text-muted-foreground">Semana</div>
            <div className="w-32 label-xs font-semibold text-muted-foreground">Días asignados</div>
          </div>

          {filtered.map((a) => {
            const assignedDays = a.day_assignments.filter((d) => d.shift_id).length
            return (
              <div
                key={a.id}
                className="flex items-center px-4 py-3 border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors"
              >
                <div className="flex-1 flex items-center gap-2.5">
                  <div className="size-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="label-xs font-semibold text-foreground">
                      {getInitials(a.employee_name)}
                    </span>
                  </div>
                  <p className="label-sm font-medium text-foreground">{a.employee_name}</p>
                </div>
                <div className="w-36">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 paragraph-xs font-medium text-white"
                    style={{ backgroundColor: a.shift_color }}
                  >
                    {a.shift_name}
                  </span>
                </div>
                <div className="w-28">
                  <span className="paragraph-xs text-muted-foreground">{a.week_start}</span>
                </div>
                <div className="w-32">
                  <span className="label-sm font-medium text-foreground">
                    {assignedDays} / 7 días
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'planner' | 'shifts' | 'assignments'

export default function AdminShiftsPage() {
  const [tab, setTab] = useState<Tab>('planner')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'planner', label: 'Planner', icon: CalendarIcon },
    { id: 'shifts', label: 'Turnos', icon: TableIcon },
    { id: 'assignments', label: 'Asignaciones', icon: ListIcon },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Turnos</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Planificación y gestión de turnos del equipo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 label-sm font-medium transition-colors border-b-2 -mb-px',
              tab === id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'planner' && (
        <Card className="border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" />
              Semana 07/04/2026 – 13/04/2026
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PlannerTab />
          </CardContent>
        </Card>
      )}

      {tab === 'shifts' && <ShiftsTab />}
      {tab === 'assignments' && <AssignmentsTab />}
    </div>
  )
}
