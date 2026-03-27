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
 * Sets the theme mode on the document root element.
 * Uses the `data-theme-mode` attribute following Backstage's existing
 * data-attribute convention for light/dark mode switching.
 */
async function setThemeMode(page: Page, mode: 'light' | 'dark') {
  await page.evaluate(themeMode => {
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, mode);
  // Allow time for CSS custom property transitions to settle
  await page.waitForTimeout(300);
}

test('Should not throw `ResizeObserver loop completed with undelivered notifications`', async ({
  page,
}) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  await page.goto('/home');
  await expect(
    page
      .frameLocator('#webpack-dev-server-client-overlay')
      .getByText(
        /ResizeObserver loop completed with undelivered notifications/,
      ),
  ).not.toBeVisible();
});

test('Should render the home page', async ({ page }) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  // Wait for sign-in to complete
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  await page.goto('/home');
  // The home page should render with the custom homepage grid
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
});

test('Visual regression: Home page - light mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  // Wait for sign-in to complete
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  await page.goto('/home');
  await page.waitForLoadState('networkidle');

  // Verify custom homepage grid renders (it should show "Home" link when fully rendered)
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  await setThemeMode(page, 'light');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('homepage-light.png');
});

test('Visual regression: Home page - dark mode', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  await page.goto('/home');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  await setThemeMode(page, 'dark');
  const screenshot = await page.screenshot({ fullPage: true });
  await expect(screenshot).toMatchSnapshot('homepage-dark.png');
});

test('Home page renders with shadcn/ui styling', async ({ page }) => {
  await page.goto('/');
  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();

  await page.goto('/home');
  await page.waitForLoadState('networkidle');

  // Verify CSS custom properties are applied (shadcn/ui token system)
  const hasTokens = await page.evaluate(() => {
    const style = window.getComputedStyle(document.documentElement);
    return style.getPropertyValue('--background').trim().length > 0;
  });
  expect(hasTokens).toBeTruthy();
});
