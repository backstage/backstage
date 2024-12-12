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
import { fireEvent, waitFor, screen, within } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { EntityTypePicker } from './EntityTypePicker';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '../../api';
import { EntityKindFilter, EntityTypeFilter } from '../../filters';
import { alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { GetEntityFacetsResponse } from '@backstage/catalog-client';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    spec: {
      type: 'service',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
    spec: {
      type: 'website',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
    spec: {
      type: 'library',
    },
  },
];

const apis = TestApiRegistry.from(
  [
    catalogApiRef,
    {
      getEntityFacets: jest.fn().mockResolvedValue({
        facets: {
          'spec.type': entities.map(e => ({
            value: (e.spec as any).type,
            count: 1,
          })),
        },
      } as GetEntityFacetsResponse),
    },
  ],
  [
    alertApiRef,
    {
      post: jest.fn(),
    },
  ],
);

describe('<EntityTypePicker/>', () => {
  it('renders available entity types', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component', 'Component') },
          }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Type')).toBeInTheDocument();

    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));

    await waitFor(() => screen.getByText('service'));

    entities.forEach(entity => {
      expect(screen.getByText(entity.spec!.type as string)).toBeInTheDocument();
    });
  });

  it('sets the selected type filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component', 'Component') },
            updateFilters,
          }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));

    await waitFor(() => screen.getByText('service'));
    fireEvent.click(screen.getByText('service'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      type: new EntityTypeFilter(['service']),
    });

    fireEvent.mouseDown(within(input).getByRole('button'));
    fireEvent.click(screen.getByText('all'));

    expect(updateFilters).toHaveBeenLastCalledWith({ type: undefined });
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { type: 'tool' };
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityTypePicker initialFilter="tool" hidden />
        </MockEntityListContextProvider>
        ,
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      type: new EntityTypeFilter(['tool']),
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { type: 'service' },
          }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      type: new EntityTypeFilter(['service']),
    });
    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { type: 'tool' },
          }}
        >
          <EntityTypePicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      type: new EntityTypeFilter(['tool']),
    });
  });
});
