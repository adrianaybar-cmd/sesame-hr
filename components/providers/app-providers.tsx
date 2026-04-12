'use client'

import { useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useUserStore, useTenantStore } from '@/stores'
import { MOCK_TENANT } from '@/lib/mock/tenant'
import type { User } from '@/types'

interface AppProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

// ─── Zustand Hydration ────────────────────────────────────────────────────────
// Reads the next-auth session and seeds user.store / tenant.store on mount.
// Runs inside SessionProvider so useSession() is available.

function ZustandHydration() {
  const { data: session, status } = useSession()
  const setUser = useUserStore((s) => s.setUser)
  const clearUser = useUserStore((s) => s.clearUser)
  const setTenant = useTenantStore((s) => s.setTenant)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session?.user) {
      clearUser()
      return
    }

    // Map next-auth session user → app User type
    const sessionUser = session.user as User & {
      role?: string
      tenant_id?: string
      employee_id?: string
      image?: string | null
    }

    const appUser: User = {
      id: sessionUser.id ?? '',
      email: sessionUser.email ?? '',
      name: sessionUser.name ?? '',
      avatar_url: sessionUser.image ?? undefined,
      role: (sessionUser.role as User['role']) ?? 'employee',
      tenant_id: sessionUser.tenant_id ?? MOCK_TENANT.id,
      employee_id: sessionUser.employee_id,
    }

    setUser(appUser)

    // Seed tenant store — in production this would come from an API call.
    // For now we always use the mock tenant that matches tenant_demo.
    setTenant(MOCK_TENANT)
  }, [session, status, setUser, clearUser, setTenant])

  return null
}

// ─── Root Providers ───────────────────────────────────────────────────────────

/**
 * Root client providers.
 * Add ThemeProvider, QueryClientProvider, etc. here as the app grows.
 */
export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ZustandHydration />
      {children}
    </SessionProvider>
  )
}
