'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@clasing/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Input } from '@clasing/ui/input'
import {
  PlusIcon,
  FileTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningCircleIcon,
  PenIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_SIGNATURE_REQUESTS } from '@/lib/mock/signatures'
import { MOCK_EMPLOYEES } from '@/lib/mock/employees'
import type { SignatureRequest, SignatureStatus } from '@/lib/types/signature'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<SignatureStatus, string> = {
  pending: 'Pendiente',
  signed: 'Firmado',
  rejected: 'Rechazado',
  expired: 'Expirado',
}

const STATUS_VARIANTS: Record<SignatureStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'error'> = {
  pending: 'primary',
  signed: 'success',
  rejected: 'error',
  expired: 'neutral',
}

const STATUS_ICONS: Record<SignatureStatus, React.ElementType> = {
  pending: ClockIcon,
  signed: CheckCircleIcon,
  rejected: XCircleIcon,
  expired: WarningCircleIcon,
}

const METHOD_LABELS: Record<SignatureRequest['method'], string> = {
  otp: 'OTP',
  biometric: 'Biométrico',
  advanced: 'Avanzada',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminSignaturesPage() {
  const [requests, setRequests] = useState<SignatureRequest[]>(MOCK_SIGNATURE_REQUESTS)
  const [selected, setSelected] = useState<SignatureRequest | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ employee: '', document: '', method: 'otp' as SignatureRequest['method'] })

  function handleCreate() {
    if (!newForm.employee || !newForm.document) return
    const emp = MOCK_EMPLOYEES.find(e => e.id === newForm.employee)
    if (!emp) return

    const now = new Date()
    const expires = new Date(now)
    expires.setDate(expires.getDate() + 7)

    const newReq: SignatureRequest = {
      id: `sig-${Date.now()}`,
      document_id: `doc-${Date.now()}`,
      document_name: newForm.document,
      document_url: `/documents/new-${Date.now()}.pdf`,
      signer_id: emp.id,
      signer_name: emp.first_name + ' ' + emp.last_name,
      requester_id: 'emp-2',
      status: 'pending',
      method: newForm.method,
      otp_sent_to: newForm.method === 'otp' ? `${emp.first_name[0].toLowerCase()}***@empresa.com` : undefined,
      expires_at: expires.toISOString(),
      created_at: now.toISOString(),
    }
    setRequests(prev => [newReq, ...prev])
    setShowNew(false)
    setNewForm({ employee: '', document: '', method: 'otp' })
  }

  const pending = requests.filter(r => r.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Firma Digital</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Gestión de solicitudes de firma de documentos</p>
        </div>
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="label-xs text-warning bg-warning/10 px-3 py-1 rounded-full">
              {pending.length} pendientes
            </span>
          )}
          <Button size="sm" onClick={() => setShowNew(true)}>
            <PlusIcon className="size-4 mr-2" />
            Solicitar firma
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-6 py-3 label-xs text-muted-foreground uppercase tracking-wide">Documento</th>
                <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Firmante</th>
                <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Método</th>
                <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Expira</th>
                <th className="text-center px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map(req => {
                const StatusIcon = STATUS_ICONS[req.status]
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-background/50 cursor-pointer transition-colors"
                    onClick={() => setSelected(req)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileTextIcon className="size-4 text-muted-foreground flex-shrink-0" />
                        <p className="label-sm font-medium text-foreground line-clamp-1">{req.document_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="size-3.5 text-primary" />
                        </div>
                        <span className="paragraph-sm text-foreground">{req.signer_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="paragraph-sm text-muted-foreground">{METHOD_LABELS[req.method]}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="paragraph-sm text-muted-foreground">{formatDate(req.expires_at)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={STATUS_VARIANTS[req.status]}>
                        <StatusIcon className="size-3 mr-1" />
                        {STATUS_LABELS[req.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SlideOver detalle */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Detalle de firma</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Info documento */}
                <div className="bg-background/50 rounded-xl border border-border p-4 flex items-center gap-3">
                  <FileTextIcon className="size-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="label-sm font-semibold text-foreground">{selected.document_name}</p>
                    <p className="paragraph-xs text-muted-foreground">ID: {selected.document_id}</p>
                  </div>
                </div>

                {/* Firmante */}
                <div className="space-y-2">
                  <p className="label-sm font-semibold text-foreground">Firmante</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="label-sm font-medium text-foreground">{selected.signer_name}</p>
                      {selected.otp_sent_to && (
                        <p className="paragraph-xs text-muted-foreground">OTP enviado a {selected.otp_sent_to}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2">
                  <p className="label-sm font-semibold text-foreground">Estado:</p>
                  <Badge variant={STATUS_VARIANTS[selected.status]}>{STATUS_LABELS[selected.status]}</Badge>
                </div>

                {/* Timeline */}
                <div>
                  <p className="label-sm font-semibold text-foreground mb-3">Timeline</p>
                  <div className="space-y-3">
                    <TimelineItem
                      icon={PenIcon}
                      label="Solicitud creada"
                      date={formatDateTime(selected.created_at)}
                      done
                    />
                    <TimelineItem
                      icon={ClockIcon}
                      label="Enviado al firmante"
                      date={formatDateTime(selected.created_at)}
                      done
                    />
                    {selected.status === 'signed' && selected.signed_at && (
                      <TimelineItem
                        icon={CheckCircleIcon}
                        label="Documento firmado"
                        date={formatDateTime(selected.signed_at)}
                        done
                        success
                      />
                    )}
                    {selected.status === 'rejected' && (
                      <TimelineItem
                        icon={XCircleIcon}
                        label="Firma rechazada"
                        date="—"
                        done
                        error
                      />
                    )}
                    {selected.status === 'expired' && (
                      <TimelineItem
                        icon={WarningCircleIcon}
                        label="Firma expirada"
                        date={formatDateTime(selected.expires_at)}
                        done
                        error
                      />
                    )}
                    {selected.status === 'pending' && (
                      <TimelineItem
                        icon={ClockIcon}
                        label="Esperando firma"
                        date={`Expira: ${formatDate(selected.expires_at)}`}
                        done={false}
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    Ver documento
                  </Button>
                  {selected.status === 'pending' && (
                    <Button className="flex-1" size="sm">
                      Reenviar recordatorio
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog nueva solicitud */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar firma de documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Empleado firmante</label>
              <Select value={newForm.employee} onValueChange={(v: string) => setNewForm(f => ({ ...f, employee: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona empleado" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_EMPLOYEES.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Nombre del documento</label>
              <Input
                placeholder="Contrato / Anexo / Política..."
                value={newForm.document}
                onChange={e => setNewForm(f => ({ ...f, document: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Método de firma</label>
              <Select value={newForm.method} onValueChange={(v: string) => setNewForm(f => ({ ...f, method: v as SignatureRequest['method'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otp">OTP (código SMS/email)</SelectItem>
                  <SelectItem value="biometric">Biométrico</SelectItem>
                  <SelectItem value="advanced">Firma avanzada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newForm.employee || !newForm.document}>
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TimelineItem({
  icon: Icon,
  label,
  date,
  done,
  success,
  error,
}: {
  icon: React.ElementType
  label: string
  date: string
  done: boolean
  success?: boolean
  error?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2',
        done && success ? 'bg-success border-success text-white' :
        done && error ? 'bg-error border-error text-white' :
        done ? 'bg-primary border-primary text-white' :
        'bg-background border-border text-muted-foreground',
      )}>
        <Icon className="size-3.5" />
      </div>
      <div className="pt-0.5">
        <p className="label-sm font-medium text-foreground">{label}</p>
        <p className="paragraph-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}

