'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { CalendarXIcon } from '@phosphor-icons/react'

const AUSENCIAS = [
  { tipo: 'Vacaciones', count: 3, variant: 'info' as const },
  { tipo: 'Baja médica', count: 2, variant: 'warning' as const },
  { tipo: 'Personales', count: 1, variant: 'default' as const },
]
const TOTAL = AUSENCIAS.reduce((s, a) => s + a.count, 0)

export function WidgetAusenciasHoy() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-medium text-muted-foreground">
          Ausencias hoy
        </CardTitle>
        <div className="rounded-lg bg-surface p-2">
          <CalendarXIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <span className="display-sm font-semibold text-foreground">{TOTAL}</span>
        <div className="space-y-2 pt-1">
          {AUSENCIAS.map((a) => (
            <div key={a.tipo} className="flex items-center justify-between">
              <span className="paragraph-xs text-muted-foreground">{a.tipo}</span>
              <Badge variant={a.variant} size="xs">{a.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
