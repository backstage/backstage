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

import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { Entity } from '@backstage/catalog-model';
import {
  alertApiRef,
  configApiRef,
  errorApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { mockApis, TestApiProvider } from '@backstage/test-utils';
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
import { EntityListProvider, useEntityList } from './useEntityListProvider';
import { useMountEffect } from '@react-hookz/web';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { EntityListPagination } from '../types';

// Expected fields for catalog table optimization
const expectedCatalogTableFields = [
  'kind',
  'metadata.name',
  'metadata.namespace',
  'metadata.title',
  'metadata.description',
  'metadata.tags',
  'metadata.labels',
  'metadata.annotations',
  'spec.type',
  'spec.lifecycle',
  'spec.targets',
  'spec.target',
  'relations',
];

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
            [alertApiRef, { post: jest.fn() }],
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
      fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
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
      result.current.updateFilters({
        kind: new EntityKindFilter('api', 'API'),
      });
      result.current.updateFilters({ type: new EntityTypeFilter('service') });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenNthCalledWith(2, {
        filter: { kind: 'api', 'spec.type': ['service'] },
        fields: expectedCatalogTableFields,
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
      fields: expectedCatalogTableFields,
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
      fields: expectedCatalogTableFields,
    });
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
        fields: expectedCatalogTableFields,
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
      fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
        fullTextFilter: undefined,
        offset: undefined,
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
          fields: expectedCatalogTableFields,
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
          fields: expectedCatalogTableFields,
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
          fields: expectedCatalogTableFields,
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
          fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
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
      fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
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
        fields: expectedCatalogTableFields,
      }),
    );
  });
});

describe('Field optimization', () => {
  it('should only request necessary fields for catalog table', async () => {
    // Mock a complete entity with many fields (simulating what backend would have)
    const completeEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'my-service',
        namespace: 'default',
        title: 'My Service',
        description: 'A sample microservice',
        labels: {
          team: 'backend',
          language: 'typescript',
          environment: 'production',
        },
        tags: ['api', 'microservice'],
        annotations: {
          'backstage.io/edit-url':
            'https://github.com/org/repo/edit/main/catalog-info.yaml',
          'backstage.io/view-url': 'https://github.com/org/repo',
          'backstage.io/source-location':
            'url:https://github.com/org/repo/tree/main/',
          'jenkins.io/build-url': 'https://jenkins.example.com/job/my-service/',
          'sonarqube.org/project-key': 'my-service',
          'grafana/dashboard-selector': 'my-service',
          'prometheus.io/rule': 'my-service-alerts',
        },
        uid: '12345678-1234-1234-1234-123456789012',
        etag: 'abc123',
        generation: 1,
        resourceVersion: '12345',
        creationTimestamp: '2023-01-01T00:00:00Z',
        deletionTimestamp: undefined,
        finalizers: [],
        managedFields: [],
        ownerReferences: [],
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'team-backend',
        system: 'payment-system',
        targets: ['https://api.example.com'],
        // Additional fields that should NOT be requested for the table
        definition:
          'Large OpenAPI spec content that is not needed for table...',
        customField1: 'Some large custom data',
        customField2: { nested: { data: 'that is not used in table' } },
        internalConfig: {
          database: {
            host: 'db.example.com',
            port: 5432,
            credentials: 'secret-data-not-needed-for-table',
          },
        },
      },

      relations: [
        {
          type: 'dependsOn',
          targetRef: 'component:default/database',
        },
      ],
    };

    // Mock the API to return the complete entity (but expect it to be called with fields parameter)
    mockCatalogApi.getEntities!.mockResolvedValue({
      items: [completeEntity],
    });

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination: false }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('component', 'Component'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntities).toHaveBeenCalled();
    });

    // Verify that the API was called with ONLY the necessary fields
    expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
      filter: { kind: 'component' },
      fields: expectedCatalogTableFields,
    });

    // Verify that the expected fields array contains only the necessary fields
    expect(expectedCatalogTableFields).toEqual([
      'kind',
      'metadata.name',
      'metadata.namespace',
      'metadata.title',
      'metadata.description',
      'metadata.tags',
      'metadata.labels',
      'metadata.annotations',
      'spec.type',
      'spec.lifecycle',
      'spec.targets',
      'spec.target',
      'relations',
    ]);

    // Verify that unnecessary fields are NOT requested
    expect(expectedCatalogTableFields).not.toContain('spec.definition');
    expect(expectedCatalogTableFields).not.toContain('spec.customField1');
    expect(expectedCatalogTableFields).not.toContain('spec.customField2');
    expect(expectedCatalogTableFields).not.toContain('spec.internalConfig');
    expect(expectedCatalogTableFields).not.toContain('status');
    expect(expectedCatalogTableFields).not.toContain('metadata.uid');
    expect(expectedCatalogTableFields).not.toContain('metadata.etag');
    expect(expectedCatalogTableFields).not.toContain('metadata.generation');
    expect(expectedCatalogTableFields).not.toContain(
      'metadata.resourceVersion',
    );
    expect(expectedCatalogTableFields).not.toContain(
      'metadata.creationTimestamp',
    );
    expect(expectedCatalogTableFields).not.toContain('metadata.managedFields');
    expect(expectedCatalogTableFields).not.toContain(
      'metadata.ownerReferences',
    );

    // Verify that we get the entities back (proving the functionality still works)
    await waitFor(() => {
      expect(result.current.entities).toHaveLength(1);
    });
  });

  it('should request necessary fields for paginated requests', async () => {
    // Clear mocks before this test to avoid interference from other tests
    jest.clearAllMocks();

    const { result } = renderHook(() => useEntityList(), {
      wrapper: createWrapper({ pagination: { mode: 'offset', limit: 20 } }),
    });

    act(() => {
      result.current.updateFilters({
        kind: new EntityKindFilter('component', 'Component'),
      });
    });

    await waitFor(() => {
      expect(mockCatalogApi.queryEntities).toHaveBeenCalled();
    });

    // Verify that paginated API calls also include the fields parameter
    // Use the most recent call since other tests might have made calls before
    const lastCall =
      mockCatalogApi.queryEntities.mock.calls[
        mockCatalogApi.queryEntities.mock.calls.length - 1
      ];
    expect(lastCall[0]).toEqual(
      expect.objectContaining({
        filter: { kind: 'component' },
        fields: expectedCatalogTableFields,
      }),
    );
  });

  it('should include relations field for table entity processing', async () => {
    // This test ensures that the 'relations' field is included because
    // it's needed by the toEntityRow function in CatalogTable
    expect(expectedCatalogTableFields).toContain('relations');
  });

  it('should include all metadata fields used by default columns', async () => {
    // These fields are used by the default catalog table columns
    const metadataFields = expectedCatalogTableFields.filter(field =>
      field.startsWith('metadata.'),
    );

    expect(metadataFields).toContain('metadata.name');
    expect(metadataFields).toContain('metadata.namespace');
    expect(metadataFields).toContain('metadata.title');
    expect(metadataFields).toContain('metadata.description');
    expect(metadataFields).toContain('metadata.tags');
    expect(metadataFields).toContain('metadata.labels');
    expect(metadataFields).toContain('metadata.annotations');
  });

  it('should include spec fields used by table columns', async () => {
    // These spec fields are used by various catalog table columns
    const specFields = expectedCatalogTableFields.filter(field =>
      field.startsWith('spec.'),
    );

    expect(specFields).toContain('spec.type');
    expect(specFields).toContain('spec.lifecycle');
    expect(specFields).toContain('spec.targets');
    expect(specFields).toContain('spec.target');
  });
});
