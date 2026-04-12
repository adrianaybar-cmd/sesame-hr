'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  UsersIcon,
  ArrowsCounterClockwiseIcon,
  CalendarXIcon,
  CurrencyEurIcon,
  GenderIntersexIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  GraduationCapIcon,
  StarIcon,
} from '@phosphor-icons/react'
import { MOCK_ANALYTICS } from '@/lib/mock/analytics'
import { cn } from '@/lib/utils'

type AnalyticsSection =
  | 'headcount'
  | 'turnover'
  | 'absenteeism'
  | 'compensation'
  | 'diversity'
  | 'engagement'
  | 'recruitment'
  | 'training'
  | 'performance'

const SECTIONS: { id: AnalyticsSection; label: string; icon: React.ElementType }[] = [
  { id: 'headcount', label: 'Headcount', icon: UsersIcon },
  { id: 'turnover', label: 'Rotación', icon: ArrowsCounterClockwiseIcon },
  { id: 'absenteeism', label: 'Absentismo', icon: CalendarXIcon },
  { id: 'compensation', label: 'Compensación', icon: CurrencyEurIcon },
  { id: 'diversity', label: 'Diversidad', icon: GenderIntersexIcon },
  { id: 'engagement', label: 'Engagement', icon: HeartIcon },
  { id: 'recruitment', label: 'Reclutamiento', icon: MagnifyingGlassIcon },
  { id: 'training', label: 'Formación', icon: GraduationCapIcon },
  { id: 'performance', label: 'Rendimiento', icon: StarIcon },
]

const d = MOCK_ANALYTICS

/* ─── helpers ─── */
function CSSBar({ value, max, color = 'hsl(var(--info))' }: { value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function StatCard({ label, value, sub, variant = 'default' }: { label: string; value: string | number; sub?: string; variant?: 'success' | 'warning' | 'error' | 'info' | 'default' }) {
  return (
    <Card className="border-border">
      <CardContent className="pt-4">
        <p className="paragraph-xs text-muted-foreground">{label}</p>
        <p className="title-lg font-semibold text-foreground mt-1">{value}</p>
        {sub && <p className="paragraph-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

/* ─── Section views ─── */

function HeadcountView() {
  const hc = d.headcount
  const maxDept = Math.max(...hc.by_department.map((d) => d.count))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total empleados" value={hc.total} />
        <StatCard label="Nuevas altas (mes)" value={hc.new_hires_this_month} variant="success" />
        <StatCard label="Bajas (mes)" value={hc.terminations_this_month} variant="warning" />
        <StatCard label="Crecimiento YoY" value={`+${hc.growth_rate}%`} variant="info" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {hc.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.count} max={maxDept} color="hsl(var(--info))" />
                <span className="label-xs text-muted-foreground w-6 text-right">{dept.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Por tipo de contrato</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {hc.by_contract_type.map((ct) => (
              <div key={ct.type} className="space-y-1">
                <div className="flex justify-between">
                  <span className="label-sm text-foreground">{ct.type}</span>
                  <span className="label-xs text-muted-foreground">{ct.count} · {ct.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--success))]" style={{ width: `${ct.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TurnoverView() {
  const tv = d.turnover
  const maxRate = Math.max(...tv.by_department.map((d) => d.rate))
  const total = tv.voluntary_vs_involuntary.voluntary + tv.voluntary_vs_involuntary.involuntary
  const pctVol = Math.round((tv.voluntary_vs_involuntary.voluntary / total) * 100)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Tasa de rotación" value={`${tv.rate}%`} variant="warning" />
        <StatCard label="Antigüedad media" value={`${tv.avg_tenure_months} meses`} />
        <StatCard label="Voluntary" value={`${pctVol}%`} sub="del total de bajas" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Rotación por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tv.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.rate} max={maxRate} color="hsl(var(--warning))" />
                <span className="label-xs text-muted-foreground w-10 text-right">{dept.rate}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Voluntaria vs Involuntaria</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="label-sm text-foreground">Voluntaria</span>
                <span className="label-xs text-muted-foreground">{tv.voluntary_vs_involuntary.voluntary}%</span>
              </div>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-l-full bg-[hsl(var(--warning))]" style={{ width: `${tv.voluntary_vs_involuntary.voluntary}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="label-sm text-foreground">Involuntaria</span>
                <span className="label-xs text-muted-foreground">{tv.voluntary_vs_involuntary.involuntary}%</span>
              </div>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-l-full bg-[hsl(var(--error))]" style={{ width: `${tv.voluntary_vs_involuntary.involuntary}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AbsenteeismView() {
  const ab = d.absenteeism
  const maxDays = Math.max(...ab.by_type.map((t) => t.days))
  const maxTrend = Math.max(...ab.trend.map((t) => t.rate))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Tasa de absentismo" value={`${ab.rate}%`} variant="warning" />
        <StatCard label="Coste estimado" value={`${ab.cost_estimate.toLocaleString('es-ES')} €`} />
        <StatCard label="Días perdidos" value={ab.by_type.reduce((s, t) => s + t.days, 0)} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Por tipo de ausencia</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {ab.by_type.map((t) => (
              <div key={t.type} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{t.type}</span>
                <CSSBar value={t.days} max={maxDays} color="hsl(var(--warning))" />
                <span className="label-xs text-muted-foreground w-14 text-right">{t.days}d · {t.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Tendencia 6 meses</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-28">
              {ab.trend.map((t) => {
                const h = (t.rate / maxTrend) * 100
                return (
                  <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="label-xs text-muted-foreground">{t.rate}%</span>
                    <div
                      className="w-full rounded-t-sm bg-[hsl(var(--warning))]"
                      style={{ height: `${h}%`, minHeight: '4px' }}
                    />
                    <span className="label-xs text-muted-foreground">{t.month}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CompensationView() {
  const co = d.compensation
  const maxSalary = Math.max(...co.by_department.map((d) => d.avg))
  const maxDist = Math.max(...co.distribution.map((d) => d.count))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Salario medio" value={`${co.avg_salary.toLocaleString('es-ES')} €`} />
        <StatCard label="Salario mediana" value={`${co.median_salary.toLocaleString('es-ES')} €`} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Salario medio por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {co.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.avg} max={maxSalary} color="hsl(var(--success))" />
                <span className="label-xs text-muted-foreground w-16 text-right">{dept.avg.toLocaleString('es-ES')} €</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Distribución salarial</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {co.distribution.map((d) => (
              <div key={d.range} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-20 shrink-0">{d.range}</span>
                <CSSBar value={d.count} max={maxDist} color="hsl(var(--info))" />
                <span className="label-xs text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DiversityView() {
  const div = d.diversity
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Género</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {div.gender.map((g) => (
              <div key={g.label} className="space-y-1">
                <div className="flex justify-between">
                  <span className="label-sm text-foreground">{g.label}</span>
                  <span className="label-xs text-muted-foreground">{g.count} · {g.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--info))]" style={{ width: `${g.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Grupos de edad</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {div.age_groups.map((a) => (
              <div key={a.range} className="space-y-1">
                <div className="flex justify-between">
                  <span className="label-sm text-foreground">{a.range}</span>
                  <span className="label-xs text-muted-foreground">{a.count} · {a.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--warning))]" style={{ width: `${a.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Antigüedad</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {div.tenure_groups.map((t) => (
              <div key={t.range} className="space-y-1">
                <div className="flex justify-between">
                  <span className="label-sm text-foreground">{t.range}</span>
                  <span className="label-xs text-muted-foreground">{t.count} · {t.percentage}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--success))]" style={{ width: `${t.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EngagementView() {
  const eng = d.engagement
  const maxTrend = Math.max(...eng.trend.map((t) => t.score))
  const maxDept = Math.max(...eng.by_department.map((d) => d.score))
  const npsColor = eng.nps >= 30 ? 'hsl(var(--success))' : eng.nps >= 0 ? 'hsl(var(--warning))' : 'hsl(var(--error))'
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 text-center">
            <p className="paragraph-xs text-muted-foreground">Score de engagement</p>
            <p className="display-sm font-semibold text-foreground mt-1">{eng.score}<span className="title-2xs text-muted-foreground">/100</span></p>
            <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-[hsl(var(--success))]" style={{ width: `${eng.score}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 text-center">
            <p className="paragraph-xs text-muted-foreground">eNPS</p>
            <p className="display-sm font-semibold mt-1" style={{ color: npsColor }}>{eng.nps}</p>
            <Badge variant={eng.nps >= 30 ? 'success' : 'warning'} size="xs" className="mt-2">
              {eng.nps >= 50 ? 'Excelente' : eng.nps >= 30 ? 'Bueno' : 'Mejorable'}
            </Badge>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Tendencia 6 meses</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-28">
              {eng.trend.map((t) => {
                const h = (t.score / maxTrend) * 100
                return (
                  <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="label-xs text-muted-foreground">{t.score}</span>
                    <div className="w-full rounded-t-sm bg-[hsl(var(--success))]" style={{ height: `${h}%`, minHeight: '4px' }} />
                    <span className="label-xs text-muted-foreground">{t.month}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {eng.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.score} max={maxDept} color="hsl(var(--success))" />
                <span className="label-xs text-muted-foreground w-6 text-right">{dept.score}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecruitmentView() {
  const rec = d.recruitment
  const maxCandidates = Math.max(...rec.sources.map((s) => s.candidates))
  const maxPipeline = Math.max(...rec.pipeline.map((p) => p.count))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Vacantes abiertas" value={rec.open_positions} />
        <StatCard label="Tiempo medio contratación" value={`${rec.time_to_hire_avg} días`} />
        <StatCard label="Coste por contratación" value={`${rec.cost_per_hire.toLocaleString('es-ES')} €`} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Fuentes de candidatos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {rec.sources.map((s) => (
              <div key={s.source} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-24 shrink-0">{s.source}</span>
                <CSSBar value={s.candidates} max={maxCandidates} color="hsl(var(--info))" />
                <span className="label-xs text-muted-foreground w-20 text-right">{s.candidates} cand. · {s.hired} cont.</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Pipeline de selección</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {rec.pipeline.map((p) => (
              <div key={p.stage} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-36 shrink-0">{p.stage}</span>
                <CSSBar value={p.count} max={maxPipeline} color="hsl(var(--warning))" />
                <span className="label-xs text-muted-foreground w-6 text-right">{p.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TrainingView() {
  const tr = d.training
  const pctCompleted = Math.round((tr.completed_vs_planned.completed / tr.completed_vs_planned.planned) * 100)
  const maxHours = Math.max(...tr.by_department.map((d) => d.hours))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Horas/empleado" value={`${tr.hours_per_employee}h`} />
        <StatCard label="Completadas" value={tr.completed_vs_planned.completed} sub={`de ${tr.completed_vs_planned.planned} planificadas`} />
        <StatCard label="% Cumplimiento" value={`${pctCompleted}%`} variant={pctCompleted >= 80 ? 'success' : 'warning'} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Horas por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tr.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.hours} max={maxHours} color="hsl(var(--info))" />
                <span className="label-xs text-muted-foreground w-8 text-right">{dept.hours}h</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Top cursos</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tr.top_courses.map((course, i) => (
              <div key={course.name} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                <span className="label-xs font-semibold text-muted-foreground w-5">#{i + 1}</span>
                <span className="paragraph-xs text-foreground flex-1">{course.name}</span>
                <Badge variant="default" size="xs">{course.completions}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PerformanceView() {
  const perf = d.performance
  const maxDist = Math.max(...perf.distribution.map((d) => d.count))
  const maxDept = Math.max(...perf.by_department.map((d) => d.avg))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Score medio" value={`${perf.avg_score}/5`} variant="success" />
        <StatCard label="Revisiones completadas" value={`${perf.completed_reviews_pct}%`} />
        <StatCard label="Superan expectativas" value={`${perf.distribution.find(d => d.range.includes('Supera'))?.percentage ?? 0}%`} variant="info" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Distribución de scores</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {perf.distribution.map((d) => (
              <div key={d.range} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-36 shrink-0">{d.range}</span>
                <CSSBar value={d.count} max={maxDist} color="hsl(var(--info))" />
                <span className="label-xs text-muted-foreground w-16 text-right">{d.count} · {d.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader><CardTitle className="label-md font-semibold text-foreground">Score medio por departamento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {perf.by_department.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="label-sm text-foreground w-28 shrink-0">{dept.name}</span>
                <CSSBar value={dept.avg} max={maxDept} color="hsl(var(--success))" />
                <span className="label-xs text-muted-foreground w-8 text-right">{dept.avg}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const SECTION_VIEWS: Record<AnalyticsSection, React.ReactNode> = {
  headcount: <HeadcountView />,
  turnover: <TurnoverView />,
  absenteeism: <AbsenteeismView />,
  compensation: <CompensationView />,
  diversity: <DiversityView />,
  engagement: <EngagementView />,
  recruitment: <RecruitmentView />,
  training: <TrainingView />,
  performance: <PerformanceView />,
}

export default function PeopleAnalyticsPage() {
  const [activeSection, setActiveSection] = useState<AnalyticsSection>('headcount')
  const [period, setPeriod] = useState('this_year')

  const activeLabel = SECTIONS.find((s) => s.id === activeSection)?.label ?? ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="title-lg font-semibold text-foreground">People Analytics</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Indicadores de personas y capital humano
          </p>
        </div>
        <Select value={period} onValueChange={(v: string) => setPeriod(v)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_year">Este año</SelectItem>
            <SelectItem value="last_year">Año pasado</SelectItem>
            <SelectItem value="last_12m">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar de secciones */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors label-sm',
                  activeSection === id
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                )}
                onClick={() => setActiveSection(id)}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="title-2xs font-semibold text-foreground">{activeLabel}</h2>
          </div>
          {SECTION_VIEWS[activeSection]}
        </div>
      </div>
    </div>
  )
}
