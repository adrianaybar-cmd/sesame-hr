'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { TargetIcon } from '@phosphor-icons/react'

const OKRS = [
  { titulo: 'Crecer ingresos un 30% en 2026', progreso: 42, estado: 'on-track' as const },
  { titulo: 'Reducir churn al 5% anual', progreso: 61, estado: 'on-track' as const },
  { titulo: 'Lanzar producto Enterprise Q2', progreso: 28, estado: 'at-risk' as const },
]

const ESTADO_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info'; color: string }> = {
  'on-track': { label: 'En camino', variant: 'success', color: 'hsl(var(--success))' },
  'at-risk': { label: 'En riesgo', variant: 'warning', color: 'hsl(var(--warning))' },
  'off-track': { label: 'Retrasado', variant: 'error', color: 'hsl(var(--error))' },
}

export function WidgetOKRProgress() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          OKR — Empresa
        </CardTitle>
        <TargetIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {OKRS.map((okr) => {
          const m = ESTADO_MAP[okr.estado]
          return (
            <div key={okr.titulo} className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="paragraph-xs text-foreground leading-relaxed flex-1">{okr.titulo}</p>
                <Badge variant={m.variant} size="xs" className="shrink-0">{m.label}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${okr.progreso}%`, backgroundColor: m.color }}
                  />
                </div>
                <span className="label-xs font-medium text-foreground w-8 text-right">{okr.progreso}%</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
