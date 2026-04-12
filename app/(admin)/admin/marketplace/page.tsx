'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Input } from '@clasing/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@clasing/ui/dialog'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  CurrencyEurIcon,
  ChartBarIcon,
  BriefcaseIcon,
  PenIcon,
  GraduationCapIcon,
  HeartbeatIcon,
  PlugsConnectedIcon,
  SparkleIcon,
  ShieldIcon,
  WarningCircleIcon,
  TrashIcon,
  ReceiptIcon,
} from '@phosphor-icons/react'
import { useTenantStore } from '@/stores/tenant.store'
import { cn } from '@/lib/utils'

type AppTier = 'installed' | 'free' | 'premium'

interface AppDef {
  id: string
  name: string
  description: string
  icon: React.ElementType
  tier: AppTier
  category: string
  requires?: string[]
}

const ALL_APPS: AppDef[] = [
  // Instaladas por defecto
  { id: 'control_horario', name: 'Control Horario', description: 'Fichajes, jornada, turnos e incidencias de control de presencia.', icon: ClockIcon, tier: 'installed', category: 'Tiempo' },
  { id: 'ausencias', name: 'Gestión de Ausencias', description: 'Vacaciones, bajas y ausencias con flujo de aprobación.', icon: CalendarIcon, tier: 'installed', category: 'Ausencias' },
  { id: 'sesame_ai', name: 'Sesame AI', description: 'Asistente inteligente de RRHH con respuestas en lenguaje natural.', icon: SparkleIcon, tier: 'installed', category: 'IA' },
  { id: 'organigrama', name: 'Organigrama', description: 'Árbol organizativo interactivo con gestión de dependencias.', icon: UsersIcon, tier: 'installed', category: 'Personas' },
  { id: 'comunicados', name: 'Comunicados', description: 'Sistema de avisos y comunicados internos con acuse de recibo.', icon: BriefcaseIcon, tier: 'installed', category: 'Comunicación' },
  { id: 'tareas', name: 'Tareas y Proyectos', description: 'Gestión de tareas, proyectos y sprints para equipos.', icon: ChartBarIcon, tier: 'installed', category: 'Productividad' },
  { id: 'reclutamiento', name: 'Reclutamiento (ATS)', description: 'Pipeline de selección, vacantes y gestión de candidatos.', icon: BriefcaseIcon, tier: 'installed', category: 'Talento' },

  // Freemium
  { id: 'bolsa_horas', name: 'Bolsa de Horas', description: 'Acumulación y compensación de horas extra con saldo en tiempo real.', icon: ClockIcon, tier: 'free', category: 'Tiempo' },
  { id: 'formacion', name: 'Formación', description: 'Catálogo de cursos, seguimiento de formaciones y certificados.', icon: GraduationCapIcon, tier: 'free', category: 'Talento' },
  { id: 'evaluaciones', name: 'Evaluaciones 360°', description: 'Ciclos de evaluación del rendimiento con feedback multidireccional.', icon: ChartBarIcon, tier: 'free', category: 'Talento' },
  { id: 'gestor_documentos', name: 'Gestor de Documentos', description: 'Repositorio de documentos de RRHH con firma y control de versiones.', icon: FileTextIcon, tier: 'free', category: 'Documentos' },
  { id: 'objetivos', name: 'OKR y Objetivos', description: 'Definición y seguimiento de objetivos individuales y de empresa.', icon: ChartBarIcon, tier: 'free', category: 'Rendimiento' },
  { id: 'espacios', name: 'Reserva de Espacios', description: 'Gestión de salas, escritorios y recursos compartidos de la oficina.', icon: BriefcaseIcon, tier: 'free', category: 'Oficina' },
  { id: 'onboarding', name: 'Onboarding & Offboarding', description: 'Flujos de incorporación y salida con checklist personalizables.', icon: UsersIcon, tier: 'free', category: 'Personas' },

  // Premium
  { id: 'nominas', name: 'Nóminas', description: 'Gestión completa del ciclo de nómina integrada con contabilidad.', icon: CurrencyEurIcon, tier: 'premium', category: 'Nóminas' },
  { id: 'gastos', name: 'Gestión de Gastos', description: 'Notas de gasto, ticketing con OCR y aprobación automática.', icon: ReceiptIcon, tier: 'premium', category: 'Finanzas' },
  {
    id: 'firma_digital',
    name: 'Firma Digital',
    description: 'Firma electrónica legal de documentos laborales con certificado.', icon: PenIcon, tier: 'premium', category: 'Documentos',
    requires: ['gestor_documentos'],
  },
  { id: 'salud_bienestar', name: 'Salud y Bienestar', description: 'Programas de salud, encuestas de bienestar y gestión de beneficios.', icon: HeartbeatIcon, tier: 'premium', category: 'Bienestar' },
  { id: 'compliance', name: 'Compliance & LOPD', description: 'Control de obligaciones legales, LOPD y registro de tratamientos.', icon: ShieldIcon, tier: 'premium', category: 'Legal' },
  { id: 'people_analytics', name: 'People Analytics Pro', description: 'Dashboards avanzados de HR con predicción de rotación e IA.', icon: ChartBarIcon, tier: 'premium', category: 'Analytics' },
]

const TIER_META: Record<AppTier, { label: string; variant: 'success' | 'info' | 'default'; sectionTitle: string }> = {
  installed: { label: 'Instalado', variant: 'success', sectionTitle: 'Instaladas' },
  free: { label: 'Gratuito', variant: 'info', sectionTitle: 'Freemium disponibles' },
  premium: { label: 'Premium', variant: 'default', sectionTitle: 'Premium' },
}

export default function MarketplacePage() {
  const { installAddon, uninstallAddon, isAddonInstalled } = useTenantStore()
  const [search, setSearch] = useState('')
  const [confirmUninstall, setConfirmUninstall] = useState<AppDef | null>(null)

  function getAppTier(app: AppDef): AppTier {
    if (isAddonInstalled(app.id)) return 'installed'
    return app.tier === 'installed' ? 'free' : app.tier
  }

  function handleInstall(app: AppDef) {
    installAddon(app.id)
  }

  function handleUninstallConfirm() {
    if (confirmUninstall) {
      uninstallAddon(confirmUninstall.id)
      setConfirmUninstall(null)
    }
  }

  const filteredApps = ALL_APPS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  )

  const installed = filteredApps.filter((a) => getAppTier(a) === 'installed')
  const freemium = filteredApps.filter((a) => getAppTier(a) === 'free' && !isAddonInstalled(a.id))
  const premium = filteredApps.filter((a) => a.tier === 'premium' && !isAddonInstalled(a.id))

  const sections: { tier: AppTier; apps: AppDef[] }[] = [
    { tier: 'installed', apps: installed },
    { tier: 'free', apps: freemium },
    { tier: 'premium', apps: premium },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="title-lg font-semibold text-foreground">Marketplace de apps</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Amplía las funcionalidades de Sesame HR con módulos adicionales.
          {installed.length > 0 && ` ${installed.length} apps instaladas.`}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar apps…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Sections */}
      {sections.map(({ tier, apps }) => {
        if (apps.length === 0) return null
        const meta = TIER_META[tier]
        return (
          <div key={tier} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="title-2xs font-semibold text-foreground">{meta.sectionTitle}</h2>
              <Badge variant={meta.variant} size="xs">{apps.length}</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {apps.map((app) => {
                const Icon = app.icon
                const currentTier = getAppTier(app)
                const isInstalled = currentTier === 'installed'
                const requiresMissing = app.requires?.filter((r) => !isAddonInstalled(r)) ?? []

                return (
                  <Card
                    key={app.id}
                    className={cn(
                      'border-border flex flex-col',
                      isInstalled && 'ring-1 ring-[hsl(var(--success)/0.4)]'
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="rounded-xl bg-muted p-2.5">
                          <Icon className="size-5 text-foreground" />
                        </div>
                        <Badge variant={meta.variant} size="xs">{meta.label}</Badge>
                      </div>
                      <CardTitle className="label-md font-semibold text-foreground mt-2">
                        {app.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-3">
                      <p className="paragraph-xs text-muted-foreground flex-1 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Dependencia */}
                      {requiresMissing.length > 0 && (
                        <div className="flex items-start gap-2 rounded-lg bg-[hsl(var(--warning)/0.1)] border border-[hsl(var(--warning)/0.3)] px-3 py-2">
                          <WarningCircleIcon className="size-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
                          <p className="paragraph-xs text-[hsl(var(--warning))]">
                            Requiere:{' '}
                            {requiresMissing
                              .map((r) => ALL_APPS.find((a) => a.id === r)?.name ?? r)
                              .join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Badge categoría */}
                      <p className="label-xs text-muted-foreground">{app.category}</p>

                      {/* Acción */}
                      {isInstalled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-[hsl(var(--error))] border-[hsl(var(--error)/0.4)] hover:bg-[hsl(var(--error)/0.05)]"
                          onClick={() => setConfirmUninstall(app)}
                        >
                          <TrashIcon className="size-4" />
                          Desinstalar
                        </Button>
                      ) : currentTier === 'free' ? (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleInstall(app)}
                          disabled={requiresMissing.length > 0}
                        >
                          <PlugsConnectedIcon className="size-4" />
                          Instalar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          variant="outline"
                          onClick={() => alert(`Para contratar "${app.name}" contacta con tu gestor de cuenta.`)}
                        >
                          <SparkleIcon className="size-4" />
                          Contratar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Dialog de confirmación de desinstalación */}
      <Dialog open={!!confirmUninstall} onOpenChange={(open: boolean) => !open && setConfirmUninstall(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="label-lg font-semibold text-foreground">
              Desinstalar {confirmUninstall?.name}
            </DialogTitle>
            <DialogDescription className="paragraph-sm text-muted-foreground">
              Esta acción desactivará el módulo y todos sus datos dejarán de estar accesibles desde
              el panel. Los datos no se eliminarán permanentemente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-lg bg-[hsl(var(--warning)/0.1)] border border-[hsl(var(--warning)/0.3)] px-4 py-3">
            <WarningCircleIcon className="size-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
            <p className="paragraph-xs text-foreground">
              Los empleados perderán el acceso a{' '}
              <strong>{confirmUninstall?.name}</strong> de forma inmediata.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmUninstall(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleUninstallConfirm}
            >
              <TrashIcon className="size-4" />
              Sí, desinstalar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
