'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { WarningCircleIcon, ArrowRightIcon } from '@phosphor-icons/react'

const INCIDENCIAS = [
  { tipo: 'Fichaje sin cierre', count: 5 },
  { tipo: 'Horario incorrecto', count: 4 },
  { tipo: 'Sin jornada asignada', count: 3 },
]
const TOTAL = INCIDENCIAS.reduce((s, i) => s + i.count, 0)

export function WidgetIncidencias() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-medium text-muted-foreground">
          Incidencias
        </CardTitle>
        <div className="rounded-lg bg-surface p-2">
          <WarningCircleIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-2">
          <span className="display-sm font-semibold text-foreground">{TOTAL}</span>
          <Badge variant="error" size="xs" className="mb-1">Pendientes</Badge>
        </div>
        <div className="space-y-2">
          {INCIDENCIAS.map((i) => (
            <div key={i.tipo} className="flex items-center justify-between">
              <span className="paragraph-xs text-muted-foreground">{i.tipo}</span>
              <span className="label-xs font-medium text-foreground">{i.count}</span>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="xs" asChild className="w-full justify-between mt-1">
          <Link href="/admin/time/incidences">
            Ver todas
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
