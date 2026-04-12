import { test, expect } from '@playwright/test'
import path from 'path'

test.use({ storageState: path.join(__dirname, '../.auth/admin.json') })

test.describe('Dashboard Admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard')
  })

  test('muestra los 4 KPI widgets', async ({ page }) => {
    const widgets = page.locator('[data-testid="kpi-widget"], .card').first()
    await expect(widgets).toBeVisible()
  })

  test('sidebar admin está visible con secciones', async ({ page }) => {
    await expect(page.getByText('TIEMPO')).toBeVisible()
    await expect(page.getByText('PERSONAS')).toBeVisible()
    await expect(page.getByText('TALENTO')).toBeVisible()
  })

  test('navegación a empleados funciona', async ({ page }) => {
    await page.getByRole('link', { name: /empleados/i }).first().click()
    await expect(page).toHaveURL('/admin/employees')
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('navegación a fichajes funciona', async ({ page }) => {
    await page.getByRole('link', { name: /fichajes/i }).first().click()
    await expect(page).toHaveURL('/admin/time')
  })
})
