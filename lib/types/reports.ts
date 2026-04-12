export type ReportCategory =
  | 'time'
  | 'absence'
  | 'payroll'
  | 'talent'
  | 'expenses'
  | 'people'

export interface ReportFilter {
  key: string
  label: string
  type: 'date_range' | 'select' | 'multiselect' | 'search'
  options?: { value: string; label: string }[]
}

export interface ReportDefinition {
  id: string
  name: string
  description: string
  category: ReportCategory
  filters: ReportFilter[]
  columns: string[]
}

export interface ReportResult {
  report_id: string
  generated_at: string
  filters_applied: Record<string, unknown>
  rows: Record<string, unknown>[]
  total_rows: number
}
