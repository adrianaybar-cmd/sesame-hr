import type { Role } from './index'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: Role
      tenant_id: string
      employee_id?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: Role
    tenant_id: string
    employee_id?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    tenant_id: string
    employee_id?: string
  }
}
