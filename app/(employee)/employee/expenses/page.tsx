'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Input } from '@clasing/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import {
  PlusIcon,
  ReceiptIcon,
  CameraIcon,
  CurrencyEurIcon,
  CalendarIcon,
} from '@phosphor-icons/react'
import { MOCK_EXPENSES } from '@/lib/mock/expenses'
import type { Expense, ExpenseCategory, ExpenseStatus } from '@/lib/types/expenses'

const CURRENT_EMPLOYEE_ID = 'emp-6'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  travel: 'Viajes',
  accommodation: 'Alojamiento',
  meals: 'Dietas',
  transport: 'Transporte',
  office_supplies: 'Material oficina',
  training: 'Formación',
  entertainment: 'Representación',
  other: 'Otros',
}

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  draft: 'Borrador',
  submitted: 'Enviado',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  paid: 'Pagado',
}

const STATUS_VARIANTS: Record<ExpenseStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'error'> = {
  draft: 'neutral',
  submitted: 'primary',
  approved: 'warning',
  rejected: 'error',
  paid: 'success',
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const CURRENT_MONTH = '2026-04'

export default function EmployeeExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [showNew, setShowNew] = useState(false)
  const [ticketUploaded, setTicketUploaded] = useState(false)

  // Form state
  const [form, setForm] = useState({
    date: '',
    category: '' as ExpenseCategory | '',
    description: '',
    amount: '',
  })

  const myExpenses = expenses.filter(e => e.employee_id === CURRENT_EMPLOYEE_ID)

  const thisMonth = myExpenses.filter(e => e.date.startsWith(CURRENT_MONTH))
  const totalMonth = thisMonth.reduce((s, e) => s + e.amount, 0)
  const pendingMonth = thisMonth.filter(e => e.status === 'submitted').reduce((s, e) => s + e.amount, 0)

  function handleSubmit() {
    if (!form.date || !form.category || !form.description || !form.amount) return
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      employee_id: CURRENT_EMPLOYEE_ID,
      employee_name: 'Sofía Moreno Castro',
      date: form.date,
      category: form.category as ExpenseCategory,
      description: form.description,
      amount: parseFloat(form.amount),
      currency: 'EUR',
      receipt_url: ticketUploaded ? '/receipts/new.jpg' : undefined,
      status: 'submitted',
      created_at: new Date().toISOString(),
    }
    setExpenses(prev => [...prev, newExpense])
    setShowNew(false)
    setForm({ date: '', category: '', description: '', amount: '' })
    setTicketUploaded(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Mis gastos</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Gestiona y envía tus gastos para reembolso</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)}>
          <PlusIcon className="size-4 mr-2" />
          Nuevo gasto
        </Button>
      </div>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Total este mes</p>
          <p className="title-lg font-semibold text-foreground">{formatEur(totalMonth)}</p>
          <p className="paragraph-xs text-muted-foreground">{thisMonth.length} gastos</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Pendiente de cobro</p>
          <p className="title-lg font-semibold text-warning">{formatEur(pendingMonth)}</p>
          <p className="paragraph-xs text-muted-foreground">Enviados y aprobados</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Total histórico</p>
          <p className="title-lg font-semibold text-foreground">
            {formatEur(myExpenses.reduce((s, e) => s + e.amount, 0))}
          </p>
          <p className="paragraph-xs text-muted-foreground">{myExpenses.length} gastos en total</p>
        </Card>
      </div>

      {/* Lista de gastos */}
      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="label-md font-semibold text-foreground">Mis gastos</h2>
        </div>
        {myExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <ReceiptIcon className="size-8 text-muted-foreground" />
            <p className="paragraph-sm text-muted-foreground">No tienes gastos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {[...myExpenses].reverse().map(expense => (
              <div key={expense.id} className="flex items-start justify-between px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                    <ReceiptIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="label-sm font-medium text-foreground">{expense.description}</p>
                    <p className="paragraph-xs text-muted-foreground">
                      {CATEGORY_LABELS[expense.category]} · {formatDate(expense.date)}
                    </p>
                    {expense.notes && (
                      <p className="paragraph-xs text-error mt-0.5">{expense.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="label-sm font-semibold text-foreground">{formatEur(expense.amount)}</p>
                  <Badge variant={STATUS_VARIANTS[expense.status]}>{STATUS_LABELS[expense.status]}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dialog nuevo gasto */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo gasto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="label-sm font-medium text-foreground">Fecha</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="label-sm font-medium text-foreground">Importe (€)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Categoría</label>
              <Select value={form.category} onValueChange={(v: string) => setForm(f => ({ ...f, category: v as ExpenseCategory }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Descripción</label>
              <Input
                placeholder="Describe el gasto..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Subir ticket */}
            <div className="space-y-1">
              <label className="label-sm font-medium text-foreground">Ticket / Factura</label>
              {ticketUploaded ? (
                <div className="flex items-center gap-2 text-success border border-success/30 bg-success/5 rounded-lg px-3 py-2">
                  <ReceiptIcon className="size-4" />
                  <span className="paragraph-sm">ticket_adjunto.jpg</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTicketUploaded(true)}
                  className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                >
                  <CameraIcon className="size-6" />
                  <span className="paragraph-sm">Hacer foto o subir archivo</span>
                  <span className="paragraph-xs text-muted-foreground">JPG, PNG o PDF hasta 10 MB</span>
                </button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.date || !form.category || !form.description || !form.amount}
            >
              Enviar gasto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
