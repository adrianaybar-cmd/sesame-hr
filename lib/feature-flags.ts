// ─── Addon Definitions ────────────────────────────────────────────────────────

export const ADDON_DEFINITIONS = {
  // PREINSTALLED (9)
  sesame_ai: {
    name: 'Sesame AI',
    tier: 'preinstalled' as const,
    routes: ['/admin/ai'],
  },
  control_horario: {
    name: 'Control Horario',
    tier: 'preinstalled' as const,
    routes: ['/admin/time', '/employee/signings'],
  },
  tareas: {
    name: 'Tareas',
    tier: 'preinstalled' as const,
    routes: ['/admin/tasks', '/employee/tasks'],
  },
  ausencias: {
    name: 'Ausencias',
    tier: 'preinstalled' as const,
    routes: ['/admin/absences', '/employee/absences'],
  },
  bolsa_horas: {
    name: 'Bolsa de Horas',
    tier: 'preinstalled' as const,
    routes: ['/admin/hour-bank'],
  },
  comunicados: {
    name: 'Comunicados',
    tier: 'preinstalled' as const,
    routes: ['/admin/announcements', '/employee/announcements'],
  },
  organigrama: {
    name: 'Organigrama',
    tier: 'preinstalled' as const,
    routes: ['/admin/org-chart', '/employee/team'],
  },
  formacion: {
    name: 'Formación',
    tier: 'preinstalled' as const,
    routes: ['/admin/training', '/employee/training'],
  },
  reclutamiento: {
    name: 'Reclutamiento',
    tier: 'preinstalled' as const,
    routes: ['/admin/recruitment'],
  },

  // FREEMIUM (7) — free installation
  boost: {
    name: 'Boost',
    tier: 'freemium' as const,
    routes: ['/admin/boost', '/employee/boost'],
  },
  nominas: {
    name: 'Nóminas',
    tier: 'freemium' as const,
    routes: ['/admin/payroll', '/employee/payroll'],
  },
  chat_rrhh: {
    name: 'Chat RRHH',
    tier: 'freemium' as const,
    routes: [], // widget
  },
  objetivos: {
    name: 'Objetivos',
    tier: 'freemium' as const,
    routes: ['/admin/objectives', '/employee/objectives'],
  },
  one_to_one: {
    name: '1-to-1',
    tier: 'freemium' as const,
    routes: ['/admin/one-to-one'],
  },
  firma_digital: {
    name: 'Firma Digital',
    tier: 'freemium' as const,
    routes: [],
    requires: ['documentos'] as string[],
  },
  reserva_espacios: {
    name: 'Reserva Espacios',
    tier: 'freemium' as const,
    routes: ['/admin/spaces', '/employee/spaces'],
  },

  // PREMIUM (4) — require payment
  sesame_learning: {
    name: 'Sesame Learning',
    tier: 'premium' as const,
    routes: ['/admin/learning'],
  },
  comunidad: {
    name: 'Comunidad',
    tier: 'premium' as const,
    routes: ['/admin/community'],
  },
  firma_signaturit: {
    name: 'Firma Signaturit',
    tier: 'premium' as const,
    routes: [],
  },
  adelanto_nomina: {
    name: 'Adelanto Nómina',
    tier: 'premium' as const,
    routes: [],
  },
} as const

export type AddonKey = keyof typeof ADDON_DEFINITIONS
export type AddonTier = 'preinstalled' | 'freemium' | 'premium'

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Returns all addon keys that belong to a given tier.
 */
export function getAddonsByTier(tier: AddonTier): AddonKey[] {
  return (Object.keys(ADDON_DEFINITIONS) as AddonKey[]).filter(
    (key) => ADDON_DEFINITIONS[key].tier === tier
  )
}

/**
 * Returns the addon key that protects a given route, or null if the route is
 * not gated behind any addon.
 */
export function isRouteProtectedByAddon(route: string): AddonKey | null {
  for (const [key, def] of Object.entries(ADDON_DEFINITIONS) as [
    AddonKey,
    (typeof ADDON_DEFINITIONS)[AddonKey],
  ][]) {
    if ((def.routes as readonly string[]).includes(route)) {
      return key
    }
  }
  return null
}

/**
 * Returns the list of addon keys that the given addon depends on.
 * Returns an empty array when the addon has no dependencies.
 */
export function getAddonDependencies(addon: AddonKey): AddonKey[] {
  const def = ADDON_DEFINITIONS[addon]
  if (!('requires' in def) || !def.requires) return []
  return (def.requires as string[]).filter(
    (dep): dep is AddonKey => dep in ADDON_DEFINITIONS
  )
}
