'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { ChartBarHorizontalIcon } from '@phosphor-icons/react'

const DEPTS = [
  { nombre: 'Tecnología', horas: 892, objetivo: 1120 },
  { nombre: 'Ventas', horas: 1024, objetivo: 1280 },
  { nombre: 'Marketing', horas: 648, objetivo: 720 },
  { nombre: 'RRHH', horas: 432, objetivo: 480 },
  { nombre: 'Finanzas', horas: 576, objetivo: 640 },
  { nombre: 'Operaciones', horas: 612, objetivo: 720 },
]

const MAX = Math.max(...DEPTS.map((d) => d.objetivo))

export function WidgetHorasSemanales() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Horas por departamento — esta semana
        </CardTitle>
        <ChartBarHorizontalIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {DEPTS.map((d) => {
          const pctReal = (d.horas / MAX) * 100
          const pctObj = (d.objetivo / MAX) * 100
          const pctCumplimiento = Math.round((d.horas / d.objetivo) * 100)
          return (
            <div key={d.nombre} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="label-sm font-medium text-foreground">{d.nombre}</span>
                <span className="paragraph-xs text-muted-foreground">
                  {d.horas}h / {d.objetivo}h ({pctCumplimiento}%)
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                {/* Objetivo marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-border z-10"
                  style={{ left: `${pctObj}%` }}
                />
                {/* Real */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pctReal}%`,
                    backgroundColor:
                      pctCumplimiento >= 90
                        ? 'hsl(var(--success))'
                        : pctCumplimiento >= 70
                        ? 'hsl(var(--info))'
                        : 'hsl(var(--warning))',
                  }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
