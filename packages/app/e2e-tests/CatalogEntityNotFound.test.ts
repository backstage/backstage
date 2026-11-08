/*
 * Copyright 2026 The Backstage Authors
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

test.describe('Catalog Entity Not Found', () => {
  test('should render NotFoundErrorPage when entity does not exist', async ({
    page,
  }) => {
    // Automatically accept any fallback dialog during sign-in
    page.on('dialog', dialog => dialog.accept());

    await page.goto('/');

    const enterButton = page.getByRole('button', { name: 'Enter' });
    await expect(enterButton).toBeVisible();
    await enterButton.click();

    // Mock catalog API to return 404 for missing entity
    await page.route('**/api/catalog/entities/by-name/**', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        json: {
          error: {
            name: 'NotFoundError',
            message: 'Entity not found',
          },
        },
      });
    });

    await page.goto('/catalog/default/component/non-existent-entity');

    // Verify that the global 404 NotFoundErrorPage is rendered
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(
      page.getByText(
        'Unable to locate this page. Please contact your support team if this page used to exist.',
      ),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go home' })).toBeVisible();

    // Verify the old inline warning panel is NOT rendered
    await expect(
      page.getByText(
        'There is no component with the requested kind, namespace, and name',
      ),
    ).not.toBeVisible();
  });
});
