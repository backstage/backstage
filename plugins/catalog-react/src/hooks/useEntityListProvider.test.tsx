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
  errorApiRef,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { MockStorageApi, TestApiProvider } from '@backstage/test-utils';
import { act, renderHook, waitFor } from '@testing-library/react';
import qs from 'qs';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { catalogApiRef } from '../api';
import { starredEntitiesApiRef, MockStarredEntitiesApi } from '../apis';
import {
  EntityKindFilter,
  EntityTextFilter,
  EntityTypeFilter,
  EntityUserFilter,
} from '../filters';
import { EntityListProvider, useEntityList } from './useEntityListProvider';
import { useMountEffect } from '@react-hookz/web';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { MockTranslationApi } from '@backstage/test-utils/alpha';

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

const ownershipEntityRefs = ['user:default/guest'];

const mockIdentityApi: Partial<IdentityApi> = {
  getBackstageIdentity: async () => ({
    type: 'user',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs,
  }),
  getCredentials: async () => ({ token: undefined }),
};
const mockCatalogApi: Partial<jest.Mocked<CatalogApi>> = {
  getEntities: jest.fn().mockResolvedValue({ items: entities }),
  queryEntities: jest.fn().mockResolvedValue({
    items: entities,
    pageInfo: { prevCursor: 'prevCursor', nextCursor: 'nextCursor' },
    totalItems: 10,
  }),
  getEntityByRef: jest.fn().mockResolvedValue(undefined),
};

const createWrapper =
  (options: { location?: string; pagination: boolean }) =>
  (props: PropsWithChildren) => {
    const InitialFiltersWrapper = ({ children }: PropsWithChildren) => {
      const { updateFilters } = useEntityList();

      useMountEffect(() => {
        updateFilters({ kind: new EntityKindFilter('component') });
      });

      return <>{children}</>;
    };

    return (
      <MemoryRouter initialEntries={[options.location ?? '']}>
        <TestApiProvider
          apis={[
            [configApiRef, mockConfigApi],
            [catalogApiRef, mockCatalogApi],
            [identityApiRef, mockIdentityApi],
            [storageApiRef, MockStorageApi.create()],
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
            [alertApiRef, { post: jest.fn() }],
            [translationApiRef, MockTranslationApi.create()],
            [errorApiRef, { error$: jest.fn(), post: jest.fn() }],
          ]}
        >
          <EntityListProvider pagination={options.pagination}>
            <InitialFiltersWrapper>{props.children}</InitialFiltersWrapper>
          </EntityListProvider>
        </TestApiProvider>
      </MemoryRouter>
    );
  };

describe('<EntityListProvider />', () => {
  const origReplaceState = window.history.replaceState;
  const pagination = false;

  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send backend filters', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(result.current.entities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'component' },
    });
  });

  it('resolves frontend filters', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
      initialProps: {
        userFilter: 'all',
      },
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    });
  });

  it('ignores search text when not paginating', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
      initialProps: {
        userFilter: 'all',
      },
    });

    act(() =>
      result.current.updateFilters({
        text: new EntityTextFilter('1'),
      }),
    );

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
        filter: { kind: 'component' },
      });
    });
  });

  it('resolves query param filter values', async () => {
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        location: `/catalog?${query}`,
        pagination,
      }),
    });

    await waitFor(() => {
      expect(result.current.queryParameters).toBeTruthy();
    });
    expect(result.current.queryParameters).toEqual({
      kind: 'component',
      type: 'service',
    });
  });

  it('does not fetch when only frontend filters change', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
      expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
    });
    expect(result.current.totalItems).toBe(1);

    await expect(() =>
      waitFor(() => {
        expect(mockCatalogApi.getEntities).not.toHaveBeenCalledTimes(1);
      }),
    ).rejects.toThrow();
  });

  it('debounces multiple filter changes', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.updateFilters({ kind: new EntityKindFilter('api') });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api', 'spec.type': ['service'] },
      });
    });
  });

  it('returns an error on catalogApi failure', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);

    expect(result.current.totalItems).toBe(2);

    mockCatalogApi.getEntities!.mockRejectedValueOnce('error');
    act(() => {
      result.current.updateFilters({ kind: new EntityKindFilter('api') });
    });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('returns an empty pageInfo', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });
    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenCalled();
    });

    expect(result.current.pageInfo).toBeUndefined();
  });
});

describe('<EntityListProvider pagination />', () => {
  const origReplaceState = window.history.replaceState;
  const pagination = true;
  const limit = 20;
  const orderFields = [{ field: 'metadata.name', order: 'asc' }];

  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends search text to the backend', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
      initialProps: {
        userFilter: 'all',
      },
    });

    act(() =>
      result.current.updateFilters({
        text: new EntityTextFilter('2'),
      }),
    );

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).not.toHaveBeenCalledTimes(1);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        filter: { kind: 'component' },
        limit,
        orderFields,
        fullTextFilter: {
          term: '2',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
          ],
        },
      });
    });
  });

  it('should send backend filters', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(result.current.entities.length).toBe(2);
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
      filter: { kind: 'component' },
      limit,
      orderFields,
    });
  });

  it('resolves frontend filters', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
      initialProps: {
        userFilter: 'all',
      },
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
    });
  });

  it('resolves query param filter values', async () => {
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        location: `/catalog?${query}`,
        pagination,
      }),
    });

    await waitFor(() => {
      expect(result.current.queryParameters).toBeTruthy();
    });
    expect(result.current.queryParameters).toEqual({
      kind: 'component',
      type: 'service',
    });
  });

  it('fetch when frontend filters change', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(2);
    });
  });

  it('debounces multiple filter changes', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.updateFilters({ kind: new EntityKindFilter('api') });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api', 'spec.type': ['service'] },
        limit,
        orderFields,
      });
    });

    expect(result.current.totalItems).toBe(10);
  });

  it('returns an error on catalogApi failure', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);

    mockCatalogApi.queryEntities!.mockRejectedValueOnce('error');
    act(() => {
      result.current.updateFilters({ kind: new EntityKindFilter('api') });
    });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  describe('pageInfo', () => {
    it('returns an empty pageInfo', async () => {
      mockCatalogApi.queryEntities!.mockResolvedValueOnce({
        items: [],
        pageInfo: {},
        totalItems: 10,
      });
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ pagination }),
      });
      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
      });

      expect(result.current.pageInfo).toStrictEqual({
        prev: undefined,
        next: undefined,
      });
    });

    it('returns pageInfo with next function and properly fetch next batch', async () => {
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ pagination }),
      });
      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.pageInfo!.next).toBeDefined();
      });

      act(() => {
        result.current.pageInfo!.next!();
      });

      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
          cursor: 'nextCursor',
          limit,
        });
      });
    });

    it('returns pageInfo with prev function and properly fetch prev batch', async () => {
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ pagination }),
      });
      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.pageInfo!.prev).toBeDefined();
      });

      act(() => {
        result.current.pageInfo!.prev!();
      });

      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
          cursor: 'prevCursor',
          limit,
        });
      });
    });
  });
});
