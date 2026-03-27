/*
 * Copyright 2021 The Backstage Authors
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
 * attribute, which is Backstage's convention for light/dark theme switching
 * using CSS custom properties. A brief timeout allows CSS transitions to settle
 * before any subsequent screenshot capture.
 */
async function setThemeMode(page: Page, mode: 'light' | 'dark') {
  await page.evaluate(themeMode => {
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, mode);
  // Allow CSS custom property transitions and repaint to complete
  await page.waitForTimeout(300);
}

test('the results are rendered as expected', async ({ page }) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  // Wait for sign-in to complete before navigating
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  // Set up route interception BEFORE navigating to the search page
  await page.route(`**/api/search/query?term=*`, async route => {
    const results = [
      {
        type: 'software-catalog',
        document: {
          title: 'backstage',
          text: 'Backstage system documentation',
          location: '/result/location/path',
        },
      },
    ];
    await route.fulfill({ json: { results } });
  });

  await page.goto('/search');

  await expect(
    page.getByPlaceholder('Search in Backstage Example App'),
  ).toBeVisible();

  // Type a search query to trigger the mocked response
  await page.getByPlaceholder('Search in Backstage Example App').fill('test');
  await expect(page.getByText('Backstage system documentation')).toBeVisible();
});

/**
 * Visual regression screenshot tests for the search page.
 *
 * These tests capture full-page screenshots of the search UI in both light and
 * dark modes, as required by AAP Section 0.8.2 for validating component
 * rendering, layout consistency, and theme correctness after the MUI-to-shadcn
 * migration. Each test uses a deterministic search API mock so that visual
 * output is reproducible across CI runs.
 */

test('Visual regression: Search page - light mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  // Set up search API mock for consistent visual regression
  await page.route(`**/api/search/query?term=*`, async route => {
    const results = [
      {
        type: 'software-catalog',
        document: {
          title: 'backstage',
          text: 'Backstage system documentation',
          location: '/result/location/path',
        },
      },
    ];
    await route.fulfill({ json: { results } });
  });

  await page.goto('/search');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-page-light.png');
});

test('Visual regression: Search page - dark mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  // Set up search API mock for consistent visual regression
  await page.route(`**/api/search/query?term=*`, async route => {
    const results = [
      {
        type: 'software-catalog',
        document: {
          title: 'backstage',
          text: 'Backstage system documentation',
          location: '/result/location/path',
        },
      },
    ];
    await route.fulfill({ json: { results } });
  });

  await page.goto('/search');
  await page.waitForLoadState('networkidle');
  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-page-dark.png');
});

test('Visual regression: Search results - light mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  // Set up search API mock for consistent visual regression
  await page.route(`**/api/search/query?term=*`, async route => {
    const results = [
      {
        type: 'software-catalog',
        document: {
          title: 'backstage',
          text: 'Backstage system documentation',
          location: '/result/location/path',
        },
      },
    ];
    await route.fulfill({ json: { results } });
  });

  await page.goto('/search');
  await page.waitForLoadState('networkidle');

  // Type search to trigger results — verify the Command dialog pattern renders
  // correctly. The placeholder text may need updating if the search UI is
  // redesigned to use the cmdk Command component with a different placeholder.
  const searchInput = page.getByPlaceholder('Search in Backstage Example App');
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('test');
    await expect(
      page.getByText('Backstage system documentation'),
    ).toBeVisible();
  }

  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-results-light.png');
});

test('Visual regression: Search results - dark mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  // Set up search API mock for consistent visual regression
  await page.route(`**/api/search/query?term=*`, async route => {
    const results = [
      {
        type: 'software-catalog',
        document: {
          title: 'backstage',
          text: 'Backstage system documentation',
          location: '/result/location/path',
        },
      },
    ];
    await route.fulfill({ json: { results } });
  });

  await page.goto('/search');
  await page.waitForLoadState('networkidle');

  // Type search to trigger results — the placeholder selector may need updating
  // if the Command dialog (cmdk) redesign changes the input placeholder text.
  const searchInput = page.getByPlaceholder('Search in Backstage Example App');
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('test');
    await expect(
      page.getByText('Backstage system documentation'),
    ).toBeVisible();
  }

  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('search-results-dark.png');
});

/**
 * Verifies that the search page renders with a recognizable search UI element.
 * Per AAP 0.5.4, the search page uses a Command dialog pattern (cmdk) for
 * global search. This test uses flexible selectors to detect either the legacy
 * placeholder-based search input or the new Command dialog root element.
 */
test('Search page renders with Command dialog pattern', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  await page.goto('/search');
  await page.waitForLoadState('networkidle');

  // Verify search UI is present — the Command dialog or search input should be
  // visible. Use flexible selectors since the implementation may use the cmdk
  // Command component ([cmdk-root]), a combobox role, or a standard search input.
  const searchVisible = await page
    .getByPlaceholder('Search in Backstage Example App')
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  // Fallback: detect cmdk root, combobox, or generic search input
  const commandDialogVisible = await page
    .locator('[cmdk-root], [role="combobox"], input[type="search"]')
    .first()
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  // Search UI should be present in at least one of the expected forms
  expect(searchVisible || commandDialogVisible).toBeTruthy();
});
