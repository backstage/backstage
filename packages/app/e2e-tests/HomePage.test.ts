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

test('Should resize widgets vertically and horizontally', async ({ page }) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  await page.goto('/home');
  await expect(page.getByText('Backstage Example App')).toBeVisible();

  // Start editing mode
  await page.getByRole('button', { name: /Edit/ }).click();
  await expect(page.getByRole('button', { name: /Save/ })).toBeVisible();

  // Resize the last installed widget
  const widgetElement = await page.locator('.react-grid-item:nth-child(3)');
  const defaultWidgetBox = { x: 1, y: 1, width: 1, height: 1 };
  const widgetBoxBefore =
    (await widgetElement.boundingBox()) ?? defaultWidgetBox;
  const widgetResizeHandle = await widgetElement.locator(
    '.react-resizable-handle',
  );
  await widgetResizeHandle.hover();
  await page.mouse.down();
  await page.mouse.move(widgetBoxBefore.width / 2, widgetBoxBefore.height / 2);
  await page.mouse.up();
  const widgetBoxAfter =
    (await widgetElement.boundingBox()) ?? defaultWidgetBox;

  // Ensure that both height and width was reduced
  expect(widgetBoxAfter.width).toBeLessThan(widgetBoxBefore.width);
  expect(widgetBoxAfter.height).toBeLessThan(widgetBoxBefore.height);

  // Exit editing mode
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('button', { name: /Edit/ })).toBeVisible();
});
