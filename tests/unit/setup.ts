import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: 'usr_test',
        email: 'test@sesame.hr',
        name: 'Test User',
        role: 'admin',
        tenant_id: 'tenant_demo',
        installed_addons: ['control_horario', 'tareas', 'ausencias'],
      },
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
    status: 'authenticated',
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock zustand stores
vi.mock('@/stores', () => ({
  useTenantStore: vi.fn(() => ({
    tenant: {
      id: 'tenant_demo',
      name: 'Acme Corp',
      plan: 'growth',
      installed_addons: ['control_horario', 'tareas', 'ausencias', 'bolsa_horas'],
    },
    isAddonInstalled: (addon: string) =>
      ['control_horario', 'tareas', 'ausencias', 'bolsa_horas'].includes(addon),
    installAddon: vi.fn(),
    uninstallAddon: vi.fn(),
  })),
  useUserStore: vi.fn(() => ({
    user: { id: 'usr_test', role: 'admin', tenant_id: 'tenant_demo' },
    isAdmin: () => true,
    isEmployee: () => false,
    hasRole: (roles: string[]) => roles.includes('admin'),
  })),
  useUIStore: vi.fn(() => ({
    sidebarCollapsed: false,
    notificationCount: 3,
    toasts: [],
    addToast: vi.fn(),
    removeToast: vi.fn(),
  })),
}))
