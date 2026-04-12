import { describe, it, expect } from 'vitest'
import {
  LoginSchema,
  EmployeeCreateSchema,
  AbsenceRequestSchema,
  ExpenseSchema,
  TaskSchema,
  sanitizeString,
} from '@/lib/security/schemas'

describe('LoginSchema', () => {
  it('valida credenciales correctas', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza contraseña corta (menos de 6 caracteres)', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza contraseña vacía', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })

  it('convierte el email a minúsculas', () => {
    const result = LoginSchema.safeParse({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  it('rechaza email sin dominio', () => {
    const result = LoginSchema.safeParse({
      email: 'test@',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})

describe('AbsenceRequestSchema', () => {
  it('valida solicitud correcta', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2026-05-01',
      end_date: '2026-05-05',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza fecha fin anterior a inicio', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2026-05-10',
      end_date: '2026-05-01',
    })
    expect(result.success).toBe(false)
  })

  it('acepta misma fecha inicio y fin', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2026-05-01',
      end_date: '2026-05-01',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza absence_type_id que no es UUID', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: 'not-a-uuid',
      start_date: '2026-05-01',
      end_date: '2026-05-05',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza fechas con formato incorrecto', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '01-05-2026',
      end_date: '05-05-2026',
    })
    expect(result.success).toBe(false)
  })

  it('acepta notas opcionales', () => {
    const result = AbsenceRequestSchema.safeParse({
      absence_type_id: '123e4567-e89b-12d3-a456-426614174000',
      start_date: '2026-05-01',
      end_date: '2026-05-05',
      notes: 'Vacaciones de verano',
    })
    expect(result.success).toBe(true)
  })
})

describe('ExpenseSchema', () => {
  it('valida gasto correcto', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'meals',
      description: 'Comida de negocios',
      amount: 45.50,
      currency: 'EUR',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza importe negativo', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'meals',
      description: 'Test',
      amount: -10,
      currency: 'EUR',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza importe cero', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'meals',
      description: 'Test',
      amount: 0,
      currency: 'EUR',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza categoría inválida', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'invalid_category',
      description: 'Test',
      amount: 10,
      currency: 'EUR',
    })
    expect(result.success).toBe(false)
  })

  it('acepta todas las categorías válidas', () => {
    const categories = ['travel', 'accommodation', 'meals', 'transport', 'office_supplies', 'training', 'entertainment', 'other']
    for (const category of categories) {
      const result = ExpenseSchema.safeParse({
        date: '2026-04-12',
        category,
        description: 'Test expense',
        amount: 10,
        currency: 'EUR',
      })
      expect(result.success).toBe(true)
    }
  })

  it('rechaza importe mayor al máximo (50000)', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'meals',
      description: 'Test',
      amount: 99999,
      currency: 'EUR',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza descripción con HTML', () => {
    const result = ExpenseSchema.safeParse({
      date: '2026-04-12',
      category: 'meals',
      description: '<script>alert("xss")</script>',
      amount: 10,
      currency: 'EUR',
    })
    expect(result.success).toBe(false)
  })
})

describe('sanitizeString()', () => {
  it('escapa caracteres HTML', () => {
    expect(sanitizeString('<script>')).toBe('&lt;script&gt;')
  })

  it('escapa ampersand', () => {
    expect(sanitizeString('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('escapa comillas dobles', () => {
    expect(sanitizeString('"hola"')).toBe('&quot;hola&quot;')
  })

  it('escapa comillas simples', () => {
    expect(sanitizeString("it's")).toBe('it&#x27;s')
  })

  it('hace trim del string', () => {
    expect(sanitizeString('  hola  ')).toBe('hola')
  })

  it('no modifica texto normal', () => {
    expect(sanitizeString('Hola mundo')).toBe('Hola mundo')
  })
})
