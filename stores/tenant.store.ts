import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tenant } from '@/types'

export const DEFAULT_ADDONS = [
  'sesame_ai',
  'control_horario',
  'tareas',
  'ausencias',
  'bolsa_horas',
  'comunicados',
  'organigrama',
  'formacion',
  'reclutamiento',
] as const

interface TenantStore {
  tenant: Tenant | null
  setTenant: (tenant: Tenant) => void
  clearTenant: () => void
  isAddonInstalled: (addon: string) => boolean
  installAddon: (addon: string) => void
  uninstallAddon: (addon: string) => void
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenant: null,

      setTenant: (tenant) => set({ tenant }),

      clearTenant: () => set({ tenant: null }),

      isAddonInstalled: (addon) => {
        const { tenant } = get()
        if (!tenant) return false
        return tenant.installed_addons.includes(addon)
      },

      installAddon: (addon) => {
        const { tenant } = get()
        if (!tenant) return
        if (tenant.installed_addons.includes(addon)) return
        set({
          tenant: {
            ...tenant,
            installed_addons: [...tenant.installed_addons, addon],
          },
        })
      },

      uninstallAddon: (addon) => {
        const { tenant } = get()
        if (!tenant) return
        set({
          tenant: {
            ...tenant,
            installed_addons: tenant.installed_addons.filter((a) => a !== addon),
          },
        })
      },
    }),
    {
      name: 'sesame-tenant',
      partialize: (state) => ({ tenant: state.tenant }),
    }
  )
)
