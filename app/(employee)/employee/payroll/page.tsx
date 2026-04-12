'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@clasing/ui/sheet'
import {
  CalendarIcon,
  DownloadSimpleIcon,
  ArrowRightIcon,
  MoneyIcon,
} from '@phosphor-icons/react'
import { MOCK_PAYROLL_PERIODS, MOCK_PAYSLIPS } from '@/lib/mock/payroll'
import type { Payslip } from '@/lib/types/payroll'

const CURRENT_EMPLOYEE_ID = 'emp-6'

const MONTH_NAMES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function EmployeePayrollPage() {
  const [selected, setSelected] = useState<Payslip | null>(null)

  const myPayslips = MOCK_PAYSLIPS.filter(ps => ps.employee_id === CURRENT_EMPLOYEE_ID)

  const statusVariant = (s: Payslip['status']) =>
    s === 'paid' ? 'success' : s === 'reviewed' ? 'warning' : 'neutral'
  const statusLabel = (s: Payslip['status']) =>
    s === 'paid' ? 'Pagada' : s === 'reviewed' ? 'Revisada' : 'Borrador'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="title-lg font-semibold text-foreground">Mis nóminas</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">Historial y detalle de tus nóminas mensuales</p>
      </div>

      {/* KPI rápido */}
      {myPayslips.length > 0 && (
        <Card className="p-5 bg-card border border-border flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MoneyIcon className="size-5 text-primary" />
          </div>
          <div>
            <p className="label-xs text-muted-foreground">Última nómina recibida</p>
            <p className="title-lg font-semibold text-foreground">
              {formatEur(myPayslips[myPayslips.length - 1].net_salary)}
            </p>
          </div>
        </Card>
      )}

      {/* Lista */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="label-md font-semibold text-foreground">Historial</h2>
        </div>
        {myPayslips.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="paragraph-sm text-muted-foreground">No tienes nóminas disponibles</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myPayslips.map(ps => {
              const period = MOCK_PAYROLL_PERIODS.find(p => p.id === ps.period_id)
              return (
                <button
                  key={ps.id}
                  onClick={() => setSelected(ps)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-background/50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="label-md font-medium text-foreground">
                        {period ? `${MONTH_NAMES[period.month]} ${period.year}` : ps.period_id}
                      </p>
                      <p className="paragraph-xs text-muted-foreground">
                        Bruto: {formatEur(ps.gross_salary)} · IRPF: {ps.irpf_rate}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="label-sm font-semibold text-foreground hidden sm:block">
                      {formatEur(ps.net_salary)}
                    </p>
                    <Badge variant={statusVariant(ps.status)}>{statusLabel(ps.status)}</Badge>
                    <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Card>

      {/* Sheet detalle nómina */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (() => {
            const period = MOCK_PAYROLL_PERIODS.find(p => p.id === selected.period_id)
            return (
              <>
                <SheetHeader>
                  <SheetTitle>
                    Nómina — {period ? `${MONTH_NAMES[period.month]} ${period.year}` : selected.period_id}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Empresa */}
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="label-sm font-semibold text-foreground">Sesame Technologies S.L.</p>
                    <p className="paragraph-xs text-muted-foreground">CIF B-12345678 · Calle Gran Vía 45, Madrid</p>
                  </div>

                  {/* Devengos */}
                  <div>
                    <p className="label-sm font-semibold text-foreground mb-2">Devengos</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="paragraph-sm text-muted-foreground">Salario base</span>
                        <span className="paragraph-sm text-foreground">{formatEur(selected.base_salary)}</span>
                      </div>
                      {selected.overtime_pay > 0 && (
                        <div className="flex justify-between">
                          <span className="paragraph-sm text-muted-foreground">Horas extra</span>
                          <span className="paragraph-sm text-foreground">{formatEur(selected.overtime_pay)}</span>
                        </div>
                      )}
                      {selected.bonuses > 0 && (
                        <div className="flex justify-between">
                          <span className="paragraph-sm text-muted-foreground">Incentivos</span>
                          <span className="paragraph-sm text-foreground">{formatEur(selected.bonuses)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border pt-1">
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
                        <span className="paragraph-sm text-muted-foreground">IRPF ({selected.irpf_rate}%)</span>
                        <span className="paragraph-sm text-error">-{formatEur(selected.irpf_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="paragraph-sm text-muted-foreground">SS empleado</span>
                        <span className="paragraph-sm text-error">-{formatEur(selected.social_security_employee)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-1">
                        <span className="label-sm font-medium text-foreground">Total deducciones</span>
                        <span className="label-sm font-semibold text-error">-{formatEur(selected.total_deductions)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Neto */}
                  <div className="bg-primary rounded-xl p-5 text-center">
                    <p className="label-xs text-white/70 uppercase tracking-wide mb-1">Líquido a percibir</p>
                    <p className="text-3xl font-semibold text-white">{formatEur(selected.net_salary)}</p>
                    {selected.bank_account && (
                      <p className="paragraph-xs text-white/60 mt-1">•••• {selected.bank_account}</p>
                    )}
                  </div>

                  <Button className="w-full" variant="outline">
                    <DownloadSimpleIcon className="size-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}
