/*
 * Copyright 2023 The Backstage Authors
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
import { CatalogApi } from '@backstage/catalog-client';
import { renderHook } from '@testing-library/react-hooks';
import {
  DefaultEntityFilters,
  EntityListProvider,
  useEntityList,
} from '../../hooks';
import { catalogApiRef } from '../../api';
import {
  ApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { useOwnedEntitiesCount } from './useOwnedEntitiesCount';
import {
  EntityNamespaceFilter,
  EntityOwnerFilter,
  EntityUserListFilter,
} from '../../filters';
import { useMountEffect } from '@react-hookz/web';

const mockQueryEntities: jest.MockedFn<CatalogApi['queryEntities']> = jest.fn();
const mockCatalogApi: jest.Mocked<Partial<CatalogApi>> = {
  queryEntities: mockQueryEntities,
};

const mockGetBackstageIdentity: jest.MockedFn<
  IdentityApi['getBackstageIdentity']
> = jest.fn();

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: (ref: ApiRef<any>) => {
      if (ref === catalogApiRef) {
        return mockCatalogApi;
      }
      if (ref === identityApiRef) {
        return {
          getBackstageIdentity: mockGetBackstageIdentity,
        };
      }

      return actual.useApi(ref);
    },
  };
});

describe('useOwnedEntitiesCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetBackstageIdentity.mockResolvedValue({
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
      userEntityRef: 'user:default/spiderman',
      type: 'user',
    });
  });

  it(`shouldn't invoke queryEntities when filters are loading`, async () => {
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result, waitFor } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({}),
    });

    await waitFor(() => expect(mockGetBackstageIdentity).toHaveBeenCalled());

    await expect(
      waitFor(() => expect(mockQueryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();

    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: EntityUserListFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should properly apply the filters`, async () => {
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result, waitFor } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
      }),
    });

    await waitFor(() => expect(mockGetBackstageIdentity).toHaveBeenCalled());

    await waitFor(() =>
      expect(mockQueryEntities).toHaveBeenCalledWith({
        filter: {
          'metadata.namespace': ['a-namespace'],
          'relations.ownedBy': ['user:default/spiderman', 'user:group/a-group'],
        },
        limit: 0,
      }),
    );

    expect(result.current).toEqual({
      count: 10,
      loading: false,
      filter: EntityUserListFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should return count 0 without invoking queryEntities if owners filter doesn't have claims on common with logged in user`, async () => {
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result, waitFor } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
        owners: new EntityOwnerFilter(['group:default/monsters']),
      }),
    });

    await waitFor(() => expect(mockGetBackstageIdentity).toHaveBeenCalled());

    await expect(
      waitFor(() => expect(mockQueryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();

    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: EntityUserListFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should send claims in common between owners filter and logged in user`, async () => {
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result, waitFor } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
        owners: new EntityOwnerFilter([
          'group:default/monsters',
          'user:group/a-group',
        ]),
      }),
    });

    await waitFor(() => expect(mockGetBackstageIdentity).toHaveBeenCalled());

    await waitFor(() =>
      expect(mockQueryEntities).toHaveBeenCalledWith({
        filter: {
          'metadata.namespace': ['a-namespace'],
          'relations.ownedBy': ['user:group/a-group'],
        },
        limit: 0,
      }),
    );

    expect(result.current).toEqual({
      count: 10,
      loading: false,
      filter: EntityUserListFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });
});

function createWrapperWithInitialFilters(
  filters: Partial<DefaultEntityFilters>,
) {
  function WrapFilters(props: PropsWithChildren<{}>) {
    const { updateFilters } = useEntityList();

    useMountEffect(() => {
      updateFilters(filters);
    });
    return <>{props.children}</>;
  }

  return function Wrapper(props: PropsWithChildren<{}>) {
    return (
      <MemoryRouter>
        <EntityListProvider>
          <WrapFilters>{props.children}</WrapFilters>
        </EntityListProvider>
      </MemoryRouter>
    );
  };
}
