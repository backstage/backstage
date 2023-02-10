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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityOwnerFilter } from '../../filters';
import { EntityOwnerPicker } from './EntityOwnerPicker';
import { ApiProvider } from '@backstage/core-app-api';
import { renderWithEffects, TestApiRegistry } from '@backstage/test-utils';
import { catalogApiRef, CatalogApi } from '../..';

const ownerEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'some-owner-2',
    },
  },
  {
    apiVersion: '1',
    kind: 'Group',
    metadata: {
      name: 'another-owner',
    },
  },
];

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner',
      },
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner-2',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/another-owner',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-3',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/some-owner',
      },
    ],
  },
];

const getEntitiesByRefs = jest.fn(async ({ entityRefs }) => ({
  items: entityRefs.map((e: string) =>
    ownerEntities.find(f => f.metadata.name === e),
  ),
}));
const mockCatalogApi: Partial<CatalogApi> = {
  getEntitiesByRefs,
};

describe('<EntityOwnerPicker/>', () => {
  const mockApis = TestApiRegistry.from([catalogApiRef, mockCatalogApi]);

  it('renders display name when available', async () => {
    const names: Record<string, string> = {
      'some-owner': 'Some Team',
      'some-owner-2': 'Other Team',
      'another-owner': 'AnotherTeam',
    };
    getEntitiesByRefs.mockResolvedValueOnce({
      items: ownerEntities.map(e => {
        e.spec = {
          ...e.spec,
          profile: {
            displayName: names[e.metadata.name],
          },
        };
        return e;
      }),
    });
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{ entities: sampleEntities, backendEntities: sampleEntities }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    sampleEntities
      .flatMap(e => e.relations?.map(r => parseEntityRef(r.targetRef).name))
      .forEach(owner => {
        expect(screen.getByText(names[owner as string])).toBeInTheDocument();
      });
  });

  /**
   * All previous test cases are still applicable for the case where there is no
   *  owner entity returned from the API or the owner entity returned does not have
   *  a display name.
   */
  it('renders all owners', async () => {
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{ entities: sampleEntities, backendEntities: sampleEntities }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    sampleEntities
      .flatMap(e => e.relations?.map(r => parseEntityRef(r.targetRef).name))
      .forEach(owner => {
        expect(screen.getByText(owner as string)).toBeInTheDocument();
      });
  });

  it('renders unique owners in alphabetical order', async () => {
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{ entities: sampleEntities, backendEntities: sampleEntities }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(screen.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('owner-picker-expand'));

    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
      'another-owner',
      'some-owner',
      'some-owner-2',
    ]);
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { owners: ['another-owner'] };
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities: sampleEntities,
            backendEntities: sampleEntities,
            updateFilters,
            queryParameters,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['another-owner']),
    });
  });

  it('adds owners to filters', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities: sampleEntities,
            backendEntities: sampleEntities,
            updateFilters,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });

    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    fireEvent.click(screen.getByText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
  });

  it('removes owners from filters', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            entities: sampleEntities,
            backendEntities: sampleEntities,
            updateFilters,
            filters: { owners: new EntityOwnerFilter(['some-owner']) },
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['some-owner']),
    });
    fireEvent.click(screen.getByTestId('owner-picker-expand'));
    expect(screen.getByLabelText('some-owner')).toBeChecked();

    fireEvent.click(screen.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-a'] },
            backendEntities: sampleEntities,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['team-a']),
    });
    rendered.rerender(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-b'] },
            backendEntities: sampleEntities,
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new EntityOwnerFilter(['team-b']),
    });
  });
  it('removes owners from filters if there are none available', async () => {
    const updateFilters = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={mockApis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { owners: ['team-a'] },
            backendEntities: [],
          }}
        >
          <EntityOwnerPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });
  });
});
