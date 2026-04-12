import { test, expect } from '@playwright/test'
import path from 'path'

test.use({ storageState: path.join(__dirname, '../.auth/admin.json') })

test.describe('Control Horario Admin', () => {
  test('vista Gantt de fichajes carga', async ({ page }) => {
    await page.goto('/admin/time')
    await expect(page.getByText(/gantt|fichajes/i)).toBeVisible()
  })

  test('página de incidencias carga', async ({ page }) => {
    await page.goto('/admin/time/incidences')
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('horarios page carga', async ({ page }) => {
    await page.goto('/admin/time/schedules')
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('bolsa de horas carga', async ({ page }) => {
    await page.goto('/admin/time/hour-bank')
    await expect(page.getByRole('table')).toBeVisible()
  })

  test("who's in carga", async ({ page }) => {
    await page.goto('/admin/time/whos-in')
    await expect(page.getByRole('heading')).toBeVisible()
  })
})
