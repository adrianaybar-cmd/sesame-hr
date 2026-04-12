'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { ClockIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const TOTAL = 124
const FICHADOS = 98
const REMOTO = 18
const PRESENCIAL = 80
const PCT = Math.round((FICHADOS / TOTAL) * 100)

export function WidgetHorasHoy() {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="label-md font-medium text-muted-foreground">
          Fichados ahora
        </CardTitle>
        <div className="rounded-lg bg-surface p-2">
          <ClockIcon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-1">
          <span className="display-sm font-semibold text-foreground">{FICHADOS}</span>
          <span className="paragraph-sm text-muted-foreground mb-1">/ {TOTAL}</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--success))]"
            style={{ width: `${PCT}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="label-xs text-muted-foreground">{PCT}% del total</span>
          <div className="flex items-center gap-2">
            <span className="label-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-[hsl(var(--info))] mr-1 align-middle" />
              {REMOTO} remoto
            </span>
            <span className="label-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-[hsl(var(--success))] mr-1 align-middle" />
              {PRESENCIAL} oficina
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
