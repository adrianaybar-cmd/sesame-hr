'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { UserPlusIcon } from '@phosphor-icons/react'

const ALTAS = [
  { nombre: 'Isabel Morales', puesto: 'UX Designer', dept: 'Tecnología', fecha: '1 abr 2026' },
  { nombre: 'Tomás Vega', puesto: 'SDR', dept: 'Ventas', fecha: '7 abr 2026' },
  { nombre: 'Natalia Peña', puesto: 'Content Manager', dept: 'Marketing', fecha: '8 abr 2026' },
]

const COLORS = ['bg-[hsl(var(--info))]', 'bg-[hsl(var(--success))]', 'bg-[hsl(var(--warning))]']

export function WidgetNuevosEmpleados() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Nuevas incorporaciones
        </CardTitle>
        <UserPlusIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ALTAS.map((emp, i) => (
            <div key={emp.nombre} className="flex items-center gap-3">
              <div
                className={`size-9 rounded-full ${COLORS[i % COLORS.length]} flex items-center justify-center shrink-0`}
              >
                <span className="label-xs font-semibold text-white">
                  {emp.nombre.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-sm font-medium text-foreground">{emp.nombre}</p>
                <p className="paragraph-xs text-muted-foreground">{emp.puesto} · {emp.dept}</p>
              </div>
              <span className="paragraph-xs text-muted-foreground whitespace-nowrap">{emp.fecha}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
