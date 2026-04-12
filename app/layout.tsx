import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { auth } from '@/lib/auth/config'
import { AppProviders } from '@/components/providers/app-providers'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sesame HR',
    template: '%s | Sesame HR',
  },
  description: 'Plataforma de gestión de recursos humanos',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased bg-background text-foreground`}>
        <AppProviders session={session}>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
