# OWASP Top 10 — Sesame HR Security Checklist

## A01: Broken Access Control ✅
- [x] RBAC implementado con verificación en cada ruta
- [x] Middleware verifica roles antes de acceder a /admin/*
- [x] Server-side permission checks en lib/rbac/server.ts
- [x] Tokens JWT con expiración configurada
- [ ] TODO: Implementar verificación granular por recurso (actualmente por módulo)

## A02: Cryptographic Failures ✅
- [x] HTTPS enforced en producción (HSTS header)
- [x] JWT con AUTH_SECRET en variables de entorno
- [x] Contraseñas nunca almacenadas en texto plano (NextAuth)
- [x] Cookies de sesión con httpOnly + Secure
- [ ] TODO: Implementar rotación de tokens JWT

## A03: Injection ✅
- [x] Validación con Zod en todos los formularios
- [x] Sanitización HTML en lib/security/schemas.ts
- [x] Parameterized queries cuando se integre la DB real
- [ ] TODO: SQL injection tests cuando se implemente la DB

## A04: Insecure Design ✅
- [x] Principio de mínimo privilegio en RBAC
- [x] Separación de vistas admin/employee
- [x] Feature flags para controlar acceso a módulos

## A05: Security Misconfiguration ✅
- [x] Security headers implementados (CSP, HSTS, X-Frame-Options...)
- [x] Variables de entorno para secrets (no hardcoded)
- [x] .env.local en .gitignore
- [ ] TODO: Revisar configuración de producción antes del deploy

## A06: Vulnerable Components ⚠️
- [ ] TODO: npm audit en CI/CD pipeline
- [ ] TODO: Dependabot configurado en GitHub
- [x] Versiones de dependencias fijadas en package.json

## A07: Authentication Failures ✅
- [x] Rate limiting en endpoint de login (5 intentos / 15min)
- [x] Sesiones JWT con expiración
- [x] Redirect al login si sesión expirada
- [ ] TODO: Implementar 2FA para admins
- [ ] TODO: Bloqueo de cuenta tras N intentos fallidos

## A08: Software and Data Integrity ✅
- [x] package-lock.json para deps deterministas
- [ ] TODO: Verificar integridad de assets con SRI

## A09: Security Logging ⚠️
- [ ] TODO: Implementar audit log de acciones críticas
- [ ] TODO: Alertas para intentos de acceso sospechosos
- [ ] TODO: Log de cambios en nóminas y datos financieros

## A10: SSRF ✅
- [x] No hay requests server-side a URLs externas controladas por usuario
- [x] next.config.ts con allowedOrigins para imágenes
