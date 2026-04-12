'use client'

import type { ReactNode } from 'react'
import type { Role, Permission } from '@/types'
import type { Module } from '@/lib/rbac/permissions'
import { usePermission, useFeatureFlag, useRole } from '@/lib/rbac/hooks'

// ─── PermissionGate ───────────────────────────────────────────────────────────

interface PermissionGateProps {
  /** The module to check the permission against */
  module: Module
  /** The specific permission required */
  permission: Permission
  /** Rendered when the user lacks the required permission. Defaults to null. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders `children` only when the current user has `permission` on `module`.
 * Renders `fallback` (default: nothing) otherwise.
 *
 * @example
 * <PermissionGate module="nominas" permission="read">
 *   <NominasPage />
 * </PermissionGate>
 *
 * <PermissionGate module="dashboard" permission="visibility" fallback={<AccessDenied />}>
 *   <Dashboard />
 * </PermissionGate>
 */
export function PermissionGate({
  module,
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const allowed = usePermission(module, permission)
  return <>{allowed ? children : fallback}</>
}

// ─── FeatureGate ─────────────────────────────────────────────────────────────

interface FeatureGateProps {
  /** The addon slug that must be installed on the tenant */
  addon: string
  /** Rendered when the addon is not installed. Defaults to null. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders `children` only when the current tenant has the given `addon` installed.
 * Renders `fallback` (default: nothing) otherwise.
 *
 * @example
 * <FeatureGate addon="nominas" fallback={<MarketplacePromo addon="nominas" />}>
 *   <NominasModule />
 * </FeatureGate>
 */
export function FeatureGate({ addon, fallback = null, children }: FeatureGateProps) {
  const enabled = useFeatureFlag(addon)
  return <>{enabled ? children : fallback}</>
}

// ─── RoleGate ─────────────────────────────────────────────────────────────────

interface RoleGateProps {
  /** The user must have one of these roles to see the children */
  roles: Role[]
  /** Rendered when the user's role is not in the allowed list. Defaults to null. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Renders `children` only when the current user's role is included in `roles`.
 * Renders `fallback` (default: nothing) otherwise.
 *
 * @example
 * <RoleGate roles={['admin', 'hr_manager']}>
 *   <AdminOnlyContent />
 * </RoleGate>
 */
export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const role = useRole()
  const allowed = role !== null && roles.includes(role)
  return <>{allowed ? children : fallback}</>
}
