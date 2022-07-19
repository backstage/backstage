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
import { fireEvent } from '@testing-library/react';
import { GetEntityFacetsResponse } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityKindFilter,
  MockEntityListContextProvider,
} from '@backstage/plugin-catalog-react';
import { ApiProvider } from '@backstage/core-app-api';
import {
  MockErrorApi,
  renderWithEffects,
  TestApiRegistry,
} from '@backstage/test-utils';
import { CatalogKindHeader } from './CatalogKindHeader';
import { errorApiRef } from '@backstage/core-plugin-api';

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
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    fireEvent.mouseDown(input);

    entities.map(entity => {
      expect(
        rendered.getByRole('option', { name: `${entity.kind}s` }),
      ).toBeInTheDocument();
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'frob' } }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(rendered.getByText('Frobs')).toBeInTheDocument();
  });

  it('updates the kind filter', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ updateFilters }}>
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    fireEvent.mouseDown(input);

    const option = rendered.getByRole('option', { name: 'Templates' });
    fireEvent.click(option);

    expect(updateFilters).toHaveBeenCalledWith({
      kind: new EntityKindFilter('template'),
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { kind: ['components'] },
          }}
        >
          <CatalogKindHeader />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('components'),
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
    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('template'),
    });
  });

  it('limits kinds when allowedKinds is set', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <CatalogKindHeader allowedKinds={['component', 'system']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = rendered.getByText('Components');
    fireEvent.mouseDown(input);

    expect(
      rendered.getByRole('option', { name: 'Components' }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole('option', { name: 'Systems' }),
    ).toBeInTheDocument();
    expect(
      rendered.queryByRole('option', { name: 'Templates' }),
    ).not.toBeInTheDocument();
  });

  it('renders kind from the query parameter even when not in allowedKinds', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'Frob' } }}
        >
          <CatalogKindHeader allowedKinds={['system']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(rendered.getByText('Frobs')).toBeInTheDocument();
    const input = rendered.getByText('Frobs');
    fireEvent.mouseDown(input);

    expect(
      rendered.getByRole('option', { name: 'Systems' }),
    ).toBeInTheDocument();
  });
});
