'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { use } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@clasing/ui/sheet'
import {
  ArrowLeftIcon,
  CalculatorIcon,
  LockIcon,
  UserIcon,
  DownloadSimpleIcon,
  PaperPlaneTiltIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { MOCK_PAYROLL_PERIODS, MOCK_PAYSLIPS } from '@/lib/mock/payroll'
import type { Payslip, PayrollStatus } from '@/lib/types/payroll'
import { cn } from '@/lib/utils'

const MONTH_NAMES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const SLIP_STATUS_VARIANTS: Record<Payslip['status'], 'neutral' | 'warning' | 'success'> = {
  draft: 'neutral',
  reviewed: 'warning',
  paid: 'success',
}

const SLIP_STATUS_LABELS: Record<Payslip['status'], string> = {
  draft: 'Borrador',
  reviewed: 'Revisado',
  paid: 'Pagado',
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatPct(rate: number) {
  return `${rate}%`
}

export default function PayrollPeriodPage({ params }: { params: Promise<{ periodId: string }> }) {
  const { periodId } = use(params)
  const [selected, setSelected] = useState<Payslip | null>(null)

  const period = MOCK_PAYROLL_PERIODS.find(p => p.id === periodId)
  const payslips = MOCK_PAYSLIPS.filter(ps => ps.period_id === periodId)

  if (!period) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground paragraph-sm">Período no encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/payroll">
            <Button variant="ghost" size="sm" iconOnly>
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="title-lg font-semibold text-foreground">
              Nóminas — {MONTH_NAMES[period.month]} {period.year}
            </h1>
            <p className="paragraph-sm text-muted-foreground">{period.employees_count} empleados</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalculatorIcon className="size-4 mr-2" />
            Calcular todas
          </Button>
          <Button size="sm">
            <LockIcon className="size-4 mr-2" />
            Cerrar período
          </Button>
        </div>
      </div>

      {/* Tabla de empleados */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="label-md font-semibold text-foreground">Detalle por empleado</h2>
          <p className="paragraph-xs text-muted-foreground">{payslips.length} nóminas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-6 py-3 label-xs text-muted-foreground uppercase tracking-wide">Empleado</th>
                <th className="text-right px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Bruto</th>
                <th className="text-right px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">IRPF</th>
                <th className="text-right px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">SS Emp.</th>
                <th className="text-right px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Neto</th>
                <th className="text-center px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payslips.map(ps => (
                <tr
                  key={ps.id}
                  className="hover:bg-background/50 cursor-pointer transition-colors"
                  onClick={() => setSelected(ps)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="label-sm font-medium text-foreground">{ps.employee_name}</p>
                        <p className="paragraph-xs text-muted-foreground">{ps.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="paragraph-sm text-foreground font-medium">{formatEur(ps.gross_salary)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="paragraph-sm text-foreground">{formatPct(ps.irpf_rate)}</span>
                    <span className="paragraph-xs text-muted-foreground block">({formatEur(ps.irpf_amount)})</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="paragraph-sm text-foreground">{formatEur(ps.social_security_employee)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="label-sm font-semibold text-foreground">{formatEur(ps.net_salary)}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge variant={SLIP_STATUS_VARIANTS[ps.status]}>
                      {SLIP_STATUS_LABELS[ps.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/payroll/${periodId}/${ps.employee_id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-primary hover:underline paragraph-xs"
                    >
                      Ver nómina
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SlideOver detalle nómina */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Detalle de nómina</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Datos empleado */}
                <div className="space-y-1">
                  <p className="label-md font-semibold text-foreground">{selected.employee_name}</p>
                  <p className="paragraph-sm text-muted-foreground">{selected.position} · {selected.department}</p>
                  <p className="paragraph-xs text-muted-foreground">NIF: {selected.employee_nif}</p>
                </div>

                {/* Devengos */}
                <div>
                  <p className="label-sm font-semibold text-foreground mb-2">Devengos</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground paragraph-sm">Salario base</span>
                      <span className="paragraph-sm text-foreground">{formatEur(selected.base_salary)}</span>
                    </div>
                    {selected.overtime_pay > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground paragraph-sm">Horas extra</span>
                        <span className="paragraph-sm text-foreground">{formatEur(selected.overtime_pay)}</span>
                      </div>
                    )}
                    {selected.bonuses > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground paragraph-sm">Incentivos</span>
                        <span className="paragraph-sm text-foreground">{formatEur(selected.bonuses)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-1 mt-1">
                      <span className="label-sm font-medium text-foreground">Total bruto</span>
                      <span className="label-sm font-semibold text-foreground">{formatEur(selected.gross_salary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deducciones */}
                <div>
                  <p className="label-sm font-semibold text-foreground mb-2">Deducciones</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground paragraph-sm">IRPF ({selected.irpf_rate}%)</span>
                      <span className="paragraph-sm text-error">-{formatEur(selected.irpf_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground paragraph-sm">SS empleado</span>
                      <span className="paragraph-sm text-error">-{formatEur(selected.social_security_employee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1 mt-1">
                      <span className="label-sm font-medium text-foreground">Total deducciones</span>
                      <span className="label-sm font-semibold text-error">-{formatEur(selected.total_deductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Neto */}
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <p className="label-xs text-muted-foreground uppercase tracking-wide mb-1">Salario neto</p>
                  <p className="text-3xl font-semibold text-primary">{formatEur(selected.net_salary)}</p>
                  {selected.bank_account && (
                    <p className="paragraph-xs text-muted-foreground mt-1">•••• {selected.bank_account}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <DownloadSimpleIcon className="size-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button className="flex-1" size="sm">
                    <PaperPlaneTiltIcon className="size-4 mr-2" />
                    Enviar al empleado
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
