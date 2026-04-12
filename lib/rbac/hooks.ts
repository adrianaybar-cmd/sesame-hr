'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import type { Role, Permission } from '@/types'
import { hasPermission, type Module } from './permissions'

// ─── useRole ──────────────────────────────────────────────────────────────────

/**
 * Returns the current user's role from the session, or null if not authenticated.
 */
export function useRole(): Role | null {
  const { data: session } = useSession()
  return session?.user?.role ?? null
}

// ─── usePermission ────────────────────────────────────────────────────────────

/**
 * Returns true if the current user has the given permission on the given module.
 * Returns false when the session is loading or the user is unauthenticated.
 */
export function usePermission(module: Module, permission: Permission): boolean {
  const { data: session } = useSession()

  return useMemo(() => {
    const role = session?.user?.role
    if (!role) return false
    return hasPermission(role, module, permission)
  }, [session?.user?.role, module, permission])
}

// ─── usePermissions ───────────────────────────────────────────────────────────

/**
 * Batch permission check. Returns an array of booleans in the same order
 * as the input checks array.
 *
 * @example
 * const [canReadNominas, canWriteFichajes] = usePermissions([
 *   { module: 'nominas', permission: 'read' },
 *   { module: 'fichajes', permission: 'write' },
 * ])
 */
export function usePermissions(
  checks: { module: Module; permission: Permission }[]
): boolean[] {
  const { data: session } = useSession()

  return useMemo(() => {
    const role = session?.user?.role
    if (!role) return checks.map(() => false)
    return checks.map(({ module, permission }) => hasPermission(role, module, permission))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.role, JSON.stringify(checks)])
}

// ─── useFeatureFlag ───────────────────────────────────────────────────────────

/**
 * Returns true if the current tenant has the specified addon installed.
 * The addon list is read from the session's `installed_addons` field,
 * which must be populated by the auth callbacks (extend the JWT/session if needed).
 *
 * Falls back to false when the session is loading, the user is unauthenticated,
 * or the session does not carry addon information.
 */
export function useFeatureFlag(addon: string): boolean {
  const { data: session } = useSession()

  return useMemo(() => {
    // `installed_addons` is an optional extension on the session user object.
    // It is populated from the tenant record during the JWT callback.
    const addons = (session?.user as { installed_addons?: string[] } | undefined)
      ?.installed_addons
    if (!Array.isArray(addons)) return false
    return addons.includes(addon)
  }, [session?.user, addon])
}

// ─── useCurrentUser ───────────────────────────────────────────────────────────

/**
 * Convenience hook – returns the full session user object or null.
 */
export function useCurrentUser() {
  const { data: session, status } = useSession()
  return { user: session?.user ?? null, status }
}
