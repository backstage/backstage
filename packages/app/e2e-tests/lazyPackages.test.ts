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

test('deferred packages are fetched from their remotes only when their pages are first visited', async ({
  page,
}) => {
  const requests = new Array<string>();
  page.on('request', request => requests.push(request.url()));
  const fetched = () =>
    requests.filter(url =>
      url.includes('/remotes/@internal/plugin-lazy-package-demo/'),
    );

  await page.goto('/');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'sidebar nav' })
      .getByRole('link', { name: 'Catalog', exact: true }),
  ).toBeVisible();

  // The package is not part of the app bundle, and its remote is not
  // fetched while the app starts
  expect(fetched()).toEqual([]);

  await page.goto('/lazy-package-demo');
  await expect(
    page.getByText('This package was loaded on demand.'),
  ).toBeVisible();

  // The remote of the package and its code are fetched from the remotes
  // endpoint of the dynamic features backend
  expect(fetched().some(url => url.endsWith('/mf-manifest.json'))).toBe(true);
  expect(fetched().filter(url => url.endsWith('.js')).length).toBeGreaterThan(
    0,
  );
});
