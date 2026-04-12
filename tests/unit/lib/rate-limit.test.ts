import { describe, it, expect } from 'vitest'
import { rateLimit } from '@/lib/security/rate-limit'

describe('rateLimit()', () => {
  it('permite requests dentro del límite', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 5 })
    const result = limiter('test-ip-1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('bloquea después de superar el límite', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 3 })
    limiter('test-ip-2')
    limiter('test-ip-2')
    limiter('test-ip-2')
    const result = limiter('test-ip-2') // 4to intento
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('IDs diferentes tienen límites independientes', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 })
    limiter('ip-a-unique')
    limiter('ip-a-unique')
    const blockedA = limiter('ip-a-unique')
    const allowedB = limiter('ip-b-unique')
    expect(blockedA.success).toBe(false)
    expect(allowedB.success).toBe(true)
  })

  it('devuelve fecha de reset correcta', () => {
    const limiter = rateLimit({ windowMs: 5000, max: 10 })
    const result = limiter('test-ip-3-unique')
    expect(result.reset).toBeInstanceOf(Date)
    expect(result.reset.getTime()).toBeGreaterThan(Date.now())
  })

  it('devuelve el límite configurado', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 10 })
    const result = limiter('test-ip-4-unique')
    expect(result.limit).toBe(10)
  })

  it('decrementa remaining con cada llamada', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 5 })
    const id = 'test-ip-decrement'
    const r1 = limiter(id)
    const r2 = limiter(id)
    const r3 = limiter(id)
    expect(r1.remaining).toBe(4)
    expect(r2.remaining).toBe(3)
    expect(r3.remaining).toBe(2)
  })

  it('devuelve remaining 0 cuando se alcanza el límite exacto', () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 })
    const id = 'test-ip-exact'
    limiter(id)
    const last = limiter(id)
    expect(last.remaining).toBe(0)
    expect(last.success).toBe(true)
  })
})
