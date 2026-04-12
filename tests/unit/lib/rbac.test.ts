import { describe, it, expect } from 'vitest'
import { hasPermission, getModulePermissions } from '@/lib/rbac/permissions'
import type { Role } from '@/types'

describe('hasPermission()', () => {
  describe('super_admin', () => {
    it('tiene todos los permisos en todos los módulos', () => {
      expect(hasPermission('super_admin', 'nominas', 'write')).toBe(true)
      expect(hasPermission('super_admin', 'configuracion', 'config')).toBe(true)
      expect(hasPermission('super_admin', 'fichajes', 'approve')).toBe(true)
    })
  })

  describe('admin', () => {
    it('puede leer y escribir en fichajes', () => {
      expect(hasPermission('admin', 'fichajes', 'read')).toBe(true)
      expect(hasPermission('admin', 'fichajes', 'write')).toBe(true)
    })

    it('puede aprobar ausencias', () => {
      expect(hasPermission('admin', 'ausencias', 'approve')).toBe(true)
    })

    it('puede configurar el sistema', () => {
      expect(hasPermission('admin', 'configuracion', 'config')).toBe(true)
    })

    it('tiene acceso completo a nóminas', () => {
      expect(hasPermission('admin', 'nominas', 'write')).toBe(true)
    })
  })

  describe('employee', () => {
    it('puede leer sus propios fichajes', () => {
      expect(hasPermission('employee', 'fichajes', 'read')).toBe(true)
    })

    it('puede escribir fichajes (selfService)', () => {
      expect(hasPermission('employee', 'fichajes', 'write')).toBe(true)
    })

    it('NO puede configurar el sistema', () => {
      expect(hasPermission('employee', 'configuracion', 'config')).toBe(false)
    })

    it('NO puede escribir nóminas', () => {
      expect(hasPermission('employee', 'nominas', 'write')).toBe(false)
    })

    it('NO puede aprobar ausencias de otros', () => {
      expect(hasPermission('employee', 'ausencias', 'approve')).toBe(false)
    })

    it('NO tiene acceso a estadísticas', () => {
      expect(hasPermission('employee', 'estadisticas', 'read')).toBe(false)
    })
  })

  describe('recruiter', () => {
    it('puede acceder a reclutamiento (write)', () => {
      expect(hasPermission('recruiter', 'reclutamiento', 'write')).toBe(true)
    })

    it('puede acceder a reclutamiento (approve)', () => {
      expect(hasPermission('recruiter', 'reclutamiento', 'approve')).toBe(true)
    })

    it('NO puede acceder a nóminas', () => {
      expect(hasPermission('recruiter', 'nominas', 'read')).toBe(false)
    })

    it('NO puede acceder a fichajes', () => {
      expect(hasPermission('recruiter', 'fichajes', 'read')).toBe(false)
    })
  })

  describe('payroll_manager', () => {
    it('puede gestionar nóminas (write)', () => {
      expect(hasPermission('payroll_manager', 'nominas', 'write')).toBe(true)
    })

    it('puede ver gastos (read)', () => {
      expect(hasPermission('payroll_manager', 'gastos', 'read')).toBe(true)
    })

    it('puede gestionar retribución flexible', () => {
      expect(hasPermission('payroll_manager', 'retribucion_flexible', 'write')).toBe(true)
    })

    it('NO puede configurar el sistema', () => {
      expect(hasPermission('payroll_manager', 'configuracion', 'config')).toBe(false)
    })
  })

  describe('read_only', () => {
    it('tiene visibility en fichajes', () => {
      expect(hasPermission('read_only', 'fichajes', 'visibility')).toBe(true)
    })

    it('tiene read en fichajes', () => {
      expect(hasPermission('read_only', 'fichajes', 'read')).toBe(true)
    })

    it('NO tiene write', () => {
      expect(hasPermission('read_only', 'fichajes', 'write')).toBe(false)
    })

    it('NO tiene approve', () => {
      expect(hasPermission('read_only', 'fichajes', 'approve')).toBe(false)
    })

    it('NO tiene config', () => {
      expect(hasPermission('read_only', 'fichajes', 'config')).toBe(false)
    })
  })

  describe('hr_manager', () => {
    it('puede leer nóminas', () => {
      expect(hasPermission('hr_manager', 'nominas', 'read')).toBe(true)
    })

    it('NO puede escribir nóminas (solo approve)', () => {
      expect(hasPermission('hr_manager', 'nominas', 'write')).toBe(false)
    })

    it('puede aprobar nóminas', () => {
      expect(hasPermission('hr_manager', 'nominas', 'approve')).toBe(true)
    })

    it('tiene acceso completo a fichajes', () => {
      expect(hasPermission('hr_manager', 'fichajes', 'write')).toBe(true)
    })
  })

  describe('department_manager', () => {
    it('puede aprobar fichajes', () => {
      expect(hasPermission('department_manager', 'fichajes', 'approve')).toBe(true)
    })

    it('NO tiene acceso a nóminas', () => {
      expect(hasPermission('department_manager', 'nominas', 'read')).toBe(false)
    })

    it('NO puede configurar el sistema', () => {
      expect(hasPermission('department_manager', 'configuracion', 'config')).toBe(false)
    })
  })

  describe('roles inválidos', () => {
    it('devuelve false para rol inexistente', () => {
      expect(hasPermission('unknown_role' as Role, 'fichajes', 'read')).toBe(false)
    })
  })
})

describe('getModulePermissions()', () => {
  it('devuelve el objeto de permisos correcto para admin', () => {
    const perms = getModulePermissions('admin', 'fichajes')
    expect(perms).toHaveProperty('visibility')
    expect(perms).toHaveProperty('read')
    expect(perms).toHaveProperty('write')
    expect(perms).toHaveProperty('approve')
    expect(perms).toHaveProperty('config')
  })

  it('devuelve todos los permisos true para admin en fichajes', () => {
    const perms = getModulePermissions('admin', 'fichajes')
    expect(perms.visibility).toBe(true)
    expect(perms.read).toBe(true)
    expect(perms.write).toBe(true)
    expect(perms.approve).toBe(true)
    expect(perms.config).toBe(true)
  })

  it('devuelve none() para employee en configuracion', () => {
    const perms = getModulePermissions('employee', 'configuracion')
    expect(perms.read).toBe(false)
    expect(perms.write).toBe(false)
    expect(perms.config).toBe(false)
  })

  it('devuelve none() para rol inexistente', () => {
    const perms = getModulePermissions('unknown_role' as Role, 'fichajes')
    expect(perms.read).toBe(false)
    expect(perms.write).toBe(false)
  })
})
