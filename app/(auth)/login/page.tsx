'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@clasing/ui/button'
import { Input } from '@clasing/ui/input'
import { Card, CardContent, CardHeader } from '@clasing/ui/card'
import { Alert, AlertDescription } from '@clasing/ui/alert'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@clasing/ui/form'
import {
  EnvelopeSimpleIcon,
  LockKeyIcon,
  GoogleLogoIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Introduce un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSSOLoading, setIsSSOLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: LoginFormValues) {
    setError(null)
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos. Verifica tus credenciales.')
        return
      }

      // Navigate to root — the authorized callback will redirect based on role
      router.push('/')
    } catch {
      setError('Ha ocurrido un error inesperado. Inténtalo de nuevo.')
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/admin/dashboard' })
    } catch {
      setError('Error al conectar con Google. Inténtalo de nuevo.')
      setIsGoogleLoading(false)
    }
  }

  async function handleSSOSignIn() {
    setIsSSOLoading(true)
    // TODO: Implement SAML/OIDC SSO flow
    setTimeout(() => setIsSSOLoading(false), 1000)
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand header */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="label-lg font-semibold text-primary-foreground">S</span>
          </div>
          <span className="title-2xs font-semibold text-foreground">Sesame HR</span>
        </div>
        <p className="paragraph-sm text-muted-foreground text-center">
          Tu plataforma de gestión de personas
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <h1 className="title-2xs font-semibold text-foreground text-center">
            Iniciar sesión
          </h1>
          <p className="paragraph-sm text-muted-foreground text-center">
            Accede a tu cuenta de Sesame HR
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Social login buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              disabled={isLoading || isSSOLoading}
            >
              {!isGoogleLoading && <GoogleLogoIcon className="size-4" />}
              Continuar con Google
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleSSOSignIn}
              isLoading={isSSOLoading}
              disabled={isLoading || isGoogleLoading}
            >
              {!isSSOLoading && <ShieldCheckIcon className="size-4" />}
              Iniciar sesión con SSO
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-border" />
            <span className="label-sm text-muted-foreground">o</span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="error" showIcon>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Credentials form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="tu@empresa.com"
                        icon={<EnvelopeSimpleIcon className="size-4" />}
                        iconPosition="left"
                        autoComplete="email"
                        aria-invalid={!!form.formState.errors.email}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Contraseña</FormLabel>
                      <a
                        href="/forgot-password"
                        className="label-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        icon={<LockKeyIcon className="size-4" />}
                        iconPosition="left"
                        autoComplete="current-password"
                        aria-invalid={!!form.formState.errors.password}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isGoogleLoading || isSSOLoading}
              >
                Iniciar sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Demo hint */}
      <div className="rounded-lg bg-info border border-info-foreground/20 px-4 py-3">
        <p className="label-sm text-info-foreground font-medium mb-1">Credenciales de demo</p>
        <p className="paragraph-xs text-info-foreground/80">
          Admin: admin@sesame.hr / password
        </p>
        <p className="paragraph-xs text-info-foreground/80">
          Empleado: employee@sesame.hr / password
        </p>
      </div>

      {/* Footer */}
      <p className="paragraph-xs text-muted-foreground text-center">
        Al iniciar sesión aceptas nuestros{' '}
        <a href="/terms" className="underline hover:text-foreground transition-colors">
          Términos de servicio
        </a>{' '}
        y{' '}
        <a href="/privacy" className="underline hover:text-foreground transition-colors">
          Política de privacidad
        </a>
      </p>
    </div>
  )
}
