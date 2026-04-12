'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import { PlusIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Module =
  | 'Empleados'
  | 'Ausencias'
  | 'Fichajes'
  | 'Nóminas'
  | 'Documentos'
  | 'Evaluaciones'
  | 'Solicitudes'
  | 'Organigrama'
  | 'Informes'
  | 'Configuración'

type Permission = 'visibility' | 'read' | 'write' | 'approve' | 'config'

type RolePermissions = Record<Module, Partial<Record<Permission, boolean>>>

interface RoleConfig {
  id: string
  name: string
  description: string
  system: boolean
  permissions: RolePermissions
}

const ALL_MODULES: Module[] = [
  'Empleados', 'Ausencias', 'Fichajes', 'Nóminas', 'Documentos',
  'Evaluaciones', 'Solicitudes', 'Organigrama', 'Informes', 'Configuración',
]

const ALL_PERMISSIONS: Permission[] = ['visibility', 'read', 'write', 'approve', 'config']

const PERMISSION_LABELS: Record<Permission, string> = {
  visibility: 'Ver',
  read: 'Leer',
  write: 'Editar',
  approve: 'Aprobar',
  config: 'Config',
}

function fullPerms(): Partial<Record<Permission, boolean>> {
  return { visibility: true, read: true, write: true, approve: true, config: true }
}
function readPerms(): Partial<Record<Permission, boolean>> {
  return { visibility: true, read: true, write: false, approve: false, config: false }
}
function noPerms(): Partial<Record<Permission, boolean>> {
  return { visibility: false, read: false, write: false, approve: false, config: false }
}
function ownPerms(): Partial<Record<Permission, boolean>> {
  return { visibility: true, read: true, write: false, approve: false, config: false }
}

const INITIAL_ROLES: RoleConfig[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acceso completo a todos los módulos',
    system: true,
    permissions: Object.fromEntries(ALL_MODULES.map((m) => [m, fullPerms()])) as RolePermissions,
  },
  {
    id: 'role-hr',
    name: 'Responsable RRHH',
    description: 'Gestión completa de recursos humanos',
    system: true,
    permissions: {
      Empleados: fullPerms(),
      Ausencias: fullPerms(),
      Fichajes: readPerms(),
      Nóminas: fullPerms(),
      Documentos: fullPerms(),
      Evaluaciones: fullPerms(),
      Solicitudes: { ...fullPerms(), config: false },
      Organigrama: readPerms(),
      Informes: { visibility: true, read: true, write: false, approve: false, config: false },
      Configuración: { visibility: true, read: true, write: true, approve: false, config: false },
    },
  },
  {
    id: 'role-manager',
    name: 'Manager de departamento',
    description: 'Gestión del equipo a su cargo',
    system: true,
    permissions: {
      Empleados: readPerms(),
      Ausencias: { ...readPerms(), approve: true },
      Fichajes: readPerms(),
      Nóminas: noPerms(),
      Documentos: readPerms(),
      Evaluaciones: { ...readPerms(), write: true },
      Solicitudes: { visibility: true, read: true, write: false, approve: true, config: false },
      Organigrama: readPerms(),
      Informes: readPerms(),
      Configuración: noPerms(),
    },
  },
  {
    id: 'role-employee',
    name: 'Empleado',
    description: 'Acceso básico de autoservicio',
    system: true,
    permissions: {
      Empleados: ownPerms(),
      Ausencias: ownPerms(),
      Fichajes: ownPerms(),
      Nóminas: ownPerms(),
      Documentos: ownPerms(),
      Evaluaciones: ownPerms(),
      Solicitudes: { visibility: true, read: true, write: true, approve: false, config: false },
      Organigrama: readPerms(),
      Informes: noPerms(),
      Configuración: noPerms(),
    },
  },
]

// ─── Permission toggle cell ────────────────────────────────────────────────────

function PermCell({
  value,
  onChange,
  disabled,
}: {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn(
        'size-6 rounded flex items-center justify-center transition-colors mx-auto',
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
        value ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-border text-muted-foreground hover:bg-accent'
      )}
    >
      {value ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
    </button>
  )
}

// ─── Role detail table ────────────────────────────────────────────────────────

function RoleTable({ role, onUpdate }: { role: RoleConfig; onUpdate: (r: RoleConfig) => void }) {
  function togglePerm(mod: Module, perm: Permission) {
    const updated: RoleConfig = {
      ...role,
      permissions: {
        ...role.permissions,
        [mod]: {
          ...role.permissions[mod],
          [perm]: !role.permissions[mod]?.[perm],
        },
      },
    }
    onUpdate(updated)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 label-xs text-muted-foreground font-medium w-40">Módulo</th>
            {ALL_PERMISSIONS.map((p) => (
              <th key={p} className="py-3 px-2 label-xs text-muted-foreground font-medium text-center min-w-16">
                {PERMISSION_LABELS[p]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_MODULES.map((mod) => (
            <tr key={mod} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
              <td className="py-3 px-4">
                <p className="label-sm font-medium text-foreground">{mod}</p>
              </td>
              {ALL_PERMISSIONS.map((perm) => (
                <td key={perm} className="py-3 px-2">
                  <PermCell
                    value={!!role.permissions[mod]?.[perm]}
                    onChange={() => togglePerm(mod, perm)}
                    disabled={role.system && role.id === 'role-admin'}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesSettingsPage() {
  const [roles, setRoles] = useState<RoleConfig[]>(INITIAL_ROLES)
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(INITIAL_ROLES[0])
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')

  function handleUpdateRole(updated: RoleConfig) {
    const newRoles = roles.map((r) => (r.id === updated.id ? updated : r))
    setRoles(newRoles)
    setSelectedRole(updated)
  }

  function createRole() {
    if (!newRoleName.trim()) return
    const base = roles.find((r) => r.id === 'role-employee')!
    const newRole: RoleConfig = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc,
      system: false,
      permissions: { ...base.permissions },
    }
    setRoles([...roles, newRole])
    setSelectedRole(newRole)
    setNewRoleName('')
    setNewRoleDesc('')
    setShowNewDialog(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Roles y permisos</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            Configura qué puede hacer cada rol en la plataforma.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowNewDialog(true)}>
          <PlusIcon className="size-4" />
          Nuevo rol
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles list */}
        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                'w-full text-left p-3 rounded-lg border transition-all',
                selectedRole.id === role.id
                  ? 'border-foreground bg-card'
                  : 'border-border bg-card hover:bg-accent/30'
              )}
            >
              <div className="flex items-center gap-2">
                <p className="label-sm font-medium text-foreground">{role.name}</p>
                {role.system && <Badge variant="neutral" size="xs">Sistema</Badge>}
              </div>
              <p className="paragraph-xs text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
            </button>
          ))}
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="label-md font-semibold text-foreground">{selectedRole.name}</CardTitle>
                  <p className="paragraph-xs text-muted-foreground mt-0.5">{selectedRole.description}</p>
                </div>
                {selectedRole.system && (
                  <Badge variant="neutral" size="sm">Rol del sistema</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RoleTable role={selectedRole} onUpdate={handleUpdateRole} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <p className="label-xs text-muted-foreground">Leyenda:</p>
        <div className="flex items-center gap-1">
          <div className="size-4 rounded bg-green-600 dark:bg-green-500 flex items-center justify-center">
            <CheckIcon className="size-2.5 text-white" />
          </div>
          <span className="label-xs text-muted-foreground">Permitido</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-4 rounded bg-border flex items-center justify-center">
            <XIcon className="size-2.5 text-muted-foreground" />
          </div>
          <span className="label-xs text-muted-foreground">Denegado</span>
        </div>
      </div>

      {/* New role dialog */}
      <Dialog open={showNewDialog} onOpenChange={(v: boolean) => !v && setShowNewDialog(false)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Nuevo rol personalizado</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Nombre del rol *</label>
              <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="Ej: Supervisor de turno" />
            </div>
            <div>
              <label className="label-xs text-muted-foreground mb-1 block">Descripción</label>
              <Input value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} placeholder="Describe este rol..." />
            </div>
            <p className="paragraph-xs text-muted-foreground">
              El nuevo rol se creará con los permisos del empleado por defecto. Puedes modificarlos después.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="md">Cancelar</Button>
            </DialogClose>
            <Button variant="primary" size="md" onClick={createRole} disabled={!newRoleName.trim()}>
              <CheckIcon className="size-4" />
              Crear rol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
