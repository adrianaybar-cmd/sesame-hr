export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

export default function SettingsPage() {
  redirect('/admin/settings/company')
}
