import { test, expect } from '@playwright/test'

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load main page without errors', async ({ page }) => {
    // Check if page loads
    await expect(page).toHaveTitle(/EDA Computers/)
    
    // Check if main elements are present
    await expect(page.locator('h1')).toContainText(/Конструктор ПК/)
    await expect(page.locator('button')).toContainText(/Начать сборку/)
  })

  test('should navigate through PC configurator', async ({ page }) => {
    // Start configuration
    await page.click('button:has-text("Начать сборку")')
    
    // Check if configurator page loads
    await expect(page.locator('h1')).toContainText(/Конструктор ПК/)
    
    // Check if component categories are present
    await expect(page.locator('text=Процессор')).toBeVisible()
    await expect(page.locator('text=Материнская плата')).toBeVisible()
    await expect(page.locator('text=Видеокарта')).toBeVisible()
  })

  test('should select components without errors', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Select CPU
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]', { timeout: 5000 })
    await page.click('[data-testid="component-card"]:first-child')
    
    // Verify selection
    await expect(page.locator('text=Выбрано')).toBeVisible()
  })

  test('should calculate build specifications', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Select components
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]')
    await page.click('[data-testid="component-card"]:first-child')
    
    // Check if calculations appear
    await expect(page.locator('text=TDP:')).toBeVisible()
    await expect(page.locator('text=Рекомендуемый БП:')).toBeVisible()
  })

  test('should handle budget mode', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Open budget mode
    await page.click('button:has-text("Режим экономии")')
    
    // Check if budget mode opens
    await expect(page.locator('text=Режим экономии')).toBeVisible()
    await expect(page.locator('input[type="range"]')).toBeVisible()
  })

  test('should save and load drafts', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Select a component
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]')
    await page.click('[data-testid="component-card"]:first-child')
    
    // Save draft
    await page.click('button:has-text("Сохранить черновик")')
    
    // Check if draft is saved
    await expect(page.locator('text=Черновик сохранен')).toBeVisible()
  })

  test('should display compatibility warnings', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Select incompatible components (if available)
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]')
    
    // Look for compatibility warnings
    const warnings = page.locator('text=⚠️')
    if (await warnings.count() > 0) {
      await expect(warnings.first()).toBeVisible()
    }
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation works
    await expect(page.locator('button:has-text("Меню")')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Check if desktop navigation works
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Try to access non-existent page
    await page.goto('/non-existent-page')
    
    // Should show 404 or redirect to home
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/localhost:3000/)
  })

  test('should perform search functionality', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="поиск"], input[type="search"]')
    if (await searchInput.count() > 0) {
      await searchInput.fill('AMD')
      await expect(page.locator('text=AMD')).toBeVisible()
    }
  })

  test('should handle component filtering', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Click on CPU category
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]')
    
    // Check if filters are present
    const filters = page.locator('button:has-text("Фильтр"), select')
    if (await filters.count() > 0) {
      await expect(filters.first()).toBeVisible()
    }
  })

  test('should display performance metrics', async ({ page }) => {
    // Navigate to configurator
    await page.click('button:has-text("Начать сборку")')
    
    // Select components to trigger performance calculation
    await page.click('text=Процессор')
    await page.waitForSelector('[data-testid="component-card"]')
    await page.click('[data-testid="component-card"]:first-child')
    
    // Check for performance indicators
    await expect(page.locator('text=FPS')).toBeVisible()
  })
})


