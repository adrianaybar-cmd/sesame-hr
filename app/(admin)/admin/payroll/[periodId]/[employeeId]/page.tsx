'use client'

export const dynamic = 'force-dynamic'

import { use } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  PaperPlaneTiltIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { MOCK_PAYROLL_PERIODS, MOCK_PAYSLIPS } from '@/lib/mock/payroll'

const MONTH_NAMES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function PayslipPage({ params }: { params: Promise<{ periodId: string; employeeId: string }> }) {
  const { periodId, employeeId } = use(params)

  const period = MOCK_PAYROLL_PERIODS.find(p => p.id === periodId)
  const payslip = MOCK_PAYSLIPS.find(ps => ps.period_id === periodId && ps.employee_id === employeeId)

  if (!period || !payslip) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground paragraph-sm">Nómina no encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Nav */}
      <div className="flex items-center gap-3">
        <Link href={`/payroll/${periodId}`}>
          <Button variant="ghost" size="sm" iconOnly>
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="title-lg font-semibold text-foreground">Nómina — {MONTH_NAMES[period.month]} {period.year}</h1>
          <p className="paragraph-sm text-muted-foreground">{payslip.employee_name}</p>
        </div>
      </div>

      {/* Documento nómina */}
      <Card className="bg-card border border-border overflow-hidden">
        {/* Header empresa + empleado */}
        <div className="bg-primary px-8 py-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <BuildingOfficeIcon className="size-6" />
              <div>
                <p className="label-md font-semibold">Sesame Technologies S.L.</p>
                <p className="paragraph-xs opacity-80">CIF: B-12345678</p>
                <p className="paragraph-xs opacity-80">Calle Gran Vía 45, Madrid · CCC: 28/123456/78</p>
              </div>
            </div>
            <div className="text-right">
              <p className="label-sm font-medium opacity-80">Período</p>
              <p className="label-md font-semibold">{MONTH_NAMES[period.month]} {period.year}</p>
              <Badge variant="neutral" className="mt-1">
                {payslip.status === 'draft' ? 'Borrador' : payslip.status === 'reviewed' ? 'Revisado' : 'Pagado'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-background/50 px-8 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="size-5 text-primary" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div>
                <p className="label-xs text-muted-foreground">Nombre</p>
                <p className="label-sm font-medium text-foreground">{payslip.employee_name}</p>
              </div>
              <div>
                <p className="label-xs text-muted-foreground">NIF</p>
                <p className="label-sm font-medium text-foreground">{payslip.employee_nif}</p>
              </div>
              <div>
                <p className="label-xs text-muted-foreground">Categoría</p>
                <p className="label-sm font-medium text-foreground">{payslip.position}</p>
              </div>
              <div>
                <p className="label-xs text-muted-foreground">Departamento</p>
                <p className="label-sm font-medium text-foreground">{payslip.department}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Devengos */}
          <div>
            <h3 className="label-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Devengos</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 label-xs text-muted-foreground">Concepto</th>
                  <th className="text-right py-2 label-xs text-muted-foreground">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 paragraph-sm text-foreground">Salario base</td>
                  <td className="py-2 paragraph-sm text-foreground text-right">{formatEur(payslip.base_salary)}</td>
                </tr>
                {payslip.overtime_pay > 0 && (
                  <tr>
                    <td className="py-2 paragraph-sm text-foreground">Horas extraordinarias</td>
                    <td className="py-2 paragraph-sm text-foreground text-right">{formatEur(payslip.overtime_pay)}</td>
                  </tr>
                )}
                {payslip.bonuses > 0 && (
                  <tr>
                    <td className="py-2 paragraph-sm text-foreground">Incentivos y comisiones</td>
                    <td className="py-2 paragraph-sm text-foreground text-right">{formatEur(payslip.bonuses)}</td>
                  </tr>
                )}
                {payslip.other_income > 0 && (
                  <tr>
                    <td className="py-2 paragraph-sm text-foreground">Otros ingresos</td>
                    <td className="py-2 paragraph-sm text-foreground text-right">{formatEur(payslip.other_income)}</td>
                  </tr>
                )}
                <tr className="border-t-2 border-border">
                  <td className="py-2 label-sm font-semibold text-foreground">Total devengado</td>
                  <td className="py-2 label-sm font-semibold text-foreground text-right">{formatEur(payslip.gross_salary)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deducciones */}
          <div>
            <h3 className="label-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Deducciones</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 label-xs text-muted-foreground">Concepto</th>
                  <th className="text-right py-2 label-xs text-muted-foreground">%</th>
                  <th className="text-right py-2 label-xs text-muted-foreground">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 paragraph-sm text-foreground">Retención IRPF</td>
                  <td className="py-2 paragraph-sm text-muted-foreground text-right">{payslip.irpf_rate}%</td>
                  <td className="py-2 paragraph-sm text-error text-right">-{formatEur(payslip.irpf_amount)}</td>
                </tr>
                <tr>
                  <td className="py-2 paragraph-sm text-foreground">Cuota SS empleado</td>
                  <td className="py-2 paragraph-sm text-muted-foreground text-right">
                    {((payslip.social_security_employee / payslip.gross_salary) * 100).toFixed(2)}%
                  </td>
                  <td className="py-2 paragraph-sm text-error text-right">-{formatEur(payslip.social_security_employee)}</td>
                </tr>
                {payslip.other_deductions > 0 && (
                  <tr>
                    <td className="py-2 paragraph-sm text-foreground">Otras deducciones</td>
                    <td className="py-2 paragraph-sm text-muted-foreground text-right">—</td>
                    <td className="py-2 paragraph-sm text-error text-right">-{formatEur(payslip.other_deductions)}</td>
                  </tr>
                )}
                <tr className="border-t-2 border-border">
                  <td className="py-2 label-sm font-semibold text-foreground">Total deducciones</td>
                  <td className="py-2" />
                  <td className="py-2 label-sm font-semibold text-error text-right">-{formatEur(payslip.total_deductions)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Salario neto — destacado */}
          <div className="bg-primary rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="label-xs text-white/70 uppercase tracking-wide">Líquido a percibir</p>
              {payslip.bank_account && (
                <p className="paragraph-xs text-white/60 mt-1">Cuenta •••• {payslip.bank_account}</p>
              )}
            </div>
            <p className="text-4xl font-semibold text-white">{formatEur(payslip.net_salary)}</p>
          </div>

          {/* Coste empresa */}
          <div className="bg-background rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="label-sm font-medium text-foreground">Coste total empresa</p>
              <p className="paragraph-xs text-muted-foreground">SS empresa: {formatEur(payslip.company_ss_contribution)}</p>
            </div>
            <p className="label-md font-semibold text-foreground">{formatEur(payslip.total_company_cost)}</p>
          </div>
        </div>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">
          <DownloadSimpleIcon className="size-4 mr-2" />
          Descargar PDF
        </Button>
        <Button>
          <PaperPlaneTiltIcon className="size-4 mr-2" />
          Enviar al empleado
        </Button>
      </div>
    </div>
  )
}
