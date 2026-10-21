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

import type {
  CatalogApi,
  GetEntitiesResponse,
} from '@backstage/catalog-client';
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

const createWrapper =
  (options: {
    catalogApi: CatalogApi;
    location?: string;
    pagination: EntityListPagination;
  }) =>
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
            [catalogApiRef, options.catalogApi],
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

  it('should send backend filters', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(result.current.entities.length).toBe(2);
    expect(streamEntities).toHaveBeenCalledTimes(1);
    expect(streamEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('resolves frontend filters', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(streamEntities).toHaveBeenCalledTimes(1);
    });
  });

  it('ignores search text when not paginating', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(streamEntities).toHaveBeenCalledTimes(1);
      expect(streamEntities).toHaveBeenCalledWith({
        query: { kind: 'component' },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });
  });

  it('resolves query param filter values', async () => {
    const catalogApi = catalogApiMock({ entities });
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        catalogApi,
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
    const catalogApi = catalogApiMock({ entities });
    const largeArray = Array.from({ length: 50 }, (_, i) => `owner-${i}`);
    const query = qs.stringify({
      filters: { kind: 'component', owners: largeArray },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        catalogApi,
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
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
      expect(streamEntities).toHaveBeenCalledTimes(1);
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
        expect(streamEntities).not.toHaveBeenCalledTimes(1);
      }),
    ).rejects.toThrow();
  });

  it('debounces multiple filter changes', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.backendEntities.length).toBe(2);
    expect(streamEntities).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenNthCalledWith(2, {
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });
  });

  it('does not re-fetch when backend filter params are unchanged', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const deferred = createDeferred<GetEntitiesResponse>();
    streamEntities.mockImplementationOnce(() => streamOf(deferred));

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('component', 'component'),
      });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalledTimes(1);
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

    expect(streamEntities).toHaveBeenCalledTimes(1);
  });

  it('does not rewrite the URL when the serialized filters are unchanged', async () => {
    const catalogApi = catalogApiMock({ entities });
    // Delegate to the real implementation so window.location actually
    // reflects the rewritten URL, which is what the guard compares against.
    const replaceStateSpy = jest.fn(
      (...args: Parameters<History['replaceState']>) =>
        origReplaceState.apply(window.history, args),
    );
    window.history.replaceState = replaceStateSpy;

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);

    expect(result.current.totalItems).toBe(2);

    streamEntities.mockImplementationOnce(() =>
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
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });
    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalled();
    });

    expect(result.current.pageInfo).toBeUndefined();
  });

  it('should omit owners filter when kind is "user"', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('user', 'User'),
        owners: new EntityOwnerFilter(['user:default/guest']),
      });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalled();
    });

    expect(streamEntities).toHaveBeenCalledWith({
      query: { kind: 'user' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('should omit owners filter when kind is "group"', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('group', 'Group'),
        owners: new EntityOwnerFilter(['group:default/team-a']),
      });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalled();
    });

    expect(streamEntities).toHaveBeenCalledWith({
      query: { kind: 'group' },
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('re-fetches when refresh is called', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });
    expect(streamEntities).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refresh?.();
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalledTimes(2);
    });
  });

  it('uses the last applied filter even if an earlier request finishes later', async () => {
    const catalogApi = catalogApiMock({ entities });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    const firstResult = createDeferred<GetEntitiesResponse>();
    const secondResult = createDeferred<GetEntitiesResponse>();

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.backendEntities.length).toBe(2);
    expect(streamEntities).toHaveBeenCalledTimes(1);

    streamEntities.mockImplementationOnce(() => streamOf(firstResult));

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenNthCalledWith(2, {
        query: { kind: 'api' },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        totalItems: 'exclude',
      });
    });

    streamEntities.mockImplementationOnce(() => streamOf(secondResult));

    await act(async () => {
      result.current.updateFilters({
        kind: new EntityKindFilter('system', 'System'),
      });
    });

    await waitFor(() => {
      expect(streamEntities).toHaveBeenNthCalledWith(3, {
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

  it('sends search text to the backend', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(streamEntities).not.toHaveBeenCalledTimes(1);
      expect(result.current.entities.length).toBe(1);
      expect(queryEntities).toHaveBeenCalledWith({
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(result.current.entities.length).toBe(2);
    expect(queryEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      limit,
      orderFields,
      totalItems: 'exclude',
    });
  });

  it('resolves frontend filters', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(result.current.backendEntities.length).toBe(1);
      expect(result.current.entities.length).toBe(1);
    });
    expect(queryEntities).toHaveBeenCalledWith(
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    // Record the number of list calls (totalItems: 'exclude') after init
    const listCallsAfterInit = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;

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
    const listCallsAfterUpdate = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;
    expect(listCallsAfterUpdate).toBe(listCallsAfterInit);
  });

  it('resolves query param filter values', async () => {
    const catalogApi = catalogApiMock({ entities });
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        catalogApi,
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(queryEntities).toHaveBeenCalledWith(
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(queryEntities).toHaveBeenCalledWith({
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        limit,
        orderFields,
        totalItems: 'exclude',
      });
    });
  });

  it('fetches count separately and does not re-count on cursor navigation', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination: { limit: 1 } }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(1);
    });

    // The count query uses limit: 0 (without totalItems: 'exclude')
    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 0 }),
      );
    });

    const countCallsBefore = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.limit === 0,
    ).length;

    // Navigate to next page via cursor — should NOT re-run the count
    act(() => {
      result.current.pageInfo?.next?.();
    });

    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: expect.any(String),
          totalItems: 'exclude',
        }),
      );
    });

    const countCallsAfter = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.limit === 0,
    ).length;

    expect(countCallsAfter).toBe(countCallsBefore);
  });

  it('re-fetches list and count when refresh is called', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 0 }),
      );
    });

    const listCallsBefore = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;
    const countCallsBefore = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.limit === 0,
    ).length;

    act(() => {
      result.current.refresh?.();
    });

    await waitFor(() => {
      const listCallsAfter = queryEntities.mock.calls.filter(
        (c: any) => c[0]?.totalItems === 'exclude',
      ).length;
      const countCallsAfter = queryEntities.mock.calls.filter(
        (c: any) => c[0]?.limit === 0,
      ).length;
      expect(listCallsAfter).toBe(listCallsBefore + 1);
      expect(countCallsAfter).toBe(countCallsBefore + 1);
    });
  });

  it('returns an error on catalogApi failure', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);

    // The count effect fires first (consuming one rejection), then the
    // list call fires. Both must reject for the error to surface.
    queryEntities.mockRejectedValueOnce('error');
    queryEntities.mockRejectedValueOnce('error');
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
      const catalogApi = catalogApiMock({ entities });
      const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ catalogApi, pagination }),
      });
      await waitFor(() => {
        expect(queryEntities).toHaveBeenCalled();
      });

      expect(result.current.pageInfo).toStrictEqual({
        prev: undefined,
        next: undefined,
      });
    });

    it('returns pageInfo with next function and properly fetch next batch', async () => {
      const catalogApi = catalogApiMock({ entities });
      const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ catalogApi, pagination: { limit: 1 } }),
      });

      await waitFor(() => {
        expect(result.current.pageInfo!.next).toBeDefined();
      });
      expect(result.current.pageInfo!.prev).toBeUndefined();
      expect(result.current.entities.map(e => e.metadata.name)).toEqual([
        'component-1',
      ]);

      act(() => {
        result.current.pageInfo!.next!();
      });

      await waitFor(() => {
        expect(result.current.entities.map(e => e.metadata.name)).toEqual([
          'component-2',
        ]);
      });
      expect(queryEntities).toHaveBeenCalledWith({
        cursor: expect.any(String),
        limit: 1,
        totalItems: 'exclude',
      });
      expect(result.current.pageInfo!.next).toBeUndefined();
    });

    it('returns pageInfo with prev function and properly fetch prev batch', async () => {
      const catalogApi = catalogApiMock({ entities });
      const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ catalogApi, pagination: { limit: 1 } }),
      });

      await waitFor(() => {
        expect(result.current.pageInfo!.next).toBeDefined();
      });
      act(() => {
        result.current.pageInfo!.next!();
      });

      await waitFor(() => {
        expect(result.current.pageInfo!.prev).toBeDefined();
      });
      queryEntities.mockClear();

      act(() => {
        result.current.pageInfo!.prev!();
      });

      await waitFor(() => {
        expect(result.current.entities.map(e => e.metadata.name)).toEqual([
          'component-1',
        ]);
      });
      expect(queryEntities).toHaveBeenCalledWith({
        cursor: expect.any(String),
        limit: 1,
        totalItems: 'exclude',
      });
    });

    it('should omit owners filter when kind is "user"', async () => {
      const catalogApi = catalogApiMock({ entities });
      const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ catalogApi, pagination }),
      });

      act(() => {
        result.current.updateFilters({
          kind: new EntityKindFilter('user', 'User'),
          owners: new EntityOwnerFilter(['user:default/guest']),
        });
      });

      await waitFor(() => {
        expect(queryEntities).toHaveBeenCalled();
      });

      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { kind: 'user' },
        }),
      );
    });

    it('should omit owners filter when kind is "group"', async () => {
      const catalogApi = catalogApiMock({ entities });
      const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
      const { result } = renderHook(() => useEntityList(), {
        wrapper: createWrapper({ catalogApi, pagination }),
      });

      act(() => {
        result.current.updateFilters({
          kind: new EntityKindFilter('group', 'Group'),
          owners: new EntityOwnerFilter(['group:default/team-a']),
        });
      });

      await waitFor(() => {
        expect(queryEntities).toHaveBeenCalled();
      });

      expect(queryEntities).toHaveBeenCalledWith(
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

  it('sends search text to the backend', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(streamEntities).not.toHaveBeenCalledTimes(1);
      expect(result.current.entities.length).toBe(1);
      expect(queryEntities).toHaveBeenCalledWith({
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
    });

    expect(result.current.entities.length).toBe(2);
    expect(queryEntities).toHaveBeenCalledWith({
      query: { kind: 'component' },
      limit,
      offset: 0,
      orderFields,
      totalItems: 'exclude',
    });
  });

  it('resolves frontend filters', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(result.current.backendEntities.length).toBe(1);
      expect(result.current.entities.length).toBe(1);
    });
    expect(queryEntities).toHaveBeenCalledWith(
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBe(2);
      expect(result.current.filters.kind?.value).toBe('component');
    });

    // Record the number of list calls (totalItems: 'exclude') after init
    const listCallsAfterInit = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;

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
    const listCallsAfterUpdate = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;
    expect(listCallsAfterUpdate).toBe(listCallsAfterInit);
  });

  it('resolves query param filter values', async () => {
    const catalogApi = catalogApiMock({ entities });
    const query = qs.stringify({
      filters: { kind: 'component', type: 'service' },
    });
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({
        catalogApi,
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(queryEntities).toHaveBeenCalledWith(
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
    const listCallsBefore = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;

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
    const listCallsAfter = queryEntities.mock.calls.filter(
      (c: any) => c[0]?.totalItems === 'exclude',
    ).length;
    expect(listCallsAfter).toBe(listCallsBefore);
  });

  it('fetch when limit change', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.entities.length).toBe(2);
    });

    act(() => result.current.setLimit(50));

    // setLimit does not change requestedFilters, so no extra count call.
    // Only the debounced list call fires.
    await waitFor(() => {
      expect(result.current.limit).toEqual(50);
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
          totalItems: 'exclude',
        }),
      );
    });
  });

  it('debounces multiple filter changes', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(queryEntities).toHaveBeenCalledWith({
        query: { $all: [{ kind: 'api' }, { 'spec.type': 'service' }] },
        limit,
        offset: 0,
        orderFields,
        totalItems: 'exclude',
      });
    });
  });

  it('debounces multiple offset changes', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
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
      expect(queryEntities).toHaveBeenCalledWith({
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    await waitFor(() => {
      expect(result.current.backendEntities.length).toBeGreaterThan(0);
    });
    expect(result.current.backendEntities.length).toBe(2);

    // The count effect fires first (consuming one rejection), then the
    // list call fires. Both must reject for the error to surface.
    queryEntities.mockRejectedValueOnce('error');
    queryEntities.mockRejectedValueOnce('error');
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
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('user', 'User'),
        owners: new EntityOwnerFilter(['user:default/guest']),
      });
    });

    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalled();
    });

    expect(queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { kind: 'user' },
      }),
    );
  });

  it('should omit owners filter when kind is "group"', async () => {
    const catalogApi = catalogApiMock({ entities });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ catalogApi, pagination }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('group', 'Group'),
        owners: new EntityOwnerFilter(['group:default/team-a']),
      });
    });

    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalled();
    });

    expect(queryEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { kind: 'group' },
      }),
    );
  });
});

describe('versioned context', () => {
  it('should work explicitly with new versioned contexts', () => {
    const catalogApi = catalogApiMock();
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
                [catalogApiRef, catalogApi],
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
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  it('stops streaming once a newer request supersedes it', async () => {
    const productionComponent: Entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'production-component' },
      spec: { lifecycle: 'production' },
    };
    const experimentalComponent: Entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'experimental-component' },
      spec: { lifecycle: 'experimental' },
    };
    const catalogApi = catalogApiMock({
      entities: [productionComponent, experimentalComponent],
    });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');

    const gate = createDeferred<void>();
    let pulled = 0;
    streamEntities.mockImplementationOnce(async function* stream() {
      pulled += 1;
      yield [productionComponent];
      await gate;
      pulled += 1;
      yield [experimentalComponent];
      pulled += 1;
      yield [experimentalComponent];
    });

    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ catalogApi, pagination: false }),
    });

    await waitFor(() => expect(pulled).toBe(1));
    act(() => result.current.updateFilters({ notExperimental }));
    await waitFor(() => {
      expect(streamEntities).toHaveBeenCalledTimes(2);
    });
    gate.resolve();

    await waitFor(() => {
      expect(result.current.backendEntities.map(e => e.metadata.name)).toEqual([
        'production-component',
      ]);
    });
    expect(pulled).toBe(2);
  });

  it('combines predicates with other filters when not paginating', async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: { name: 'production-component' },
          spec: { lifecycle: 'production' },
        },
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: { name: 'experimental-component' },
          spec: { lifecycle: 'experimental' },
        },
      ],
    });
    const streamEntities = jest.spyOn(catalogApi, 'streamEntities');

    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ catalogApi, pagination: false }),
    });

    act(() => result.current.updateFilters({ notExperimental }));

    await waitFor(() => {
      expect(streamEntities).toHaveBeenLastCalledWith({
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
      expect(result.current.backendEntities.map(e => e.metadata.name)).toEqual([
        'production-component',
      ]);
    });
  });

  it('sends the query in offset mode, including for the count', async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: { name: 'production-component' },
          spec: { lifecycle: 'production' },
        },
        {
          apiVersion: '1',
          kind: 'Component',
          metadata: { name: 'experimental-component' },
          spec: { lifecycle: 'experimental' },
        },
      ],
    });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

    const { result } = renderHook(() => useEntityList<Filters>(), {
      wrapper: createWrapper({ catalogApi, pagination: { mode: 'offset' } }),
    });

    act(() => result.current.updateFilters({ notExperimental }));

    const query = {
      $all: [
        { kind: 'component' },
        { $not: { 'spec.lifecycle': 'experimental' } },
      ],
    };
    await waitFor(() => {
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          totalItems: 'exclude',
        }),
      );
      expect(queryEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          query,
          limit: 0,
        }),
      );
    });
    await waitFor(() => {
      expect(result.current.entities.map(e => e.metadata.name)).toEqual([
        'production-component',
      ]);
    });
  });
});
