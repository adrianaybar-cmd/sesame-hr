import type { HourBank, HourBankEntry } from '@/lib/types/hour-bank'

export const MOCK_HOUR_BANKS: HourBank[] = [
  {
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    balance_minutes: 480,   // +8h
    accrued_minutes: 2880,  // 48h acumuladas
    consumed_minutes: 2400, // 40h consumidas
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    balance_minutes: 120,   // +2h
    accrued_minutes: 2520,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    balance_minutes: -300,  // -5h (debe horas)
    accrued_minutes: 2100,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    balance_minutes: 720,   // +12h
    accrued_minutes: 3120,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-5',
    employee_name: 'Javier Rodríguez',
    balance_minutes: -600,  // -10h
    accrued_minutes: 1800,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-6',
    employee_name: 'Sofía Moreno',
    balance_minutes: 240,   // +4h
    accrued_minutes: 2640,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-8',
    employee_name: 'Elena Ruiz',
    balance_minutes: -120,  // -2h
    accrued_minutes: 2280,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
  {
    employee_id: 'emp-10',
    employee_name: 'Marta García',
    balance_minutes: 360,   // +6h
    accrued_minutes: 2760,
    consumed_minutes: 2400,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
  },
]

export const MOCK_HOUR_BANK_ENTRIES: HourBankEntry[] = [
  // Carlos Martínez
  {
    id: 'hbe-1',
    employee_id: 'emp-1',
    date: '2026-03-03',
    type: 'accrual',
    minutes: 90,
    notes: 'Horas extra cierre sprint',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-2',
    employee_id: 'emp-1',
    date: '2026-03-10',
    type: 'accrual',
    minutes: 120,
    notes: 'Despliegue en producción',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-3',
    employee_id: 'emp-1',
    date: '2026-03-17',
    type: 'compensation',
    minutes: -240,
    notes: 'Tarde libre viernes',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-4',
    employee_id: 'emp-1',
    date: '2026-03-24',
    type: 'accrual',
    minutes: 150,
    notes: 'Guardia fin de semana',
    approved_by: 'Manager',
  },
  // Laura Sánchez
  {
    id: 'hbe-5',
    employee_id: 'emp-2',
    date: '2026-03-05',
    type: 'accrual',
    minutes: 60,
    notes: 'Entrevistas candidatos extra',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-6',
    employee_id: 'emp-2',
    date: '2026-03-12',
    type: 'accrual',
    minutes: 90,
    notes: 'Onboarding sesión tardía',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-7',
    employee_id: 'emp-2',
    date: '2026-03-20',
    type: 'compensation',
    minutes: -60,
    notes: 'Salida anticipada',
    approved_by: 'Manager',
  },
  // Miguel Fernández
  {
    id: 'hbe-8',
    employee_id: 'emp-3',
    date: '2026-03-04',
    type: 'accrual',
    minutes: 30,
    notes: 'Reunión externa tardía',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-9',
    employee_id: 'emp-3',
    date: '2026-03-11',
    type: 'compensation',
    minutes: -240,
    notes: 'Día compensación acordada',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-10',
    employee_id: 'emp-3',
    date: '2026-03-18',
    type: 'adjustment',
    minutes: -90,
    notes: 'Corrección incidencia sistema',
    approved_by: 'Admin',
  },
  // Ana González
  {
    id: 'hbe-11',
    employee_id: 'emp-4',
    date: '2026-03-06',
    type: 'accrual',
    minutes: 180,
    notes: 'Cierre trimestral ventas',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-12',
    employee_id: 'emp-4',
    date: '2026-03-13',
    type: 'accrual',
    minutes: 120,
    notes: 'Evento cliente fuera horario',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-13',
    employee_id: 'emp-4',
    date: '2026-03-21',
    type: 'accrual',
    minutes: 60,
    notes: 'Demo producto',
    approved_by: 'Manager',
  },
  // Javier Rodríguez
  {
    id: 'hbe-14',
    employee_id: 'emp-5',
    date: '2026-03-03',
    type: 'compensation',
    minutes: -480,
    notes: 'Día libre acordado',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-15',
    employee_id: 'emp-5',
    date: '2026-03-14',
    type: 'adjustment',
    minutes: -120,
    notes: 'Ajuste por retrasos acumulados',
    approved_by: 'Admin',
  },
  // Sofía Moreno
  {
    id: 'hbe-16',
    employee_id: 'emp-6',
    date: '2026-03-07',
    type: 'accrual',
    minutes: 90,
    notes: 'Bug crítico producción',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-17',
    employee_id: 'emp-6',
    date: '2026-03-19',
    type: 'accrual',
    minutes: 150,
    notes: 'Migración base de datos',
    approved_by: 'Manager',
  },
  // Elena Ruiz
  {
    id: 'hbe-18',
    employee_id: 'emp-8',
    date: '2026-03-09',
    type: 'compensation',
    minutes: -180,
    notes: 'Tardes recuperadas',
    approved_by: 'Manager',
  },
  {
    id: 'hbe-19',
    employee_id: 'emp-8',
    date: '2026-03-23',
    type: 'accrual',
    minutes: 60,
    notes: 'Lanzamiento campaña',
    approved_by: 'Manager',
  },
  // Marta García
  {
    id: 'hbe-20',
    employee_id: 'emp-10',
    date: '2026-03-08',
    type: 'accrual',
    minutes: 360,
    notes: 'Auditoría fin de mes',
    approved_by: 'Manager',
  },
]
