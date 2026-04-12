'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { BellIcon, FileTextIcon, CakeIcon, UserPlusIcon } from '@phosphor-icons/react'

const ALERTAS = [
  { icon: FileTextIcon, label: 'Contratos por vencer', count: 2, variant: 'warning' as const },
  { icon: CakeIcon, label: 'Cumpleaños esta semana', count: 3, variant: 'info' as const },
  { icon: UserPlusIcon, label: 'Nuevas incorporaciones', count: 1, variant: 'success' as const },
]

export function WidgetAlertasRRHH() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-medium text-muted-foreground">
          Alertas RRHH
        </CardTitle>
        <div className="rounded-lg bg-surface p-2">
          <BellIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-1">
        {ALERTAS.map(({ icon: Icon, label, count, variant }) => (
          <div key={label} className="flex items-center gap-3 py-1">
            <div className="rounded-md bg-muted p-1.5 shrink-0">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <span className="paragraph-xs text-foreground flex-1">{label}</span>
            <Badge variant={variant} size="xs">{count}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
