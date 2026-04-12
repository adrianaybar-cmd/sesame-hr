'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Input } from '@clasing/ui/input'
import {
  ForkKnifeIcon,
  BusIcon,
  BabyIcon,
  HeartIcon,
  BookOpenIcon,
  CheckCircleIcon,
  InfoIcon,
} from '@phosphor-icons/react'
import type { FlexBenefit, EmployeeFlexBenefit, FlexBenefitCategory } from '@/lib/types/flex-benefits'
import { cn } from '@/lib/utils'

const CURRENT_EMPLOYEE_ID = 'emp-6'
const IRPF_RATE = 19 // tasa IRPF de Sofía

const ALL_BENEFITS: FlexBenefit[] = [
  {
    id: 'fb-1',
    category: 'restaurant',
    name: 'Cheque Restaurante',
    provider: 'Sodexo',
    max_monthly: 220,
    irpf_exempt: true,
    annual_limit: 2640,
    description: 'Paga tu comida diaria con cheques restaurante exentos de IRPF hasta 11€/día laborable.',
  },
  {
    id: 'fb-2',
    category: 'transport',
    name: 'Transporte Público',
    provider: 'Cobee',
    max_monthly: 136.36,
    irpf_exempt: true,
    annual_limit: 1636.32,
    description: 'Abono de transporte público (metro, bus, tren de cercanías) con exención fiscal total.',
  },
  {
    id: 'fb-3',
    category: 'childcare',
    name: 'Cheque Guardería',
    provider: 'KidsCo',
    max_monthly: 600,
    irpf_exempt: true,
    description: 'Pago de guardería o escuela infantil para hijos de 0 a 3 años sin límite de exención.',
  },
  {
    id: 'fb-4',
    category: 'health',
    name: 'Seguro Médico',
    provider: 'Adeslas',
    max_monthly: 41.67,
    irpf_exempt: true,
    annual_limit: 500,
    description: 'Seguro médico privado para el empleado y familia (cónyuge + 2 hijos). Exento hasta 500€/año por persona.',
  },
  {
    id: 'fb-5',
    category: 'training',
    name: 'Formación y Desarrollo',
    provider: 'Udemy Business',
    max_monthly: 100,
    irpf_exempt: true,
    description: 'Cursos, certificaciones y formación relacionada con tu puesto de trabajo, sin límite fiscal.',
  },
]

const CATEGORY_ICONS: Record<FlexBenefitCategory, React.ElementType> = {
  restaurant: ForkKnifeIcon,
  transport: BusIcon,
  childcare: BabyIcon,
  health: HeartIcon,
  training: BookOpenIcon,
}

const CATEGORY_COLORS: Record<FlexBenefitCategory, string> = {
  restaurant: 'bg-orange-100 text-orange-600',
  transport: 'bg-blue-100 text-blue-600',
  childcare: 'bg-purple-100 text-purple-600',
  health: 'bg-red-100 text-red-600',
  training: 'bg-green-100 text-green-600',
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

const INITIAL_ACTIVE: EmployeeFlexBenefit[] = [
  {
    id: 'efb-1',
    employee_id: CURRENT_EMPLOYEE_ID,
    benefit_id: 'fb-4',
    benefit_name: 'Seguro Médico',
    category: 'health',
    monthly_amount: 41.67,
    start_date: '2026-01-01',
    is_active: true,
  },
]

export default function FlexBenefitsPage() {
  const [activeBenefits, setActiveBenefits] = useState<EmployeeFlexBenefit[]>(INITIAL_ACTIVE)
  const [amounts, setAmounts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    INITIAL_ACTIVE.forEach(b => { init[b.benefit_id] = String(b.monthly_amount) })
    return init
  })

  function isActive(benefitId: string) {
    return activeBenefits.some(b => b.benefit_id === benefitId && b.is_active)
  }

  function toggleBenefit(benefit: FlexBenefit) {
    if (isActive(benefit.id)) {
      setActiveBenefits(prev => prev.map(b => b.benefit_id === benefit.id ? { ...b, is_active: false } : b))
    } else {
      const existing = activeBenefits.find(b => b.benefit_id === benefit.id)
      if (existing) {
        setActiveBenefits(prev => prev.map(b => b.benefit_id === benefit.id ? { ...b, is_active: true } : b))
      } else {
        setActiveBenefits(prev => [
          ...prev,
          {
            id: `efb-${Date.now()}`,
            employee_id: CURRENT_EMPLOYEE_ID,
            benefit_id: benefit.id,
            benefit_name: benefit.name,
            category: benefit.category,
            monthly_amount: parseFloat(amounts[benefit.id] ?? '0') || 0,
            start_date: '2026-04-01',
            is_active: true,
          },
        ])
        if (!amounts[benefit.id]) {
          setAmounts(a => ({ ...a, [benefit.id]: '' }))
        }
      }
    }
  }

  function updateAmount(benefitId: string, value: string) {
    setAmounts(a => ({ ...a, [benefitId]: value }))
    setActiveBenefits(prev =>
      prev.map(b => b.benefit_id === benefitId ? { ...b, monthly_amount: parseFloat(value) || 0 } : b),
    )
  }

  // Cálculo ahorro fiscal
  const totalFlex = activeBenefits.filter(b => b.is_active).reduce((s, b) => s + b.monthly_amount, 0)
  const annualFlex = totalFlex * 12
  const taxSaving = (annualFlex * IRPF_RATE) / 100
  const ssEmployee = annualFlex * 0.0635
  const totalSaving = taxSaving + ssEmployee

  return (
    <div className="space-y-6">
      <div>
        <h1 className="title-lg font-semibold text-foreground">Retribución Flexible</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Personaliza tu paquete de beneficios y ahorra en IRPF
        </p>
      </div>

      {/* Resumen ahorro */}
      {totalFlex > 0 && (
        <Card className="p-6 bg-primary text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="label-xs opacity-70 uppercase tracking-wide">Retribución flexible activa</p>
              <p className="text-3xl font-semibold mt-1">{formatEur(totalFlex)}<span className="text-base opacity-70">/mes</span></p>
              <p className="paragraph-xs opacity-70 mt-1">{formatEur(annualFlex)}/año</p>
            </div>
            <div className="text-right">
              <p className="label-xs opacity-70 uppercase tracking-wide">Ahorro fiscal estimado</p>
              <p className="text-3xl font-semibold mt-1 text-yellow-300">{formatEur(totalSaving)}</p>
              <p className="paragraph-xs opacity-70 mt-1">IRPF + SS/año</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <InfoIcon className="size-4 opacity-70 flex-shrink-0" />
            <p className="paragraph-xs opacity-80">
              Ahorro calculado con tu IRPF del {IRPF_RATE}%. Sin retribución flexible pagarías {formatEur(totalSaving)} más de impuestos al año.
            </p>
          </div>
        </Card>
      )}

      {/* Cards de beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_BENEFITS.map(benefit => {
          const Icon = CATEGORY_ICONS[benefit.category]
          const iconCls = CATEGORY_COLORS[benefit.category]
          const active = isActive(benefit.id)
          const currentAmount = amounts[benefit.id] ?? ''

          return (
            <Card
              key={benefit.id}
              className={cn(
                'bg-card border border-border p-5 transition-all',
                active && 'border-primary ring-1 ring-primary/20',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconCls)}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="label-md font-semibold text-foreground">{benefit.name}</p>
                      {benefit.irpf_exempt && (
                        <Badge variant="success">IRPF Exento</Badge>
                      )}
                    </div>
                    <p className="paragraph-xs text-muted-foreground mt-0.5">{benefit.provider}</p>
                    <p className="paragraph-xs text-muted-foreground mt-1">{benefit.description}</p>

                    <div className="flex gap-3 mt-2 flex-wrap">
                      <div>
                        <p className="label-xs text-muted-foreground">Límite mensual</p>
                        <p className="label-sm font-medium text-foreground">{formatEur(benefit.max_monthly)}</p>
                      </div>
                      {benefit.annual_limit && (
                        <div>
                          <p className="label-xs text-muted-foreground">Límite anual</p>
                          <p className="label-sm font-medium text-foreground">{formatEur(benefit.annual_limit)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5',
                    active ? 'bg-primary' : 'bg-border',
                  )}
                  aria-label={active ? 'Desactivar beneficio' : 'Activar beneficio'}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                      active ? 'translate-x-5' : 'translate-x-0.5',
                    )}
                  />
                </button>
              </div>

              {/* Input importe */}
              {active && (
                <div className="mt-4 flex items-center gap-3 bg-background rounded-lg border border-border p-3">
                  <div className="flex-1">
                    <p className="label-xs text-muted-foreground mb-1">Importe mensual a destinar</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={currentAmount}
                        onChange={e => updateAmount(benefit.id, e.target.value)}
                        min="0"
                        max={benefit.max_monthly}
                        step="0.01"
                        className="h-8 text-sm"
                      />
                      <span className="label-xs text-muted-foreground whitespace-nowrap">
                        máx. {formatEur(benefit.max_monthly)}
                      </span>
                    </div>
                  </div>
                  {parseFloat(currentAmount) > 0 && (
                    <div className="text-right flex-shrink-0">
                      <p className="label-xs text-muted-foreground">Ahorro/año</p>
                      <p className="label-sm font-semibold text-success">
                        {formatEur(parseFloat(currentAmount) * 12 * IRPF_RATE / 100)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Guardar */}
      <div className="flex justify-end">
        <Button>
          <CheckCircleIcon className="size-4 mr-2" />
          Guardar configuración
        </Button>
      </div>
    </div>
  )
}
