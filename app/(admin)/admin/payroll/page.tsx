'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  MoneyIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  CalculatorIcon,
  ClockIcon,
  LockIcon,
  CurrencyEurIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { MOCK_PAYROLL_PERIODS } from '@/lib/mock/payroll'
import type { PayrollPeriod, PayrollStatus } from '@/lib/types/payroll'
import { cn } from '@/lib/utils'

const MONTH_NAMES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const STATUS_LABELS: Record<PayrollStatus, string> = {
  draft: 'Borrador',
  calculated: 'Calculado',
  reviewed: 'Revisado',
  closed: 'Cerrado',
  paid: 'Pagado',
}

const STATUS_VARIANTS: Record<PayrollStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'error'> = {
  draft: 'neutral',
  calculated: 'primary',
  reviewed: 'warning',
  closed: 'success',
  paid: 'success',
}

const PHASE_STEPS = [
  { icon: UsersIcon, label: 'Recopilación', description: 'Datos y ausencias' },
  { icon: CalculatorIcon, label: 'Cálculo', description: 'Devengos y deducciones' },
  { icon: CheckCircleIcon, label: 'Revisión', description: 'Validación contable' },
  { icon: LockIcon, label: 'Cierre', description: 'Pago y archivo' },
]

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>(MOCK_PAYROLL_PERIODS)
  const [showNewPeriod, setShowNewPeriod] = useState(false)
  const [newYear, setNewYear] = useState('2026')
  const [newMonth, setNewMonth] = useState('')

  const current = periods.find(p => p.status === 'reviewed') ?? periods[periods.length - 1]

  function handleCreatePeriod() {
    if (!newMonth) return
    const id = `period-${newYear}-${String(newMonth).padStart(2, '0')}`
    const exists = periods.some(p => p.id === id)
    if (exists) return
    setPeriods(prev => [
      ...prev,
      {
        id,
        year: Number(newYear),
        month: Number(newMonth),
        status: 'draft',
        employees_count: 13,
        total_gross: 0,
        total_net: 0,
        total_company_cost: 0,
      },
    ])
    setShowNewPeriod(false)
    setNewMonth('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Nóminas</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Gestión de períodos y cálculo de nóminas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewPeriod(true)}>
            <PlusIcon className="size-4 mr-2" />
            Nuevo período
          </Button>
          <Button size="sm">
            <CalculatorIcon className="size-4 mr-2" />
            Calcular nóminas
          </Button>
        </div>
      </div>

      {/* KPIs del período actual */}
      {current && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MoneyIcon className="size-4 text-primary" />
              </div>
              <div>
                <p className="label-xs text-muted-foreground uppercase tracking-wide">Total Bruto</p>
                <p className="title-lg font-semibold text-foreground">{formatEur(current.total_gross)}</p>
                <p className="paragraph-xs text-muted-foreground">{MONTH_NAMES[current.month]} {current.year}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CurrencyEurIcon className="size-4 text-success" />
              </div>
              <div>
                <p className="label-xs text-muted-foreground uppercase tracking-wide">Total Neto</p>
                <p className="title-lg font-semibold text-foreground">{formatEur(current.total_net)}</p>
                <p className="paragraph-xs text-muted-foreground">{current.employees_count} empleados</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <UsersIcon className="size-4 text-warning" />
              </div>
              <div>
                <p className="label-xs text-muted-foreground uppercase tracking-wide">Coste Empresa</p>
                <p className="title-lg font-semibold text-foreground">{formatEur(current.total_company_cost)}</p>
                <p className="paragraph-xs text-muted-foreground">SS empresa incluida</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Proceso 4 fases */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="label-md font-semibold text-foreground mb-4">Proceso de cierre de nóminas</h2>
        <div className="flex items-start gap-2 flex-wrap md:flex-nowrap">
          {PHASE_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.label} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2',
                    i === 0 ? 'bg-success border-success text-white' :
                    i === 1 ? 'bg-success border-success text-white' :
                    i === 2 ? 'bg-warning border-warning text-white' :
                    'border-border text-muted-foreground',
                  )}>
                    <Icon className="size-4" />
                  </div>
                  <p className="label-sm font-medium text-foreground mt-2">{step.label}</p>
                  <p className="paragraph-xs text-muted-foreground text-center">{step.description}</p>
                </div>
                {i < PHASE_STEPS.length - 1 && (
                  <ArrowRightIcon className="size-4 text-muted-foreground mx-2 mt-[-1.5rem] flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Lista de períodos */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="label-md font-semibold text-foreground">Períodos de nómina</h2>
        </div>
        <div className="divide-y divide-border">
          {[...periods].reverse().map(period => (
            <Link
              key={period.id}
              href={`/payroll/${period.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-background/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarIcon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="label-md font-medium text-foreground">
                    {MONTH_NAMES[period.month]} {period.year}
                  </p>
                  <p className="paragraph-xs text-muted-foreground">
                    {period.employees_count} empleados
                    {period.status !== 'draft' && ` · Bruto: ${formatEur(period.total_gross)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {period.status !== 'draft' && (
                  <p className="paragraph-sm text-foreground hidden md:block">
                    {formatEur(period.total_net)} neto
                  </p>
                )}
                <Badge variant={STATUS_VARIANTS[period.status]}>
                  {STATUS_LABELS[period.status]}
                </Badge>
                <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Dialog nuevo período */}
      <Dialog open={showNewPeriod} onOpenChange={setShowNewPeriod}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo período de nómina</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Año</label>
              <Select value={newYear} onValueChange={(v: string) => setNewYear(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Mes</label>
              <Select value={newMonth} onValueChange={(v: string) => setNewMonth(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.slice(1).map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPeriod(false)}>Cancelar</Button>
            <Button onClick={handleCreatePeriod} disabled={!newMonth}>Crear período</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
