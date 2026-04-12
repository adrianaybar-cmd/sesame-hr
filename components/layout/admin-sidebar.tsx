'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@clasing/ui/sidebar'
import { Avatar } from '@clasing/ui/avatar'
import { Button } from '@clasing/ui/button'
import {
  ClockIcon,
  CalendarIcon,
  CalendarXIcon,
  ArrowsClockwiseIcon,
  HourglassIcon,
  UsersIcon,
  TreeStructureIcon,
  FolderOpenIcon,
  SignatureIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  ChartBarIcon,
  TargetIcon,
  MegaphoneIcon,
  ChatCircleIcon,
  HandshakeIcon,
  MoneyIcon,
  ReceiptIcon,
  GiftIcon,
  WalletIcon,
  SquaresFourIcon,
  ChartLineIcon,
  FileTextIcon,
  GearIcon,
  StorefrontIcon,
  PlugsConnectedIcon,
  StarIcon,
  UserCircleIcon,
  SignOutIcon,
  CheckSquareIcon,
  BuildingsIcon,
  RocketLaunchIcon,
} from '@phosphor-icons/react'
import { useSession, signOut } from 'next-auth/react'
import { getInitials } from '@/lib/utils'
import type { NavSection } from '@/types'

// ─── Navigation structure ────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'TIEMPO',
    items: [
      { label: 'Fichajes', href: '/admin/signings', icon: ClockIcon },
      { label: 'Horarios', href: '/admin/schedules', icon: CalendarIcon },
      { label: 'Ausencias', href: '/admin/absences', icon: CalendarXIcon },
      { label: 'Turnos', href: '/admin/shifts', icon: ArrowsClockwiseIcon },
      { label: 'Bolsa de horas', href: '/admin/hour-bank', icon: HourglassIcon },
    ],
  },
  {
    title: 'PERSONAS',
    items: [
      { label: 'Empleados', href: '/admin/employees', icon: UsersIcon },
      { label: 'Organigrama', href: '/admin/org-chart', icon: TreeStructureIcon },
      { label: 'Documentos', href: '/admin/documents', icon: FolderOpenIcon },
      { label: 'Firma Digital', href: '/admin/documents/signatures', icon: SignatureIcon, requiredAddon: 'firma-digital' },
    ],
  },
  {
    title: 'TALENTO',
    items: [
      { label: 'Reclutamiento', href: '/admin/recruitment', icon: BriefcaseIcon, requiredAddon: 'reclutamiento' },
      { label: 'Onboarding', href: '/admin/onboarding', icon: UsersIcon },
      { label: 'Evaluaciones', href: '/admin/evaluations', icon: StarIcon },
      { label: 'Formación', href: '/admin/training', icon: GraduationCapIcon },
      { label: 'OKR', href: '/admin/objectives', icon: TargetIcon },
    ],
  },
  {
    title: 'PRODUCTIVIDAD',
    items: [
      { label: 'Tareas', href: '/admin/tasks', icon: CheckSquareIcon },
      { label: 'Espacios', href: '/admin/spaces', icon: BuildingsIcon },
    ],
  },
  {
    title: 'COMUNICACIÓN',
    items: [
      { label: 'Comunicados', href: '/admin/announcements', icon: MegaphoneIcon },
      { label: 'Chat RRHH', href: '/admin/hr-chat', icon: ChatCircleIcon, requiredAddon: 'chat-rrhh' },
      { label: '1-to-1', href: '/admin/one-to-one', icon: HandshakeIcon, requiredAddon: 'one-to-one' },
      { label: 'Boost', href: '/admin/boost', icon: RocketLaunchIcon },
    ],
  },
  {
    title: 'FINANZAS',
    items: [
      { label: 'Nóminas', href: '/admin/payroll', icon: MoneyIcon, requiredAddon: 'nominas' },
      { label: 'Gastos', href: '/admin/expenses', icon: ReceiptIcon },
      { label: 'Retribución Flexible', href: '/admin/flexible-pay', icon: GiftIcon, requiredAddon: 'retribucion-flexible' },
      { label: 'Wallet', href: '/admin/wallet', icon: WalletIcon, requiredAddon: 'wallet' },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: SquaresFourIcon },
      { label: 'People Analytics', href: '/admin/analytics', icon: ChartLineIcon },
      { label: 'Reportes', href: '/admin/reports', icon: ChartBarIcon },
      { label: 'Estadísticas', href: '/admin/statistics', icon: ChartBarIcon },
    ],
  },
  {
    title: 'CONFIGURACIÓN',
    items: [
      { label: 'Configuración', href: '/admin/settings', icon: GearIcon },
      { label: 'Marketplace', href: '/admin/marketplace', icon: StorefrontIcon },
      { label: 'Integraciones', href: '/admin/integrations', icon: PlugsConnectedIcon },
    ],
  },
]

// ─── Logo ─────────────────────────────────────────────────────────────────────

function SesameLogoMark() {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <span className="label-md font-semibold text-primary-foreground">S</span>
      </div>
      <span className="label-lg font-semibold text-foreground truncate group-data-[collapsible=icon]:hidden">
        Sesame HR
      </span>
    </div>
  )
}

// ─── User footer ──────────────────────────────────────────────────────────────

function SidebarUserFooter() {
  const { data: session } = useSession()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const name = session?.user?.name ?? 'Usuario'
  const email = session?.user?.email ?? ''
  const image = session?.user?.image

  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <Avatar className="size-8 shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="rounded-full object-cover" />
        ) : (
          <span className="label-sm font-medium text-muted-foreground">
            {getInitials(name)}
          </span>
        )}
      </Avatar>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="label-sm font-medium text-foreground truncate">{name}</p>
          <p className="paragraph-xs text-muted-foreground truncate">{email}</p>
        </div>
      )}
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="xs"
          iconOnly
          onClick={() => signOut({ callbackUrl: '/login' })}
          tooltip="Cerrar sesión"
        >
          <SignOutIcon className="size-4" />
        </Button>
      )}
    </div>
  )
}

// ─── Admin Sidebar component ──────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header — logo */}
      <SidebarHeader className="px-3 py-4 border-b border-border">
        <SesameLogoMark />
      </SidebarHeader>

      {/* Navigation sections */}
      <SidebarContent className="py-2">
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="label-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 py-1">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer — user info */}
      <SidebarFooter className="border-t border-border py-2">
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

// Re-export SidebarProvider for convenience in the layout
export { SidebarProvider }
