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
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { fireEvent, waitFor, screen, within } from '@testing-library/react';
import { capitalize } from 'lodash';
import { default as React } from 'react';
import { catalogApiRef } from '../../api';
import { EntityKindFilter } from '../../filters';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component', 'Component') },
          }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Kind')).toBeInTheDocument();

    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));

    await waitFor(() => screen.getByText('Domain'));

    entities.forEach(entity => {
      expect(
        screen.getByRole('option', {
          name: capitalize(entity.kind as string),
        }),
      ).toBeInTheDocument();
    });
  });

  it('sets the selected kind filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            filters: { kind: new EntityKindFilter('component', 'Component') },
            updateFilters,
          }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));

    await waitFor(() => screen.getByText('Domain'));
    fireEvent.click(screen.getByText('Domain'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('domain', 'Domain'),
    });
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { kind: 'group' };
    await renderInTestApp(
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
      kind: new EntityKindFilter('group', 'Group'),
    });
  });

  it('renders unknown kinds provided in query parameters', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'FROb' } }}
        >
          <EntityKindPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('FROb')).toBeInTheDocument();
  });

  it('limits kinds when allowedKinds is set', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider>
          <EntityKindPicker allowedKinds={['component', 'domain']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));

    expect(
      screen.getByRole('option', { name: 'Component' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Domain' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Template' }),
    ).not.toBeInTheDocument();
  });

  it('renders kind from the query parameter even when not in allowedKinds', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ queryParameters: { kind: 'Frob' } }}
        >
          <EntityKindPicker allowedKinds={['domain']} />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('Frob')).toBeInTheDocument();

    const input = screen.getByTestId('select');
    fireEvent.mouseDown(within(input).getByRole('button'));
    expect(screen.getByRole('option', { name: 'Domain' })).toBeInTheDocument();
  });
});
