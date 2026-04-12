'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { ClockCounterClockwiseIcon, ClockIcon, CalendarIcon, FileTextIcon, UserIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type ActividadTipo = 'fichaje' | 'ausencia' | 'documento' | 'empleado' | 'aprobacion'

interface Actividad {
  id: string
  tipo: ActividadTipo
  texto: string
  tiempo: string
}

const ACTIVIDADES: Actividad[] = [
  { id: 'a1', tipo: 'fichaje', texto: 'Juan Navarro fichó entrada a las 9:02', tiempo: 'hace 3 min' },
  { id: 'a2', tipo: 'ausencia', texto: 'María García solicitó vacaciones del 16 al 20 abr', tiempo: 'hace 12 min' },
  { id: 'a3', tipo: 'aprobacion', texto: 'Laura Sánchez aprobó la ausencia de Pablo Díaz', tiempo: 'hace 28 min' },
  { id: 'a4', tipo: 'fichaje', texto: 'Elena Torres fichó salida a las 18:05', tiempo: 'hace 45 min' },
  { id: 'a5', tipo: 'documento', texto: 'Carlos Martínez subió Nómina Marzo 2026', tiempo: 'hace 1h' },
  { id: 'a6', tipo: 'empleado', texto: 'Tomás Vega completó su onboarding', tiempo: 'hace 2h' },
  { id: 'a7', tipo: 'ausencia', texto: 'Roberto Díaz reportó baja médica', tiempo: 'hace 3h' },
]

const TIPO_ICON: Record<ActividadTipo, React.ElementType> = {
  fichaje: ClockIcon,
  ausencia: CalendarIcon,
  documento: FileTextIcon,
  empleado: UserIcon,
  aprobacion: CheckCircleIcon,
}

const TIPO_COLOR: Record<ActividadTipo, string> = {
  fichaje: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
  ausencia: 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]',
  documento: 'bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]',
  empleado: 'bg-muted text-muted-foreground',
  aprobacion: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
}

export function WidgetActividadReciente() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Actividad reciente
        </CardTitle>
        <ClockCounterClockwiseIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-1">
            {ACTIVIDADES.map((act) => {
              const Icon = TIPO_ICON[act.tipo]
              return (
                <div key={act.id} className="flex items-start gap-3 pl-1 py-2">
                  <div className={cn('relative z-10 rounded-full p-1.5 shrink-0', TIPO_COLOR[act.tipo])}>
                    <Icon className="size-3" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="paragraph-xs text-foreground leading-relaxed">{act.texto}</p>
                    <p className="paragraph-xs text-muted-foreground mt-0.5">{act.tiempo}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
