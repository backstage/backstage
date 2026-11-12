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

test('deferred remotes are fetched only when their pages are first visited', async ({
  page,
}) => {
  const requests = new Array<string>();
  page.on('request', request => requests.push(request.url()));
  const fetched = (remote: string) =>
    requests.filter(
      url =>
        url.includes(`/remotes/@internal/plugin-${remote}/`) &&
        (url.endsWith('mf-manifest.json') || url.endsWith('remoteEntry.js')),
    );

  await page.goto('/');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'sidebar nav' })
      .getByRole('link', { name: 'Catalog', exact: true }),
  ).toBeVisible();

  // Neither remote entry is fetched while the app starts
  expect(fetched('lazy-demo')).toEqual([]);
  expect(fetched('lazy-scorecard')).toEqual([]);

  await page.goto('/lazy-demo');
  await expect(page.getByText(/This page was loaded on demand/)).toBeVisible();
  expect(fetched('lazy-demo').length).toBeGreaterThan(0);
  expect(fetched('lazy-scorecard')).toEqual([]);

  // A deferred plugin with sub-pages works as well
  await page.goto('/lazy-scorecard/overview');
  await expect(
    page.getByText(/component:default\/example-website: \d+%/),
  ).toBeVisible();
  expect(fetched('lazy-scorecard').length).toBeGreaterThan(0);
});
