// ─── RBAC barrel export ───────────────────────────────────────────────────────
// Import from here to keep consumer imports clean:
//   import { hasPermission, usePermission, PermissionGate } from '@/lib/rbac'

export * from './permissions'
export * from './hooks'
export * from './server'
export { PermissionGate, FeatureGate, RoleGate } from '@/components/rbac/permission-gate'
