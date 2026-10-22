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

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { CatalogGraphPage, NfsCatalogGraphPage } from './CatalogGraphPage';

jest.mock('../EntityRelationsGraph', () => ({
  EntityRelationsGraph: () => <div data-testid="entity-relations-graph" />,
}));

const initialState = {
  showFilters: false,
  rootEntityRefs: ['component:default/my-service'],
};

const renderOptions = {
  mountedRoutes: {
    '/entity/:kind/:namespace/:name': entityRouteRef,
  },
};

describe('NfsCatalogGraphPage', () => {
  it('renders the page content without the legacy header', async () => {
    await renderInTestApp(
      <NfsCatalogGraphPage initialState={initialState} />,
      renderOptions,
    );

    expect(
      await screen.findByTestId('entity-relations-graph'),
    ).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByText('Catalog Graph')).not.toBeInTheDocument();
    expect(screen.queryByText('my-service')).not.toBeInTheDocument();
  });

  it('keeps the legacy header on the legacy page', async () => {
    await renderInTestApp(
      <CatalogGraphPage initialState={initialState} />,
      renderOptions,
    );

    expect(
      await screen.findByTestId('entity-relations-graph'),
    ).toBeInTheDocument();
    expect(screen.getByText('Catalog Graph')).toBeInTheDocument();
    expect(screen.getByText('my-service')).toBeInTheDocument();
  });
});
