'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@clasing/ui/form'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Button } from '@clasing/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@clasing/ui/card'
import { Alert } from '@clasing/ui/alert'
import { BuildingIcon, CheckCircleIcon } from '@phosphor-icons/react'

// ─── Zod schema ───────────────────────────────────────────────────────────────

const companySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cif: z.string().min(9, 'CIF/NIF inválido').max(12, 'CIF/NIF inválido'),
  address: z.string().min(5, 'Introduce una dirección válida'),
  city: z.string().min(2, 'Introduce una ciudad'),
  postal_code: z.string().min(5, 'Código postal inválido'),
  country: z.string().min(1, 'Selecciona un país'),
  language: z.string().min(1, 'Selecciona un idioma'),
  timezone: z.string().min(1, 'Selecciona una zona horaria'),
  logo_url: z.string().url('URL de logo inválida').optional().or(z.literal('')),
})

type CompanyFormValues = z.infer<typeof companySchema>

// ─── Mock default values ──────────────────────────────────────────────────────

const DEFAULT_VALUES: CompanyFormValues = {
  name: 'Empresa Ejemplo S.L.',
  cif: 'B12345678',
  address: 'Calle Gran Vía 45, 3ª planta',
  city: 'Madrid',
  postal_code: '28013',
  country: 'es',
  language: 'es',
  timezone: 'Europe/Madrid',
  logo_url: '',
}

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'ca', label: 'Català' },
  { value: 'eu', label: 'Euskara' },
  { value: 'gl', label: 'Galego' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
]

const TIMEZONES = [
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)' },
  { value: 'Europe/Lisbon', label: 'Lisboa (UTC+0/+1)' },
  { value: 'Europe/London', label: 'Londres (UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'París (UTC+1/+2)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6/-5)' },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-3)' },
  { value: 'America/Santiago', label: 'Santiago (UTC-4/-3)' },
]

const COUNTRIES = [
  { value: 'es', label: 'España' },
  { value: 'pt', label: 'Portugal' },
  { value: 'fr', label: 'Francia' },
  { value: 'de', label: 'Alemania' },
  { value: 'mx', label: 'México' },
  { value: 'ar', label: 'Argentina' },
  { value: 'co', label: 'Colombia' },
  { value: 'cl', label: 'Chile' },
]

// ─── Page component ───────────────────────────────────────────────────────────

export default function CompanySettingsPage() {
  const [saved, setSaved] = useState(false)

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: DEFAULT_VALUES,
  })

  async function onSubmit(values: CompanyFormValues) {
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Saved:', values)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {saved && (
        <Alert
          variant="success"
          title="Cambios guardados"
          content="La configuración de empresa se ha actualizado correctamente."
          showIcon
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Identity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BuildingIcon className="size-4 text-muted-foreground" />
                <CardTitle>Identidad de la empresa</CardTitle>
              </div>
              <CardDescription>
                Información legal y de identificación de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nombre de la empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa S.L." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CIF / NIF</FormLabel>
                      <FormControl>
                        <Input placeholder="B12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del logo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección</CardTitle>
              <CardDescription>Domicilio fiscal de la empresa</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Principal 1, 2ª planta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código postal</FormLabel>
                      <FormControl>
                        <Input placeholder="28001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>País</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Regional settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración regional</CardTitle>
              <CardDescription>Idioma y zona horaria por defecto</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona horaria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una zona horaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting && (
                <CheckCircleIcon className="size-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
