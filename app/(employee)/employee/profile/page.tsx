'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  PencilSimpleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  GraduationCapIcon,
  StarIcon,
  TranslateIcon,
  CertificateIcon,
  ChartLineUpIcon,
  CameraIcon,
  CheckIcon,
  XIcon,
  TargetIcon,
  HouseIcon,
  IdentificationCardIcon,
  FirstAidKitIcon,
} from '@phosphor-icons/react'
import { getEmployeeProfileById } from '@/lib/mock/employees'
import type { EmployeeProfile, EmployeeDocument, EmployeeEvaluation } from '@/lib/types/employee'
import { cn } from '@/lib/utils'

// Simula el empleado autenticado actualmente
const CURRENT_EMPLOYEE_ID = 'emp-6'

const LANGUAGE_LEVELS: Record<string, string> = {
  A1: 'A1 — Principiante',
  A2: 'A2 — Básico',
  B1: 'B1 — Intermedio',
  B2: 'B2 — Intermedio alto',
  C1: 'C1 — Avanzado',
  C2: 'C2 — Maestría',
  native: 'Nativo',
}

const CONTRACT_LABELS: Record<string, string> = {
  indefinido: 'Indefinido',
  temporal: 'Temporal',
  practicas: 'Prácticas',
  freelance: 'Freelance',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function InfoRow({
  icon: Icon,
  label,
  value,
  readOnly = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  readOnly?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="label-xs text-muted-foreground">{label}</p>
          {readOnly && <Badge variant="neutral" size="xs">Solo lectura</Badge>}
        </div>
        <p className="paragraph-sm text-foreground font-medium">{value || '—'}</p>
      </div>
    </div>
  )
}

// ─── Avatar dialog ────────────────────────────────────────────────────────────

function AvatarEditDialog({ employee }: { employee: EmployeeProfile }) {
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative group">
          <div className="size-20 rounded-full bg-accent flex items-center justify-center shrink-0 border-4 border-background shadow-sm">
            {employee.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={employee.avatar_url} alt="" className="size-20 rounded-full object-cover" />
            ) : (
              <span className="title-2xs font-semibold text-foreground">{initials}</span>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CameraIcon className="size-5 text-white" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Cambiar foto de perfil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="size-24 rounded-full bg-accent flex items-center justify-center border-4 border-border">
            <span className="title-2xs font-semibold text-foreground">{initials}</span>
          </div>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-accent/30 transition-colors">
              <CameraIcon className="size-8 text-muted-foreground" />
              <p className="label-md font-medium text-foreground">Arrastra tu foto aquí</p>
              <p className="paragraph-sm text-muted-foreground">PNG, JPG o WEBP hasta 5 MB</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md">Cancelar</Button>
          </DialogClose>
          <Button variant="primary" size="md">
            <CheckIcon className="size-4" />
            Guardar foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tab: Información personal ────────────────────────────────────────────────

function TabPersonal({ employee }: { employee: EmployeeProfile }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    phone: employee.phone ?? '',
    street: employee.address?.street ?? '',
    city: employee.address?.city ?? '',
    postal_code: employee.address?.postal_code ?? '',
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <IdentificationCardIcon className="size-4 text-muted-foreground" />
            Mis datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <>
              <InfoRow icon={EnvelopeIcon} label="Email" value={employee.email} readOnly />
              <InfoRow icon={PhoneIcon} label="Teléfono" value={employee.phone} />
              <InfoRow icon={CalendarIcon} label="Fecha de nacimiento" value={formatDate(employee.birth_date)} readOnly />
              <InfoRow icon={UserIcon} label="Nacionalidad" value={employee.nationality} readOnly />
              <InfoRow icon={IdentificationCardIcon} label="DNI / NIF" value={employee.dni} readOnly />
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <PencilSimpleIcon className="size-4" />
                  Editar teléfono
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Teléfono</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 600 000 000" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={() => setEditing(false)}>
                  <CheckIcon className="size-4" />
                  Guardar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <XIcon className="size-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="label-md font-semibold flex items-center gap-2">
              <HouseIcon className="size-4 text-muted-foreground" />
              Mi dirección
            </CardTitle>
            {!editing && (
              <Button variant="ghost" size="xs" onClick={() => setEditing(true)}>
                <PencilSimpleIcon className="size-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <InfoRow icon={MapPinIcon} label="Calle" value={employee.address?.street} />
          <InfoRow icon={MapPinIcon} label="Ciudad" value={employee.address?.city} />
          <InfoRow icon={MapPinIcon} label="Código postal" value={employee.address?.postal_code} />
          <InfoRow icon={MapPinIcon} label="País" value={employee.address?.country} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <BriefcaseInfo className="size-4 text-muted-foreground" />
            Información laboral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={StarIcon} label="Cargo" value={employee.position} readOnly />
          <InfoRow icon={UserIcon} label="Departamento" value={employee.department_name} readOnly />
          <InfoRow icon={MapPinIcon} label="Centro de trabajo" value={employee.work_center_name} readOnly />
          <InfoRow icon={CalendarIcon} label="Fecha de incorporación" value={formatDate(employee.hire_date)} readOnly />
          <InfoRow icon={FileTextIcon} label="Tipo de contrato" value={CONTRACT_LABELS[employee.contract_type]} readOnly />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <FirstAidKitIcon className="size-4 text-muted-foreground" />
            Contacto de emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={UserIcon} label="Nombre" value={employee.emergency_contact?.name} />
          <InfoRow icon={UserIcon} label="Relación" value={employee.emergency_contact?.relationship} />
          <InfoRow icon={PhoneIcon} label="Teléfono" value={employee.emergency_contact?.phone} />
        </CardContent>
      </Card>
    </div>
  )
}

// Helper icon (briefcase without the BriefcaseIcon naming conflict)
function BriefcaseInfo({ className }: { className?: string }) {
  return <StarIcon className={className} />
}

// ─── Tab: Documentos ─────────────────────────────────────────────────────────

function TabDocumentos({ employee }: { employee: EmployeeProfile }) {
  const docs: EmployeeDocument[] = employee.documents ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <FileTextIcon className="size-4 text-muted-foreground" />
          Mis documentos ({docs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <FileTextIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin documentos</p>
            <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
              Cuando RRHH suba documentos para ti aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors">
                <div className="size-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <FileTextIcon className="size-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="label-xs text-muted-foreground">
                    {doc.type} · {doc.size_kb} KB · {formatDateShort(doc.uploaded_at)}
                  </p>
                </div>
                <Button variant="ghost" size="xs">Descargar</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Evaluaciones ────────────────────────────────────────────────────────

function TabEvaluaciones({ employee }: { employee: EmployeeProfile }) {
  const evals: EmployeeEvaluation[] = employee.evaluations ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <ChartLineUpIcon className="size-4 text-muted-foreground" />
          Mis evaluaciones ({evals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {evals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ChartLineUpIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin evaluaciones</p>
            <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
              Todavía no tienes evaluaciones. Cuando tu manager complete una evaluación aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {evals.map((ev) => {
              const pct = Math.round((ev.score / ev.max_score) * 100)
              return (
                <div key={ev.id} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <p className="label-md font-semibold text-foreground">{ev.type}</p>
                      <p className="paragraph-sm text-muted-foreground">
                        Evaluador: {ev.evaluator_name} · {formatDateShort(ev.date)}
                      </p>
                    </div>
                    <Badge
                      variant={pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'error'}
                      size="sm"
                    >
                      {ev.score}/{ev.max_score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', pct >= 80 ? 'bg-green-600 dark:bg-green-400' : pct >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' : 'bg-red-600 dark:bg-red-400')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="label-xs text-muted-foreground">{pct}%</span>
                  </div>
                  {ev.comments && (
                    <p className="paragraph-sm text-muted-foreground mt-3 pt-3 border-t border-border italic">
                      &ldquo;{ev.comments}&rdquo;
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Formación ───────────────────────────────────────────────────────────

function TabFormacion({ employee }: { employee: EmployeeProfile }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <GraduationCapIcon className="size-4 text-muted-foreground" />
            Formación académica
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employee.education.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground">Sin formación registrada.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {employee.education.map((edu) => (
                <div key={edu.id} className="flex items-start gap-4 p-3 rounded-lg bg-card border border-border">
                  <div className="size-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <GraduationCapIcon className="size-4 text-foreground" />
                  </div>
                  <div>
                    <p className="label-md font-semibold text-foreground">{edu.degree}</p>
                    <p className="paragraph-sm text-muted-foreground">{edu.institution}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {edu.field && <Badge variant="secondary" size="xs">{edu.field}</Badge>}
                      <span className="label-xs text-muted-foreground">{edu.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="label-md font-semibold flex items-center gap-2">
              <TranslateIcon className="size-4 text-muted-foreground" />
              Idiomas
            </CardTitle>
            <Button variant="ghost" size="xs">
              <PencilSimpleIcon className="size-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employee.languages.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground">Sin idiomas registrados.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {employee.languages.map((lang) => (
                <div key={lang.language} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
                  <TranslateIcon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="label-sm font-medium text-foreground">{lang.language}</p>
                    <p className="label-xs text-muted-foreground">{LANGUAGE_LEVELS[lang.level]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="label-md font-semibold flex items-center gap-2">
              <StarIcon className="size-4 text-muted-foreground" />
              Habilidades
            </CardTitle>
            <Button variant="ghost" size="xs">
              <PencilSimpleIcon className="size-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employee.skills.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground">Sin habilidades registradas.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <CertificateIcon className="size-4 text-muted-foreground" />
            Certificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employee.certifications.length === 0 ? (
            <p className="paragraph-sm text-muted-foreground">Sin certificaciones registradas.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {employee.certifications.map((cert) => {
                const isExpired = cert.expiry_date ? new Date(cert.expiry_date) < new Date() : false
                return (
                  <div key={cert.id} className="flex items-start gap-4 p-3 rounded-lg bg-card border border-border">
                    <CertificateIcon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="label-md font-semibold text-foreground">{cert.name}</p>
                        {isExpired && <Badge variant="warning" size="xs">Expirada</Badge>}
                      </div>
                      <p className="paragraph-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="label-xs text-muted-foreground mt-1">
                        Obtenida: {formatDateShort(cert.date)}
                        {cert.expiry_date && ` · Expira: ${formatDateShort(cert.expiry_date)}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab: Objetivos ───────────────────────────────────────────────────────────

function TabObjetivos() {
  const objectives = [
    { id: 'obj-1', title: 'Completar certificación AWS', progress: 65, due: '2025-06-30', status: 'in_progress' },
    { id: 'obj-2', title: 'Liderar al menos 2 proyectos de cliente', progress: 50, due: '2025-12-31', status: 'in_progress' },
    { id: 'obj-3', title: 'Mejorar el tiempo de respuesta de la API un 30%', progress: 100, due: '2025-03-01', status: 'completed' },
  ]

  const statusLabels: Record<string, { label: string; variant: 'success' | 'in-progress' | 'not-started' }> = {
    completed: { label: 'Completado', variant: 'success' },
    in_progress: { label: 'En progreso', variant: 'in-progress' },
    not_started: { label: 'No iniciado', variant: 'not-started' },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <TargetIcon className="size-4 text-muted-foreground" />
          Mis objetivos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {objectives.map((obj) => {
            const s = statusLabels[obj.status]
            return (
              <div key={obj.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <p className="label-md font-semibold text-foreground">{obj.title}</p>
                  <Badge variant={s.variant} size="sm">{s.label}</Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', obj.progress === 100 ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-500 dark:bg-blue-400')}
                      style={{ width: `${obj.progress}%` }}
                    />
                  </div>
                  <span className="label-xs text-muted-foreground whitespace-nowrap">{obj.progress}%</span>
                </div>
                <p className="label-xs text-muted-foreground">Fecha límite: {formatDateShort(obj.due)}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeProfileSelfPage() {
  const employee = getEmployeeProfileById(CURRENT_EMPLOYEE_ID)

  if (!employee) return null

  const initials = `${employee.first_name[0]}${employee.last_name[0]}`

  const STATUS_LABELS: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'De baja',
    terminated: 'Baja definitiva',
  }

  const STATUS_VARIANTS: Record<string, 'success' | 'neutral' | 'warning' | 'error'> = {
    active: 'success',
    inactive: 'neutral',
    on_leave: 'warning',
    terminated: 'error',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <AvatarEditDialog employee={employee} />
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-foreground flex items-center justify-center border-2 border-background pointer-events-none">
                <CameraIcon className="size-3 text-background" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="title-2xs font-semibold text-foreground">
                  {employee.first_name} {employee.last_name}
                </h1>
                <Badge variant={STATUS_VARIANTS[employee.status]} size="sm">
                  {STATUS_LABELS[employee.status]}
                </Badge>
              </div>
              <p className="label-md text-muted-foreground">{employee.position}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="paragraph-sm text-muted-foreground">{employee.department_name}</span>
                <span className="text-border">·</span>
                <span className="paragraph-sm text-muted-foreground">{employee.work_center_name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <TabsList size="md" {...({} as any)}>
          <TabsTrigger value="personal">
            <UserIcon className="size-4" />
            Información personal
          </TabsTrigger>
          <TabsTrigger value="documentos">
            <FileTextIcon className="size-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="evaluaciones">
            <ChartLineUpIcon className="size-4" />
            Evaluaciones
          </TabsTrigger>
          <TabsTrigger value="formacion">
            <GraduationCapIcon className="size-4" />
            Formación
          </TabsTrigger>
          <TabsTrigger value="objetivos">
            <TargetIcon className="size-4" />
            Objetivos
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="personal"><TabPersonal employee={employee} /></TabsContent>
          <TabsContent value="documentos"><TabDocumentos employee={employee} /></TabsContent>
          <TabsContent value="evaluaciones"><TabEvaluaciones employee={employee} /></TabsContent>
          <TabsContent value="formacion"><TabFormacion employee={employee} /></TabsContent>
          <TabsContent value="objetivos"><TabObjetivos /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
