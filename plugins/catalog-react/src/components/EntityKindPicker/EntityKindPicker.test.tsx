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

import { GetEntityFacetsResponse } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { renderWithEffects, TestApiRegistry } from '@backstage/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import { capitalize } from 'lodash';
import { default as React } from 'react';
import { catalogApiRef } from '../../api';
import { EntityKindFilter } from '../../filters';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityKindPicker } from './EntityKindPicker';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component',
    },
  },
  {
    apiVersion: '1',
    kind: 'Domain',
    metadata: {
      name: 'domain',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'group',
    },
  },
];

describe('<EntityKindPicker/>', () => {
  const apis = TestApiRegistry.from(
    [
      catalogApiRef,
      {
        getEntityFacets: jest.fn().mockResolvedValue({
          facets: {
            kind: entities.map(e => ({
              value: e.kind,
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

  it('renders available entity kinds', async () => {
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ filters: { kind: new EntityKindFilter('component') } }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('Kind')).toBeInTheDocument();

    const input = rendered.getByTestId('select');
    fireEvent.click(input);

    await waitFor(() => rendered.getByText('Domain'));

    entities.forEach(entity => {
      expect(
        rendered.getByRole('option', {
          name: capitalize(entity.kind as string),
        }),
      ).toBeInTheDocument();
    });
  });

  it('sets the selected kind filter', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component') },
            updateFilters,
          }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    const input = rendered.getByTestId('select');
    fireEvent.click(input);

    await waitFor(() => rendered.getByText('Domain'));
    fireEvent.click(rendered.getByText('Domain'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('domain'),
    });
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { kind: 'group' };
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters,
          }}
        >
          <EntityKindPicker initialFilter="group" hidden />
        </MockEntityListContextProvider>
        ,
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('group'),
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { kind: 'component' },
          }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('component'),
    });
    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { kind: 'domain' },
          }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('domain'),
    });
  });
});
