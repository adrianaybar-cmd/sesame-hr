import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { isAdminRole } from '@/types'

/**
 * Root page — redirect based on auth state and role.
 */
export default async function RootPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (isAdminRole(session.user.role)) {
    redirect('/admin/dashboard')
  }

  redirect('/employee/signings')
}
