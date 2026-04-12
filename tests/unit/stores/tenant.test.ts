import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock zustand persist middleware to avoid localStorage issues in tests
vi.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

describe('TenantStore', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('isAddonInstalled devuelve true para addon instalado', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    const store = useTenantStore.getState()
    expect(typeof store.isAddonInstalled).toBe('function')
  })

  it('estado inicial de tenant es null', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    const { tenant } = useTenantStore.getState()
    expect(tenant).toBeNull()
  })

  it('setTenant actualiza el tenant', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    const mockTenant = {
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario', 'tareas'],
    }
    useTenantStore.getState().setTenant(mockTenant)
    const { tenant } = useTenantStore.getState()
    expect(tenant).toEqual(mockTenant)
  })

  it('isAddonInstalled devuelve true para addon instalado', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario', 'tareas'],
    })
    expect(useTenantStore.getState().isAddonInstalled('control_horario')).toBe(true)
  })

  it('isAddonInstalled devuelve false para addon no instalado', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario'],
    })
    expect(useTenantStore.getState().isAddonInstalled('nominas')).toBe(false)
  })

  it('isAddonInstalled devuelve false cuando no hay tenant', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().clearTenant()
    expect(useTenantStore.getState().isAddonInstalled('control_horario')).toBe(false)
  })

  it('installAddon añade un addon al tenant', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario'],
    })
    useTenantStore.getState().installAddon('nominas')
    expect(useTenantStore.getState().isAddonInstalled('nominas')).toBe(true)
  })

  it('uninstallAddon elimina un addon del tenant', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario', 'nominas'],
    })
    useTenantStore.getState().uninstallAddon('nominas')
    expect(useTenantStore.getState().isAddonInstalled('nominas')).toBe(false)
    expect(useTenantStore.getState().isAddonInstalled('control_horario')).toBe(true)
  })

  it('installAddon no duplica addons ya instalados', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: ['control_horario'],
    })
    useTenantStore.getState().installAddon('control_horario')
    const { tenant } = useTenantStore.getState()
    const count = tenant?.installed_addons.filter((a) => a === 'control_horario').length
    expect(count).toBe(1)
  })

  it('clearTenant pone tenant a null', async () => {
    const { useTenantStore } = await import('@/stores/tenant.store')
    useTenantStore.getState().setTenant({
      id: 'tenant_test',
      name: 'Test Corp',
      slug: 'test-corp',
      plan: 'growth' as const,
      installed_addons: [],
    })
    useTenantStore.getState().clearTenant()
    expect(useTenantStore.getState().tenant).toBeNull()
  })
})
