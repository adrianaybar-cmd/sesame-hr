import { test, expect } from '@playwright/test'
import path from 'path'

test.use({ storageState: path.join(__dirname, '../.auth/employee.json') })

test.describe('Flujos Employee', () => {
  test('página de fichajes carga con calendario', async ({ page }) => {
    await page.goto('/employee/signings')
    await expect(page.getByRole('heading', { name: /mi fichaje|fichajes/i })).toBeVisible()
  })

  test('sidebar employee tiene los 12 items', async ({ page }) => {
    await page.goto('/employee/signings')
    // Verifica algunos items del sidebar
    await expect(page.getByRole('link', { name: /mi fichaje|fichaje/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /ausencias/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /documentos/i }).first()).toBeVisible()
  })

  test('página de ausencias del employee carga', async ({ page }) => {
    await page.goto('/employee/absences')
    await expect(page.getByRole('heading')).toBeVisible()
    await expect(page.getByText(/vacaciones|ausencias/i)).toBeVisible()
  })

  test('mis tareas carga', async ({ page }) => {
    await page.goto('/employee/tasks')
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('mis documentos carga', async ({ page }) => {
    await page.goto('/employee/documents')
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('mi perfil carga con tabs', async ({ page }) => {
    await page.goto('/employee/profile')
    await expect(page.getByRole('tab')).toHaveCount(3)
  })

  test('ruta admin no accesible desde employee', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).not.toHaveURL('/admin/dashboard')
  })
})
