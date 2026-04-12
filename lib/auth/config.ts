import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import type { Role } from '@/types'
import { isAdminRole } from '@/types'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        // TODO: Replace with real DB/API call
        // Mock user for development
        if (
          parsed.data.email === 'admin@sesame.hr' &&
          parsed.data.password === 'password'
        ) {
          return {
            id: 'usr_mock_admin',
            email: parsed.data.email,
            name: 'Admin Demo',
            role: 'admin' as Role,
            tenant_id: 'tenant_demo',
          }
        }

        if (
          parsed.data.email === 'employee@sesame.hr' &&
          parsed.data.password === 'password'
        ) {
          return {
            id: 'usr_mock_employee',
            email: parsed.data.email,
            name: 'Employee Demo',
            role: 'employee' as Role,
            tenant_id: 'tenant_demo',
            employee_id: 'emp_mock_001',
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user.role as Role) ?? 'employee'
        token.tenant_id = (user.tenant_id as string) ?? ''
        token.employee_id = user.employee_id as string | undefined
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.tenant_id = token.tenant_id as string
        session.user.employee_id = token.employee_id as string | undefined
      }
      return session
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnEmployee = nextUrl.pathname.startsWith('/employee')
      const isOnAuth = nextUrl.pathname.startsWith('/login')

      if (isOnAuth) {
        // Already logged in → redirect to appropriate dashboard
        if (isLoggedIn) {
          const role = auth.user.role
          const dest = isAdminRole(role) ? '/admin/dashboard' : '/employee/signings'
          return Response.redirect(new URL(dest, nextUrl))
        }
        return true
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      if (isOnAdmin && !isAdminRole(auth.user.role)) {
        return Response.redirect(new URL('/employee/signings', nextUrl))
      }

      if (isOnEmployee && isAdminRole(auth.user.role)) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }

      return true
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
