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
import { CatalogApi } from '@backstage/catalog-client';
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
import { useEntityOwnership } from '../../hooks';

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

const mockCatalogApi = {
  getEntityByRef: () => Promise.resolve(mockUser),
} as Partial<CatalogApi>;

const mockIdentityApi = {
  getUserId: () => 'testUser',
  getIdToken: async () => undefined,
} as Partial<IdentityApi>;

const apis = TestApiRegistry.from(
  [configApiRef, mockConfigApi],
  [catalogApiRef, mockCatalogApi],
  [identityApiRef, mockIdentityApi],
  [storageApiRef, MockStorageApi.create()],
);

const mockIsOwnedEntity = jest.fn(
  (entity: Entity) => entity.metadata.name === 'component-1',
);

const mockIsStarredEntity = jest.fn(
  (entity: Entity) => entity.metadata.name === 'component-3',
);

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return {
    ...actual,
    useEntityOwnership: jest.fn(() => ({
      isOwnedEntity: mockIsOwnedEntity,
    })),
    useStarredEntities: () => ({
      isStarredEntity: mockIsStarredEntity,
    }),
  };
});

const backendEntities: Entity[] = [
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

describe('<UserListPicker />', () => {
  it('renders filter groups', () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('renders filters', () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(
      screen.getAllByRole('menuitem').map(({ textContent }) => textContent),
    ).toEqual(['Owned 1', 'Starred 1', 'All 4']);
  });

  it('includes counts alongside each filter', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider value={{ backendEntities }}>
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
            backendEntities,
            filters: { tags: new EntityTagFilter(['tag1']) },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getAllByRole('menuitem').map(({ textContent }) => textContent),
      ).toEqual(['Owned 1', 'Starred 0', 'All 2']);
    });
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { user: 'owned' };
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ backendEntities, updateFilters, queryParameters }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter('owned', mockIsOwnedEntity, mockIsStarredEntity),
    });
  });

  it('updates user filter when a menuitem is selected', () => {
    const updateFilters = jest.fn();
    render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ backendEntities, updateFilters }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );

    fireEvent.click(screen.getByText('Starred'));

    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter(
        'starred',
        mockIsOwnedEntity,
        mockIsStarredEntity,
      ),
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            backendEntities,
            updateFilters,
            queryParameters: { user: ['all'] },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter('all', mockIsOwnedEntity, mockIsStarredEntity),
    });
    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{
            backendEntities,
            updateFilters,
            queryParameters: { user: ['owned'] },
          }}
        >
          <UserListPicker />
        </MockEntityListContextProvider>
      </ApiProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      user: new UserListFilter('owned', mockIsOwnedEntity, mockIsStarredEntity),
    });
  });

  describe.each`
    type         | filterFn
    ${'owned'}   | ${mockIsOwnedEntity}
    ${'starred'} | ${mockIsStarredEntity}
  `('filter resetting for $type entities', ({ type, filterFn }) => {
    let updateFilters: jest.Mock;

    const picker = (props: { loading: boolean }) => (
      <ApiProvider apis={apis}>
        <MockEntityListContextProvider
          value={{ backendEntities, updateFilters, loading: props.loading }}
        >
          <UserListPicker initialFilter={type} />
        </MockEntityListContextProvider>
      </ApiProvider>
    );

    beforeEach(() => {
      updateFilters = jest.fn();
    });

    describe(`when there are no ${type} entities match the filter`, () => {
      beforeEach(() => {
        filterFn.mockReturnValue(false);
      });

      it('does not reset the filter while entities are loading', () => {
        render(picker({ loading: true }));

        expect(updateFilters).not.toHaveBeenCalledWith({
          user: new UserListFilter(
            'all',
            mockIsOwnedEntity,
            mockIsStarredEntity,
          ),
        });
      });

      it('does not reset the filter while owned entities are loading', () => {
        const isOwnedEntity = jest.fn(() => false);
        (useEntityOwnership as jest.Mock).mockReturnValueOnce({
          loading: true,
          isOwnedEntity,
        });

        render(picker({ loading: false }));
        expect(updateFilters).not.toHaveBeenCalledWith({
          user: new UserListFilter('all', isOwnedEntity, mockIsStarredEntity),
        });
      });

      it('resets the filter to "all" when entities are loaded', () => {
        render(picker({ loading: false }));

        expect(updateFilters).toHaveBeenLastCalledWith({
          user: new UserListFilter(
            'all',
            mockIsOwnedEntity,
            mockIsStarredEntity,
          ),
        });
      });
    });

    describe(`when there are some ${type} entities present`, () => {
      beforeEach(() => {
        filterFn.mockReturnValue(true);
      });

      it('does not reset the filter while entities are loading', () => {
        render(picker({ loading: true }));

        expect(updateFilters).not.toHaveBeenCalledWith({
          user: new UserListFilter(
            'all',
            mockIsOwnedEntity,
            mockIsStarredEntity,
          ),
        });
      });

      it('does not reset the filter when entities are loaded', () => {
        render(picker({ loading: false }));

        expect(updateFilters).toHaveBeenLastCalledWith({
          user: new UserListFilter(
            type,
            mockIsOwnedEntity,
            mockIsStarredEntity,
          ),
        });
      });
    });
  });
});
