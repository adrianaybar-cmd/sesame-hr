import type { Metadata } from 'next'
import { AdminShell } from '@/components/layout/admin-shell'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin — Sesame HR',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
