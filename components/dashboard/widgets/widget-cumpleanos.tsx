'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { CakeIcon } from '@phosphor-icons/react'

const CUMPLES = [
  { nombre: 'Carlos Martínez', dept: 'Tecnología', fecha: 'Hoy', estasSemana: true },
  { nombre: 'Elena Torres', dept: 'Marketing', fecha: 'Mañana', estasSemana: true },
  { nombre: 'Roberto Díaz', dept: 'Ventas', fecha: 'Vie 18 abr', estasSemana: true },
  { nombre: 'Patricia Ruiz', dept: 'RRHH', fecha: 'Lun 21 abr', estasSemana: false },
  { nombre: 'Daniel Castro', dept: 'Finanzas', fecha: 'Mié 23 abr', estasSemana: false },
]

export function WidgetCumpleanos() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Cumpleaños
        </CardTitle>
        <CakeIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {CUMPLES.map((c) => (
            <div
              key={c.nombre}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="label-xs font-medium text-muted-foreground">
                  {c.nombre.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-sm font-medium text-foreground truncate">{c.nombre}</p>
                <p className="paragraph-xs text-muted-foreground">{c.dept}</p>
              </div>
              <Badge variant={c.estasSemana ? 'info' : 'default'} size="xs">
                {c.fecha}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
