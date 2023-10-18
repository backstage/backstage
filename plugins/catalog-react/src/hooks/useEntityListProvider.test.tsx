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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  alertApiRef,
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { MockStorageApi, TestApiProvider } from '@backstage/test-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import qs from 'qs';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { catalogApiRef } from '../api';
import { starredEntitiesApiRef, MockStarredEntitiesApi } from '../apis';
import { EntityKindPicker, UserListPicker } from '../components';
import { EntityKindFilter, EntityTypeFilter, UserListFilter } from '../filters';
import { UserListFilterKind } from '../types';
import { EntityListProvider, useEntityList } from './useEntityListProvider';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'user:default/guest',
      },
    ],
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
    },
  },
];

const mockConfigApi = {
  getOptionalString: () => '',
} as Partial<ConfigApi>;
const mockIdentityApi: Partial<IdentityApi> = {
  getBackstageIdentity: async () => ({
    type: 'user',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: [],
  }),
  getCredentials: async () => ({ token: undefined }),
};
const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: jest.fn().mockImplementation(async () => ({ items: entities })),
  getEntityByRef: async () => undefined,
};

const wrapper = ({
  userFilter,
  location,
  children,
}: PropsWithChildren<{
  userFilter?: UserListFilterKind;
  location?: string;
}>) => {
  return (
    <MemoryRouter initialEntries={[location ?? '']}>
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [catalogApiRef, mockCatalogApi],
          [identityApiRef, mockIdentityApi],
          [storageApiRef, MockStorageApi.create()],
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          [alertApiRef, { post: jest.fn() }],
        ]}
      >
        <EntityListProvider>
          <EntityKindPicker initialFilter="component" hidden />
          <UserListPicker initialFilter={userFilter} />
          {children}
        </EntityListProvider>
      </TestApiProvider>
    </MemoryRouter>
  );
};

describe('<EntityListProvider />', () => {
  const origReplaceState = window.history.replaceState;
  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves backend filters', async () => {
    const { result, waitForValueToChange } = renderHook(() => useEntityList(), {
      wrapper,
    });
    await waitForValueToChange(() => result.current.backendEntities);
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'component' },
    });
  });

  it('resolves frontend filters', async () => {
    const { result, waitFor } = renderHook(() => useEntityList(), {
      wrapper,
      initialProps: {
        userFilter: 'all',
      },
    });
    await waitFor(() => !!result.current.entities.length);
    expect(result.current.backendEntities.length).toBe(2);

    act(() =>
      result.current.updateFilters({
        user: new UserListFilter(
          'owned',
          entity => entity.metadata.name === 'component-1',
          () => true,
        ),
      }),
    );

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    });
  });

  it('resolves query param filter values', async () => {
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result, waitFor } = renderHook(() => useEntityList(), {
      wrapper,
      initialProps: {
        location: `/catalog?${query}`,
      },
    });
    await act(() => waitFor(() => !!result.current.queryParameters));
    expect(result.current.queryParameters).toEqual({
      kind: 'component',
      type: 'service',
    });
  });

  it('does not fetch when only frontend filters change', async () => {
    const { result, waitFor } = renderHook(() => useEntityList(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    });

    act(() =>
      result.current.updateFilters({
        user: new UserListFilter(
          'owned',
          entity => entity.metadata.name === 'component-1',
          () => true,
        ),
      }),
    );

    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    });
  });

  it('debounces multiple filter changes', async () => {
    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
      () => useEntityList(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current.backendEntities);
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.updateFilters({ kind: new EntityKindFilter('component') });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });
    await waitForNextUpdate();
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(2);
  });

  it('returns an error on catalogApi failure', async () => {
    const { result, waitForValueToChange, waitFor } = renderHook(
      () => useEntityList(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current.backendEntities);
    expect(result.current.backendEntities.length).toBe(2);

    mockCatalogApi.getEntities = jest.fn().mockRejectedValue('error');
    act(() => {
      result.current.updateFilters({ kind: new EntityKindFilter('api') });
    });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
