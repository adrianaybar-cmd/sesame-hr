'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { CalendarIcon } from '@phosphor-icons/react'

const PROXIMAS = [
  { nombre: 'Laura Fernández', tipo: 'Vacaciones', inicio: '14 abr', dias: 5 },
  { nombre: 'Javier Rodríguez', tipo: 'Asuntos propios', inicio: '15 abr', dias: 1 },
  { nombre: 'Sofía Moreno', tipo: 'Vacaciones', inicio: '16 abr', dias: 10 },
  { nombre: 'Miguel Fernández', tipo: 'Baja médica', inicio: '17 abr', dias: 3 },
  { nombre: 'Ana González', tipo: 'Maternidad', inicio: '18 abr', dias: 112 },
]

export function WidgetAusenciasProximas() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Ausencias próximas (7 días)
        </CardTitle>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {PROXIMAS.map((a) => (
            <div
              key={a.nombre + a.inicio}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="label-xs font-medium text-muted-foreground">
                  {a.nombre.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-sm font-medium text-foreground truncate">{a.nombre}</p>
                <p className="paragraph-xs text-muted-foreground">{a.tipo} · desde {a.inicio}</p>
              </div>
              <Badge variant="default" size="xs">{a.dias}d</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
