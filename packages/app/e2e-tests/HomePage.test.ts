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

import { test, expect } from '@playwright/test';

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
