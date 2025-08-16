import { test, expect } from '@playwright/test'

test.describe('Auth and RBAC', () => {
  test('guest visiting /admin is redirected to login with redirect param', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fadmin/)
    await expect(page.getByRole('heading', { name: 'Вход в систему' })).toBeVisible()
  })

  test('guest visiting /account is redirected to login with redirect param', async ({ page }) => {
    await page.goto('http://localhost:3000/account')
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Faccount/)
    await expect(page.getByRole('heading', { name: 'Вход в систему' })).toBeVisible()
  })

  test('admin login redirects to /admin', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@eda.com')
    await page.getByLabel('Пароль').fill('password')
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page).toHaveURL(/\/admin/) 
    await expect(page.getByRole('heading', { name: 'Админ-панель' })).toBeVisible()
  })

  test('user login redirects to /account', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('ivan@example.com')
    await page.getByLabel('Пароль').fill('password')
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page).toHaveURL(/\/account/)
    await expect(page.getByRole('heading', { name: 'Личный кабинет' })).toBeVisible()
  })
})


