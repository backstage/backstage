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
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { ApiProvider } from '@backstage/core-app-api';

import { Discover } from './Discover';
import { apisWithEntities } from '../../../../test-utils';

describe('Discover', () => {
  it('should render the header', async () => {
    await renderInTestApp(
      <ApiProvider apis={apisWithEntities}>
        <Discover />
      </ApiProvider>,
      { mountedRoutes: { 'catalog/:namespace/:kind/:name': entityRouteRef } },
    );

    const header = screen.getByText('Find Golden Path');
    expect(header).toBeVisible();
  });

  it('should render the search bar', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <ApiProvider apis={apisWithEntities}>
        <Discover />
      </ApiProvider>,
      { mountedRoutes: { 'catalog/:namespace/:kind/:name': entityRouteRef } },
    );

    const search = getByPlaceholderText('Search');
    expect(search).toBeVisible();
  });

  it('should render all filters', async () => {
    const { getByRole } = await renderInTestApp(
      <ApiProvider apis={apisWithEntities}>
        <Discover />
      </ApiProvider>,
      { mountedRoutes: { 'catalog/:namespace/:kind/:name': entityRouteRef } },
    );

    const owned = getByRole('menuitem', { name: /Owned/ });
    const starred = getByRole('menuitem', { name: /Starred/ });
    const all = getByRole('menuitem', { name: /All/ });
    expect(owned).toBeVisible();
    expect(starred).toBeVisible();
    expect(all).toBeVisible();
  });

  it('should render all pickers', async () => {
    await renderInTestApp(
      <ApiProvider apis={apisWithEntities}>
        <Discover />
      </ApiProvider>,
      { mountedRoutes: { 'catalog/:namespace/:kind/:name': entityRouteRef } },
    );

    const type = await screen.findByText('Type');
    const tags = await screen.findByRole('textbox', { name: 'Tags' });
    const owner = await screen.findByRole('textbox', { name: 'Owner' });
    expect(type).toBeVisible();
    expect(tags).toBeVisible();
    expect(owner).toBeVisible();
  });
});
