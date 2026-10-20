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

import { PropsWithChildren } from 'react';
import { CatalogApi } from '@backstage/catalog-client';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DefaultEntityFilters,
  EntityListProvider,
  useEntityList,
} from '../../hooks';
import { catalogApiRef } from '../../api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { useOwnedEntitiesCount } from './useOwnedEntitiesCount';
import {
  EntityNamespaceFilter,
  EntityOwnerFilter,
  EntityUserFilter,
} from '../../filters';
import { useMountEffect } from '@react-hookz/web';
import { TestApiProvider, mockApis } from '@backstage/test-utils';

// The count is requested with limit 0, which tells it apart from the
// EntityListProvider's own fetch of the entity list
const countRequest = expect.objectContaining({ limit: 0 });

describe('useOwnedEntitiesCount', () => {
  it(`shouldn't invoke queryEntities when filters are loading`, async () => {
    const catalogApi = catalogApiMock();
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const identityApi = mockApis.identity({
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });
    const getBackstageIdentity = jest.spyOn(
      identityApi,
      'getBackstageIdentity',
    );

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapper({ catalogApi, identityApi, filters: {} }),
    });

    await waitFor(() => expect(getBackstageIdentity).toHaveBeenCalled());

    await expect(
      waitFor(() => expect(queryEntities).toHaveBeenCalledWith(countRequest)),
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
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-user', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/spiderman' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-group', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:group/a-group' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-other', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/monsters' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'other-namespace', namespace: 'b-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/spiderman' }],
        },
      ],
    });
    const identityApi = mockApis.identity({
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapper({
        catalogApi,
        identityApi,
        filters: { namespace: new EntityNamespaceFilter(['a-namespace']) },
      }),
    });

    await waitFor(() =>
      expect(result.current).toEqual({
        count: 2,
        loading: false,
        filter: EntityUserFilter.owned([
          'user:default/spiderman',
          'user:group/a-group',
        ]),
        ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
      }),
    );
  });

  it(`should return count 0 without invoking queryEntities if owners filter doesn't have claims in common with logged in user`, async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-other', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/monsters' }],
        },
      ],
    });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const identityApi = mockApis.identity({
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapper({
        catalogApi,
        identityApi,
        filters: {
          namespace: new EntityNamespaceFilter(['a-namespace']),
          owners: new EntityOwnerFilter(['group:default/monsters']),
        },
      }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      waitFor(() => expect(queryEntities).toHaveBeenCalledWith(countRequest)),
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

  it(`should return count 0 without invoking queryEntities if ownershipEntityRefs is empty`, async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-user', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/spiderman' }],
        },
      ],
    });
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const identityApi = mockApis.identity({ ownershipEntityRefs: [] });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapper({
        catalogApi,
        identityApi,
        filters: { namespace: new EntityNamespaceFilter(['a-namespace']) },
      }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(queryEntities).not.toHaveBeenCalledWith(countRequest);
    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: EntityUserFilter.owned([]),
      ownershipEntityRefs: [],
    });
  });

  it(`should send claims in common between owners filter and logged in user`, async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-user', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/spiderman' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-group', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'user:group/a-group' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-by-other', namespace: 'a-namespace' },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/monsters' }],
        },
      ],
    });
    const identityApi = mockApis.identity({
      ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
    });

    const { result } = renderHook(() => useOwnedEntitiesCount(), {
      wrapper: createWrapper({
        catalogApi,
        identityApi,
        filters: {
          namespace: new EntityNamespaceFilter(['a-namespace']),
          owners: new EntityOwnerFilter([
            'group:default/monsters',
            'user:group/a-group',
          ]),
        },
      }),
    });

    // Only the group claim is in common, so the entity owned directly by the
    // user is not counted
    await waitFor(() =>
      expect(result.current).toEqual({
        count: 1,
        loading: false,
        filter: EntityUserFilter.owned([
          'user:default/spiderman',
          'user:group/a-group',
        ]),
        ownershipEntityRefs: ['user:default/spiderman', 'user:group/a-group'],
      }),
    );
  });
});

function createWrapper(options: {
  catalogApi: CatalogApi;
  identityApi: IdentityApi;
  filters: Partial<DefaultEntityFilters>;
}) {
  function WrapFilters(props: PropsWithChildren<{}>) {
    const { updateFilters } = useEntityList();

    useMountEffect(() => {
      updateFilters(options.filters);
    });
    return <>{props.children}</>;
  }

  return function Wrapper(props: PropsWithChildren<{}>) {
    return (
      <TestApiProvider
        apis={[
          [catalogApiRef, options.catalogApi],
          [identityApiRef, options.identityApi],
        ]}
      >
        <MemoryRouter>
          <EntityListProvider>
            <WrapFilters>{props.children}</WrapFilters>
          </EntityListProvider>
        </MemoryRouter>
      </TestApiProvider>
    );
  };
}
