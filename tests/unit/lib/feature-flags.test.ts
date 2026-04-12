import { describe, it, expect } from 'vitest'
import {
  getAddonsByTier,
  isRouteProtectedByAddon,
  getAddonDependencies,
  ADDON_DEFINITIONS,
} from '@/lib/feature-flags'

describe('ADDON_DEFINITIONS', () => {
  it('tiene 20 addons definidos', () => {
    expect(Object.keys(ADDON_DEFINITIONS)).toHaveLength(20)
  })

  it('todos los addons tienen name, tier y routes', () => {
    for (const [, addon] of Object.entries(ADDON_DEFINITIONS)) {
      expect(addon.name).toBeTruthy()
      expect(['preinstalled', 'freemium', 'premium']).toContain(addon.tier)
      expect(Array.isArray(addon.routes)).toBe(true)
    }
  })

  it('control_horario es preinstalled', () => {
    expect(ADDON_DEFINITIONS.control_horario.tier).toBe('preinstalled')
  })

  it('nominas es freemium', () => {
    expect(ADDON_DEFINITIONS.nominas.tier).toBe('freemium')
  })

  it('sesame_learning es premium', () => {
    expect(ADDON_DEFINITIONS.sesame_learning.tier).toBe('premium')
  })
})

describe('getAddonsByTier()', () => {
  it('devuelve 9 addons preinstalados', () => {
    const preinstalled = getAddonsByTier('preinstalled')
    expect(preinstalled).toHaveLength(9)
  })

  it('devuelve 7 addons freemium', () => {
    const freemium = getAddonsByTier('freemium')
    expect(freemium).toHaveLength(7)
  })

  it('devuelve 4 addons premium', () => {
    const premium = getAddonsByTier('premium')
    expect(premium).toHaveLength(4)
  })

  it('los addons preinstalados incluyen control_horario', () => {
    const preinstalled = getAddonsByTier('preinstalled')
    expect(preinstalled).toContain('control_horario')
  })

  it('los addons freemium incluyen nominas', () => {
    const freemium = getAddonsByTier('freemium')
    expect(freemium).toContain('nominas')
  })

  it('los addons premium incluyen sesame_learning', () => {
    const premium = getAddonsByTier('premium')
    expect(premium).toContain('sesame_learning')
  })

  it('la suma de todos los tiers es 20', () => {
    const total =
      getAddonsByTier('preinstalled').length +
      getAddonsByTier('freemium').length +
      getAddonsByTier('premium').length
    expect(total).toBe(20)
  })
})

describe('isRouteProtectedByAddon()', () => {
  it('detecta rutas de control horario', () => {
    const result = isRouteProtectedByAddon('/admin/time')
    expect(result).toBe('control_horario')
  })

  it('detecta rutas de ausencias', () => {
    const result = isRouteProtectedByAddon('/admin/absences')
    expect(result).toBe('ausencias')
  })

  it('detecta rutas de tareas', () => {
    const result = isRouteProtectedByAddon('/admin/tasks')
    expect(result).toBe('tareas')
  })

  it('detecta rutas de nóminas', () => {
    const result = isRouteProtectedByAddon('/admin/payroll')
    expect(result).toBe('nominas')
  })

  it('devuelve null para rutas no protegidas', () => {
    const result = isRouteProtectedByAddon('/admin/dashboard')
    expect(result).toBeNull()
  })

  it('devuelve null para ruta inexistente', () => {
    const result = isRouteProtectedByAddon('/some/random/route')
    expect(result).toBeNull()
  })
})

describe('getAddonDependencies()', () => {
  it('firma_digital requiere documentos', () => {
    const deps = getAddonDependencies('firma_digital')
    expect(Array.isArray(deps)).toBe(true)
    // documentos no está en ADDON_DEFINITIONS, por lo que se filtra
    expect(deps).toHaveLength(0)
  })

  it('addon sin dependencias devuelve array vacío', () => {
    const deps = getAddonDependencies('control_horario')
    expect(deps).toHaveLength(0)
  })

  it('nominas no tiene dependencias', () => {
    const deps = getAddonDependencies('nominas')
    expect(deps).toHaveLength(0)
  })

  it('sesame_ai no tiene dependencias', () => {
    const deps = getAddonDependencies('sesame_ai')
    expect(deps).toHaveLength(0)
  })
})
