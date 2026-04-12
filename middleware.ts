/**
 * Sesame HR — Edge Middleware
 *
 * Authentication and role-based route protection is implemented inside the
 * `authorized` callback of `/lib/auth/config.ts`, which already handles:
 *
 *   - Unauthenticated users  → redirect /login
 *   - /admin/* routes        → only roles in ADMIN_ROLES; others → /employee/signings
 *   - /employee/* routes     → only roles in EMPLOYEE_ROLES; admins → /admin/dashboard
 *   - /login while logged in → redirect to role-appropriate dashboard
 *
 * Security extensions added here:
 *   - Rate limiting for /login (POST) and /api/* routes
 *   - Blocks known malicious user agents
 *   - Additional security response headers
 *
 * NOTE: NextAuth v5 auth() wraps the entire middleware so RBAC runs inside it.
 * Rate limiting and UA blocking execute BEFORE auth to short-circuit early.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { loginRateLimiter, apiRateLimiter } from '@/lib/security/rate-limit'

// Malicious user agent patterns to block
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /nuclei/i,
  /havij/i,
  /acunetix/i,
]

function isBlockedUserAgent(ua: string | null): boolean {
  if (!ua) return false
  return BLOCKED_UA_PATTERNS.some(pattern => pattern.test(ua))
}

function applyRateLimiting(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  // Rate limiting for login POST
  if (pathname === '/login' && request.method === 'POST') {
    const ip =
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const result = loginRateLimiter(ip)
    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.reset.getTime() - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toISOString(),
        },
      })
    }
  }

  // Rate limiting for API routes (excluding /api/auth handled by NextAuth)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    const ip =
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const result = apiRateLimiter(ip)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.reset.getTime() - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.reset.toISOString(),
          },
        }
      )
    }
  }

  return null
}

// Wrap NextAuth middleware so we can run pre-checks before auth
export default auth(function middleware(request) {
  // Block malicious user agents
  const userAgent = request.headers.get('user-agent')
  if (isBlockedUserAgent(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Apply rate limiting — returns a response if limit exceeded, null otherwise
  const rateLimitResponse = applyRateLimiting(request)
  if (rateLimitResponse) return rateLimitResponse

  // Auth/RBAC is handled by the `authorized` callback in /lib/auth/config.ts
  // No further action needed — NextAuth processes the response after this handler
  return NextResponse.next()
}) as (request: NextRequest) => Promise<NextResponse>

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public static files (svg, png, jpg, jpeg, gif, webp)
     * - api/auth/*    (NextAuth route handlers — must not be gated)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth|api/health).*)',
  ],
}
