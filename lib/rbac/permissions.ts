import type { Role, Permission, ModulePermissions } from '@/types'

// ─── Module type ──────────────────────────────────────────────────────────────

export type Module =
  // Time & Attendance
  | 'fichajes'
  | 'horarios'
  | 'ausencias'
  | 'turnos'
  | 'bolsa_horas'
  // People
  | 'empleados'
  | 'organigrama'
  | 'documentos'
  | 'firma_digital'
  // Talent
  | 'reclutamiento'
  | 'onboarding'
  | 'evaluaciones'
  | 'formacion'
  | 'okr'
  // Communication
  | 'comunicados'
  | 'chat_rrhh'
  | 'one_to_one'
  // Finance
  | 'nominas'
  | 'gastos'
  | 'retribucion_flexible'
  | 'wallet'
  // Analytics
  | 'dashboard'
  | 'estadisticas'
  | 'reportes'
  // System
  | 'configuracion'
  | 'marketplace'

export type RolePermissions = Record<Module, ModulePermissions>
export type PermissionsMap = Record<Role, RolePermissions>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function all(): ModulePermissions {
  return { visibility: true, read: true, write: true, approve: true, config: true }
}

function none(): ModulePermissions {
  return { visibility: false, read: false, write: false, approve: false, config: false }
}

function readOnly(): ModulePermissions {
  return { visibility: true, read: true, write: false, approve: false, config: false }
}

function visible(): ModulePermissions {
  return { visibility: true, read: false, write: false, approve: false, config: false }
}

function readWrite(): ModulePermissions {
  return { visibility: true, read: true, write: true, approve: false, config: false }
}

function readApprove(): ModulePermissions {
  return { visibility: true, read: true, write: false, approve: true, config: false }
}

function selfService(): ModulePermissions {
  return { visibility: true, read: true, write: true, approve: false, config: false }
}

// ─── Full permissions map ─────────────────────────────────────────────────────

export const PERMISSIONS_MAP: PermissionsMap = {
  // ─── super_admin: unrestricted access to everything ────────────────────────
  super_admin: {
    fichajes: all(),
    horarios: all(),
    ausencias: all(),
    turnos: all(),
    bolsa_horas: all(),
    empleados: all(),
    organigrama: all(),
    documentos: all(),
    firma_digital: all(),
    reclutamiento: all(),
    onboarding: all(),
    evaluaciones: all(),
    formacion: all(),
    okr: all(),
    comunicados: all(),
    chat_rrhh: all(),
    one_to_one: all(),
    nominas: all(),
    gastos: all(),
    retribucion_flexible: all(),
    wallet: all(),
    dashboard: all(),
    estadisticas: all(),
    reportes: all(),
    configuracion: all(),
    marketplace: all(),
  },

  // ─── admin: same as super_admin ────────────────────────────────────────────
  admin: {
    fichajes: all(),
    horarios: all(),
    ausencias: all(),
    turnos: all(),
    bolsa_horas: all(),
    empleados: all(),
    organigrama: all(),
    documentos: all(),
    firma_digital: all(),
    reclutamiento: all(),
    onboarding: all(),
    evaluaciones: all(),
    formacion: all(),
    okr: all(),
    comunicados: all(),
    chat_rrhh: all(),
    one_to_one: all(),
    nominas: all(),
    gastos: all(),
    retribucion_flexible: all(),
    wallet: all(),
    dashboard: all(),
    estadisticas: all(),
    reportes: all(),
    configuracion: all(),
    marketplace: all(),
  },

  // ─── hr_manager: everything except full payroll config ─────────────────────
  hr_manager: {
    fichajes: all(),
    horarios: all(),
    ausencias: all(),
    turnos: all(),
    bolsa_horas: all(),
    empleados: all(),
    organigrama: all(),
    documentos: all(),
    firma_digital: all(),
    reclutamiento: all(),
    onboarding: all(),
    evaluaciones: all(),
    formacion: all(),
    okr: all(),
    comunicados: all(),
    chat_rrhh: all(),
    one_to_one: all(),
    // Payroll: can read and approve but cannot configure payroll engine
    nominas: { visibility: true, read: true, write: false, approve: true, config: false },
    gastos: { visibility: true, read: true, write: true, approve: true, config: false },
    retribucion_flexible: { visibility: true, read: true, write: true, approve: true, config: false },
    wallet: { visibility: true, read: true, write: false, approve: false, config: false },
    dashboard: all(),
    estadisticas: all(),
    reportes: all(),
    configuracion: { visibility: true, read: true, write: true, approve: false, config: false },
    marketplace: readOnly(),
  },

  // ─── department_manager: see/approve their department ──────────────────────
  department_manager: {
    fichajes: readApprove(),
    horarios: { visibility: true, read: true, write: true, approve: true, config: false },
    ausencias: readApprove(),
    turnos: { visibility: true, read: true, write: true, approve: true, config: false },
    bolsa_horas: readOnly(),
    empleados: { visibility: true, read: true, write: true, approve: false, config: false },
    organigrama: readOnly(),
    documentos: readOnly(),
    firma_digital: { visibility: true, read: true, write: true, approve: true, config: false },
    reclutamiento: { visibility: true, read: true, write: false, approve: true, config: false },
    onboarding: { visibility: true, read: true, write: true, approve: true, config: false },
    evaluaciones: { visibility: true, read: true, write: true, approve: true, config: false },
    formacion: readOnly(),
    okr: { visibility: true, read: true, write: true, approve: true, config: false },
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: readWrite(),
    nominas: none(),
    gastos: { visibility: true, read: true, write: false, approve: true, config: false },
    retribucion_flexible: none(),
    wallet: none(),
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: readOnly(),
    reportes: readOnly(),
    configuracion: none(),
    marketplace: visible(),
  },

  // ─── team_leader: see their team, approve fichajes/ausencias ───────────────
  team_leader: {
    fichajes: readApprove(),
    horarios: readOnly(),
    ausencias: readApprove(),
    turnos: readOnly(),
    bolsa_horas: readOnly(),
    empleados: readOnly(),
    organigrama: readOnly(),
    documentos: none(),
    firma_digital: { visibility: true, read: true, write: true, approve: false, config: false },
    reclutamiento: none(),
    onboarding: readOnly(),
    evaluaciones: { visibility: true, read: true, write: true, approve: false, config: false },
    formacion: readOnly(),
    okr: { visibility: true, read: true, write: true, approve: false, config: false },
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: readWrite(),
    nominas: none(),
    gastos: readOnly(),
    retribucion_flexible: none(),
    wallet: none(),
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: readOnly(),
    reportes: readOnly(),
    configuracion: none(),
    marketplace: visible(),
  },

  // ─── employee: own data only ───────────────────────────────────────────────
  employee: {
    fichajes: selfService(),
    horarios: readOnly(),
    ausencias: selfService(),
    turnos: readOnly(),
    bolsa_horas: readOnly(),
    empleados: { visibility: true, read: false, write: false, approve: false, config: false },
    organigrama: readOnly(),
    documentos: { visibility: true, read: true, write: true, approve: false, config: false },
    firma_digital: { visibility: true, read: true, write: true, approve: false, config: false },
    reclutamiento: none(),
    onboarding: readOnly(),
    evaluaciones: { visibility: true, read: true, write: true, approve: false, config: false },
    formacion: { visibility: true, read: true, write: true, approve: false, config: false },
    okr: { visibility: true, read: true, write: true, approve: false, config: false },
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: readOnly(),
    nominas: { visibility: true, read: true, write: false, approve: false, config: false },
    gastos: selfService(),
    retribucion_flexible: { visibility: true, read: true, write: true, approve: false, config: false },
    wallet: { visibility: true, read: true, write: false, approve: false, config: false },
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: none(),
    reportes: none(),
    configuracion: none(),
    marketplace: none(),
  },

  // ─── intern: like employee but no nominas, no gastos ──────────────────────
  intern: {
    fichajes: selfService(),
    horarios: readOnly(),
    ausencias: selfService(),
    turnos: readOnly(),
    bolsa_horas: readOnly(),
    empleados: visible(),
    organigrama: readOnly(),
    documentos: { visibility: true, read: true, write: true, approve: false, config: false },
    firma_digital: { visibility: true, read: true, write: true, approve: false, config: false },
    reclutamiento: none(),
    onboarding: readOnly(),
    evaluaciones: { visibility: true, read: true, write: true, approve: false, config: false },
    formacion: { visibility: true, read: true, write: true, approve: false, config: false },
    okr: { visibility: true, read: true, write: true, approve: false, config: false },
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: readOnly(),
    nominas: none(),
    gastos: none(),
    retribucion_flexible: none(),
    wallet: none(),
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: none(),
    reportes: none(),
    configuracion: none(),
    marketplace: none(),
  },

  // ─── external: minimal access – only fichajes and own documents ────────────
  external: {
    fichajes: selfService(),
    horarios: readOnly(),
    ausencias: none(),
    turnos: none(),
    bolsa_horas: none(),
    empleados: none(),
    organigrama: none(),
    documentos: { visibility: true, read: true, write: false, approve: false, config: false },
    firma_digital: { visibility: true, read: true, write: true, approve: false, config: false },
    reclutamiento: none(),
    onboarding: none(),
    evaluaciones: none(),
    formacion: none(),
    okr: none(),
    comunicados: readOnly(),
    chat_rrhh: none(),
    one_to_one: none(),
    nominas: none(),
    gastos: none(),
    retribucion_flexible: none(),
    wallet: none(),
    dashboard: none(),
    estadisticas: none(),
    reportes: none(),
    configuracion: none(),
    marketplace: none(),
  },

  // ─── read_only: visibility + read across all modules, nothing else ─────────
  read_only: {
    fichajes: readOnly(),
    horarios: readOnly(),
    ausencias: readOnly(),
    turnos: readOnly(),
    bolsa_horas: readOnly(),
    empleados: readOnly(),
    organigrama: readOnly(),
    documentos: readOnly(),
    firma_digital: readOnly(),
    reclutamiento: readOnly(),
    onboarding: readOnly(),
    evaluaciones: readOnly(),
    formacion: readOnly(),
    okr: readOnly(),
    comunicados: readOnly(),
    chat_rrhh: readOnly(),
    one_to_one: readOnly(),
    nominas: readOnly(),
    gastos: readOnly(),
    retribucion_flexible: readOnly(),
    wallet: readOnly(),
    dashboard: readOnly(),
    estadisticas: readOnly(),
    reportes: readOnly(),
    configuracion: readOnly(),
    marketplace: readOnly(),
  },

  // ─── recruiter: only reclutamiento/ATS + basic people visibility ───────────
  recruiter: {
    fichajes: none(),
    horarios: none(),
    ausencias: none(),
    turnos: none(),
    bolsa_horas: none(),
    empleados: readOnly(),
    organigrama: readOnly(),
    documentos: none(),
    firma_digital: none(),
    reclutamiento: all(),
    onboarding: { visibility: true, read: true, write: true, approve: false, config: false },
    evaluaciones: none(),
    formacion: none(),
    okr: none(),
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: none(),
    nominas: none(),
    gastos: none(),
    retribucion_flexible: none(),
    wallet: none(),
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: none(),
    reportes: none(),
    configuracion: none(),
    marketplace: visible(),
  },

  // ─── payroll_manager: only financial modules ───────────────────────────────
  payroll_manager: {
    fichajes: readOnly(),
    horarios: none(),
    ausencias: none(),
    turnos: none(),
    bolsa_horas: none(),
    empleados: readOnly(),
    organigrama: none(),
    documentos: none(),
    firma_digital: none(),
    reclutamiento: none(),
    onboarding: none(),
    evaluaciones: none(),
    formacion: none(),
    okr: none(),
    comunicados: readOnly(),
    chat_rrhh: readWrite(),
    one_to_one: none(),
    nominas: all(),
    gastos: all(),
    retribucion_flexible: all(),
    wallet: all(),
    dashboard: { visibility: true, read: true, write: false, approve: false, config: false },
    estadisticas: { visibility: true, read: true, write: false, approve: false, config: false },
    reportes: { visibility: true, read: true, write: true, approve: false, config: false },
    configuracion: none(),
    marketplace: visible(),
  },
}

// ─── Permission checker ───────────────────────────────────────────────────────

/**
 * Check if a given role has a specific permission on a module.
 * Returns false if the role or module is not found.
 */
export function hasPermission(role: Role, module: Module, permission: Permission): boolean {
  const rolePerms = PERMISSIONS_MAP[role]
  if (!rolePerms) return false
  const modulePerms = rolePerms[module]
  if (!modulePerms) return false
  return modulePerms[permission] === true
}

/**
 * Get all permissions for a role on a specific module.
 */
export function getModulePermissions(role: Role, module: Module): ModulePermissions {
  const rolePerms = PERMISSIONS_MAP[role]
  if (!rolePerms) return none()
  return rolePerms[module] ?? none()
}
