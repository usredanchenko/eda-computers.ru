import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/EDA Computers/);
    
    // Check if main elements are present
    await expect(page.locator('h1')).toContainText('EDA');
    await expect(page.locator('h1')).toContainText('Computers');
    
    // Check navigation links
    await expect(page.locator('a[href="/"]')).toBeVisible();
    await expect(page.locator('a[href="/builds"]')).toBeVisible();
    await expect(page.locator('a[href="/about"]')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.locator('text=Открыть конструктор ПК')).toBeVisible();
    await expect(page.locator('text=Готовые сборки')).toBeVisible();
  });

  test('should navigate to constructor page', async ({ page }) => {
    await page.goto('/');
    
    // Click on constructor button
    await page.click('text=Открыть конструктор ПК');
    
    // Should navigate to constructor page
    await expect(page).toHaveURL(/.*constructor/);
  });

  test('should navigate to builds page', async ({ page }) => {
    await page.goto('/');
    
    // Click on builds button
    await page.click('text=Готовые сборки');
    
    // Should navigate to builds page
    await expect(page).toHaveURL(/.*builds/);
  });

  test('should show reviews carousel', async ({ page }) => {
    await page.goto('/');
    
    // Check if reviews section is present
    await expect(page.locator('[role="region"][aria-label="Карусель отзывов"]')).toBeVisible();
    
    // Check if at least one review is visible
    await expect(page.locator('.review-card')).toHaveCount(1);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    await expect(page.locator('button[aria-label="Открыть меню"]')).toBeVisible();
    
    // Check if desktop navigation is hidden
    await expect(page.locator('nav.hidden.md\\:flex')).toBeVisible();
  });
});

