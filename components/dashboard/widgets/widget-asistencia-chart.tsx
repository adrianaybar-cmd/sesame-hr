'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { ChartBarIcon } from '@phosphor-icons/react'

const DIAS = [
  { dia: 'Lun', presentes: 102, ausentes: 14, remoto: 8 },
  { dia: 'Mar', presentes: 98, ausentes: 16, remoto: 10 },
  { dia: 'Mié', presentes: 105, ausentes: 10, remoto: 9 },
  { dia: 'Jue', presentes: 100, ausentes: 13, remoto: 11 },
  { dia: 'Vie', presentes: 88, ausentes: 18, remoto: 18 },
  { dia: 'Sáb', presentes: 12, ausentes: 0, remoto: 4 },
  { dia: 'Dom', presentes: 3, ausentes: 0, remoto: 2 },
]

const MAX = Math.max(...DIAS.map((d) => d.presentes + d.ausentes + d.remoto))

export function WidgetAsistenciaChart() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Asistencia — últimos 7 días
        </CardTitle>
        <ChartBarIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[hsl(var(--success))] inline-block" />
            <span className="label-xs text-muted-foreground">Presentes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[hsl(var(--info))] inline-block" />
            <span className="label-xs text-muted-foreground">Remoto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[hsl(var(--warning))] inline-block" />
            <span className="label-xs text-muted-foreground">Ausentes</span>
          </div>
        </div>
        {/* Chart */}
        <div className="flex items-end gap-2 h-32">
          {DIAS.map((d) => {
            const total = d.presentes + d.ausentes + d.remoto
            const pctPresentes = (d.presentes / MAX) * 100
            const pctRemoto = (d.remoto / MAX) * 100
            const pctAusentes = (d.ausentes / MAX) * 100
            return (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-px" style={{ height: '112px' }}>
                  <div
                    className="w-full rounded-t-sm bg-[hsl(var(--warning))]"
                    style={{ height: `${pctAusentes}%` }}
                    title={`${d.ausentes} ausentes`}
                  />
                  <div
                    className="w-full bg-[hsl(var(--info))]"
                    style={{ height: `${pctRemoto}%` }}
                    title={`${d.remoto} remoto`}
                  />
                  <div
                    className="w-full rounded-b-sm bg-[hsl(var(--success))]"
                    style={{ height: `${pctPresentes}%` }}
                    title={`${d.presentes} presentes`}
                  />
                </div>
                <span className="label-xs text-muted-foreground">{d.dia}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
