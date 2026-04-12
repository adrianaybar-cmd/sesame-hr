'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card } from '@clasing/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@clasing/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Input } from '@clasing/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import {
  ReceiptIcon,
  CheckIcon,
  XIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CurrencyEurIcon,
} from '@phosphor-icons/react'
import { MOCK_EXPENSES } from '@/lib/mock/expenses'
import type { Expense, ExpenseStatus, ExpenseCategory } from '@/lib/types/expenses'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  draft: 'Borrador',
  submitted: 'Pendiente',
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

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [approvalDialog, setApprovalDialog] = useState<{ expense: Expense; action: 'approve' | 'reject' } | null>(null)
  const [comment, setComment] = useState('')

  function handleAction() {
    if (!approvalDialog) return
    const { expense, action } = approvalDialog
    setExpenses(prev =>
      prev.map(e =>
        e.id === expense.id
          ? {
              ...e,
              status: action === 'approve' ? 'approved' : 'rejected',
              notes: action === 'reject' ? comment : e.notes,
              approved_by: 'emp-2',
              approved_at: new Date().toISOString(),
            }
          : e,
      ),
    )
    setApprovalDialog(null)
    setComment('')
  }

  function filtered(list: Expense[]) {
    return list
      .filter(e => filterCat === 'all' || e.category === filterCat)
      .filter(e => filterStatus === 'all' || e.status === filterStatus)
      .filter(e =>
        search === '' ||
        e.employee_name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()),
      )
  }

  const pending = filtered(expenses.filter(e => e.status === 'submitted'))
  const all = filtered(expenses)

  const totalPending = expenses.filter(e => e.status === 'submitted').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Gastos y Dietas</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">Gestión y aprobación de gastos de empleados</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 bg-warning/10 text-warning rounded-lg px-4 py-2">
            <CurrencyEurIcon className="size-4" />
            <span className="label-sm font-medium">{pending.length} pendientes · {formatEur(totalPending)}</span>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <MagnifyingGlassIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por empleado o descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCat} onValueChange={(v: string) => setFilterCat(v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v: string) => setFilterStatus(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pending">
        <TabsList {...({} as any)}>
          <TabsTrigger value="pending">
            Pendientes
            {pending.length > 0 && (
              <span className="ml-2 bg-warning/20 text-warning rounded-full px-2 py-0.5 label-xs">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <ExpensesTable
            expenses={pending}
            onApprove={expense => setApprovalDialog({ expense, action: 'approve' })}
            onReject={expense => setApprovalDialog({ expense, action: 'reject' })}
            showActions
          />
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <ExpensesTable expenses={all} />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportsTab expenses={expenses} />
        </TabsContent>
      </Tabs>

      {/* Dialog aprobación / rechazo */}
      <Dialog open={!!approvalDialog} onOpenChange={() => { setApprovalDialog(null); setComment('') }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog?.action === 'approve' ? 'Aprobar gasto' : 'Rechazar gasto'}
            </DialogTitle>
          </DialogHeader>
          {approvalDialog && (
            <div className="space-y-4 py-2">
              <div className="bg-background/50 rounded-lg border border-border p-4 space-y-1">
                <p className="label-sm font-medium text-foreground">{approvalDialog.expense.description}</p>
                <p className="paragraph-xs text-muted-foreground">
                  {approvalDialog.expense.employee_name} · {CATEGORY_LABELS[approvalDialog.expense.category]}
                </p>
                <p className="label-md font-semibold text-foreground">{formatEur(approvalDialog.expense.amount)}</p>
              </div>
              {approvalDialog.action === 'reject' && (
                <div className="space-y-1">
                  <label className="label-sm font-medium text-foreground">Motivo del rechazo</label>
                  <Input
                    placeholder="Indica el motivo..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setApprovalDialog(null); setComment('') }}>
              Cancelar
            </Button>
            <Button
              variant={approvalDialog?.action === 'reject' ? 'destructive' : 'primary'}
              onClick={handleAction}
              disabled={approvalDialog?.action === 'reject' && !comment}
            >
              {approvalDialog?.action === 'approve' ? 'Aprobar' : 'Rechazar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function ExpensesTable({
  expenses,
  onApprove,
  onReject,
  showActions = false,
}: {
  expenses: Expense[]
  onApprove?: (e: Expense) => void
  onReject?: (e: Expense) => void
  showActions?: boolean
}) {
  if (expenses.length === 0) {
    return (
      <Card className="bg-card border border-border">
        <div className="flex items-center justify-center h-32">
          <p className="paragraph-sm text-muted-foreground">No hay gastos que mostrar</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="text-left px-6 py-3 label-xs text-muted-foreground uppercase tracking-wide">Empleado</th>
              <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Descripción</th>
              <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Categoría</th>
              <th className="text-left px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Fecha</th>
              <th className="text-right px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Importe</th>
              <th className="text-center px-4 py-3 label-xs text-muted-foreground uppercase tracking-wide">Estado</th>
              {showActions && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="label-sm font-medium text-foreground">{expense.employee_name}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="paragraph-sm text-foreground line-clamp-1">{expense.description}</p>
                  {expense.notes && (
                    <p className="paragraph-xs text-muted-foreground line-clamp-1">{expense.notes}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="paragraph-sm text-muted-foreground">{CATEGORY_LABELS[expense.category]}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="paragraph-sm text-muted-foreground">{formatDate(expense.date)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="label-sm font-semibold text-foreground">{formatEur(expense.amount)}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <Badge variant={STATUS_VARIANTS[expense.status]}>{STATUS_LABELS[expense.status]}</Badge>
                </td>
                {showActions && (
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success hover:bg-success/10"
                        onClick={() => onApprove?.(expense)}
                      >
                        <CheckIcon className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-error border-error hover:bg-error/10"
                        onClick={() => onReject?.(expense)}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function ReportsTab({ expenses }: { expenses: Expense[] }) {
  const byCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount
      return acc
    }, {}),
  ).sort((a, b) => b[1] - a[1])

  const totalApproved = expenses.filter(e => e.status === 'approved' || e.status === 'paid').reduce((s, e) => s + e.amount, 0)
  const totalPending = expenses.filter(e => e.status === 'submitted').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Total aprobado</p>
          <p className="title-lg font-semibold text-success">{formatEur(totalApproved)}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Pendiente aprobación</p>
          <p className="title-lg font-semibold text-warning">{formatEur(totalPending)}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Total gastos</p>
          <p className="title-lg font-semibold text-foreground">{expenses.length}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="label-xs text-muted-foreground">Empleados activos</p>
          <p className="title-lg font-semibold text-foreground">{new Set(expenses.map(e => e.employee_id)).size}</p>
        </Card>
      </div>

      <Card className="bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="label-md font-semibold text-foreground">Gasto por categoría</h3>
        </div>
        <div className="divide-y divide-border">
          {byCategory.map(([cat, total]) => (
            <div key={cat} className="flex items-center justify-between px-6 py-3">
              <span className="paragraph-sm text-foreground">
                {CATEGORY_LABELS[cat as ExpenseCategory] ?? cat}
              </span>
              <span className="label-sm font-semibold text-foreground">{formatEur(total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
