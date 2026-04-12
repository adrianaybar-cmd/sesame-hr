'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { BriefcaseIcon } from '@phosphor-icons/react'

const VACANTES = [
  { puesto: 'Senior Backend Engineer', dept: 'Tecnología', candidatos: 24 },
  { puesto: 'Account Executive', dept: 'Ventas', candidatos: 18 },
  { puesto: 'Data Analyst', dept: 'Finanzas', candidatos: 11 },
  { puesto: 'SEO Specialist', dept: 'Marketing', candidatos: 9 },
]

const TOTAL_CANDIDATOS = VACANTES.reduce((s, v) => s + v.candidatos, 0)

export function WidgetVacantesAbiertas() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-semibold text-foreground">
          Vacantes abiertas
        </CardTitle>
        <BriefcaseIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="display-sm font-semibold text-foreground">{VACANTES.length}</p>
            <p className="paragraph-xs text-muted-foreground">Posiciones</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="display-sm font-semibold text-foreground">{TOTAL_CANDIDATOS}</p>
            <p className="paragraph-xs text-muted-foreground">Candidatos</p>
          </div>
        </div>
        <div className="space-y-2">
          {VACANTES.map((v) => (
            <div key={v.puesto} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <div className="min-w-0">
                <p className="label-sm font-medium text-foreground truncate">{v.puesto}</p>
                <p className="paragraph-xs text-muted-foreground">{v.dept}</p>
              </div>
              <Badge variant="info" size="xs">{v.candidatos} cand.</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
