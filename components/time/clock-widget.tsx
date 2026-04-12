'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@clasing/ui/tooltip'
import { ClockIcon, SignInIcon, SignOutIcon, CoffeeIcon } from '@phosphor-icons/react'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type ClockStatus = 'out' | 'working' | 'break'

interface ClockState {
  status: ClockStatus
  workStart: Date | null
  breakStart: Date | null
  accumulatedSeconds: number // seconds before current session
}

// ─── Toast (simple inline) ────────────────────────────────────────────────────

function InlineToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 3000)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div className="absolute top-full mt-2 right-0 z-50 rounded-xl border border-border bg-card shadow-lg px-3 py-2 flex items-center gap-2 min-w-48">
      <span className="size-2 rounded-full bg-success shrink-0" />
      <span className="paragraph-xs text-foreground">{message}</span>
    </div>
  )
}

// ─── Clock Widget ─────────────────────────────────────────────────────────────

interface ClockWidgetProps {
  className?: string
}

export function ClockWidget({ className }: ClockWidgetProps) {
  const [state, setState] = useState<ClockState>({
    status: 'out',
    workStart: null,
    breakStart: null,
    accumulatedSeconds: 0,
  })
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  // Ticker
  useEffect(() => {
    if (state.status === 'out') {
      setDisplaySeconds(state.accumulatedSeconds)
      return
    }

    const tick = () => {
      if (state.status === 'working' && state.workStart) {
        const elapsed = Math.floor((Date.now() - state.workStart.getTime()) / 1000)
        setDisplaySeconds(state.accumulatedSeconds + elapsed)
      } else if (state.status === 'break') {
        // While on break, the counter pauses (accumulated stays)
        setDisplaySeconds(state.accumulatedSeconds)
      }
    }

    tick() // immediate
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [state])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
  }, [])

  const handleClockIn = useCallback(() => {
    const now = new Date()
    setState({
      status: 'working',
      workStart: now,
      breakStart: null,
      accumulatedSeconds: 0,
    })
    showToast('Entrada registrada')
  }, [showToast])

  const handleBreak = useCallback(() => {
    setState((prev) => {
      const elapsed = prev.workStart
        ? Math.floor((Date.now() - prev.workStart.getTime()) / 1000)
        : 0
      return {
        status: 'break',
        workStart: null,
        breakStart: new Date(),
        accumulatedSeconds: prev.accumulatedSeconds + elapsed,
      }
    })
    showToast('Descanso iniciado')
  }, [showToast])

  const handleResumeFromBreak = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'working',
      workStart: new Date(),
      breakStart: null,
    }))
    showToast('Descanso finalizado')
  }, [showToast])

  const handleClockOut = useCallback(() => {
    setState((prev) => {
      const elapsed = prev.workStart
        ? Math.floor((Date.now() - prev.workStart.getTime()) / 1000)
        : 0
      return {
        status: 'out',
        workStart: null,
        breakStart: null,
        accumulatedSeconds: 0, // reset after clocking out
      }
    })
    showToast('Salida registrada')
  }, [showToast])

  const statusConfig = {
    out: { dot: 'bg-muted-foreground', label: 'Sin fichar' },
    working: { dot: 'bg-success animate-pulse', label: 'Trabajando' },
    break: { dot: 'bg-warning animate-pulse', label: 'Descanso' },
  }[state.status]

  return (
    <div className={cn('relative flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-1.5', className)}>
      {/* Status dot + icon */}
      <div className="flex items-center gap-1.5">
        <span className={cn('size-2 rounded-full', statusConfig.dot)} />
        <ClockIcon className="size-4 text-muted-foreground" />
      </div>

      {/* Timer */}
      <div className="min-w-[5rem] text-center">
        {state.status !== 'out' ? (
          <span className="label-md font-semibold text-foreground tabular-nums">
            {formatDuration(displaySeconds)}
          </span>
        ) : (
          <span className="paragraph-xs text-muted-foreground">Sin fichar</span>
        )}
      </div>

      {/* Status badge (only on break) */}
      {state.status === 'break' && (
        <Badge variant="warning" size="xs">Descanso</Badge>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        {state.status === 'out' && (
          <Button variant="primary" size="sm" onClick={handleClockIn} className="gap-1.5">
            <SignInIcon className="size-3.5" />
            Entrar
          </Button>
        )}

        {state.status === 'working' && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" iconOnly onClick={handleBreak}>
                  <CoffeeIcon className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Iniciar descanso</TooltipContent>
            </Tooltip>
            <Button variant="destructive" size="sm" onClick={handleClockOut} className="gap-1.5">
              <SignOutIcon className="size-3.5" />
              Salir
            </Button>
          </>
        )}

        {state.status === 'break' && (
          <>
            <Button variant="outline" size="sm" onClick={handleResumeFromBreak} className="gap-1.5">
              <SignInIcon className="size-3.5" />
              Reanudar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClockOut} className="gap-1.5">
              <SignOutIcon className="size-3.5" />
              Salir
            </Button>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <InlineToast message={toast} onDismiss={() => setToast(null)} />
      )}
    </div>
  )
}
