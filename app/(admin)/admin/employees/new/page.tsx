'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@clasing/ui/button'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@clasing/ui/form'
import { Card, CardContent } from '@clasing/ui/card'
import { Alert } from '@clasing/ui/alert'
import { cn } from '@/lib/utils'
import {
  UserIcon,
  BriefcaseIcon,
  LockIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperPlaneTiltIcon,
} from '@phosphor-icons/react'
import { MOCK_DEPARTMENTS, MOCK_WORK_CENTERS } from '@/lib/mock/employees'

// ─── Schemas per step ─────────────────────────────────────────────────────────

const step1Schema = z.object({
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
})

const step2Schema = z.object({
  position: z.string().min(2, 'Introduce el cargo del empleado'),
  department_id: z.string().min(1, 'Selecciona un departamento'),
  work_center_id: z.string().min(1, 'Selecciona un centro de trabajo'),
  hire_date: z.string().min(1, 'Introduce la fecha de incorporación'),
  contract_type: z.enum(['indefinido', 'temporal', 'practicas', 'freelance'] as const, {
    message: 'Selecciona un tipo de contrato',
  }),
})

const step3Schema = z.object({
  role: z.enum(
    ['admin', 'hr_manager', 'department_manager', 'team_leader', 'employee', 'intern', 'external', 'read_only', 'recruiter', 'payroll_manager'] as const,
    { message: 'Selecciona un rol' }
  ),
  send_invitation: z.boolean(),
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>
type Step3Values = z.infer<typeof step3Schema>

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Datos personales', icon: UserIcon },
  { id: 2, label: 'Datos laborales', icon: BriefcaseIcon },
  { id: 3, label: 'Acceso', icon: LockIcon },
]

const CONTRACT_TYPES = [
  { value: 'indefinido', label: 'Indefinido' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'practicas', label: 'Prácticas' },
  { value: 'freelance', label: 'Freelance' },
]

const ROLES = [
  { value: 'employee', label: 'Empleado' },
  { value: 'team_leader', label: 'Líder de equipo' },
  { value: 'department_manager', label: 'Manager de departamento' },
  { value: 'hr_manager', label: 'Responsable RRHH' },
  { value: 'payroll_manager', label: 'Responsable de nóminas' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Administrador' },
  { value: 'intern', label: 'Becario' },
  { value: 'external', label: 'Externo' },
  { value: 'read_only', label: 'Solo lectura' },
]

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isCompleted = current > step.id
        const isActive = current === step.id
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'size-9 rounded-full flex items-center justify-center border-2 transition-colors',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                    ? 'border-primary text-primary bg-background'
                    : 'border-border text-muted-foreground bg-background'
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-4" weight="bold" />
                ) : (
                  <span className="label-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  'label-xs font-medium whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-16 sm:w-24 mb-5 mx-2 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1 form ──────────────────────────────────────────────────────────────

function Step1Form({
  onNext,
  defaultValues,
}: {
  onNext: (values: Step1Values) => void
  defaultValues?: Partial<Step1Values>
}) {
  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      birth_date: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Carlos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Martínez García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="carlos@empresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+34 600 000 000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Siguiente
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ─── Step 2 form ──────────────────────────────────────────────────────────────

function Step2Form({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (values: Step2Values) => void
  onBack: () => void
  defaultValues?: Partial<Step2Values>
}) {
  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      position: '',
      department_id: '',
      work_center_id: '',
      hire_date: '',
      contract_type: undefined,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Cargo / Puesto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Desarrollador Full Stack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_DEPARTMENTS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
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
            name="work_center_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centro de trabajo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_WORK_CENTERS.map((wc) => (
                      <SelectItem key={wc.id} value={wc.id}>
                        {wc.name}
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
            name="hire_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de incorporación</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de contrato</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTRACT_TYPES.map((ct) => (
                      <SelectItem key={ct.value} value={ct.value}>
                        {ct.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            <ArrowLeftIcon className="size-4" />
            Anterior
          </Button>
          <Button type="submit" variant="primary" size="md">
            Siguiente
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ─── Step 3 form ──────────────────────────────────────────────────────────────

function Step3Form({
  onSave,
  onBack,
  defaultValues,
  isSaving,
}: {
  onSave: (values: Step3Values) => void
  onBack: () => void
  defaultValues?: Partial<Step3Values>
  isSaving: boolean
}) {
  const form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      role: 'employee',
      send_invitation: true,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol en la plataforma</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
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
          name="send_invitation"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <input
                  id="send_invitation"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="size-4 rounded border-border accent-primary"
                />
                <div>
                  <label htmlFor="send_invitation" className="label-md font-medium text-foreground cursor-pointer">
                    Enviar invitación por email
                  </label>
                  <p className="paragraph-xs text-muted-foreground">
                    El empleado recibirá un correo para configurar su acceso
                  </p>
                </div>
                <PaperPlaneTiltIcon className="size-5 text-muted-foreground ml-auto shrink-0" />
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            <ArrowLeftIcon className="size-4" />
            Anterior
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
            {!isSaving && <CheckIcon className="size-4" />}
            Guardar empleado
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewEmployeePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [step1Data, setStep1Data] = useState<Step1Values | undefined>()
  const [step2Data, setStep2Data] = useState<Step2Values | undefined>()

  function handleStep1(values: Step1Values) {
    setStep1Data(values)
    setStep(2)
  }

  function handleStep2(values: Step2Values) {
    setStep2Data(values)
    setStep(3)
  }

  async function handleStep3(values: Step3Values) {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('New employee:', { ...step1Data, ...step2Data, ...values })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/admin/employees'), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="xs" iconOnly asChild>
          <a href="/admin/employees">
            <ArrowLeftIcon className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Nuevo empleado</h1>
          <p className="paragraph-sm text-muted-foreground">
            Completa los datos para registrar un nuevo empleado
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center">
        <StepIndicator current={step} />
      </div>

      {saved && (
        <Alert
          variant="success"
          title="Empleado creado"
          content="El empleado ha sido registrado correctamente. Redirigiendo..."
          showIcon
        />
      )}

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            {step === 1 && <UserIcon className="size-5 text-muted-foreground" />}
            {step === 2 && <BriefcaseIcon className="size-5 text-muted-foreground" />}
            {step === 3 && <LockIcon className="size-5 text-muted-foreground" />}
            <h2 className="label-lg font-semibold text-foreground">{STEPS[step - 1].label}</h2>
          </div>
          {step === 1 && <Step1Form onNext={handleStep1} defaultValues={step1Data} />}
          {step === 2 && (
            <Step2Form
              onNext={handleStep2}
              onBack={() => setStep(1)}
              defaultValues={step2Data}
            />
          )}
          {step === 3 && (
            <Step3Form
              onSave={handleStep3}
              onBack={() => setStep(2)}
              isSaving={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
