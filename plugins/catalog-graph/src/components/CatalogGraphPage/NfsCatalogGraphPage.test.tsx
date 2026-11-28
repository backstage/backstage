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

import { TestApiProvider } from '@backstage/frontend-test-utils';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';
import { CatalogGraphPage, NfsCatalogGraphPage } from './CatalogGraphPage';

jest.mock('../EntityRelationsGraph', () => ({
  EntityRelationsGraph: () => <div data-testid="entity-relations-graph" />,
}));

const initialState = {
  showFilters: false,
  rootEntityRefs: ['component:default/my-service'],
};

const apis = [
  catalogApiMock({ entities: [] }),
  [catalogGraphApiRef, new DefaultCatalogGraphApi()],
] as const;

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
    expect(screen.getByRole('main')).toContainElement(
      screen.getByTestId('entity-relations-graph'),
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByText('Catalog Graph')).not.toBeInTheDocument();
    expect(screen.queryByText('my-service')).not.toBeInTheDocument();
  });

  it('toggles the filters panel', async () => {
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <NfsCatalogGraphPage
          initialState={{ ...initialState, showFilters: true }}
        />
      </TestApiProvider>,
      renderOptions,
    );

    expect(await screen.findByText('Max depth')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Simplified' })).toBeChecked();

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));

    expect(screen.queryByText('Max depth')).not.toBeInTheDocument();
    expect(
      await screen.findByTestId('entity-relations-graph'),
    ).toBeInTheDocument();
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
