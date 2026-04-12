'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@clasing/ui/button'
import { PlayIcon, StopIcon, ClockIcon } from '@phosphor-icons/react'
import type { TimeEntry } from '@/lib/types/tasks'
import { cn } from '@/lib/utils'

interface TaskTimerProps {
  taskId: string
  employeeId: string
  existingMinutes?: number
  onEntryAdded?: (entry: TimeEntry) => void
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function TaskTimer({ taskId, employeeId, existingMinutes = 0, onEntryAdded }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds in current session
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const startRef = useRef<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  function handleStart() {
    startRef.current = new Date().toISOString()
    setElapsed(0)
    setIsRunning(true)
  }

  function handleStop() {
    setIsRunning(false)
    if (!startRef.current) return

    const endTime = new Date().toISOString()
    const durationMinutes = Math.round(elapsed / 60)

    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      task_id: taskId,
      employee_id: employeeId,
      start: startRef.current,
      end: endTime,
      duration_minutes: durationMinutes,
    }

    setEntries((prev) => [...prev, newEntry])
    onEntryAdded?.(newEntry)
    startRef.current = null
  }

  const totalMinutesThisSession = entries.reduce((sum, e) => sum + (e.duration_minutes ?? 0), 0)
  const totalMinutes = existingMinutes + totalMinutesThisSession

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <span className="label-sm font-medium text-foreground">Tiempo registrado</span>
        </div>
        <span className="paragraph-sm text-muted-foreground">
          Total: {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
        <div
          className={cn(
            'font-mono label-md font-medium tabular-nums flex-1',
            isRunning ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {isRunning ? formatTime(elapsed) : '00:00:00'}
        </div>

        {isRunning ? (
          <Button variant="destructive" size="sm" onClick={handleStop}>
            <StopIcon className="size-4" />
            Detener
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleStart}>
            <PlayIcon className="size-4" />
            Iniciar
          </Button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="label-xs font-medium text-muted-foreground uppercase tracking-wide">
            Entradas de esta sesión
          </p>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between px-3 py-2 rounded-md bg-card border border-border"
            >
              <span className="paragraph-xs text-muted-foreground">
                {new Date(entry.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                {' — '}
                {entry.end
                  ? new Date(entry.end).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                  : '...'}
              </span>
              <span className="label-xs font-medium text-foreground">
                {entry.duration_minutes}min
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
