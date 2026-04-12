import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import type { Role, Permission } from '@/types'
import { isAdminRole } from '@/types'
import { hasPermission, type Module } from './permissions'

// ─── getServerRole ────────────────────────────────────────────────────────────

/**
 * Returns the current user's role from the server-side session.
 * Returns null when there is no authenticated session.
 */
export async function getServerRole(): Promise<Role | null> {
  const session = await auth()
  return session?.user?.role ?? null
}

// ─── getServerPermission ──────────────────────────────────────────────────────

/**
 * Returns true if the authenticated user has `permission` on `module`.
 * Returns false when unauthenticated or the role lacks the permission.
 *
 * Use in Server Components and Route Handlers:
 * @example
 * const canRead = await getServerPermission('nominas', 'read')
 */
export async function getServerPermission(
  module: Module,
  permission: Permission
): Promise<boolean> {
  const session = await auth()
  const role = session?.user?.role
  if (!role) return false
  return hasPermission(role, module, permission)
}

// ─── requirePermission ────────────────────────────────────────────────────────

/**
 * Guards a Server Component or Route Handler by checking a permission.
 * Redirects to `/unauthorized` (or to `/login` when unauthenticated)
 * if the check fails. Throws Next.js redirect — does not return.
 *
 * @example
 * // At the top of a server component:
 * await requirePermission('nominas', 'read')
 */
export async function requirePermission(
  module: Module,
  permission: Permission
): Promise<void> {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const allowed = hasPermission(session.user.role, module, permission)
  if (!allowed) {
    redirect('/unauthorized')
  }
}

// ─── requireRole ─────────────────────────────────────────────────────────────

/**
 * Guards a Server Component or Route Handler by checking the user's role.
 * Accepts any number of allowed roles (OR logic).
 * Redirects to `/unauthorized` (or to `/login` when unauthenticated)
 * if the check fails. Throws Next.js redirect — does not return.
 *
 * @example
 * await requireRole('admin', 'hr_manager')
 */
export async function requireRole(...roles: Role[]): Promise<void> {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (!roles.includes(session.user.role)) {
    // Redirect to the appropriate area if the user is authenticated but wrong role
    const dest = isAdminRole(session.user.role) ? '/admin/dashboard' : '/employee/signings'
    redirect(dest)
  }
}

// ─── getServerFeatureFlag ─────────────────────────────────────────────────────

/**
 * Returns true if the current tenant has the specified addon installed.
 * The addon list is read from the session's `installed_addons` field.
 *
 * Returns false when unauthenticated or addon information is not present
 * in the session.
 *
 * @example
 * const hasPayroll = await getServerFeatureFlag('nominas')
 */
export async function getServerFeatureFlag(addon: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user) return false

  // `installed_addons` is an optional extension on the session user object.
  const addons = (session.user as { installed_addons?: string[] } | undefined)
    ?.installed_addons

  if (!Array.isArray(addons)) return false
  return addons.includes(addon)
}

// ─── requireFeatureFlag ───────────────────────────────────────────────────────

/**
 * Guards a Server Component or Route Handler by checking whether the tenant
 * has the required addon installed.
 * Redirects to `/marketplace` if the addon is not enabled.
 * Throws Next.js redirect — does not return.
 *
 * @example
 * await requireFeatureFlag('nominas')
 */
export async function requireFeatureFlag(addon: string): Promise<void> {
  const enabled = await getServerFeatureFlag(addon)
  if (!enabled) {
    redirect('/marketplace')
  }
}
