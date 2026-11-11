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

test('deferred plugins are loaded in a separate chunk when first visited', async ({
  page,
}) => {
  const scriptRequests = new Array<string>();
  page.on('request', request => {
    if (request.resourceType() === 'script') {
      scriptRequests.push(new URL(request.url()).pathname);
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'sidebar nav' })
      .getByRole('link', { name: 'Catalog', exact: true }),
  ).toBeVisible();

  // The code of a deferred plugin is not part of the initial app bundle
  expect(
    scriptRequests.filter(path => /deferred-.*lazy-demo/.test(path)),
  ).toEqual([]);

  await page.goto('/lazy-demo');
  await expect(page.getByText(/This page was loaded on demand/)).toBeVisible();

  const demoChunks = scriptRequests.filter(path =>
    /deferred-.*lazy-demo/.test(path),
  );
  expect(demoChunks.length).toBeGreaterThan(0);

  // Pages of deferred plugins with sub-pages work as well
  await page.goto('/lazy-scorecard/overview');
  await expect(
    page.getByText(/component:default\/example-website: \d+%/),
  ).toBeVisible();
  expect(
    scriptRequests.filter(path => /deferred-.*lazy-scorecard/.test(path))
      .length,
  ).toBeGreaterThan(0);
});
