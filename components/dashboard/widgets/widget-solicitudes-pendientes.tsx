'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { ClipboardTextIcon, CheckIcon, XIcon } from '@phosphor-icons/react'

type SolicitudStatus = 'pending' | 'approved' | 'rejected'

interface Solicitud {
  id: string
  empleado: string
  tipo: string
  detalle: string
  status: SolicitudStatus
}

const INITIAL: Solicitud[] = [
  { id: 's1', empleado: 'Laura Fernández', tipo: 'Ausencia', detalle: 'Vacaciones 16–20 abr', status: 'pending' },
  { id: 's2', empleado: 'Pablo Díaz', tipo: 'Ausencia', detalle: 'Asuntos propios 15 abr', status: 'pending' },
  { id: 's3', empleado: 'Elena Torres', tipo: 'Fichaje', detalle: 'Retro 10 abr 09:00–18:00', status: 'pending' },
  { id: 's4', empleado: 'Roberto Díaz', tipo: 'Ausencia', detalle: 'Baja médica 14 abr', status: 'pending' },
  { id: 's5', empleado: 'Carmen Álvarez', tipo: 'Fichaje', detalle: 'Retro 9 abr 08:30–17:30', status: 'pending' },
]

export function WidgetSolicitudesPendientes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(INITIAL)

  const pending = solicitudes.filter((s) => s.status === 'pending')

  function approve(id: string) {
    setSolicitudes((prev) => prev.map((s) => s.id === id ? { ...s, status: 'approved' } : s))
  }
  function reject(id: string) {
    setSolicitudes((prev) => prev.map((s) => s.id === id ? { ...s, status: 'rejected' } : s))
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Solicitudes pendientes
        </CardTitle>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <Badge variant="warning" size="xs">{pending.length}</Badge>
          )}
          <ClipboardTextIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {solicitudes.length === 0 || pending.length === 0 ? (
          <div className="py-6 text-center">
            <p className="paragraph-sm text-muted-foreground">Sin solicitudes pendientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {solicitudes.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="label-xs font-medium text-muted-foreground">
                    {s.empleado.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm font-medium text-foreground truncate">{s.empleado}</p>
                  <p className="paragraph-xs text-muted-foreground">{s.tipo} · {s.detalle}</p>
                </div>
                {s.status === 'approved' && <Badge variant="success" size="xs">Aprobado</Badge>}
                {s.status === 'rejected' && <Badge variant="error" size="xs">Rechazado</Badge>}
                {s.status === 'pending' && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-[hsl(var(--success))] hover:text-[hsl(var(--success))]"
                      onClick={() => approve(s.id)}
                    >
                      <CheckIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-[hsl(var(--error))] hover:text-[hsl(var(--error))]"
                      onClick={() => reject(s.id)}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
