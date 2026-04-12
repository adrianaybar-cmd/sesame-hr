import { test, expect } from '@playwright/test'
import path from 'path'

test.use({ storageState: path.join(__dirname, '../.auth/admin.json') })

test.describe('Gestión de Empleados', () => {
  test('lista de empleados carga correctamente', async ({ page }) => {
    await page.goto('/admin/employees')
    await expect(page.getByRole('table')).toBeVisible()
    const rows = page.getByRole('row')
    await expect(rows).toHaveCount(2) // header + al menos 1 empleado
  })

  test('búsqueda de empleados funciona', async ({ page }) => {
    await page.goto('/admin/employees')
    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill('Carlos')
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('botón añadir empleado está visible', async ({ page }) => {
    await page.goto('/admin/employees')
    await expect(page.getByRole('button', { name: /añadir|nuevo empleado/i })).toBeVisible()
  })

  test('perfil de empleado carga con tabs', async ({ page }) => {
    await page.goto('/admin/employees')
    // Click primer empleado en la tabla
    await page.getByRole('link', { name: /ver|perfil/i }).first().click()
    await expect(page.getByRole('tab', { name: /información/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /contrato/i })).toBeVisible()
  })
})
