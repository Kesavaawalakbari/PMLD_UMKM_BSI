import { test, expect } from '@playwright/test';

/**
 * Landing Page Tests
 * Tests the main landing page (landingpage.html)
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/landingpage.html');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BSI UMKM/);
  });

  test('should display navbar with logo', async ({ page }) => {
    const logo = page.locator('.nav-logo img');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('alt', /BSI UMKM Centre/i);
  });

  test('should have navigation menu buttons', async ({ page }) => {
    await expect(page.locator('.nav-btn:has-text("Tentang Kami")')).toBeVisible();
    await expect(page.locator('.nav-btn:has-text("Produk")')).toBeVisible();
    await expect(page.locator('a.nav-btn:has-text("FAQ")')).toBeVisible();
  });

  test('should have login button in navbar', async ({ page }) => {
    const loginBtn = page.locator('.btn-login-nav');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toHaveText('Login');
  });

  test('should display decorative SVG shapes', async ({ page }) => {
    await expect(page.locator('.shape-right-up')).toBeVisible();
    await expect(page.locator('.shape-left-down')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('should navigate to login page when clicking login button', async ({ page }) => {
    await page.click('.btn-login-nav');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('should navigate to FAQ page when clicking FAQ link', async ({ page }) => {
    await page.click('a.nav-btn:has-text("FAQ")');
    await expect(page).toHaveURL(/faq\.html/);
  });

  test('should have BSI brand colors', async ({ page }) => {
    // Check if primary teal color (#00A39D) is used
    const shapeRightUp = page.locator('.shape-right-up path');
    await expect(shapeRightUp).toHaveAttribute('fill', '#00A39D');
    
    // Check if secondary orange color (#F8AD3C) is used
    const shapeLeftDown = page.locator('.shape-left-down path');
    await expect(shapeLeftDown).toHaveAttribute('fill', '#F8AD3C');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.hero')).toBeVisible();
  });
});
