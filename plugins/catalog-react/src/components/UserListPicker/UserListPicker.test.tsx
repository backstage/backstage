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
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import {
  Entity,
  RELATION_OWNED_BY,
  UserEntity,
} from '@backstage/catalog-model';
import { UserListPicker } from './UserListPicker';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityTagFilter, UserListFilter } from '../../filters';
import { CatalogApi, GetEntityFacetsResponse } from '@backstage/catalog-client';
import { catalogApiRef } from '../../api';
import { MockStorageApi, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';

const mockUser: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    namespace: 'default',
    name: 'testUser',
  },
  spec: {
    memberOf: [],
  },
};

const mockConfigApi = {
  getOptionalString: () => 'Test Company',
} as Partial<ConfigApi>;

const mockIdentityApi = {
  getUserId: () => 'testUser',
  getIdToken: async () => undefined,
  getBackstageIdentity: async () => ({
    ownershipEntityRefs: ['user:default/someone', 'group:default/a-group'],
    type: 'user',
    userEntityRef: 'user:default/someone',
  }),
} as Partial<IdentityApi>;

const mockedStarredEntities = new Set(['component:namespace-2/component-3']);

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return {
    ...actual,
    useStarredEntities: () => ({
      starredEntities: mockedStarredEntities,
    }),
  };
});

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-1',
      name: 'component-1',
      tags: ['tag1'],
    },
    relations: [
      {
        type: RELATION_OWNED_BY,
        targetRef: 'user:default/testuser',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-2',
      tags: ['tag1'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-3',
      tags: [],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'namespace-2',
      name: 'component-4',
      tags: [],
    },
    relations: [
      {
        type: RELATION_OWNED_BY,
        targetRef: 'user:default/testuser',
      },
    ],
  },
];

const mockedFacets = {
  'metadata.uid': [{ count: 4, value: 'uid' }],
  'metadata.name': [{ count: 1, value: 'component:namespace-2/component-3' }],
  'relations.ownedBy': [
    { count: 1, value: 'component:namespace-1/component-1' },
  ],
};

const mockedEntityFacets = jest.fn();

const mockCatalogApi = {
  getEntityByRef: () => Promise.resolve(mockUser),
  getEntityFacets: mockedEntityFacets,
  getEntities: async () => ({ items: entities }),
} as Partial<CatalogApi>;

const apis = TestApiRegistry.from(
  [configApiRef, mockConfigApi],
  [catalogApiRef, mockCatalogApi],
  [identityApiRef, mockIdentityApi],
  [storageApiRef, MockStorageApi.create()],
);

describe('<UserListPicker />', () => {
  beforeEach(() => {
    mockedEntityFacets.mockImplementation(async () => {
      return { facets: mockedFacets };
    });
  });

  it('renders filter groups', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{}}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByText('Personal')).toBeInTheDocument(),
    );
    expect(screen.queryByText('Test Company')).toBeInTheDocument();
  });

  it('renders filters', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ entities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getAllByRole('menuitem').map(({ textContent }) => textContent),
      ).toEqual(['Owned', 'Starred', 'All']),
    );
  });

  it('includes counts alongside each filter', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ entities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    // Material UI renders ListItemSecondaryActions outside the
    // menuitem itself, so we pick off the next sibling.
    await waitFor(() => {
      expect(
        screen.getAllByRole('menuitem').map(({ textContent }) => textContent),
      ).toEqual(['Owned 1', 'Starred 1', 'All 4']);
    });
  });

  it('respects other frontend filters in counts', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            entities,
            filters: { tags: new EntityTagFilter(['tag1']) },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() =>
      expect(mockedEntityFacets).toHaveBeenCalledWith({
        facets: ['metadata.uid'],
        filter: { 'metadata.tags': ['tag1'] },
      }),
    );
  });

  it('respects the query parameter filter value', async () => {
    const updateFilters = jest.fn();
    const queryParameters = { user: 'owned' };
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ entities, updateFilters, queryParameters }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: UserListFilter.owned([
          'user:default/someone',
          'group:default/a-group',
        ]),
      }),
    );
  });

  it('updates user filter when a menuitem is selected', async () => {
    const updateFilters = jest.fn();
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ entities, updateFilters }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    fireEvent.click(screen.getByText('Starred'));

    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: UserListFilter.starred(Array.from(mockedStarredEntities)),
      }),
    );
  });

  it('responds to external queryParameters changes', async () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { user: ['all'] },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: UserListFilter.all(),
      }),
    );
    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            updateFilters,
            queryParameters: { user: ['owned'] },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    await waitFor(() =>
      expect(updateFilters).toHaveBeenLastCalledWith({
        user: UserListFilter.owned([
          'user:default/someone',
          'group:default/a-group',
        ]),
      }),
    );
  });

  describe.each`
    type         | facet
    ${'owned'}   | ${'relations.ownedBy'}
    ${'starred'} | ${'metadata.name'}
  `('filter resetting for $type entities', ({ type, facet }) => {
    let updateFilters: jest.Mock;

    const picker = (props: { loading: boolean }) => (
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ updateFilters, loading: props.loading }}
        >
          <UserListPicker initialFilter={type} />
        </MockEntityListContextProvider>
      </ApiProvider>
    );

    beforeEach(() => {
      mockedEntityFacets.mockImplementation(async () => {
        return { facets: mockedFacets };
      });

      updateFilters = jest.fn();
    });

    describe(`when there are no ${type} entities match the filter`, () => {
      it('does not reset the filter while any facet is loading', async () => {
        mockedEntityFacets.mockImplementation(
          // @ts-expect-error
          new Promise<GetEntityFacetsResponse>(() => {}),
        );
        render(picker({ loading: false }));

        await waitFor(() =>
          expect(updateFilters).not.toHaveBeenCalledWith({
            user: UserListFilter.all(),
          }),
        );
      });

      it('resets the filter to "all" when entities are loaded', async () => {
        mockedEntityFacets.mockImplementation(async () => ({
          facets: { ...mockedFacets, [facet]: [] },
        }));
        render(picker({ loading: false }));

        await waitFor(() =>
          expect(updateFilters).toHaveBeenLastCalledWith({
            user: UserListFilter.all(),
          }),
        );
      });
    });

    describe(`when there are some ${type} entities present`, () => {
      it('does not reset the filter while entities are loading', async () => {
        render(picker({ loading: true }));

        await waitFor(() =>
          expect(updateFilters).not.toHaveBeenCalledWith({
            user: UserListFilter.all(),
          }),
        );
      });

      it('does not reset the filter when entities are loaded', async () => {
        render(picker({ loading: false }));

        await waitFor(() =>
          expect(updateFilters).not.toHaveBeenLastCalledWith(
            UserListFilter.all(),
          ),
        );
      });
    });
  });
});
