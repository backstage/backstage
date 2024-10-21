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
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DefaultEntityFilters,
  EntityListProvider,
  useEntityList,
} from '../../hooks';
import { catalogApiRef } from '../../api';
import { ApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { useOwnedEntitiesCount } from './useOwnedEntitiesCount';
import {
  EntityNamespaceFilter,
  EntityOwnerFilter,
  EntityUserFilter,
} from '../../filters';
import { useMountEffect } from '@react-hookz/web';
import { mockApis } from '@backstage/test-utils';

const mockCatalogApi = catalogApiMock.mock();
const mockIdentityApi = mockApis.identity({
  ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
  userEntityRef: 'user:default/spiderman',
});
jest.spyOn(mockIdentityApi, 'getBackstageIdentity');

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: (ref: ApiRef<any>) => {
      if (ref === catalogApiRef) {
        return mockCatalogApi;
      } else if (ref === identityApiRef) {
        return mockIdentityApi;
      }
      return actual.useApi(ref);
    },
  };
});

describe('useOwnedEntitiesCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`shouldn't invoke queryEntities when filters are loading`, async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({}),
    });

    await waitFor(() =>
      expect(mockIdentityApi.getBackstageIdentity).toHaveBeenCalled(),
    );

    await expect(
      waitFor(() => expect(mockCatalogApi.queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();

    expect(result.current).toEqual({
      count: undefined,
      loading: true,
      filter: EntityUserFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should properly apply the filters`, async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
      }),
    });

    await waitFor(() =>
      expect(mockIdentityApi.getBackstageIdentity).toHaveBeenCalled(),
    );

    await waitFor(() =>
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
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
      filter: EntityUserFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should return count 0 without invoking queryEntities if owners filter doesn't have claims in common with logged in user`, async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
        owners: new EntityOwnerFilter(['group:default/monsters']),
      }),
    });

    await waitFor(() =>
      expect(mockIdentityApi.getBackstageIdentity).toHaveBeenCalled(),
    );

    await expect(
      waitFor(() => expect(mockCatalogApi.queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();

    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: EntityUserFilter.owned([
        'user:default/spiderman',
        'user:group/a-group',
      ]),
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
  });

  it(`should send claims in common between owners filter and logged in user`, async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapperWithInitialFilters({
        namespace: new EntityNamespaceFilter(['a-namespace']),
        owners: new EntityOwnerFilter([
          'group:default/monsters',
          'user:group/a-group',
        ]),
      }),
    });

    await waitFor(() =>
      expect(mockIdentityApi.getBackstageIdentity).toHaveBeenCalled(),
    );

    await waitFor(() =>
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
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
      filter: EntityUserFilter.owned([
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
