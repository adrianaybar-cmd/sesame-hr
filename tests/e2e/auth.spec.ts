import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test('login de admin redirige a dashboard', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading')).toContainText(/sesame|iniciar sesión/i)
    await page.getByLabel('Email').fill('admin@sesame.hr')
    await page.getByLabel('Contraseña').fill('password')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('login de employee redirige a fichajes', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('employee@sesame.hr')
    await page.getByLabel('Contraseña').fill('password')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await expect(page).toHaveURL('/employee/signings')
  })

  test('credenciales incorrectas muestra error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('wrong@email.com')
    await page.getByLabel('Contraseña').fill('wrongpass')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('ruta protegida sin sesión redirige a login', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('admin no puede acceder a rutas employee', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@sesame.hr')
    await page.getByLabel('Contraseña').fill('password')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await page.goto('/employee/signings')
    await expect(page).toHaveURL('/admin/dashboard')
  })
})
