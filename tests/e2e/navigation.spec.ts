import { test, expect } from '@playwright/test'
import path from 'path'

const adminAuth = path.join(__dirname, '../.auth/admin.json')

test.use({ storageState: adminAuth })

test.describe('Navegación Admin', () => {
  const adminRoutes = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/time', label: 'Fichajes' },
    { path: '/admin/absences', label: 'Ausencias' },
    { path: '/admin/employees', label: 'Empleados' },
    { path: '/admin/recruitment', label: 'Reclutamiento' },
    { path: '/admin/evaluations', label: 'Evaluaciones' },
    { path: '/admin/objectives', label: 'Objetivos' },
    { path: '/admin/payroll', label: 'Nóminas' },
    { path: '/admin/reports', label: 'Reportes' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/marketplace', label: 'Marketplace' },
    { path: '/admin/settings/company', label: 'Config Empresa' },
  ]

  for (const route of adminRoutes) {
    test(`${route.label} carga sin errores`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', err => errors.push(err.message))
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')
      expect(errors).toHaveLength(0)
      await expect(page.getByRole('main')).toBeVisible()
    })
  }
})
