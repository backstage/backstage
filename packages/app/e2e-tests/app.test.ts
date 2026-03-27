/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Sets the theme mode on the document root element via the `data-theme-mode`
 * attribute, which is Backstage's existing data-attribute convention for
 * light/dark theme switching using CSS custom properties. A brief timeout
 * allows CSS transitions and repaint to settle before any subsequent
 * screenshot capture.
 */
async function setThemeMode(page: Page, mode: 'light' | 'dark') {
  await page.evaluate(themeMode => {
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, mode);
  // Allow CSS custom property transitions to settle
  await page.waitForTimeout(300);
}

/**
 * Helper that signs into the Backstage example app by clicking the guest
 * "Enter" button and waits for the authenticated shell to render. Optionally
 * navigates to a specific path after sign-in.
 */
async function signInAndNavigate(page: Page, targetPath?: string) {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  // Wait for authenticated shell to render
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
  if (targetPath) {
    await page.goto(targetPath);
  }
}

// ---------------------------------------------------------------------------
// Existing smoke test — preserved exactly as-is
// ---------------------------------------------------------------------------

test('App should render the welcome page', async ({ page }) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  // Verify the sidebar navigation is visible after sign-in
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'APIs' })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Visual regression screenshot tests for all redesigned flows
//
// Per AAP Section 0.8.2, every redesigned user flow must be captured
// programmatically via Playwright in both light and dark modes to verify
// component rendering, layout consistency, and theme correctness after the
// MUI-to-shadcn/ui migration.
// ---------------------------------------------------------------------------

// --- Catalog Browsing Flow ---

test('Visual regression: Catalog browsing - light mode', async ({ page }) => {
  await signInAndNavigate(page);
  await page.getByRole('link', { name: 'Catalog' }).click();
  // Wait for catalog page to render
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('catalog-browse-light.png');
});

test('Visual regression: Catalog browsing - dark mode', async ({ page }) => {
  await signInAndNavigate(page);
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('catalog-browse-dark.png');
});

// --- Entity Detail Navigation ---

test('Visual regression: Entity detail - light mode', async ({ page }) => {
  await signInAndNavigate(page);
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.waitForLoadState('networkidle');
  // Click on first entity in the catalog list if available
  const entityLink = page
    .locator('table a, [data-testid="catalog-table"] a')
    .first();
  if (await entityLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await entityLink.click();
    await page.waitForLoadState('networkidle');
  }
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('entity-detail-light.png');
});

test('Visual regression: Entity detail - dark mode', async ({ page }) => {
  await signInAndNavigate(page);
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.waitForLoadState('networkidle');
  const entityLink = page
    .locator('table a, [data-testid="catalog-table"] a')
    .first();
  if (await entityLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await entityLink.click();
    await page.waitForLoadState('networkidle');
  }
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('entity-detail-dark.png');
});

// --- Scaffolder Template Creation ---

test('Visual regression: Scaffolder - light mode', async ({ page }) => {
  await signInAndNavigate(page, '/create');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('scaffolder-light.png');
});

test('Visual regression: Scaffolder - dark mode', async ({ page }) => {
  await signInAndNavigate(page, '/create');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('scaffolder-dark.png');
});

// --- TechDocs Reading ---

test('Visual regression: TechDocs - light mode', async ({ page }) => {
  await signInAndNavigate(page, '/docs');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('techdocs-light.png');
});

test('Visual regression: TechDocs - dark mode', async ({ page }) => {
  await signInAndNavigate(page, '/docs');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('techdocs-dark.png');
});

// --- Global Search (Command Dialog) ---

test('Visual regression: Global search - light mode', async ({ page }) => {
  await signInAndNavigate(page, '/search');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-light.png');
});

test('Visual regression: Global search - dark mode', async ({ page }) => {
  await signInAndNavigate(page, '/search');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-dark.png');
});

// --- Settings Management ---

test('Visual regression: Settings - light mode', async ({ page }) => {
  await signInAndNavigate(page, '/settings');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('settings-light.png');
});

test('Visual regression: Settings - dark mode', async ({ page }) => {
  await signInAndNavigate(page, '/settings');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('settings-dark.png');
});

// ---------------------------------------------------------------------------
// Theme correctness verification tests
//
// Per AAP Section 0.8.2, verify that the CSS custom property token system is
// correctly applied in both light and dark modes. These tests confirm that the
// `--background` token (the foundational shadcn/ui design token) resolves to a
// non-empty value, indicating proper theme initialization.
// ---------------------------------------------------------------------------

test('Theme correctness: CSS custom properties are applied in light mode', async ({
  page,
}) => {
  await signInAndNavigate(page);
  await setThemeMode(page, 'light');
  const bgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--background')
      .trim();
  });
  expect(bgColor).toBeTruthy();
});

test('Theme correctness: CSS custom properties are applied in dark mode', async ({
  page,
}) => {
  await signInAndNavigate(page);
  await setThemeMode(page, 'dark');
  const bgColor = await page.evaluate(() => {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--background')
      .trim();
  });
  expect(bgColor).toBeTruthy();
});
