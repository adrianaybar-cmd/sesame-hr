// Simple in-memory rate limiter (para producción usar Redis)
interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  windowMs: number  // ventana en ms
  max: number       // máximo de requests
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

export function rateLimit(config: RateLimitConfig) {
  return function check(identifier: string): RateLimitResult {
    const now = Date.now()
    const entry = store.get(identifier)

    if (!entry || entry.resetAt < now) {
      store.set(identifier, { count: 1, resetAt: now + config.windowMs })
      return {
        success: true,
        limit: config.max,
        remaining: config.max - 1,
        reset: new Date(now + config.windowMs),
      }
    }

    if (entry.count >= config.max) {
      return {
        success: false,
        limit: config.max,
        remaining: 0,
        reset: new Date(entry.resetAt),
      }
    }

    entry.count++
    return {
      success: true,
      limit: config.max,
      remaining: config.max - entry.count,
      reset: new Date(entry.resetAt),
    }
  }
}

// Limiters preconfigurados
export const loginRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 })   // 5 intentos / 15min
export const apiRateLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 })          // 100 req / min
export const uploadRateLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 })        // 10 uploads / min
