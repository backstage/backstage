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
import { EntityFilter, EntityListPagination } from '../types';
import {
  DefaultEntityFilters,
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
async function* streamOf(response: Promise<GetEntitiesResponse>) {
  yield (await response).items;
}

const mockCatalogApi = catalogApiMock.mock({
  queryEntities: jest.fn().mockResolvedValue({
    items: entities,
    pageInfo: { prevCursor: 'prevCursor', nextCursor: 'nextCursor' },
    totalItems: 10,
  }),
  getEntityByRef: jest.fn().mockResolvedValue(undefined),
  streamEntities: jest
    .fn()
    .mockImplementation(() => streamOf(Promise.resolve({ items: entities }))),
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
    expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
    expect(mockCatalogApi.streamEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledWith({
        query: { kind: 'component' },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
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
        expect(mockCatalogApi.streamEntities).not.toHaveBeenCalledTimes(1);
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
    expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenNthCalledWith(2, {
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });
  });

  it('does not re-fetch when backend filter params are unchanged', async () => {
    const deferred = createDeferred<GetEntitiesResponse>();
    mockCatalogApi.streamEntities!.mockImplementationOnce(() =>
      streamOf(deferred),
    );

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('component', 'component'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('component', 'Component'),
      });
    });
    act(() => {
      result.current.updateFilters({
        user: EntityUserFilter.all(),
      });
    });

    await act(async () => {
      deferred.resolve({ items: entities });
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);
  });

  it('does not rewrite the URL when the serialized filters are unchanged', async () => {
    // Delegate to the real implementation so window.location actually
    // reflects the rewritten URL, which is what the guard compares against.
    const replaceStateSpy = jest.fn(
      (...args: Parameters<History['replaceState']>) =>
        origReplaceState.apply(window.history, args),
    );
    window.history.replaceState = replaceStateSpy;

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    // Applying the user filter changes the URL, so the URL is rewritten once.
    act(() => {
      result.current.updateFilters({ user: EntityUserFilter.all() });
    });

    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalled();
    });
    const callsAfterChange = replaceStateSpy.mock.calls.length;

    // Re-applying an equivalent filter produces a fresh requestedFilters
    // object that serializes to the same URL (mirrors the UserListPicker
    // `?filters[user]=all` churn). The URL must not be rewritten again,
    // since repeated replaceState calls crash Safari with a SecurityError.
    act(() => {
      result.current.updateFilters({ user: EntityUserFilter.all() });
    });

    await expect(
      waitFor(() => {
        expect(replaceStateSpy.mock.calls.length).toBeGreaterThan(
          callsAfterChange,
        );
      }),
    ).rejects.toThrow();
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

    mockCatalogApi.streamEntities!.mockImplementationOnce(() =>
      streamOf(Promise.reject('error')),
    );
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalled();
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.streamEntities).toHaveBeenCalledWith({
      query: { kind: 'user' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
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
      expect(mockCatalogApi.streamEntities).toHaveBeenCalled();
    });

    expect(mockCatalogApi.streamEntities).toHaveBeenCalledWith({
      query: { kind: 'group' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('re-fetches when refresh is called', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });
    expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refresh?.();
    });

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(2);
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
    expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(1);

    mockCatalogApi.streamEntities!.mockImplementationOnce(() =>
      streamOf(firstResult),
    );

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenNthCalledWith(2, {
        query: { kind: 'api' },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });

    mockCatalogApi.streamEntities!.mockImplementationOnce(() =>
      streamOf(secondResult),
    );

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('system', 'System'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenNthCalledWith(3, {
        query: { kind: 'system' },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
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
      expect(mockCatalogApi.streamEntities).not.toHaveBeenCalledTimes(1);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        query: { kind: 'component' },
        limit,
        orderFields,
        totalItems: 'exclude',
        fullTextFilter: {
          term: '2',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
            'spec.target',
            'spec.targets',
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
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      limit,
      orderFields,
      totalItems: 'exclude',
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
    });
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          $all: [
            { kind: 'component' },
            {
              relations: {
                $contains: {
                  type: 'ownedBy',
                  targetRef: ownershipEntityRefs[0],
                },
              },
            },
          ],
        },
        totalItems: 'exclude',
      }),
    );
  });

  it('applies frontend-only filters without refetching', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    // Record the number of list calls (totalItems: 'exclude') after init
    const listCallsAfterInit = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.all(),
      }),
    );

    await waitFor(() => {
      expect(result.current.filters.user?.value).toBe('all');
      expect(result.current.entities.length).toBe(2);
    });
    // EntityUserFilter.all() doesn't change the backend filter, so no
    // additional list call should fire (count effect fires, but not
    // the list fetch).
    const listCallsAfterUpdate = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;
    expect(listCallsAfterUpdate).toBe(listCallsAfterInit);
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
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
    });

    // Verify the list call with the owned filter was made
    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            $all: [
              { kind: 'component' },
              {
                relations: {
                  $contains: {
                    type: 'ownedBy',
                    targetRef: ownershipEntityRefs[0],
                  },
                },
              },
            ],
          },
          totalItems: 'exclude',
        }),
      );
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

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        limit,
        orderFields,
        totalItems: 'exclude',
      });
    });
  });

  it('fetches count separately and does not re-count on cursor navigation', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    // The count query uses limit: 0 (without totalItems: 'exclude')
    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 0 }),
      );
    });

    const countCallsBefore = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.limit === 0).length;

    // Navigate to next page via cursor — should NOT re-run the count
    act(() => {
      result.current.pageInfo?.next?.();
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: expect.any(String),
          totalItems: 'exclude',
        }),
      );
    });

    const countCallsAfter = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.limit === 0).length;

    expect(countCallsAfter).toBe(countCallsBefore);
  });

  it('re-fetches list and count when refresh is called', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 0 }),
      );
    });

    const listCallsBefore = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;
    const countCallsBefore = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.limit === 0).length;

    act(() => {
      result.current.refresh?.();
    });

    await waitFor(() => {
      const listCallsAfter = (
        mockCatalogApi.queryEntities as jest.Mock
      ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;
      const countCallsAfter = (
        mockCatalogApi.queryEntities as jest.Mock
      ).mock.calls.filter((c: any) => c[0]?.limit === 0).length;
      expect(listCallsAfter).toBe(listCallsBefore + 1);
      expect(countCallsAfter).toBe(countCallsBefore + 1);
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

    // The count effect fires first (consuming one rejection), then the
    // list call fires. Both must reject for the error to surface.
    mockCatalogApi.queryEntities!.mockRejectedValueOnce('error');
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
          totalItems: 'exclude',
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
          totalItems: 'exclude',
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
          query: { kind: 'user' },
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
          query: { kind: 'group' },
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
      expect(mockCatalogApi.streamEntities).not.toHaveBeenCalledTimes(1);
      expect(result.current.entities.length).toBe(1);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        query: { kind: 'component' },
        limit,
        offset: 0,
        orderFields,
        totalItems: 'exclude',
        fullTextFilter: {
          term: '2',
          fields: [
            'metadata.name',
            'metadata.title',
            'spec.profile.displayName',
            'spec.target',
            'spec.targets',
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
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      limit,
      offset: 0,
      orderFields,
      totalItems: 'exclude',
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
    });
    expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          $all: [
            { kind: 'component' },
            {
              relations: {
                $contains: {
                  type: 'ownedBy',
                  targetRef: ownershipEntityRefs[0],
                },
              },
            },
          ],
        },
        totalItems: 'exclude',
      }),
    );
  });

  it('applies frontend-only filters without refetching', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    // Record the number of list calls (totalItems: 'exclude') after init
    const listCallsAfterInit = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.all(),
      }),
    );

    await waitFor(() => {
      expect(result.current.filters.user?.value).toBe('all');
      expect(result.current.entities.length).toBe(2);
    });
    // EntityUserFilter.all() doesn't change the backend filter, so no
    // additional list call should fire (count effect fires, but not
    // the list fetch).
    const listCallsAfterUpdate = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;
    expect(listCallsAfterUpdate).toBe(listCallsAfterInit);
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
    });

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
    });

    // Verify the list call with the owned filter was made
    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            $all: [
              { kind: 'component' },
              {
                relations: {
                  $contains: {
                    type: 'ownedBy',
                    targetRef: ownershipEntityRefs[0],
                  },
                },
              },
            ],
          },
          totalItems: 'exclude',
        }),
      );
    });

    // Record list call count before setting the same filter again
    const listCallsBefore = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;

    act(() =>
      result.current.updateFilters({
        user: EntityUserFilter.owned(ownershipEntityRefs),
      }),
    );

    // Wait for any pending effects to settle
    await waitFor(() => {
      expect(result.current.entities.length).toBe(1);
    });

    // Setting the same filter again should not trigger additional list calls
    const listCallsAfter = (
      mockCatalogApi.queryEntities as jest.Mock
    ).mock.calls.filter((c: any) => c[0]?.totalItems === 'exclude').length;
    expect(listCallsAfter).toBe(listCallsBefore);
  });

  it('fetch when limit change', async () => {
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
    });

    act(() => result.current.setLimit(50));

    // setLimit does not change requestedFilters, so no extra count call.
    // Only the debounced list call fires.
    await waitFor(() => {
      expect(result.current.limit).toEqual(50);
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
          totalItems: 'exclude',
        }),
      );
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

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        limit,
        offset: 0,
        orderFields,
        totalItems: 'exclude',
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

    act(() => {
      result.current.setOffset!(5);
      result.current.setOffset!(10);
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        query: { kind: 'component' },
        limit,
        offset: 10,
        orderFields,
        totalItems: 'exclude',
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

    // The count effect fires first (consuming one rejection), then the
    // list call fires. Both must reject for the error to surface.
    mockCatalogApi.queryEntities!.mockRejectedValueOnce('error');
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
        query: { kind: 'user' },
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
        query: { kind: 'group' },
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
      totalItemsLoading: false,
      limit: 277,
      setLimit: jest.fn(),
      setOffset: jest.fn(),
      paginationMode: 'none',
      refresh: jest.fn(),
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

describe('<EntityListProvider /> with predicate queries', () => {
  type Filters = DefaultEntityFilters & { notExperimental?: EntityFilter };
  const notExperimental: EntityFilter = {
    getCatalogQuery: () => ({ $not: { 'spec.lifecycle': 'experimental' } }),
  };
  const origReplaceState = window.history.replaceState;

  beforeEach(() => {
    window.history.replaceState = jest.fn();
    jest.clearAllMocks();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  it('stops streaming once a newer request supersedes it', async () => {
    const gate = createDeferred<void>();
    let pulled = 0;
    mockCatalogApi.streamEntities!.mockImplementationOnce(
      async function* stream() {
        pulled += 1;
        yield [entities[0]];
        await gate;
        pulled += 1;
        yield [entities[1]];
        pulled += 1;
        yield [entities[1]];
      },
    );

    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ pagination: false }),
    });

    await waitFor(() => expect(pulled).toBe(1));
    act(() => result.current.updateFilters({ notExperimental }));
    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenCalledTimes(2);
    });
    gate.resolve();

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });
    expect(pulled).toBe(2);
  });

  it('combines predicates with other filters when not paginating', async () => {
    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ pagination: false }),
    });

    act(() => result.current.updateFilters({ notExperimental }));

    await waitFor(() => {
      expect(mockCatalogApi.streamEntities).toHaveBeenLastCalledWith({
        query: {
          $all: [
            { kind: 'component' },
            { $not: { 'spec.lifecycle': 'experimental' } },
          ],
        },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });
    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });
  });

  it('sends the query in offset mode, including for the count', async () => {
    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ pagination: { mode: 'offset' } }),
    });

    act(() => result.current.updateFilters({ notExperimental }));

    const query = {
      $all: [
        { kind: 'component' },
        { $not: { 'spec.lifecycle': 'experimental' } },
      ],
    };
    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          totalItems: 'exclude',
        }),
      );
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          limit: 0,
        }),
      );
    });
  });
});
