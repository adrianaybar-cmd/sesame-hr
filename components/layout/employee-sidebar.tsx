'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
  CalendarXIcon,
  CalendarIcon,
  CheckSquareIcon,
  FileIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  BuildingsIcon,
  TargetIcon,
  GraduationCapIcon,
  StarIcon,
  SignOutIcon,
  MegaphoneIcon,
  HandshakeIcon,
  MoneyIcon,
  ReceiptIcon,
  WalletIcon,
  GiftIcon,
  SignatureIcon,
  RocketLaunchIcon,
  UsersFourIcon,
} from '@phosphor-icons/react'
import { useSession, signOut } from 'next-auth/react'
import { getInitials } from '@/lib/utils'

// ─── Navigation items ─────────────────────────────────────────────────────────

const EMPLOYEE_NAV = [
  { label: 'Mi Fichaje', href: '/employee/signings', icon: ClockIcon },
  { label: 'Mis Ausencias', href: '/employee/absences', icon: CalendarXIcon },
  { label: 'Mis Horarios', href: '/employee/schedules', icon: CalendarIcon },
  { label: 'Mis Tareas', href: '/employee/tasks', icon: CheckSquareIcon },
  { label: 'Mis Documentos', href: '/employee/documents', icon: FileIcon },
  { label: 'Mi Perfil', href: '/employee/profile', icon: UserIcon },
  { label: 'Equipo', href: '/employee/team', icon: UsersIcon },
  { label: 'Mis Estadísticas', href: '/employee/statistics', icon: ChartBarIcon },
  { label: 'Reserva Espacios', href: '/employee/spaces', icon: BuildingsIcon },
  { label: 'Mis Objetivos', href: '/employee/objectives', icon: TargetIcon },
  { label: 'Formación', href: '/employee/training', icon: GraduationCapIcon },
  { label: 'Evaluaciones', href: '/employee/evaluations', icon: StarIcon },
  { label: 'Comunicados', href: '/employee/announcements', icon: MegaphoneIcon },
  { label: 'Mis 1-to-1', href: '/employee/one-to-one', icon: UsersFourIcon },
  { label: 'Boost', href: '/employee/boost', icon: RocketLaunchIcon },
  { label: 'Mi Onboarding', href: '/employee/onboarding', icon: HandshakeIcon },
  { label: 'Mis Nóminas', href: '/employee/payroll', icon: MoneyIcon },
  { label: 'Mis Gastos', href: '/employee/expenses', icon: ReceiptIcon },
  { label: 'Mi Wallet', href: '/employee/wallet', icon: WalletIcon },
  { label: 'Retrib. Flexible', href: '/employee/flex-benefits', icon: GiftIcon },
  { label: 'Firma Digital', href: '/employee/documents/signatures', icon: SignatureIcon },
]

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

// ─── Employee Sidebar component ───────────────────────────────────────────────

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header — brand */}
      <SidebarHeader className="px-3 py-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="label-md font-semibold text-primary-foreground">S</span>
          </div>
          <span className="label-lg font-semibold text-foreground truncate group-data-[collapsible=icon]:hidden">
            Sesame HR
          </span>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {EMPLOYEE_NAV.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/employee/signings' && pathname.startsWith(item.href))

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
      </SidebarContent>

      {/* Footer — user info */}
      <SidebarFooter className="border-t border-border py-2">
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
