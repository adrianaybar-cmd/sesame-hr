'use client'

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, use } from 'react'
import { Badge } from '@clasing/ui/badge'
import { Button } from '@clasing/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@clasing/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Input } from '@clasing/ui/input'
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserIcon,
  FileTextIcon,
  ClockCounterClockwiseIcon,
  GraduationCapIcon,
  StarIcon,
  CaretDownIcon,
  XIcon,
  CheckIcon,
  WarningCircleIcon,
  CurrencyEurIcon,
  IdentificationCardIcon,
  HouseIcon,
  FirstAidKitIcon,
  TranslateIcon,
  CertificateIcon,
  ChartLineUpIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { getEmployeeProfileById } from '@/lib/mock/employees'
import type { EmployeeProfile, HistoryEntry, EmployeeEvaluation, EmployeeDocument } from '@/lib/types/employee'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<EmployeeProfile['status'], string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  on_leave: 'De baja',
  terminated: 'Baja definitiva',
}

const STATUS_VARIANTS: Record<EmployeeProfile['status'], 'success' | 'neutral' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'neutral',
  on_leave: 'warning',
  terminated: 'error',
}

const CONTRACT_LABELS: Record<EmployeeProfile['contract_type'], string> = {
  indefinido: 'Indefinido',
  temporal: 'Temporal',
  practicas: 'Prácticas',
  freelance: 'Freelance',
}

const LANGUAGE_LEVELS: Record<string, string> = {
  A1: 'A1 — Principiante',
  A2: 'A2 — Básico',
  B1: 'B1 — Intermedio',
  B2: 'B2 — Intermedio alto',
  C1: 'C1 — Avanzado',
  C2: 'C2 — Maestría',
  native: 'Nativo',
}

const HISTORY_TYPE_LABELS: Record<HistoryEntry['type'], string> = {
  position_change: 'Cambio de cargo',
  department_change: 'Cambio de departamento',
  salary_change: 'Cambio de salario',
  status_change: 'Cambio de estado',
  location_change: 'Cambio de centro',
}

const HISTORY_TYPE_COLORS: Record<HistoryEntry['type'], string> = {
  position_change: 'bg-blue-500 dark:bg-blue-400',
  department_change: 'bg-violet-500 dark:bg-violet-400',
  salary_change: 'bg-green-600 dark:bg-green-400',
  status_change: 'bg-yellow-600 dark:bg-yellow-400',
  location_change: 'bg-orange-500 dark:bg-orange-400',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmployeeAvatarLarge({ employee }: { employee: EmployeeProfile }) {
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`
  return (
    <div className="size-20 rounded-full bg-accent flex items-center justify-center shrink-0 border-4 border-background shadow-sm">
      {employee.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={employee.avatar_url} alt="" className="size-20 rounded-full object-cover" />
      ) : (
        <span className="title-2xs font-semibold text-foreground">{initials}</span>
      )}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="label-xs text-muted-foreground">{label}</p>
        <p className="paragraph-sm text-foreground font-medium">{value || '—'}</p>
      </div>
    </div>
  )
}

// ─── Tab: Información personal ────────────────────────────────────────────────

function TabPersonal({ employee }: { employee: EmployeeProfile }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    phone: employee.phone ?? '',
    birth_date: employee.birth_date ?? '',
    nationality: employee.nationality ?? '',
    dni: employee.dni ?? '',
    gender: employee.gender ?? '',
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <IdentificationCardIcon className="size-4 text-muted-foreground" />
            Datos personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <>
              <InfoRow icon={EnvelopeIcon} label="Email" value={employee.email} />
              <InfoRow icon={PhoneIcon} label="Teléfono" value={employee.phone} />
              <InfoRow icon={CalendarIcon} label="Fecha de nacimiento" value={formatDate(employee.birth_date)} />
              <InfoRow icon={UserIcon} label="Nacionalidad" value={employee.nationality} />
              <InfoRow icon={IdentificationCardIcon} label="DNI / NIF" value={employee.dni} />
              <InfoRow icon={UserIcon} label="Género" value={employee.gender} />
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <PencilSimpleIcon className="size-4" />
                  Editar datos
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Teléfono</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 600 000 000" />
              </div>
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Fecha de nacimiento</label>
                <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
              </div>
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">Nacionalidad</label>
                <Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="Española" />
              </div>
              <div>
                <label className="label-xs text-muted-foreground mb-1 block">DNI / NIF</label>
                <Input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="12345678A" />
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
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <HouseIcon className="size-4 text-muted-foreground" />
            Dirección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={MapPinIcon} label="Calle" value={employee.address?.street} />
          <InfoRow icon={MapPinIcon} label="Ciudad" value={employee.address?.city} />
          <InfoRow icon={MapPinIcon} label="Código postal" value={employee.address?.postal_code} />
          <InfoRow icon={MapPinIcon} label="País" value={employee.address?.country} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <FirstAidKitIcon className="size-4 text-muted-foreground" />
            Contacto de emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <InfoRow icon={UserIcon} label="Nombre" value={employee.emergency_contact?.name} />
            <InfoRow icon={UserIcon} label="Relación" value={employee.emergency_contact?.relationship} />
            <InfoRow icon={PhoneIcon} label="Teléfono" value={employee.emergency_contact?.phone} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab: Contrato y nómina ───────────────────────────────────────────────────

function TabContrato({ employee }: { employee: EmployeeProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <FileTextIcon className="size-4 text-muted-foreground" />
            Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={FileTextIcon} label="Tipo de contrato" value={CONTRACT_LABELS[employee.contract_type]} />
          <InfoRow icon={CalendarIcon} label="Fecha de incorporación" value={formatDate(employee.hire_date)} />
          <InfoRow icon={CalendarIcon} label="Fecha de baja" value={employee.termination_date ? formatDate(employee.termination_date) : 'Vigente'} />
          <InfoRow icon={BriefcaseIcon} label="Cargo" value={employee.position} />
          <InfoRow icon={UserIcon} label="Departamento" value={employee.department_name} />
          <InfoRow icon={MapPinIcon} label="Centro de trabajo" value={employee.work_center_name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <CurrencyEurIcon className="size-4 text-muted-foreground" />
            Nómina y retenciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow
            icon={CurrencyEurIcon}
            label="Salario bruto anual"
            value={employee.salary ? `${employee.salary.toLocaleString('es-ES')} €` : '—'}
          />
          <InfoRow
            icon={ChartLineUpIcon}
            label="Retención IRPF"
            value={employee.irpf !== undefined ? `${employee.irpf}%` : '—'}
          />
          <InfoRow icon={IdentificationCardIcon} label="Número Seg. Social" value={employee.social_security_number} />
          <InfoRow
            icon={BriefcaseIcon}
            label="Cuenta bancaria (IBAN)"
            value={
              employee.bank_account
                ? `${employee.bank_account.slice(0, 8)}${'•'.repeat(16)}`
                : '—'
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tab: Datos adicionales ───────────────────────────────────────────────────

function TabDatosAdicionales({ employee }: { employee: EmployeeProfile }) {
  const fields = employee.custom_fields ?? {}
  const hasFields = Object.keys(fields).length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <StarIcon className="size-4 text-muted-foreground" />
          Campos personalizados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasFields ? (
          Object.entries(fields).map(([key, val]) => (
            <InfoRow key={key} icon={StarIcon} label={key} value={String(val)} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <StarIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin campos personalizados</p>
            <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
              Los campos personalizados se configuran desde Ajustes → Campos personalizados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Educación y habilidades ─────────────────────────────────────────────

function TabEducacion({ employee }: { employee: EmployeeProfile }) {
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
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <TranslateIcon className="size-4 text-muted-foreground" />
            Idiomas
          </CardTitle>
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
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <StarIcon className="size-4 text-muted-foreground" />
            Habilidades
          </CardTitle>
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

// ─── Tab: Documentos ─────────────────────────────────────────────────────────

function TabDocumentos({ employee }: { employee: EmployeeProfile }) {
  const docs: EmployeeDocument[] = employee.documents ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="label-md font-semibold flex items-center gap-2">
            <FileTextIcon className="size-4 text-muted-foreground" />
            Documentos ({docs.length})
          </CardTitle>
          <Button variant="outline" size="sm">
            <FileTextIcon className="size-4" />
            Subir documento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <FileTextIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin documentos</p>
            <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
              No hay documentos asociados a este empleado todavía.
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
                <Button variant="ghost" size="xs">
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Evaluaciones ────────────────────────────────────────────────────────

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            pct >= 80 ? 'bg-green-600 dark:bg-green-400' : pct >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' : 'bg-red-600 dark:bg-red-400'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="label-sm font-semibold text-foreground whitespace-nowrap">{score}/{max}</span>
    </div>
  )
}

function TabEvaluaciones({ employee }: { employee: EmployeeProfile }) {
  const evals: EmployeeEvaluation[] = employee.evaluations ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <ChartLineUpIcon className="size-4 text-muted-foreground" />
          Historial de evaluaciones ({evals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {evals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ChartLineUpIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin evaluaciones</p>
            <p className="paragraph-sm text-muted-foreground text-center max-w-xs">
              Todavía no hay evaluaciones registradas para este empleado.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {evals.map((ev) => (
              <div key={ev.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="label-md font-semibold text-foreground">{ev.type}</p>
                    <p className="paragraph-sm text-muted-foreground">
                      Evaluador: {ev.evaluator_name} · {formatDateShort(ev.date)}
                    </p>
                  </div>
                  <Badge
                    variant={ev.score / ev.max_score >= 0.8 ? 'success' : ev.score / ev.max_score >= 0.6 ? 'warning' : 'error'}
                    size="sm"
                  >
                    {ev.score}/{ev.max_score}
                  </Badge>
                </div>
                <ScoreBar score={ev.score} max={ev.max_score} />
                {ev.comments && (
                  <p className="paragraph-sm text-muted-foreground mt-3 pt-3 border-t border-border italic">
                    &ldquo;{ev.comments}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Tab: Historial ──────────────────────────────────────────────────────────

function TabHistorial({ employee }: { employee: EmployeeProfile }) {
  const history = [...(employee.history ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="label-md font-semibold flex items-center gap-2">
          <ClockCounterClockwiseIcon className="size-4 text-muted-foreground" />
          Línea de tiempo ({history.length} cambios)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ClockCounterClockwiseIcon className="size-10 text-muted-foreground" />
            <p className="label-md font-medium text-foreground">Sin historial</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {history.map((entry, idx) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn('size-3 rounded-full mt-1 shrink-0', HISTORY_TYPE_COLORS[entry.type])} />
                  {idx < history.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                </div>
                <div className={cn('pb-6', idx === history.length - 1 && 'pb-0')}>
                  <p className="label-xs text-muted-foreground mb-0.5">{formatDate(entry.date)}</p>
                  <p className="label-md font-semibold text-foreground">{HISTORY_TYPE_LABELS[entry.type]}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="label-xs text-muted-foreground line-through">{entry.previous_value}</span>
                    <ArrowRightIcon className="size-3 text-muted-foreground" />
                    <span className="label-xs font-medium text-foreground">{entry.new_value}</span>
                  </div>
                  <p className="paragraph-xs text-muted-foreground mt-1">Por: {entry.changed_by}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Actions dropdown ─────────────────────────────────────────────────────────

function ActionsDropdown({ employee }: { employee: EmployeeProfile }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="outline" size="md" onClick={() => setOpen(!open)}>
        Acciones
        <CaretDownIcon className="size-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-lg border border-border bg-popover shadow-lg py-1">
            {[
              { label: 'Dar de baja', icon: WarningCircleIcon, destructive: false },
              { label: 'Resetear contraseña', icon: IdentificationCardIcon, destructive: false },
              { label: 'Desactivar cuenta', icon: XIcon, destructive: true },
            ].map((action) => (
              <button
                key={action.label}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 paragraph-sm transition-colors text-left',
                  action.destructive
                    ? 'text-destructive-foreground hover:bg-destructive/10'
                    : 'text-foreground hover:bg-accent'
                )}
                onClick={() => setOpen(false)}
              >
                <action.icon className="size-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const employee = getEmployeeProfileById(id)

  if (!employee) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" iconOnly asChild>
          <Link href="/admin/employees">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <span className="paragraph-sm text-muted-foreground">Empleados</span>
        <span className="paragraph-sm text-muted-foreground">/</span>
        <span className="paragraph-sm text-foreground">
          {employee.first_name} {employee.last_name}
        </span>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <EmployeeAvatarLarge employee={employee} />
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
                <span className="text-border">·</span>
                <span className="paragraph-sm text-muted-foreground">Desde {formatDateShort(employee.hire_date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="md" asChild>
                <Link href={`/admin/employees/${employee.id}/edit`}>
                  <PencilSimpleIcon className="size-4" />
                  Editar
                </Link>
              </Button>
              <ActionsDropdown employee={employee} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <div className="overflow-x-auto pb-1">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <TabsList size="md" {...({} as any)}>
            <TabsTrigger value="personal">
              <UserIcon className="size-4" />
              Información personal
            </TabsTrigger>
            <TabsTrigger value="contrato">
              <FileTextIcon className="size-4" />
              Contrato y nómina
            </TabsTrigger>
            <TabsTrigger value="adicionales">
              <StarIcon className="size-4" />
              Datos adicionales
            </TabsTrigger>
            <TabsTrigger value="educacion">
              <GraduationCapIcon className="size-4" />
              Educación y habilidades
            </TabsTrigger>
            <TabsTrigger value="documentos">
              <FileTextIcon className="size-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="evaluaciones">
              <ChartLineUpIcon className="size-4" />
              Evaluaciones
            </TabsTrigger>
            <TabsTrigger value="historial">
              <ClockCounterClockwiseIcon className="size-4" />
              Historial
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-4">
          <TabsContent value="personal"><TabPersonal employee={employee} /></TabsContent>
          <TabsContent value="contrato"><TabContrato employee={employee} /></TabsContent>
          <TabsContent value="adicionales"><TabDatosAdicionales employee={employee} /></TabsContent>
          <TabsContent value="educacion"><TabEducacion employee={employee} /></TabsContent>
          <TabsContent value="documentos"><TabDocumentos employee={employee} /></TabsContent>
          <TabsContent value="evaluaciones"><TabEvaluaciones employee={employee} /></TabsContent>
          <TabsContent value="historial"><TabHistorial employee={employee} /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
