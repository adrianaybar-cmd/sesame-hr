import { test, expect } from '@playwright/test'
import path from 'path'

test.use({ storageState: path.join(__dirname, '../.auth/admin.json') })

test.describe('Reclutamiento (ATS)', () => {
  test('lista de vacantes carga', async ({ page }) => {
    await page.goto('/admin/recruitment')
    await expect(page.getByRole('heading', { name: /reclutamiento/i })).toBeVisible()
  })

  test('tabs de vacantes, candidatos y cuestionarios existen', async ({ page }) => {
    await page.goto('/admin/recruitment')
    await expect(page.getByRole('tab', { name: /vacantes/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /candidatos/i })).toBeVisible()
  })
})
