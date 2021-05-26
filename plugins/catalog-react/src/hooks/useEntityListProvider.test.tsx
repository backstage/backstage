/*
 * Copyright 2021 Spotify AB
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

import React, { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  ApiProvider,
  ApiRegistry,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core';
import { MockStorageApi } from '@backstage/test-utils';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity, UserEntity } from '@backstage/catalog-model';
import {
  DefaultEntityFilters,
  EntityListProvider,
  EntityListProviderProps,
  useEntityListProvider,
} from './useEntityListProvider';
import { catalogApiRef } from '../api';
import { EntityKindFilter, EntityTypeFilter, UserListFilter } from '../types';

const mockUser: UserEntity = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'User',
  metadata: {
    name: 'guest',
  },
  spec: {
    memberOf: [],
  },
};

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
        target: {
          name: 'guest',
          namespace: 'default',
          kind: 'User',
        },
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

const mockIdentityApi: Partial<IdentityApi> = {
  getUserId: () => 'guest@example.com',
};
const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ items: entities })),
  getEntityByName: () => Promise.resolve(mockUser),
};
const apis = ApiRegistry.from([
  [catalogApiRef, mockCatalogApi],
  [identityApiRef, mockIdentityApi],
  [storageApiRef, MockStorageApi.create()],
]);

const wrapper = ({
  children,
  initialFilters,
}: PropsWithChildren<EntityListProviderProps<DefaultEntityFilters>>) => {
  return (
    <ApiProvider apis={apis}>
      <EntityListProvider initialFilters={initialFilters}>
        {children}
      </EntityListProvider>
    </ApiProvider>
  );
};

describe('<EntityListProvider/>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves backend filters', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useEntityListProvider(),
      {
        wrapper,
        initialProps: {
          initialFilters: { kind: new EntityKindFilter('component') },
        },
      },
    );
    await waitForValueToChange(() => result.current.backendEntities);
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'component' },
    });
  });

  it('resolves frontend filters', async () => {
    const { result, waitFor } = renderHook(() => useEntityListProvider(), {
      wrapper,
      initialProps: {
        initialFilters: {
          user: new UserListFilter('owned', mockUser, () => true),
        },
      },
    });
    await waitFor(() => !!result.current.entities.length);
    expect(result.current.backendEntities.length).toBe(2);
    expect(result.current.entities.length).toBe(1);
  });

  it('does not fetch when only frontend filters change', async () => {
    const { result, waitFor } = renderHook(() => useEntityListProvider(), {
      wrapper,
      initialProps: {
        initialFilters: { kind: new EntityKindFilter('component') },
      },
    });
    await waitFor(() => !!result.current.entities.length);
    expect(result.current.entities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);

    act(() =>
      result.current.updateFilters({
        user: new UserListFilter('owned', mockUser, () => true),
      }),
    );
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    expect(result.current.entities.length).toBe(1);
  });

  it('debounces multiple filter changes', async () => {
    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
      () => useEntityListProvider(),
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
    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
      () => useEntityListProvider(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current.backendEntities);
    expect(result.current.backendEntities.length).toBe(2);

    mockCatalogApi.getEntities = jest.fn().mockRejectedValue('error');
    act(() => {
      result.current.updateFilters({ kind: new EntityKindFilter('component') });
    });
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });
});
