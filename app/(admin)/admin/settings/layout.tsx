'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SETTINGS_TABS = [
  { label: 'General', href: '/admin/settings/general' },
  { label: 'Empresa', href: '/admin/settings/company' },
  { label: 'Centros', href: '/admin/settings/work-centers' },
  { label: 'Departamentos', href: '/admin/settings/departments' },
  { label: 'Equipos', href: '/admin/settings/teams' },
  { label: 'Calendarios', href: '/admin/settings/calendars' },
  { label: 'Roles y permisos', href: '/admin/settings/roles' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Configuración</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Gestiona la configuración global de tu empresa
        </p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px overflow-x-auto no-scrollbar">
          {SETTINGS_TABS.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'label-md font-medium px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div>{children}</div>
    </div>
  )
}
