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

import type { GetEntitiesResponse } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  alertApiRef,
  configApiRef,
  errorApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { TestApiProvider } from '@backstage/test-utils';
import { mockApis } from '@backstage/frontend-test-utils';
import { useMountEffect } from '@react-hookz/web';
import { act, renderHook, waitFor } from '@testing-library/react';
import qs from 'qs';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { catalogApiRef } from '../api';
import { MockStarredEntitiesApi, starredEntitiesApiRef } from '../apis';
import {
  EntityKindFilter,
  EntityOwnerFilter,
  EntityTextFilter,
  EntityTypeFilter,
  EntityUserFilter,
} from '../filters';
import { createDeferred } from '@backstage/types';
import { EntityListPagination } from '../types';
import {
  EntityListContextProps,
  EntityListProvider,
  NewEntityListContext,
  useEntityList,
} from './useEntityListProvider';
import { createVersionedValueMap } from '@backstage/version-bridge';

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

const ownershipEntityRefs = ['user:default/guest'];

const mockIdentityApi = mockApis.identity({
  userEntityRef: 'user:default/guest',
  ownershipEntityRefs,
});
const mockCatalogApi = catalogApiMock.mock({
  getEntities: jest.fn().mockResolvedValue({ items: entities }),
  queryEntities: jest.fn().mockResolvedValue({
    items: entities,
    pageInfo: { prevCursor: 'prevCursor', nextCursor: 'nextCursor' },
    totalItems: 10,
  }),
  getEntityByRef: jest.fn().mockResolvedValue(undefined),
});

const createWrapper =
  (options: { location?: string; pagination: EntityListPagination }) =>
  (props: PropsWithChildren) => {
    const InitialFiltersWrapper = ({ children }: PropsWithChildren) => {
      const { updateFilters } = useEntityList();

      useMountEffect(() => {
        updateFilters({ kind: new EntityKindFilter('component', 'Component') });
      });

      return <>{children}</>;
    };

    return (
      <MemoryRouter initialEntries={[options.location ?? '']}>
        <TestApiProvider
          apis={[
            [configApiRef, mockApis.config()],
            [catalogApiRef, mockCatalogApi],
            [identityApiRef, mockIdentityApi],
            [storageApiRef, mockApis.storage()],
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
            [alertApiRef, mockApis.alert()],
            [translationApiRef, mockApis.translation()],
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
      order: [{ field: 'metadata.name', order: 'asc' }],
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
        order: [{ field: 'metadata.name', order: 'asc' }],
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

  it('resolves query param filter values with large arrays', async () => {
    const largeArray = Array.from({ length: 50 }, (_, i) => `owner-${i}`);
    const query = qs.stringify({
      filters: { kind: 'component', owners: largeArray },
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
      owners: largeArray,
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
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api', 'spec.type': ['service'] },
        order: [{ field: 'metadata.name', order: 'asc' }],
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
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
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

  it('should omit owners filter when kind is "user"', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('user', 'User'),
        owners: new EntityOwnerFilter(['user:default/guest']),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'user' },
      order: [{ field: 'metadata.name', order: 'asc' }],
    });
  });

  it('should omit owners filter when kind is "group"', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('group', 'Group'),
        owners: new EntityOwnerFilter(['group:default/team-a']),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'group' },
      order: [{ field: 'metadata.name', order: 'asc' }],
    });
  });

  it('uses the last applied filter even if an earlier request finishes later', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    const firstResult = createDeferred<GetEntitiesResponse>();
    const secondResult = createDeferred<GetEntitiesResponse>();

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.getEntities).toHaveBeenCalledTimes(1);

    mockCatalogApi.getEntities!.mockReturnValueOnce(firstResult);

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api' },
        order: [{ field: 'metadata.name', order: 'asc' }],
      });
    });

    mockCatalogApi.getEntities!.mockReturnValueOnce(secondResult);

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('system', 'System'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenNthCalledWith(3, {
        filter: { kind: 'system' },
        order: [{ field: 'metadata.name', order: 'asc' }],
      });
    });

    await act(async () => {
      secondResult.resolve({
        items: [],
      });
      firstResult.resolve({
        items: entities,
      });
    });

    expect(result.current.filters.kind!.value).toBe('system');
    expect(result.current.backendEntities.length).toBe(0);
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

  it('applies frontend-only filters without refetching', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.all(),
      }),
    );

    await waitFor(() => {
      expect(result.current.filters.user?.value).toBe('all');
      expect(result.current.entities.length).toBe(2);
    });
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
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
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
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
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
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

    it('should omit owners filter when kind is "user"', async () => {
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ pagination }),
      });

      act(() => {
        result.current.updateFilters({
          kind: new EntityKindFilter('user', 'User'),
          owners: new EntityOwnerFilter(['user:default/guest']),
        });
      });

      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
      });

      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: { kind: 'user' },
        }),
      );
    });

    it('should omit owners filter when kind is "group"', async () => {
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ pagination }),
      });

      act(() => {
        result.current.updateFilters({
          kind: new EntityKindFilter('group', 'Group'),
          owners: new EntityOwnerFilter(['group:default/team-a']),
        });
      });

      await waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
      });

      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: { kind: 'group' },
        }),
      );
    });
  });
});

describe(`<EntityListProvider pagination={{ mode: 'offset' }} />`, () => {
  const origReplaceState = window.history.replaceState;
  const pagination: EntityListPagination = { mode: 'offset' };
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
        offset: 0,
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
      offset: 0,
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

  it('applies frontend-only filters without refetching', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.all(),
      }),
    );

    await waitFor(() => {
      expect(result.current.filters.user?.value).toBe('all');
      expect(result.current.entities.length).toBe(2);
    });
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
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

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await expect(() =>
      waitFor(() => {
        expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(3);
      }),
    ).rejects.toThrow();
  });

  it('fetch when limit change', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);
    });

    act(() => result.current.setLimit(50));

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(2);
      expect(result.current.limit).toEqual(50);
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

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api', 'spec.type': ['service'] },
        limit,
        offset: 0,
        orderFields,
      });
    });
  });

  it('debounces multiple offset changes', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setOffset!(5);
      result.current.setOffset!(10);
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'component' },
        limit,
        offset: 10,
        orderFields,
      });
      expect(result.current.offset).toEqual(10);
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

    mockCatalogApi.queryEntities!.mockRejectedValueOnce('error');
    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
    });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should omit owners filter when kind is "user"', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('user', 'User'),
        owners: new EntityOwnerFilter(['user:default/guest']),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { kind: 'user' },
      }),
    );
  });

  it('should omit owners filter when kind is "group"', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('group', 'Group'),
        owners: new EntityOwnerFilter(['group:default/team-a']),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { kind: 'group' },
      }),
    );
  });
});

describe('versioned context', () => {
  it('should work explicitly with new versioned contexts', () => {
    const value: EntityListContextProps<any> = {
      filters: {},
      entities: [],
      backendEntities: [],
      updateFilters: jest.fn(),
      queryParameters: {},
      loading: true,
      limit: 277,
      setLimit: jest.fn(),
      setOffset: jest.fn(),
      paginationMode: 'none',
    };

    const { result } = renderHook(() => useEntityList(), {
      wrapper: ({ children }) => {
        const InitialFiltersWrapper = (f: PropsWithChildren<{}>) => {
          const { updateFilters } = useEntityList();
          useMountEffect(() => {
            updateFilters({
              kind: new EntityKindFilter('component', 'Component'),
            });
          });
          return <>{f.children}</>;
        };

        return (
          <MemoryRouter initialEntries={['/catalog']}>
            <TestApiProvider
              apis={[
                [configApiRef, mockApis.config()],
                [catalogApiRef, mockCatalogApi],
                [identityApiRef, mockIdentityApi],
                [storageApiRef, mockApis.storage()],
                [starredEntitiesApiRef, new MockStarredEntitiesApi()],
                [alertApiRef, { post: jest.fn() }],
                [translationApiRef, mockApis.translation()],
                [errorApiRef, { error$: jest.fn(), post: jest.fn() }],
              ]}
            >
              <NewEntityListContext.Provider
                value={createVersionedValueMap({ 1: value })}
              >
                <InitialFiltersWrapper>{children}</InitialFiltersWrapper>
              </NewEntityListContext.Provider>
            </TestApiProvider>
          </MemoryRouter>
        );
      },
    });

    expect(result.current.limit).toBe(277);
  });
});
