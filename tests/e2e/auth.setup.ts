import { test as setup, expect } from '@playwright/test'
import path from 'path'

const adminAuthFile = path.join(__dirname, '../.auth/admin.json')
const employeeAuthFile = path.join(__dirname, '../.auth/employee.json')

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@sesame.hr')
  await page.getByLabel('Contraseña').fill('password')
  await page.getByRole('button', { name: /iniciar sesión/i }).click()
  await page.waitForURL('/admin/dashboard')
  await expect(page).toHaveURL('/admin/dashboard')
  await page.context().storageState({ path: adminAuthFile })
})

setup('authenticate as employee', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('employee@sesame.hr')
  await page.getByLabel('Contraseña').fill('password')
  await page.getByRole('button', { name: /iniciar sesión/i }).click()
  await page.waitForURL('/employee/signings')
  await page.context().storageState({ path: employeeAuthFile })
})
