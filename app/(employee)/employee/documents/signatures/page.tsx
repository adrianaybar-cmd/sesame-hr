'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import {
  FileTextIcon,
  PenIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
} from '@phosphor-icons/react'
import { MOCK_SIGNATURE_REQUESTS } from '@/lib/mock/signatures'
import type { SignatureRequest, SignatureStatus } from '@/lib/types/signature'
import { cn } from '@/lib/utils'

const CURRENT_EMPLOYEE_ID = 'emp-6'

const STATUS_LABELS: Record<SignatureStatus, string> = {
  pending: 'Pendiente de firma',
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

type SignStep = 'preview' | 'otp' | 'done'

export default function EmployeeSignaturesPage() {
  const [requests, setRequests] = useState<SignatureRequest[]>(MOCK_SIGNATURE_REQUESTS)
  const [signing, setSigning] = useState<SignatureRequest | null>(null)
  const [step, setStep] = useState<SignStep>('preview')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)

  const myDocs = requests.filter(r => r.signer_id === CURRENT_EMPLOYEE_ID)
  const pendingDocs = myDocs.filter(r => r.status === 'pending')
  const signedDocs = myDocs.filter(r => r.status === 'signed')

  function openSign(req: SignatureRequest) {
    setSigning(req)
    setStep('preview')
    setOtp('')
    setOtpError(false)
  }

  function handleVerifyOtp() {
    // Accept any 6-digit code in demo
    if (otp.length === 6) {
      setStep('done')
      setRequests(prev =>
        prev.map(r =>
          r.id === signing?.id
            ? { ...r, status: 'signed', signed_at: new Date().toISOString() }
            : r,
        ),
      )
    } else {
      setOtpError(true)
    }
  }

  function closeDialog() {
    setSigning(null)
    setStep('preview')
    setOtp('')
    setOtpError(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="title-lg font-semibold text-foreground">Mis documentos para firmar</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">Firma tus documentos pendientes de forma segura y legal</p>
      </div>

      {/* Pendientes */}
      {pendingDocs.length > 0 && (
        <div className="space-y-3">
          <h2 className="label-md font-semibold text-foreground">Pendientes de tu firma</h2>
          {pendingDocs.map(req => (
            <PendingDocCard key={req.id} req={req} onSign={() => openSign(req)} />
          ))}
        </div>
      )}

      {pendingDocs.length === 0 && (
        <Card className="bg-card border border-border p-8 flex flex-col items-center gap-3 text-center">
          <CheckCircleIcon className="size-10 text-success" />
          <p className="label-md font-semibold text-foreground">¡Todo al día!</p>
          <p className="paragraph-sm text-muted-foreground">No tienes documentos pendientes de firma.</p>
        </Card>
      )}

      {/* Firmados */}
      {signedDocs.length > 0 && (
        <div className="space-y-3">
          <h2 className="label-md font-semibold text-foreground">Firmados</h2>
          <Card className="bg-card border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {signedDocs.map(req => (
                <div key={req.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileTextIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="label-sm font-medium text-foreground">{req.document_name}</p>
                      <p className="paragraph-xs text-muted-foreground">
                        Firmado el {req.signed_at ? formatDate(req.signed_at) : '—'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Firmado</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Dialog firma */}
      <Dialog open={!!signing} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-lg">
          {signing && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {step === 'preview' ? 'Vista previa del documento' :
                   step === 'otp' ? 'Verificación de identidad' :
                   '¡Documento firmado!'}
                </DialogTitle>
              </DialogHeader>

              {/* Step indicators */}
              <div className="flex items-center gap-1 my-2">
                {(['preview', 'otp', 'done'] as SignStep[]).map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
                      (step === s || (step === 'done' && s !== 'done') || (step === 'otp' && s === 'preview'))
                        ? 'bg-primary text-white'
                        : step === 'done' && s === 'done'
                        ? 'bg-success text-white'
                        : 'bg-border text-muted-foreground',
                    )}>
                      {i + 1}
                    </div>
                    {i < 2 && <div className={cn('h-0.5 flex-1 mx-1', i < (['preview', 'otp', 'done'] as SignStep[]).indexOf(step) ? 'bg-primary' : 'bg-border')} />}
                  </div>
                ))}
              </div>

              {/* Step 1: Preview */}
              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="bg-background rounded-xl border border-border overflow-hidden" style={{ height: 320 }}>
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="size-4 text-muted-foreground" />
                        <span className="paragraph-xs text-muted-foreground">{signing.document_name}</span>
                      </div>
                      <EyeIcon className="size-4 text-muted-foreground" />
                    </div>
                    {/* Simulación iframe documento */}
                    <div className="p-6 space-y-3">
                      <div className="text-center border-b border-border pb-4">
                        <p className="label-md font-semibold text-foreground">Sesame Technologies S.L.</p>
                        <p className="paragraph-xs text-muted-foreground">CIF B-12345678</p>
                      </div>
                      <p className="paragraph-sm font-semibold text-foreground">{signing.document_name}</p>
                      <div className="space-y-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-2 bg-muted/40 rounded-full" style={{ width: `${75 + (i % 3) * 10}%` }} />
                        ))}
                      </div>
                      <div className="space-y-1 mt-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-2 bg-muted/40 rounded-full" style={{ width: `${60 + (i % 4) * 10}%` }} />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="h-8 w-24 border-b-2 border-border" />
                        <p className="paragraph-xs text-muted-foreground">Firma aquí</p>
                      </div>
                    </div>
                  </div>
                  <p className="paragraph-xs text-muted-foreground text-center">
                    Al firmar este documento aceptas su contenido con plena validez legal.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
                    <Button onClick={() => setStep('otp')}>
                      <PenIcon className="size-4 mr-2" />
                      Proceder a firmar
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
                    <LockIcon className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="label-sm font-medium text-foreground">Código de verificación enviado</p>
                      {signing.otp_sent_to ? (
                        <p className="paragraph-xs text-muted-foreground mt-0.5">
                          Hemos enviado un código de 6 dígitos a {signing.otp_sent_to}
                        </p>
                      ) : (
                        <p className="paragraph-xs text-muted-foreground mt-0.5">
                          Hemos enviado un código de 6 dígitos a tu email corporativo
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="label-sm font-medium text-foreground">Introduce el código de 6 dígitos</label>
                    <Input
                      placeholder="000000"
                      value={otp}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setOtp(v)
                        setOtpError(false)
                      }}
                      maxLength={6}
                      className={cn(
                        'text-center text-2xl tracking-widest font-semibold h-14',
                        otpError && 'border-error focus:ring-error',
                      )}
                    />
                    {otpError && (
                      <p className="paragraph-xs text-error">Código incorrecto. Inténtalo de nuevo.</p>
                    )}
                    <p className="paragraph-xs text-muted-foreground text-center mt-2">
                      Demo: usa cualquier código de 6 dígitos (ej. 123456)
                    </p>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStep('preview')}>Atrás</Button>
                    <Button onClick={handleVerifyOtp} disabled={otp.length !== 6}>
                      Verificar y firmar
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {/* Step 3: Done */}
              {step === 'done' && (
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-success/10">
                      <CheckCircleIcon className="size-12 text-success" />
                    </div>
                  </div>
                  <div>
                    <p className="label-md font-semibold text-foreground">¡Documento firmado correctamente!</p>
                    <p className="paragraph-sm text-muted-foreground mt-1">
                      {signing.document_name}
                    </p>
                    <p className="paragraph-xs text-muted-foreground mt-2">
                      Recibirás una copia firmada en tu email. La firma tiene plena validez legal.
                    </p>
                  </div>
                  <div className="bg-success/5 border border-success/20 rounded-lg p-3 flex items-center gap-2 text-success">
                    <CheckCircleIcon className="size-4 flex-shrink-0" />
                    <div className="text-left">
                      <p className="label-xs font-medium">Firma registrada</p>
                      <p className="paragraph-xs opacity-80">{new Date().toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={closeDialog}>
                    Cerrar
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PendingDocCard({ req, onSign }: { req: SignatureRequest; onSign: () => void }) {
  const daysLeft = Math.ceil((new Date(req.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="bg-card border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
            <FileTextIcon className="size-5 text-primary" />
          </div>
          <div>
            <p className="label-md font-semibold text-foreground">{req.document_name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-1 text-muted-foreground">
                <UserIcon className="size-3.5" />
                <span className="paragraph-xs">Enviado por RRHH</span>
              </div>
              <span className="text-muted-foreground paragraph-xs">·</span>
              <div className="flex items-center gap-1">
                <ClockIcon className="size-3.5 text-muted-foreground" />
                <span className={cn(
                  'paragraph-xs',
                  daysLeft <= 2 ? 'text-error font-medium' : 'text-muted-foreground',
                )}>
                  {daysLeft > 0 ? `Expira en ${daysLeft} días` : 'Expira hoy'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={onSign}>
          <PenIcon className="size-4 mr-2" />
          Firmar
        </Button>
      </div>
    </Card>
  )
}

