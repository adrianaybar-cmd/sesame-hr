'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Input } from '@clasing/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import {
  WalletIcon,
  UserIcon,
  IdentificationCardIcon,
  CameraIcon,
  CheckCircleIcon,
  SpinnerIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  CreditCardIcon,
  BankIcon,
  MoneyIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_WALLET, MOCK_WALLET_TRANSACTIONS } from '@/lib/mock/wallet'
import type { KYCStep, WalletTransaction } from '@/lib/types/wallet'
import { cn } from '@/lib/utils'

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const KYC_STEPS: { key: KYCStep; label: string; description: string; icon: React.ElementType }[] = [
  { key: 'personal_data', label: 'Datos personales', description: 'Nombre, DNI, fecha de nacimiento y teléfono', icon: UserIcon },
  { key: 'id_document', label: 'Documento de identidad', description: 'Sube una foto de tu DNI o pasaporte', icon: IdentificationCardIcon },
  { key: 'selfie', label: 'Selfie de verificación', description: 'Tómate una foto para verificar tu identidad', icon: CameraIcon },
  { key: 'verification', label: 'Verificación en proceso', description: 'Revisamos tu documentación', icon: SpinnerIcon },
]

export default function WalletPage() {
  const [wallet, setWallet] = useState(MOCK_WALLET)
  const [kycStep, setKycStep] = useState(0)
  const [docUploaded, setDocUploaded] = useState(false)
  const [selfieCapt, setSelfieCapt] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const [advanceAmount, setAdvanceAmount] = useState('')

  // Form personal data
  const [personalForm, setPersonalForm] = useState({ nombre: '', dni: '', nacimiento: '', telefono: '' })

  const isVerified = wallet.kyc_status === 'verified'

  function nextStep() {
    if (kycStep < KYC_STEPS.length - 1) {
      setKycStep(s => s + 1)
    } else {
      // Simulate completion
      setTimeout(() => {
        setWallet(w => ({ ...w, kyc_status: 'verified', kyc_completed_steps: ['personal_data', 'id_document', 'selfie', 'verification'] }))
      }, 2000)
    }
  }

  function handleAdvance() {
    const amt = parseFloat(advanceAmount)
    if (!amt || isNaN(amt)) return
    setWallet(w => ({ ...w, balance: w.balance + amt }))
    setShowAdvance(false)
    setAdvanceAmount('')
  }

  // ─── KYC Wizard ─────────────────────────────────────────────────────────────
  if (!isVerified) {
    const step = KYC_STEPS[kycStep]
    const StepIcon = step.icon
    const isVerifying = kycStep === KYC_STEPS.length - 1

    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Mi Wallet</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Verifica tu identidad para activar tu wallet</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {KYC_STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.key} className="flex items-center flex-1">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all flex-shrink-0',
                    i < kycStep ? 'bg-success border-success text-white' :
                    i === kycStep ? 'bg-primary border-primary text-white' :
                    'border-border text-muted-foreground bg-background',
                  )}
                >
                  {i < kycStep ? <CheckCircleIcon className="size-4" /> : <Icon className="size-3.5" />}
                </div>
                {i < KYC_STEPS.length - 1 && (
                  <div className={cn('h-0.5 flex-1 mx-1', i < kycStep ? 'bg-success' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <Card className="bg-card border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              'p-3 rounded-xl',
              isVerifying ? 'bg-warning/10' : 'bg-primary/10',
            )}>
              <StepIcon className={cn('size-5', isVerifying ? 'text-warning animate-spin' : 'text-primary')} />
            </div>
            <div>
              <p className="label-md font-semibold text-foreground">{step.label}</p>
              <p className="paragraph-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>

          {/* Step 1: Datos personales */}
          {kycStep === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="label-sm font-medium text-foreground">Nombre completo</label>
                  <Input
                    placeholder="Sofía Moreno Castro"
                    value={personalForm.nombre}
                    onChange={e => setPersonalForm(f => ({ ...f, nombre: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="label-sm font-medium text-foreground">DNI / NIE</label>
                  <Input
                    placeholder="67890123F"
                    value={personalForm.dni}
                    onChange={e => setPersonalForm(f => ({ ...f, dni: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="label-sm font-medium text-foreground">Fecha de nacimiento</label>
                  <Input
                    type="date"
                    value={personalForm.nacimiento}
                    onChange={e => setPersonalForm(f => ({ ...f, nacimiento: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="label-sm font-medium text-foreground">Teléfono</label>
                  <Input
                    placeholder="+34 600 000 000"
                    value={personalForm.telefono}
                    onChange={e => setPersonalForm(f => ({ ...f, telefono: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={nextStep}
                disabled={!personalForm.nombre || !personalForm.dni || !personalForm.nacimiento || !personalForm.telefono}
              >
                Continuar
                <ArrowRightIcon className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Documento */}
          {kycStep === 1 && (
            <div className="space-y-4">
              {docUploaded ? (
                <div className="flex items-center gap-3 bg-success/5 border border-success/30 rounded-xl p-4 text-success">
                  <CheckCircleIcon className="size-5" />
                  <p className="paragraph-sm font-medium">documento_dni_anverso.jpg subido correctamente</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDocUploaded(true)}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary transition-colors"
                >
                  <IdentificationCardIcon className="size-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="label-sm font-medium text-foreground">Subir DNI o pasaporte</p>
                    <p className="paragraph-xs text-muted-foreground mt-1">Anverso y reverso · JPG, PNG o PDF</p>
                  </div>
                </button>
              )}
              <Button className="w-full" onClick={nextStep} disabled={!docUploaded}>
                Continuar
                <ArrowRightIcon className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 3: Selfie */}
          {kycStep === 2 && (
            <div className="space-y-4">
              {selfieCapt ? (
                <div className="flex items-center gap-3 bg-success/5 border border-success/30 rounded-xl p-4 text-success">
                  <CheckCircleIcon className="size-5" />
                  <p className="paragraph-sm font-medium">Selfie capturado correctamente</p>
                </div>
              ) : (
                <div className="bg-background rounded-xl border border-border p-8 flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                    <CameraIcon className="size-8 text-muted-foreground" />
                  </div>
                  <p className="paragraph-sm text-muted-foreground text-center">
                    Coloca tu cara en el círculo y asegúrate de tener buena iluminación
                  </p>
                  <Button onClick={() => setSelfieCapt(true)}>
                    <CameraIcon className="size-4 mr-2" />
                    Tomar foto
                  </Button>
                </div>
              )}
              <Button className="w-full" onClick={nextStep} disabled={!selfieCapt}>
                Continuar
                <ArrowRightIcon className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 4: Verificación */}
          {kycStep === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-warning/10">
                  <SpinnerIcon className="size-8 text-warning animate-spin" />
                </div>
              </div>
              <div>
                <p className="label-md font-semibold text-foreground">Verificando tu documentación</p>
                <p className="paragraph-sm text-muted-foreground mt-1">
                  Estamos revisando tus documentos. Este proceso puede tardar unos minutos.
                  Te notificaremos cuando esté listo.
                </p>
              </div>
              <Button className="w-full" onClick={nextStep}>
                Finalizar
              </Button>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // ─── Dashboard verificado ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Mi Wallet</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Tu saldo y movimientos disponibles</p>
        </div>
        <Badge variant="success">Verificado</Badge>
      </div>

      {/* Saldo */}
      <Card className="bg-primary text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-xs opacity-70 uppercase tracking-wide">Saldo disponible</p>
            <p className="text-5xl font-semibold mt-2">{formatEur(wallet.balance)}</p>
            {wallet.iban && (
              <p className="paragraph-xs opacity-60 mt-2">
                IBAN: ES91 •••• •••• •••• {wallet.iban.slice(-4)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <WalletIcon className="size-8 opacity-50" />
            {wallet.card_last_four && (
              <div className="flex items-center gap-1 opacity-70">
                <CreditCardIcon className="size-4" />
                <span className="paragraph-xs">•••• {wallet.card_last_four}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={() => setShowAdvance(true)}
          >
            <MoneyIcon className="size-4 mr-2" />
            Solicitar adelanto de nómina
          </Button>
        </div>
      </Card>

      {/* Transacciones recientes */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="label-md font-semibold text-foreground">Movimientos recientes</h2>
        </div>
        <div className="divide-y divide-border">
          {MOCK_WALLET_TRANSACTIONS.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </Card>

      {/* Dialog adelanto */}
      <Dialog open={showAdvance} onOpenChange={setShowAdvance}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar adelanto de nómina</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="paragraph-sm text-muted-foreground">
              Puedes solicitar un adelanto de hasta el 50% de tu nómina neta del mes en curso.
            </p>
            <div className="bg-background/50 rounded-lg border border-border p-4 flex justify-between">
              <span className="paragraph-sm text-muted-foreground">Importe máximo disponible</span>
              <span className="label-sm font-semibold text-foreground">1.411,44 €</span>
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Importe a solicitar (€)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={advanceAmount}
                onChange={e => setAdvanceAmount(e.target.value)}
                min="0"
                max="1411.44"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvance(false)}>Cancelar</Button>
            <Button onClick={handleAdvance} disabled={!advanceAmount || parseFloat(advanceAmount) <= 0}>
              Solicitar adelanto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isPositive = tx.amount > 0
  const typeLabel: Record<WalletTransaction['type'], string> = {
    salary_advance: 'Adelanto nómina',
    refund: 'Reembolso',
    charge: 'Cargo',
    transfer: 'Transferencia',
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-2 rounded-full',
          isPositive ? 'bg-success/10' : 'bg-error/10',
        )}>
          {isPositive
            ? <ArrowDownLeftIcon className="size-4 text-success" />
            : <ArrowUpRightIcon className="size-4 text-error" />
          }
        </div>
        <div>
          <p className="label-sm font-medium text-foreground">{tx.description}</p>
          <p className="paragraph-xs text-muted-foreground">
            {typeLabel[tx.type]} · {formatDate(tx.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          'label-sm font-semibold',
          isPositive ? 'text-success' : 'text-error',
        )}>
          {isPositive ? '+' : ''}{formatEur(tx.amount)}
        </p>
        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'} className="mt-0.5">
          {tx.status === 'completed' ? 'Completado' : tx.status === 'pending' ? 'Pendiente' : 'Fallido'}
        </Badge>
      </div>
    </div>
  )
}

