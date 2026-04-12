import { describe, it, expect } from 'vitest'
import { cn, formatDuration, getInitials, formatFullName, isAddonInstalled, formatDate, formatTime } from '@/lib/utils'

describe('cn()', () => {
  it('combina clases correctamente', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('elimina clases conflictivas de Tailwind', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('maneja valores falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('maneja objetos condicionales', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
  })

  it('devuelve string vacío sin argumentos', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDuration()', () => {
  it('formatea segundos a HH:MM:SS', () => {
    expect(formatDuration(3600)).toBe('01:00:00')
  })

  it('maneja 0 segundos', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('formatea 8 horas', () => {
    expect(formatDuration(28800)).toBe('08:00:00')
  })

  it('formatea horas, minutos y segundos', () => {
    expect(formatDuration(3661)).toBe('01:01:01')
  })

  it('formatea solo segundos', () => {
    expect(formatDuration(45)).toBe('00:00:45')
  })
})

describe('getInitials()', () => {
  it('obtiene iniciales de nombre completo', () => {
    expect(getInitials('Juan García')).toBe('JG')
  })

  it('maneja nombre de una sola palabra', () => {
    expect(getInitials('Juan')).toBe('J')
  })

  it('usa solo las dos primeras palabras', () => {
    expect(getInitials('Juan Carlos García López')).toBe('JC')
  })

  it('convierte a mayúsculas', () => {
    expect(getInitials('juan garcía')).toBe('JG')
  })
})

describe('formatFullName()', () => {
  it('combina nombre y apellido', () => {
    expect(formatFullName('Juan', 'García')).toBe('Juan García')
  })

  it('funciona sin apellido', () => {
    expect(formatFullName('Juan')).toBe('Juan')
  })

  it('maneja apellido undefined', () => {
    expect(formatFullName('Ana', undefined)).toBe('Ana')
  })
})

describe('isAddonInstalled()', () => {
  const installedAddons = ['control_horario', 'tareas', 'ausencias']

  it('devuelve true para addon instalado', () => {
    expect(isAddonInstalled(installedAddons, 'control_horario')).toBe(true)
  })

  it('devuelve false para addon no instalado', () => {
    expect(isAddonInstalled(installedAddons, 'nominas')).toBe(false)
  })

  it('devuelve false con lista vacía', () => {
    expect(isAddonInstalled([], 'control_horario')).toBe(false)
  })
})
