import type { ReportDefinition } from '@/lib/types/reports'

const DEPT_OPTIONS = [
  { value: 'dept-1', label: 'Tecnología' },
  { value: 'dept-2', label: 'RRHH' },
  { value: 'dept-3', label: 'Marketing' },
  { value: 'dept-4', label: 'Ventas' },
  { value: 'dept-5', label: 'Finanzas' },
]

const CONTRACT_OPTIONS = [
  { value: 'indefinido', label: 'Indefinido' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'practicas', label: 'Prácticas' },
]

const COMMON_FILTERS = [
  {
    key: 'date_range',
    label: 'Período',
    type: 'date_range' as const,
  },
  {
    key: 'department',
    label: 'Departamento',
    type: 'multiselect' as const,
    options: DEPT_OPTIONS,
  },
  {
    key: 'employee',
    label: 'Empleado',
    type: 'search' as const,
  },
]

export const MOCK_REPORTS: ReportDefinition[] = [
  // TIME
  {
    id: 'time-1',
    name: 'Horas trabajadas por empleado',
    description: 'Total de horas trabajadas por cada empleado en el período seleccionado.',
    category: 'time',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Departamento', 'Horas regulares', 'Horas extra', 'Total horas', 'Objetivo'],
  },
  {
    id: 'time-2',
    name: 'Fichajes del período',
    description: 'Detalle de todos los fichajes de entrada y salida en el rango de fechas.',
    category: 'time',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Fecha', 'Entrada', 'Salida', 'Horas', 'Ubicación', 'Tipo'],
  },
  {
    id: 'time-3',
    name: 'Overtime report',
    description: 'Empleados con horas extra acumuladas, con coste estimado.',
    category: 'time',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Departamento', 'Horas extra', 'Coste estimado', 'Semanas'],
  },
  {
    id: 'time-4',
    name: 'Puntualidad',
    description: 'Análisis de puntualidad por empleado: entradas tardías y salidas anticipadas.',
    category: 'time',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Entradas a tiempo', 'Tarde', 'Salidas anticipadas', '% Puntualidad'],
  },
  {
    id: 'time-5',
    name: 'Incidencias de fichaje',
    description: 'Listado de incidencias detectadas: fichajes sin cierre, horarios incorrectos.',
    category: 'time',
    filters: [
      ...COMMON_FILTERS,
      {
        key: 'status',
        label: 'Estado',
        type: 'select' as const,
        options: [
          { value: 'pending', label: 'Pendiente' },
          { value: 'resolved', label: 'Resuelto' },
        ],
      },
    ],
    columns: ['Empleado', 'Fecha', 'Tipo incidencia', 'Descripción', 'Estado'],
  },

  // ABSENCE
  {
    id: 'abs-1',
    name: 'Ausencias por tipo',
    description: 'Resumen de ausencias agrupadas por tipo (vacaciones, bajas, personales…).',
    category: 'absence',
    filters: COMMON_FILTERS,
    columns: ['Tipo', 'Nº ausencias', 'Días totales', '% del total', 'Coste estimado'],
  },
  {
    id: 'abs-2',
    name: 'Vacaciones disfrutadas',
    description: 'Vacaciones disfrutadas vs saldo disponible por empleado.',
    category: 'absence',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Saldo total', 'Disfrutadas', 'Pendientes', 'Caducidad'],
  },
  {
    id: 'abs-3',
    name: 'Ausencias por departamento',
    description: 'Tasa de absentismo y días perdidos desglosados por departamento.',
    category: 'absence',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Departamento', 'Empleados', 'Días perdidos', 'Tasa absentismo', 'vs Período anterior'],
  },
  {
    id: 'abs-4',
    name: 'Calendario de ausencias',
    description: 'Vista de calendario con todas las ausencias aprobadas y pendientes.',
    category: 'absence',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Empleado', 'Tipo', 'Fecha inicio', 'Fecha fin', 'Días', 'Estado'],
  },

  // PAYROLL
  {
    id: 'pay-1',
    name: 'Nóminas del mes',
    description: 'Resumen de nóminas generadas en el período, con importes bruto y neto.',
    category: 'payroll',
    filters: [
      COMMON_FILTERS[0],
      COMMON_FILTERS[1],
    ],
    columns: ['Empleado', 'Departamento', 'Salario bruto', 'IRPF', 'SS empleado', 'Neto'],
  },
  {
    id: 'pay-2',
    name: 'Histórico de nóminas',
    description: 'Histórico completo de nóminas por empleado, con variaciones mensuales.',
    category: 'payroll',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Mes', 'Bruto', 'IRPF', 'SS', 'Neto', 'Variación'],
  },
  {
    id: 'pay-3',
    name: 'Coste empresa',
    description: 'Coste total para la empresa incluyendo SS patronal y beneficios.',
    category: 'payroll',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Departamento', 'Nº empleados', 'Salario bruto', 'SS patronal', 'Beneficios', 'Coste total'],
  },
  {
    id: 'pay-4',
    name: 'IRPF anual',
    description: 'Retenciones de IRPF acumuladas por empleado para el año fiscal.',
    category: 'payroll',
    filters: [COMMON_FILTERS[0]],
    columns: ['Empleado', 'Base imponible', 'IRPF acumulado', '% Retención', 'Tipo aplicado'],
  },
  {
    id: 'pay-5',
    name: 'Base de cotización',
    description: 'Bases de cotización a la Seguridad Social por empleado y período.',
    category: 'payroll',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Grupo cotización', 'Base CC', 'Base AT', 'Base desempleo', 'Contingencias'],
  },

  // TALENT
  {
    id: 'tal-1',
    name: 'Estado de evaluaciones',
    description: 'Progreso de evaluaciones de rendimiento: completadas, en curso, pendientes.',
    category: 'talent',
    filters: [COMMON_FILTERS[1]],
    columns: ['Empleado', 'Evaluador', 'Ciclo', 'Puntuación', 'Estado', 'Fecha completado'],
  },
  {
    id: 'tal-2',
    name: 'Pipeline ATS',
    description: 'Estado de candidatos por vacante y etapa del proceso de selección.',
    category: 'talent',
    filters: [
      {
        key: 'vacancy',
        label: 'Vacante',
        type: 'select' as const,
        options: [
          { value: 'v1', label: 'Senior Backend Engineer' },
          { value: 'v2', label: 'Account Executive' },
        ],
      },
    ],
    columns: ['Candidato', 'Vacante', 'Etapa', 'Fuente', 'Evaluación', 'Fecha aplicación'],
  },
  {
    id: 'tal-3',
    name: 'OKR progress',
    description: 'Progreso de objetivos individuales y de equipo en el período.',
    category: 'talent',
    filters: [COMMON_FILTERS[1]],
    columns: ['Empleado', 'Objetivo', 'Key Result', '% Completado', 'Estado', 'Responsable'],
  },
  {
    id: 'tal-4',
    name: 'Formaciones completadas',
    description: 'Cursos y formaciones completadas por empleado, con horas y certificados.',
    category: 'talent',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Curso', 'Horas', 'Completado', 'Puntuación', 'Certificado'],
  },

  // EXPENSES
  {
    id: 'exp-1',
    name: 'Gastos por empleado',
    description: 'Gastos reportados por empleado con estado de aprobación e importe.',
    category: 'expenses',
    filters: COMMON_FILTERS,
    columns: ['Empleado', 'Categoría', 'Descripción', 'Importe', 'Fecha', 'Estado'],
  },
  {
    id: 'exp-2',
    name: 'Gastos por categoría',
    description: 'Análisis de gastos agrupados por categoría (viajes, dietas, material…).',
    category: 'expenses',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Categoría', 'Nº gastos', 'Importe total', '% del total', 'Vs período anterior'],
  },
  {
    id: 'exp-3',
    name: 'Pendientes de aprobación',
    description: 'Gastos en espera de revisión por parte de RRHH o responsable.',
    category: 'expenses',
    filters: [COMMON_FILTERS[1]],
    columns: ['Empleado', 'Categoría', 'Importe', 'Fecha solicitud', 'Días pendiente'],
  },

  // PEOPLE
  {
    id: 'ppl-1',
    name: 'Plantilla actual',
    description: 'Listado completo de empleados activos con datos clave de plantilla.',
    category: 'people',
    filters: [
      COMMON_FILTERS[1],
      {
        key: 'contract_type',
        label: 'Tipo contrato',
        type: 'multiselect' as const,
        options: CONTRACT_OPTIONS,
      },
    ],
    columns: ['Empleado', 'Puesto', 'Departamento', 'Tipo contrato', 'Antigüedad', 'Responsable'],
  },
  {
    id: 'ppl-2',
    name: 'Altas y bajas',
    description: 'Movimientos de plantilla: nuevas incorporaciones y bajas en el período.',
    category: 'people',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Empleado', 'Tipo movimiento', 'Fecha', 'Departamento', 'Motivo'],
  },
  {
    id: 'ppl-3',
    name: 'Antigüedad',
    description: 'Distribución de antigüedad de la plantilla por tramos y departamentos.',
    category: 'people',
    filters: [COMMON_FILTERS[1]],
    columns: ['Empleado', 'Fecha alta', 'Antigüedad (años)', 'Tramo', 'Departamento'],
  },
  {
    id: 'ppl-4',
    name: 'Rotación',
    description: 'Tasa de rotación voluntaria e involuntaria por departamento y período.',
    category: 'people',
    filters: [COMMON_FILTERS[0], COMMON_FILTERS[1]],
    columns: ['Departamento', 'Plantilla media', 'Bajas', 'Tasa rotación', 'Voluntaria', 'Involuntaria'],
  },
]

export function getReportsByCategory(category: string) {
  return MOCK_REPORTS.filter((r) => r.category === category)
}

export function generateMockRows(reportId: string, count = 10): Record<string, unknown>[] {
  const report = MOCK_REPORTS.find((r) => r.id === reportId)
  if (!report) return []
  const names = ['Carlos Martínez', 'Laura Sánchez', 'Miguel Fernández', 'Ana González', 'Javier Rodríguez', 'Sofía Moreno', 'Pablo Díaz', 'Elena Torres', 'Roberto Díaz', 'Carmen Álvarez']
  return Array.from({ length: Math.min(count, names.length) }, (_, i) => {
    const row: Record<string, unknown> = {}
    report.columns.forEach((col) => {
      if (col === 'Empleado') row[col] = names[i]
      else if (col === 'Departamento') row[col] = ['Tecnología', 'Ventas', 'Marketing', 'RRHH', 'Finanzas'][i % 5]
      else if (col.includes('hora') || col.includes('Horas')) row[col] = Math.floor(Math.random() * 40) + 160
      else if (col.includes('Fecha') || col.includes('fecha')) row[col] = `${Math.floor(Math.random() * 28) + 1} abr 2026`
      else if (col === 'Estado') row[col] = ['Pendiente', 'Resuelto', 'Aprobado'][i % 3]
      else if (col.includes('mporte') || col.includes('alario') || col.includes('oste')) row[col] = `${(Math.random() * 3000 + 1500).toFixed(2)} €`
      else if (col.includes('%')) row[col] = `${(Math.random() * 100).toFixed(1)}%`
      else row[col] = `—`
    })
    return row
  })
}
