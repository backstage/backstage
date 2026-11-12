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

test('the catalog graph plugin is fetched from its remote only when its entity card is first rendered', async ({
  page,
}) => {
  const requests = new Array<string>();
  page.on('request', request => requests.push(request.url()));
  const fetched = () =>
    requests.filter(url =>
      url.includes('/remotes/@backstage/plugin-catalog-graph/'),
    );

  await page.goto('/');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'sidebar nav' })
      .getByRole('link', { name: 'Catalog', exact: true }),
  ).toBeVisible();
  await page.waitForLoadState('networkidle');

  // The card has config for its height, which only reaches the element, so
  // the plugin isn't loaded while the app starts
  expect(fetched()).toEqual([]);

  // The entity page renders the stand-in of the card, which loads the
  // plugin. The card uses the API of the plugin, which is created by the
  // factory of the loaded plugin.
  await page.goto('/catalog/default/component/artist-lookup');
  await expect(page.getByText('Relations', { exact: true })).toBeVisible();
  await expect(
    page.locator('svg').filter({ hasText: 'artist-lookup' }).first(),
  ).toBeVisible();

  expect(fetched().some(url => url.endsWith('/mf-manifest.json'))).toBe(true);
  expect(fetched().filter(url => url.endsWith('.js')).length).toBeGreaterThan(
    0,
  );
});
