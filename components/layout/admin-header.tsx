'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@clasing/ui/sidebar'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@clasing/ui/tooltip'
import {
  BellIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { NotificationPanel } from '@/components/notifications/notification-panel'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notifications'

// Simple breadcrumb from pathname
function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const labelMap: Record<string, string> = {
    admin: 'Admin',
    dashboard: 'Dashboard',
    employees: 'Empleados',
    signings: 'Fichajes',
    schedules: 'Horarios',
    absences: 'Ausencias',
    shifts: 'Turnos',
    'hour-bank': 'Bolsa de horas',
    'org-chart': 'Organigrama',
    documents: 'Documentos',
    'digital-signature': 'Firma Digital',
    recruitment: 'Reclutamiento',
    onboarding: 'Onboarding',
    evaluations: 'Evaluaciones',
    training: 'Formación',
    okr: 'OKR',
    announcements: 'Comunicados',
    'hr-chat': 'Chat RRHH',
    'one-to-one': '1-to-1',
    payroll: 'Nóminas',
    expenses: 'Gastos',
    'flexible-pay': 'Retribución Flexible',
    wallet: 'Wallet',
    statistics: 'Estadísticas',
    reports: 'Reportes',
    settings: 'Configuración',
    marketplace: 'Marketplace',
    integrations: 'Integraciones',
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1
          return (
            <li key={seg} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span className="label-sm text-muted-foreground">/</span>
              )}
              <span
                className={`label-sm ${isLast ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
              >
                {labelMap[seg] ?? seg}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function AdminHeader() {
  const { data: session } = useSession()
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <>
    <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      {/* Sidebar toggle */}
      <SidebarTrigger className="shrink-0" />

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" iconOnly>
              <MagnifyingGlassIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Buscar</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" iconOnly className="relative" onClick={() => setNotifOpen(true)}>
              <BellIcon className="size-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="error"
                  size="xs"
                  className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 label-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notificaciones</TooltipContent>
        </Tooltip>

        {/* User avatar */}
        <div className="size-7 rounded-full bg-muted flex items-center justify-center">
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? ''}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <span className="label-xs font-medium text-muted-foreground">
              {session?.user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2) ?? 'U'}
            </span>
          )}
        </div>
      </div>
    </header>
    </>
  )
}
