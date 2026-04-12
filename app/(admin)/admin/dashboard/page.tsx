'use client'

export const dynamic = 'force-dynamic'

import { WidgetHorasHoy } from '@/components/dashboard/widgets/widget-horas-hoy'
import { WidgetAusenciasHoy } from '@/components/dashboard/widgets/widget-ausencias-hoy'
import { WidgetIncidencias } from '@/components/dashboard/widgets/widget-incidencias'
import { WidgetAlertasRRHH } from '@/components/dashboard/widgets/widget-alertas-rrhh'
import { WidgetAsistenciaChart } from '@/components/dashboard/widgets/widget-asistencia-chart'
import { WidgetAusenciasProximas } from '@/components/dashboard/widgets/widget-ausencias-proximas'
import { WidgetCumpleanos } from '@/components/dashboard/widgets/widget-cumpleanos'
import { WidgetSolicitudesPendientes } from '@/components/dashboard/widgets/widget-solicitudes-pendientes'
import { WidgetWhosInMini } from '@/components/dashboard/widgets/widget-whos-in-mini'
import { WidgetHorasSemanales } from '@/components/dashboard/widgets/widget-horas-semanales'
import { WidgetOKRProgress } from '@/components/dashboard/widgets/widget-okr-progress'
import { WidgetNuevosEmpleados } from '@/components/dashboard/widgets/widget-nuevos-empleados'
import { WidgetVacantesAbiertas } from '@/components/dashboard/widgets/widget-vacantes-abiertas'
import { WidgetActividadReciente } from '@/components/dashboard/widgets/widget-actividad-reciente'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="title-lg font-semibold text-foreground">Dashboard</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Resumen de actividad · hoy, 12 de abril de 2026
        </p>
      </div>

      {/* Fila 1 — KPIs críticos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WidgetHorasHoy />
        <WidgetAusenciasHoy />
        <WidgetIncidencias />
        <WidgetAlertasRRHH />
      </div>

      {/* Fila 2 — Charts y listas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <WidgetAsistenciaChart />
        <WidgetAusenciasProximas />
        <WidgetCumpleanos />
      </div>

      {/* Fila 3 — Operaciones */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetSolicitudesPendientes />
        <WidgetWhosInMini />
      </div>

      {/* Fila 4 — Analytics y actividad */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WidgetHorasSemanales />
        <WidgetActividadReciente />
      </div>

      {/* Fila 5 — Más analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WidgetOKRProgress />
        <WidgetNuevosEmpleados />
        <WidgetVacantesAbiertas />
      </div>
    </div>
  )
}
