'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { UsersThreeIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type EstadoEmpleado = 'presencial' | 'remoto' | 'ausente' | 'sin_fichar'

interface EmpleadoMini {
  nombre: string
  estado: EstadoEmpleado
}

const DEPARTAMENTOS: { nombre: string; empleados: EmpleadoMini[] }[] = [
  {
    nombre: 'Tecnología',
    empleados: [
      { nombre: 'Carlos M.', estado: 'presencial' },
      { nombre: 'Sofía M.', estado: 'remoto' },
      { nombre: 'Pablo D.', estado: 'presencial' },
      { nombre: 'Lucía R.', estado: 'ausente' },
    ],
  },
  {
    nombre: 'Ventas',
    empleados: [
      { nombre: 'Ana G.', estado: 'presencial' },
      { nombre: 'Roberto D.', estado: 'ausente' },
      { nombre: 'Carmen A.', estado: 'presencial' },
    ],
  },
  {
    nombre: 'Marketing',
    empleados: [
      { nombre: 'Miguel F.', estado: 'remoto' },
      { nombre: 'Elena T.', estado: 'presencial' },
      { nombre: 'Diego V.', estado: 'sin_fichar' },
    ],
  },
  {
    nombre: 'RRHH',
    empleados: [
      { nombre: 'Laura S.', estado: 'presencial' },
      { nombre: 'Patricia R.', estado: 'remoto' },
    ],
  },
  {
    nombre: 'Finanzas',
    empleados: [
      { nombre: 'Javier R.', estado: 'presencial' },
      { nombre: 'Daniel C.', estado: 'ausente' },
    ],
  },
]

const ESTADO_COLOR: Record<EstadoEmpleado, string> = {
  presencial: 'bg-[hsl(var(--success))]',
  remoto: 'bg-[hsl(var(--info))]',
  ausente: 'bg-[hsl(var(--warning))]',
  sin_fichar: 'bg-muted-foreground',
}

const ESTADO_LABEL: Record<EstadoEmpleado, string> = {
  presencial: 'Presencial',
  remoto: 'Remoto',
  ausente: 'Ausente',
  sin_fichar: 'Sin fichar',
}

export function WidgetWhosInMini() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          ¿Quién está?
        </CardTitle>
        <div className="flex items-center gap-3">
          {(['presencial', 'remoto', 'ausente', 'sin_fichar'] as EstadoEmpleado[]).map((e) => (
            <div key={e} className="flex items-center gap-1">
              <span className={cn('size-2 rounded-full shrink-0', ESTADO_COLOR[e])} />
              <span className="label-xs text-muted-foreground">{ESTADO_LABEL[e]}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {DEPARTAMENTOS.map((dept) => (
            <div key={dept.nombre} className="space-y-2">
              <p className="label-xs font-medium text-muted-foreground uppercase tracking-wide">{dept.nombre}</p>
              <div className="space-y-1.5">
                {dept.empleados.map((emp) => (
                  <div key={emp.nombre} className="flex items-center gap-1.5">
                    <span className={cn('size-2 rounded-full shrink-0', ESTADO_COLOR[emp.estado])} />
                    <span className="paragraph-xs text-foreground truncate">{emp.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
