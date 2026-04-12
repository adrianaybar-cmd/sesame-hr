import type { Tenant } from '@/types'
import { DEFAULT_ADDONS } from '@/stores/tenant.store'

export const MOCK_TENANT: Tenant = {
  id: 'tenant_demo',
  name: 'Acme Corp SL',
  slug: 'acme-corp',
  plan: 'growth',
  installed_addons: [...DEFAULT_ADDONS],
  logo_url: undefined,
  primary_color: '#0243f1',
}
