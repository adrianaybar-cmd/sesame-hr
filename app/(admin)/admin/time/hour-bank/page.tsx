'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  PlusIcon,
  XIcon,
  ClockCountdownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SlidersIcon,
} from '@phosphor-icons/react'
import { MOCK_HOUR_BANKS, MOCK_HOUR_BANK_ENTRIES } from '@/lib/mock/hour-bank'
import type { HourBank, HourBankEntry } from '@/lib/types/hour-bank'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function minutesToHLabel(minutes: number): string {
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const sign = minutes >= 0 ? '+' : '-'
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${m}m`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

const ENTRY_TYPE_LABELS: Record<HourBankEntry['type'], string> = {
  accrual: 'Acumulación',
  compensation: 'Compensación',
  adjustment: 'Ajuste',
}

const ENTRY_TYPE_VARIANTS: Record<HourBankEntry['type'], 'success' | 'neutral' | 'warning'> = {
  accrual: 'success',
  compensation: 'neutral',
  adjustment: 'warning',
}

const DEPARTMENTS: Record<string, string> = {
  'emp-1': 'Tecnología',
  'emp-2': 'Recursos Humanos',
  'emp-3': 'Marketing',
  'emp-4': 'Ventas',
  'emp-5': 'Finanzas',
  'emp-6': 'Tecnología',
  'emp-8': 'Marketing',
  'emp-10': 'Finanzas',
}

// ─── SlideOver ────────────────────────────────────────────────────────────────

function EmployeeSlideOver({
  bank,
  onClose,
}: {
  bank: HourBank
  onClose: () => void
}) {
  const entries = MOCK_HOUR_BANK_ENTRIES.filter((e) => e.employee_id === bank.employee_id).sort(
    (a, b) => b.date.localeCompare(a.date)
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="label-lg font-semibold text-foreground">Bolsa de horas</h2>
            <p className="paragraph-xs text-muted-foreground">{bank.employee_name}</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Balance summary */}
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="paragraph-xs text-muted-foreground">Saldo</p>
              <p
                className={cn(
                  'label-md font-semibold tabular-nums',
                  bank.balance_minutes >= 0 ? 'text-success-foreground' : 'text-destructive-foreground'
                )}
              >
                {minutesToHLabel(bank.balance_minutes)}
              </p>
            </div>
            <div>
              <p className="paragraph-xs text-muted-foreground">Acumulado</p>
              <p className="label-md font-semibold text-foreground tabular-nums">
                {minutesToHLabel(bank.accrued_minutes)}
              </p>
            </div>
            <div>
              <p className="paragraph-xs text-muted-foreground">Consumido</p>
              <p className="label-md font-semibold text-foreground tabular-nums">
                {minutesToHLabel(bank.consumed_minutes)}
              </p>
            </div>
          </div>
          <p className="paragraph-xs text-muted-foreground mt-2">
            Periodo: {bank.period_start} — {bank.period_end}
          </p>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="label-sm font-semibold text-foreground mb-3">
            Historial de movimientos
          </p>
          {entries.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground text-center py-8">
              Sin movimientos registrados
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <div
                    className={cn(
                      'size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      entry.minutes >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                    )}
                  >
                    {entry.minutes >= 0 ? (
                      <ArrowUpIcon className="size-3.5 text-success-foreground" />
                    ) : (
                      <ArrowDownIcon className="size-3.5 text-destructive-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={ENTRY_TYPE_VARIANTS[entry.type]} size="xs">
                        {ENTRY_TYPE_LABELS[entry.type]}
                      </Badge>
                      <span
                        className={cn(
                          'label-sm font-semibold tabular-nums',
                          entry.minutes >= 0 ? 'text-success-foreground' : 'text-destructive-foreground'
                        )}
                      >
                        {minutesToHLabel(entry.minutes)}
                      </span>
                    </div>
                    <p className="paragraph-xs text-muted-foreground mt-1">{formatDate(entry.date)}</p>
                    {entry.notes && (
                      <p className="paragraph-xs text-foreground mt-0.5">{entry.notes}</p>
                    )}
                    {entry.approved_by && (
                      <p className="paragraph-xs text-muted-foreground">
                        Aprobado por: {entry.approved_by}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Adjustment Dialog ────────────────────────────────────────────────────────

function AdjustmentDialog({ onClose }: { onClose: () => void }) {
  const [empId, setEmpId] = useState('')
  const [type, setType] = useState<HourBankEntry['type']>('adjustment')
  const [hours, setHours] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In a real app, this would call an API
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="label-lg font-semibold text-foreground">Ajuste manual</h2>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
            {/* Employee */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Empleado</label>
              <Select value={empId} onValueChange={setEmpId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_HOUR_BANKS.map((b) => (
                    <SelectItem key={b.employee_id} value={b.employee_id}>
                      {b.employee_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Tipo</label>
              <Select value={type} onValueChange={(v: string) => setType(v as HourBankEntry['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accrual">Acumulación</SelectItem>
                  <SelectItem value="compensation">Compensación</SelectItem>
                  <SelectItem value="adjustment">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">
                Horas (negativo para descuento)
              </label>
              <input
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Ej: 2 o -1.5"
                className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="label-sm font-medium text-foreground">Motivo</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descripción del ajuste..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={!empId || !hours}>
                Aplicar ajuste
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminHourBankPage() {
  const [selectedBank, setSelectedBank] = useState<HourBank | null>(null)
  const [showAdjustDialog, setShowAdjustDialog] = useState(false)
  const [deptFilter, setDeptFilter] = useState('all')
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'positive' | 'negative'>('all')

  const departments = Array.from(new Set(Object.values(DEPARTMENTS))).sort()

  const filtered = useMemo(
    () =>
      MOCK_HOUR_BANKS.filter((b) => {
        const dept = DEPARTMENTS[b.employee_id]
        const matchDept = deptFilter === 'all' || dept === deptFilter
        const matchBalance =
          balanceFilter === 'all' ||
          (balanceFilter === 'positive' && b.balance_minutes >= 0) ||
          (balanceFilter === 'negative' && b.balance_minutes < 0)
        return matchDept && matchBalance
      }),
    [deptFilter, balanceFilter]
  )

  const totalPositive = MOCK_HOUR_BANKS.filter((b) => b.balance_minutes > 0).length
  const totalNegative = MOCK_HOUR_BANKS.filter((b) => b.balance_minutes < 0).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Bolsa de Horas</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Gestión de horas acumuladas y compensaciones
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdjustDialog(true)}>
          <SlidersIcon className="size-4" />
          Ajuste manual
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="paragraph-xs text-muted-foreground">Total empleados</p>
            <p className="title-2xs font-semibold text-foreground">{MOCK_HOUR_BANKS.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="paragraph-xs text-muted-foreground">Saldo positivo</p>
            <div className="flex items-center gap-2">
              <p className="title-2xs font-semibold text-success-foreground">{totalPositive}</p>
              <Badge variant="success" size="xs">empleados</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="paragraph-xs text-muted-foreground">Saldo negativo</p>
            <div className="flex items-center gap-2">
              <p className="title-2xs font-semibold text-destructive-foreground">{totalNegative}</p>
              <Badge variant="error" size="xs">empleados</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-4">
            <p className="paragraph-xs text-muted-foreground">Total movimientos</p>
            <p className="title-2xs font-semibold text-foreground">{MOCK_HOUR_BANK_ENTRIES.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border border-border overflow-hidden">
          {([
            { value: 'all', label: 'Todos' },
            { value: 'positive', label: 'Positivo' },
            { value: 'negative', label: 'Negativo' },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setBalanceFilter(value)}
              className={cn(
                'px-3 py-1.5 label-sm font-medium transition-colors',
                balanceFilter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="paragraph-xs text-muted-foreground ml-auto">
          {filtered.length} empleado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="label-lg font-semibold text-foreground flex items-center gap-2">
            <ClockCountdownIcon className="size-4 text-muted-foreground" />
            Empleados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Header row */}
          <div className="flex items-center px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex-1 label-xs font-semibold text-muted-foreground">Empleado</div>
            <div className="w-32 label-xs font-semibold text-muted-foreground">Departamento</div>
            <div className="w-28 text-right label-xs font-semibold text-muted-foreground">Acumulado</div>
            <div className="w-28 text-right label-xs font-semibold text-muted-foreground">Consumido</div>
            <div className="w-28 text-right label-xs font-semibold text-muted-foreground">Saldo</div>
            <div className="w-20 text-right label-xs font-semibold text-muted-foreground">Periodo</div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <ClockCountdownIcon className="size-10 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">Sin resultados</p>
            </div>
          ) : (
            filtered.map((bank) => (
              <div
                key={bank.employee_id}
                className="flex items-center px-4 py-3 border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => setSelectedBank(bank)}
              >
                <div className="flex-1 flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="label-xs font-semibold text-foreground">
                      {getInitials(bank.employee_name)}
                    </span>
                  </div>
                  <p className="label-sm font-medium text-foreground">{bank.employee_name}</p>
                </div>
                <div className="w-32">
                  <p className="paragraph-xs text-muted-foreground">
                    {DEPARTMENTS[bank.employee_id] ?? '—'}
                  </p>
                </div>
                <div className="w-28 text-right">
                  <span className="label-sm text-foreground tabular-nums">
                    {minutesToHLabel(bank.accrued_minutes)}
                  </span>
                </div>
                <div className="w-28 text-right">
                  <span className="label-sm text-foreground tabular-nums">
                    {minutesToHLabel(bank.consumed_minutes)}
                  </span>
                </div>
                <div className="w-28 text-right">
                  <span
                    className={cn(
                      'label-sm font-semibold tabular-nums',
                      bank.balance_minutes >= 0 ? 'text-success-foreground' : 'text-destructive-foreground'
                    )}
                  >
                    {minutesToHLabel(bank.balance_minutes)}
                  </span>
                </div>
                <div className="w-20 text-right">
                  <span className="paragraph-xs text-muted-foreground">
                    {bank.period_start.slice(0, 7)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* SlideOver */}
      {selectedBank && (
        <EmployeeSlideOver bank={selectedBank} onClose={() => setSelectedBank(null)} />
      )}

      {/* Adjustment Dialog */}
      {showAdjustDialog && (
        <AdjustmentDialog onClose={() => setShowAdjustDialog(false)} />
      )}
    </div>
  )
}
