import type { ClockIn, ClockIncidence, WorkSchedule, ClockEntry, WhosInStatus, PersonalStats } from '@/lib/types/time'

// Week of 2026-04-06 (Monday) to 2026-04-12 (Sunday)
const WEEK_DATES = ['2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10', '2026-04-11', '2026-04-12']

function makeEntries(date: string, inTime: string, outTime: string, breakStart?: string, breakEnd?: string): ClockEntry[] {
  const entries: ClockEntry[] = [
    {
      id: `entry-in-${date}`,
      type: 'in',
      timestamp: `${date}T${inTime}:00.000Z`,
      device: 'web',
      clocking_type: 'office',
    },
  ]
  if (breakStart && breakEnd) {
    entries.push(
      {
        id: `entry-bs-${date}`,
        type: 'break_start',
        timestamp: `${date}T${breakStart}:00.000Z`,
        device: 'web',
        clocking_type: 'office',
      },
      {
        id: `entry-be-${date}`,
        type: 'break_end',
        timestamp: `${date}T${breakEnd}:00.000Z`,
        device: 'web',
        clocking_type: 'office',
      }
    )
  }
  entries.push({
    id: `entry-out-${date}`,
    type: 'out',
    timestamp: `${date}T${outTime}:00.000Z`,
    device: 'web',
    clocking_type: 'office',
  })
  return entries
}

export const MOCK_CLOCK_INS: ClockIn[] = [
  // Carlos Martínez - Tecnología
  {
    id: 'ci-1',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department_name: 'Tecnología',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '08:57', '17:03', '13:30', '14:30'),
    total_minutes: 486,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-2',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department_name: 'Tecnología',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '09:05', '17:55', '13:45', '14:45'),
    total_minutes: 525,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-3',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department_name: 'Tecnología',
    date: WEEK_DATES[2],
    entries: makeEntries(WEEK_DATES[2], '08:50', '17:00', '13:00', '14:00'),
    total_minutes: 490,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-4',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department_name: 'Tecnología',
    date: WEEK_DATES[3],
    entries: makeEntries(WEEK_DATES[3], '09:10', '15:30', '13:00', '13:45'),
    total_minutes: 385,
    expected_minutes: 480,
    status: 'out',
    incidence: 'Salida anticipada',
  },
  {
    id: 'ci-5',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department_name: 'Tecnología',
    date: WEEK_DATES[4],
    entries: [
      {
        id: 'entry-in-ci-5',
        type: 'in' as const,
        timestamp: `${WEEK_DATES[4]}T09:02:00.000Z`,
        device: 'web' as const,
        clocking_type: 'office' as const,
      },
      {
        id: 'entry-bs-ci-5',
        type: 'break_start' as const,
        timestamp: `${WEEK_DATES[4]}T14:00:00.000Z`,
        device: 'web' as const,
        clocking_type: 'office' as const,
      },
      {
        id: 'entry-be-ci-5',
        type: 'break_end' as const,
        timestamp: `${WEEK_DATES[4]}T14:30:00.000Z`,
        device: 'web' as const,
        clocking_type: 'office' as const,
      },
    ],
    total_minutes: 328,
    expected_minutes: 480,
    status: 'working',
  },

  // Laura Sánchez - RRHH
  {
    id: 'ci-6',
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    department_name: 'Recursos Humanos',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '09:00', '18:00', '14:00', '15:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-7',
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    department_name: 'Recursos Humanos',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '08:45', '18:10', '14:00', '15:00'),
    total_minutes: 505,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-8',
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    department_name: 'Recursos Humanos',
    date: WEEK_DATES[2],
    entries: makeEntries(WEEK_DATES[2], '09:00', '18:00', '14:00', '15:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-9',
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    department_name: 'Recursos Humanos',
    date: WEEK_DATES[3],
    entries: [
      {
        id: 'entry-in-ci-9',
        type: 'in' as const,
        timestamp: `${WEEK_DATES[3]}T09:00:00.000Z`,
        device: 'web' as const,
        clocking_type: 'office' as const,
      },
    ],
    total_minutes: 0,
    expected_minutes: 480,
    status: 'out',
    incidence: 'Falta salida',
  },

  // Miguel Fernández - Marketing
  {
    id: 'ci-10',
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    department_name: 'Marketing',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '10:00', '19:00', '14:00', '15:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-11',
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    department_name: 'Marketing',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '10:05', '19:10', '14:00', '15:00'),
    total_minutes: 485,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-12',
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    department_name: 'Marketing',
    date: WEEK_DATES[2],
    entries: makeEntries(WEEK_DATES[2], '09:50', '18:55', '14:00', '15:00'),
    total_minutes: 485,
    expected_minutes: 480,
    status: 'out',
  },

  // Ana González - Ventas
  {
    id: 'ci-13',
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    department_name: 'Ventas',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '08:30', '17:30', '13:00', '14:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-14',
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    department_name: 'Ventas',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '08:25', '17:45', '13:00', '14:00'),
    total_minutes: 500,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-15',
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    department_name: 'Ventas',
    date: WEEK_DATES[2],
    entries: makeEntries(WEEK_DATES[2], '08:30', '17:30', '13:00', '14:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },

  // Javier Rodríguez - Finanzas
  {
    id: 'ci-16',
    employee_id: 'emp-5',
    employee_name: 'Javier Rodríguez',
    department_name: 'Finanzas',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '09:15', '18:15', '14:00', '15:00'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-17',
    employee_id: 'emp-5',
    employee_name: 'Javier Rodríguez',
    department_name: 'Finanzas',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '09:00', '18:30', '14:00', '15:00'),
    total_minutes: 510,
    expected_minutes: 480,
    status: 'out',
  },

  // Sofía Moreno - Tecnología
  {
    id: 'ci-18',
    employee_id: 'emp-6',
    employee_name: 'Sofía Moreno',
    department_name: 'Tecnología',
    date: WEEK_DATES[0],
    entries: makeEntries(WEEK_DATES[0], '09:00', '17:00', '13:30', '14:30'),
    total_minutes: 480,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-19',
    employee_id: 'emp-6',
    employee_name: 'Sofía Moreno',
    department_name: 'Tecnología',
    date: WEEK_DATES[1],
    entries: makeEntries(WEEK_DATES[1], '09:05', '17:10', '13:30', '14:30'),
    total_minutes: 485,
    expected_minutes: 480,
    status: 'out',
  },
  {
    id: 'ci-20',
    employee_id: 'emp-6',
    employee_name: 'Sofía Moreno',
    department_name: 'Tecnología',
    date: WEEK_DATES[4],
    entries: [
      {
        id: 'entry-in-ci-20',
        type: 'in' as const,
        timestamp: `${WEEK_DATES[4]}T09:02:00.000Z`,
        device: 'mobile' as const,
        clocking_type: 'remote' as const,
      },
      {
        id: 'entry-bs-ci-20',
        type: 'break_start' as const,
        timestamp: `${WEEK_DATES[4]}T13:30:00.000Z`,
        device: 'mobile' as const,
        clocking_type: 'remote' as const,
      },
    ],
    total_minutes: 268,
    expected_minutes: 480,
    status: 'break',
  },
]

export const MOCK_INCIDENCES: ClockIncidence[] = [
  {
    id: 'inc-1',
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    date: WEEK_DATES[3],
    type: 'missing_exit',
    status: 'pending',
    requested_entry: `${WEEK_DATES[3]}T09:00:00.000Z`,
    notes: 'Olvidé fichar la salida. Salí a las 18:00.',
  },
  {
    id: 'inc-2',
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    date: WEEK_DATES[3],
    type: 'retroactive_request',
    status: 'pending',
    requested_entry: `${WEEK_DATES[3]}T09:10:00.000Z`,
    requested_exit: `${WEEK_DATES[3]}T17:30:00.000Z`,
    notes: 'Necesito corregir la hora de salida, me fui a las 17:30 no a las 15:30.',
  },
  {
    id: 'inc-3',
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    date: '2026-04-04',
    type: 'anomaly',
    status: 'pending',
    notes: 'El sistema registró una entrada duplicada.',
  },
  {
    id: 'inc-4',
    employee_id: 'emp-5',
    employee_name: 'Javier Rodríguez',
    date: WEEK_DATES[1],
    type: 'overtime',
    status: 'pending',
    requested_exit: `${WEEK_DATES[1]}T20:30:00.000Z`,
    notes: 'Trabajé hasta las 20:30 para cerrar el cierre mensual.',
  },
  {
    id: 'inc-5',
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    date: '2026-04-03',
    type: 'retroactive_request',
    status: 'pending',
    requested_entry: `2026-04-03T08:30:00.000Z`,
    requested_exit: `2026-04-03T17:30:00.000Z`,
    notes: 'Trabajé el viernes pero no pude fichar porque el sistema estaba caído.',
  },
]

export const MOCK_SCHEDULES: WorkSchedule[] = [
  {
    id: 'sched-1',
    name: 'Jornada de Mañana',
    type: 'fixed',
    monday: { start: '07:00', end: '15:00', break_start: '10:00', break_end: '10:30', is_workday: true },
    tuesday: { start: '07:00', end: '15:00', break_start: '10:00', break_end: '10:30', is_workday: true },
    wednesday: { start: '07:00', end: '15:00', break_start: '10:00', break_end: '10:30', is_workday: true },
    thursday: { start: '07:00', end: '15:00', break_start: '10:00', break_end: '10:30', is_workday: true },
    friday: { start: '07:00', end: '15:00', break_start: '10:00', break_end: '10:30', is_workday: true },
    saturday: { start: '00:00', end: '00:00', is_workday: false },
    sunday: { start: '00:00', end: '00:00', is_workday: false },
    total_weekly_hours: 37.5,
  },
  {
    id: 'sched-2',
    name: 'Jornada de Tarde',
    type: 'fixed',
    monday: { start: '15:00', end: '23:00', break_start: '19:00', break_end: '19:30', is_workday: true },
    tuesday: { start: '15:00', end: '23:00', break_start: '19:00', break_end: '19:30', is_workday: true },
    wednesday: { start: '15:00', end: '23:00', break_start: '19:00', break_end: '19:30', is_workday: true },
    thursday: { start: '15:00', end: '23:00', break_start: '19:00', break_end: '19:30', is_workday: true },
    friday: { start: '15:00', end: '23:00', break_start: '19:00', break_end: '19:30', is_workday: true },
    saturday: { start: '00:00', end: '00:00', is_workday: false },
    sunday: { start: '00:00', end: '00:00', is_workday: false },
    total_weekly_hours: 37.5,
  },
  {
    id: 'sched-3',
    name: 'Jornada Partida',
    type: 'fixed',
    monday: { start: '09:00', end: '18:00', break_start: '14:00', break_end: '15:00', is_workday: true },
    tuesday: { start: '09:00', end: '18:00', break_start: '14:00', break_end: '15:00', is_workday: true },
    wednesday: { start: '09:00', end: '18:00', break_start: '14:00', break_end: '15:00', is_workday: true },
    thursday: { start: '09:00', end: '18:00', break_start: '14:00', break_end: '15:00', is_workday: true },
    friday: { start: '09:00', end: '15:00', is_workday: true },
    saturday: { start: '00:00', end: '00:00', is_workday: false },
    sunday: { start: '00:00', end: '00:00', is_workday: false },
    total_weekly_hours: 40,
  },
  {
    id: 'sched-4',
    name: 'Horario Flexible',
    type: 'flexible',
    monday: { start: '08:00', end: '17:00', break_start: '13:00', break_end: '14:00', is_workday: true },
    tuesday: { start: '08:00', end: '17:00', break_start: '13:00', break_end: '14:00', is_workday: true },
    wednesday: { start: '08:00', end: '17:00', break_start: '13:00', break_end: '14:00', is_workday: true },
    thursday: { start: '08:00', end: '17:00', break_start: '13:00', break_end: '14:00', is_workday: true },
    friday: { start: '08:00', end: '14:00', is_workday: true },
    saturday: { start: '00:00', end: '00:00', is_workday: false },
    sunday: { start: '00:00', end: '00:00', is_workday: false },
    total_weekly_hours: 37.5,
  },
]

// ─── Who's In ─────────────────────────────────────────────────────────────────

export const MOCK_WHOS_IN: WhosInStatus[] = [
  {
    employee_id: 'emp-1',
    employee_name: 'Carlos Martínez',
    department: 'Tecnología',
    status: 'in',
    since: '2026-04-12T07:58:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-2',
    employee_name: 'Laura Sánchez',
    department: 'Recursos Humanos',
    status: 'in',
    since: '2026-04-12T08:05:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-3',
    employee_name: 'Miguel Fernández',
    department: 'Marketing',
    status: 'remote',
    since: '2026-04-12T09:00:00.000Z',
    location: 'Casa',
  },
  {
    employee_id: 'emp-4',
    employee_name: 'Ana González',
    department: 'Ventas',
    status: 'out',
    since: '2026-04-12T17:30:00.000Z',
  },
  {
    employee_id: 'emp-5',
    employee_name: 'Javier Rodríguez',
    department: 'Finanzas',
    status: 'in',
    since: '2026-04-12T08:30:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-6',
    employee_name: 'Sofía Moreno',
    department: 'Tecnología',
    status: 'remote',
    since: '2026-04-12T09:02:00.000Z',
    location: 'Coworking Barcelona',
  },
  {
    employee_id: 'emp-7',
    employee_name: 'Pablo Jiménez',
    department: 'Tecnología',
    status: 'vacation',
  },
  {
    employee_id: 'emp-8',
    employee_name: 'Elena Ruiz',
    department: 'Marketing',
    status: 'in',
    since: '2026-04-12T08:45:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-9',
    employee_name: 'Diego López',
    department: 'Ventas',
    status: 'sick',
  },
  {
    employee_id: 'emp-10',
    employee_name: 'Marta García',
    department: 'Finanzas',
    status: 'in',
    since: '2026-04-12T07:50:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-11',
    employee_name: 'Roberto Díaz',
    department: 'Recursos Humanos',
    status: 'out',
    since: '2026-04-12T16:00:00.000Z',
  },
  {
    employee_id: 'emp-12',
    employee_name: 'Cristina Torres',
    department: 'Marketing',
    status: 'remote',
    since: '2026-04-12T08:55:00.000Z',
    location: 'Casa',
  },
  {
    employee_id: 'emp-13',
    employee_name: 'Andrés Vega',
    department: 'Tecnología',
    status: 'in',
    since: '2026-04-12T09:10:00.000Z',
    location: 'Oficina Central',
  },
  {
    employee_id: 'emp-14',
    employee_name: 'Isabel Morales',
    department: 'Ventas',
    status: 'out',
    since: '2026-04-12T17:00:00.000Z',
  },
  {
    employee_id: 'emp-15',
    employee_name: 'Fernando Castro',
    department: 'Finanzas',
    status: 'vacation',
  },
]

// ─── Personal Statistics ───────────────────────────────────────────────────────

function generateDailyBreakdown(employeeId: string): ReturnType<typeof generateMonthBreakdown> {
  return generateMonthBreakdown(employeeId)
}

function generateMonthBreakdown(employeeId: string) {
  const days: PersonalStats['daily_breakdown'] = []
  const seed = parseInt(employeeId.replace('emp-', ''), 10) || 1
  for (let d = 1; d <= 30; d++) {
    const date = `2026-03-${String(d).padStart(2, '0')}`
    const dayOfWeek = new Date(date).getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      days.push({ date, worked_minutes: 0, expected_minutes: 0, status: 'weekend' })
    } else if (d === 10) {
      days.push({ date, worked_minutes: 0, expected_minutes: 480, status: 'holiday' })
    } else if (d % (7 + seed) === 0) {
      days.push({ date, worked_minutes: 0, expected_minutes: 480, status: 'absent' })
    } else {
      const variance = ((d * seed) % 60) - 20
      const worked = 480 + variance
      days.push({
        date,
        worked_minutes: worked,
        expected_minutes: 480,
        status: worked >= 480 ? 'complete' : 'incomplete',
      })
    }
  }
  return days
}

export const MOCK_PERSONAL_STATS: PersonalStats[] = [
  {
    employee_id: 'emp-1',
    period: 'month',
    worked_hours: 168,
    expected_hours: 160,
    overtime_hours: 8,
    absence_days: 0,
    vacation_days_used: 2,
    vacation_days_remaining: 20,
    punctuality_rate: 95,
    daily_breakdown: generateDailyBreakdown('emp-1'),
  },
  {
    employee_id: 'emp-2',
    period: 'month',
    worked_hours: 162,
    expected_hours: 160,
    overtime_hours: 2,
    absence_days: 1,
    vacation_days_used: 5,
    vacation_days_remaining: 17,
    punctuality_rate: 88,
    daily_breakdown: generateDailyBreakdown('emp-2'),
  },
  {
    employee_id: 'emp-3',
    period: 'month',
    worked_hours: 155,
    expected_hours: 160,
    overtime_hours: 0,
    absence_days: 2,
    vacation_days_used: 3,
    vacation_days_remaining: 19,
    punctuality_rate: 80,
    daily_breakdown: generateDailyBreakdown('emp-3'),
  },
  {
    employee_id: 'emp-4',
    period: 'month',
    worked_hours: 172,
    expected_hours: 160,
    overtime_hours: 12,
    absence_days: 0,
    vacation_days_used: 0,
    vacation_days_remaining: 22,
    punctuality_rate: 98,
    daily_breakdown: generateDailyBreakdown('emp-4'),
  },
  {
    employee_id: 'emp-5',
    period: 'month',
    worked_hours: 150,
    expected_hours: 160,
    overtime_hours: 0,
    absence_days: 3,
    vacation_days_used: 8,
    vacation_days_remaining: 14,
    punctuality_rate: 75,
    daily_breakdown: generateDailyBreakdown('emp-5'),
  },
]
