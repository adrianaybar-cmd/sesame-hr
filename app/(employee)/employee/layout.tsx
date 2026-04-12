import type { Metadata } from 'next'
import { EmployeeShell } from '@/components/layout/employee-shell'

export const metadata: Metadata = {
  title: {
    default: 'Mi espacio',
    template: '%s | Sesame HR',
  },
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <EmployeeShell>{children}</EmployeeShell>
}
