'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@clasing/ui/dialog'
import {
  ClockIcon,
  CalendarXIcon,
  CurrencyEurIcon,
  UsersIcon,
  ReceiptIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  DownloadSimpleIcon,
  PlayIcon,
  CaretDownIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'
import { MOCK_REPORTS, generateMockRows } from '@/lib/mock/reports'
import type { ReportDefinition, ReportCategory, ReportResult } from '@/lib/types/reports'
import { cn } from '@/lib/utils'

const CATEGORY_META: Record<
  ReportCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  time: { label: 'Control horario', icon: ClockIcon, color: 'text-[hsl(var(--info))]' },
  absence: { label: 'Ausencias', icon: CalendarXIcon, color: 'text-[hsl(var(--warning))]' },
  payroll: { label: 'Nóminas', icon: CurrencyEurIcon, color: 'text-[hsl(var(--success))]' },
  talent: { label: 'Talento', icon: ChartBarIcon, color: 'text-purple-500' },
  expenses: { label: 'Gastos', icon: ReceiptIcon, color: 'text-orange-500' },
  people: { label: 'Personas', icon: UsersIcon, color: 'text-[hsl(var(--foreground))]' },
}

const CATEGORIES: ReportCategory[] = ['time', 'absence', 'payroll', 'talent', 'expenses', 'people']

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<ReportCategory>>(new Set(['time']))
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ReportResult | null>(null)
  const [generating, setGenerating] = useState(false)

  function toggleCategory(cat: ReportCategory) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function openReport(report: ReportDefinition) {
    setSelectedReport(report)
    setFilterValues({})
    setResult(null)
  }

  function handleGenerate() {
    if (!selectedReport) return
    setGenerating(true)
    setTimeout(() => {
      const rows = generateMockRows(selectedReport.id, 10)
      setResult({
        report_id: selectedReport.id,
        generated_at: new Date().toISOString(),
        filters_applied: filterValues,
        rows,
        total_rows: rows.length,
      })
      setGenerating(false)
    }, 600)
  }

  function handleExport(format: 'excel' | 'pdf') {
    alert(`Descargando ${selectedReport?.name}.${format === 'excel' ? 'xlsx' : 'pdf'} …`)
  }

  const filteredReports = MOCK_REPORTS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Reportes</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {MOCK_REPORTS.length} reportes disponibles en {CATEGORIES.length} categorías
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar reporte…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Accordion por categoría */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          const Icon = meta.icon
          const reports = filteredReports.filter((r) => r.category === cat)
          if (search && reports.length === 0) return null
          const isOpen = openCategories.has(cat) || !!search

          return (
            <Card key={cat} className="border-border overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(cat)}
              >
                <div className={cn('rounded-lg bg-muted p-1.5', meta.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1">
                  <span className="label-md font-semibold text-foreground">{meta.label}</span>
                  <span className="paragraph-xs text-muted-foreground ml-2">
                    {reports.length} reportes
                  </span>
                </div>
                {isOpen ? (
                  <CaretDownIcon className="size-4 text-muted-foreground" />
                ) : (
                  <CaretRightIcon className="size-4 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 py-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                      <button
                        key={report.id}
                        className="text-left rounded-lg border border-border p-4 hover:border-[hsl(var(--ring))] hover:bg-muted/30 transition-all group"
                        onClick={() => openReport(report)}
                      >
                        <p className="label-sm font-semibold text-foreground group-hover:text-[hsl(var(--primary))] transition-colors">
                          {report.name}
                        </p>
                        <p className="paragraph-xs text-muted-foreground mt-1 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="paragraph-xs text-muted-foreground">
                            {report.columns.length} columnas
                          </span>
                          <PlayIcon className="size-3.5 text-muted-foreground group-hover:text-[hsl(var(--primary))] transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Dialog del reporte */}
      <Dialog open={!!selectedReport} onOpenChange={(open: boolean) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="title-2xs font-semibold text-foreground">
                  {selectedReport.name}
                </DialogTitle>
                <DialogDescription className="paragraph-sm text-muted-foreground">
                  {selectedReport.description}
                </DialogDescription>
              </DialogHeader>

              {/* Filtros */}
              <div className="space-y-4 mt-2">
                <p className="label-sm font-semibold text-foreground">Filtros</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedReport.filters.map((filter) => (
                    <div key={filter.key} className="space-y-1.5">
                      <label className="label-xs font-medium text-muted-foreground">
                        {filter.label}
                      </label>
                      {filter.type === 'date_range' && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            placeholder="Desde"
                            value={(filterValues[`${filter.key}_from`] as string) ?? ''}
                            onChange={(e) =>
                              setFilterValues((p) => ({ ...p, [`${filter.key}_from`]: e.target.value }))
                            }
                          />
                          <Input
                            type="date"
                            placeholder="Hasta"
                            value={(filterValues[`${filter.key}_to`] as string) ?? ''}
                            onChange={(e) =>
                              setFilterValues((p) => ({ ...p, [`${filter.key}_to`]: e.target.value }))
                            }
                          />
                        </div>
                      )}
                      {(filter.type === 'select' || filter.type === 'multiselect') && filter.options && (
                        <Select
                          value={(filterValues[filter.key] as string) ?? ''}
                          onValueChange={(v: string) =>
                            setFilterValues((p) => ({ ...p, [filter.key]: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar…" />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {filter.type === 'search' && (
                        <Input
                          placeholder="Buscar…"
                          value={(filterValues[filter.key] as string) ?? ''}
                          onChange={(e) =>
                            setFilterValues((p) => ({ ...p, [filter.key]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={handleGenerate} disabled={generating}>
                    <PlayIcon className="size-4" />
                    {generating ? 'Generando…' : 'Generar reporte'}
                  </Button>
                  {result && (
                    <>
                      <Button variant="outline" onClick={() => handleExport('excel')}>
                        <DownloadSimpleIcon className="size-4" />
                        Excel
                      </Button>
                      <Button variant="outline" onClick={() => handleExport('pdf')}>
                        <DownloadSimpleIcon className="size-4" />
                        PDF
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabla de resultados */}
              {result && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="label-sm font-semibold text-foreground">
                      Resultados
                    </p>
                    <Badge variant="default" size="xs">{result.total_rows} filas</Badge>
                  </div>
                  <div className="rounded-lg border border-border overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          {selectedReport.columns.map((col) => (
                            <th
                              key={col}
                              className="px-3 py-2 label-xs font-semibold text-muted-foreground whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                          >
                            {selectedReport.columns.map((col) => (
                              <td key={col} className="px-3 py-2 paragraph-xs text-foreground whitespace-nowrap">
                                {String(row[col] ?? '—')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
