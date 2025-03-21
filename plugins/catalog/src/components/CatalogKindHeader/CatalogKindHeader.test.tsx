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

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { GetEntityFacetsResponse } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityKindFilter,
} from '@backstage/plugin-catalog-react';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { ApiProvider } from '@backstage/core-app-api';
import {
  MockErrorApi,
  renderWithEffects,
  TestApiRegistry,
} from '@backstage/test-utils';
import { CatalogKindHeader } from './CatalogKindHeader';
import { errorApiRef } from '@backstage/core-plugin-api';
import pluralize from 'pluralize';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Template',
    metadata: {
      name: 'template',
    },
  },
  {
    apiVersion: '1',
    kind: 'System',
    metadata: {
      name: 'system',
    },
  },
];
const errorApi = new MockErrorApi();
const apis = TestApiRegistry.from(
  [
    catalogApiRef,
    {
      getEntityFacets: jest.fn().mockResolvedValue({
        facets: {
          kind: [
            { value: 'Component', count: 2 },
            { value: 'Template', count: 1 },
            { value: 'System', count: 1 },
          ],
        },
      } as GetEntityFacetsResponse),
    },
  ],
  [errorApiRef, errorApi],
);

describe('<CatalogKindHeader />', () => {
  it('renders available kinds', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = screen.getByText('Components');
    fireEvent.mouseDown(input);

    entities.map(entity => {
      expect(
        screen.getByRole('option', { name: `${pluralize(entity.kind)}` }),
      ).toBeInTheDocument();
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'FROb' } }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('FRObs')).toBeInTheDocument();
  });

  it('updates the kind filter', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ updateFilters }}>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = screen.getByText('Components');
    fireEvent.mouseDown(input);

    const option = screen.getByRole('option', { name: 'Templates' });
    fireEvent.click(option);

    expect(updateFilters).toHaveBeenCalledWith({
      kind: new EntityKindFilter('template', 'Template'),
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { kind: ['component'] },
          }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('component', 'Component'),
    });
    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { kind: ['template'] },
          }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        kind: new EntityKindFilter('template', 'Template'),
      }),
    );
  });

  it('limits kinds when allowedKinds is set', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader allowedKinds={['component', 'system']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = screen.getByText('Components');
    fireEvent.mouseDown(input);

    expect(
      screen.getByRole('option', { name: 'Components' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Systems' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Templates' }),
    ).not.toBeInTheDocument();
  });

  it('renders kind from the query parameter even when not in allowedKinds', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'Frob' } }}
        >
          <CatalogKindHeader allowedKinds={['system']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('Frobs')).toBeInTheDocument();
    const input = screen.getByText('Frobs');
    fireEvent.mouseDown(input);

    expect(screen.getByRole('option', { name: 'Systems' })).toBeInTheDocument();
  });
});
