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
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { useAllEntitiesCount } from './useAllEntitiesCount';
import { renderHook, waitFor } from '@testing-library/react';
import { EntityListProvider, useEntityList } from '../../hooks';
import { catalogApiRef } from '../../api';
import { ApiRef } from '@backstage/core-plugin-api';
import { MemoryRouter } from 'react-router-dom';
import { EntityOwnerFilter } from '../../filters';
import { useMountEffect } from '@react-hookz/web';

const mockCatalogApi = catalogApiMock.mock();

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: (ref: ApiRef<any>) =>
      ref === catalogApiRef ? mockCatalogApi : actual.useApi(ref),
  };
});

describe('useAllEntitiesCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the count', async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    function WrapFilters(props: PropsWithChildren<{}>) {
      const { updateFilters } = useEntityList();

      useMountEffect(() => {
        updateFilters({
          owners: new EntityOwnerFilter(['user:default/owner']),
        });
      });
      return <>{props.children}</>;
    }

    const { result } = renderHook(() => useAllEntitiesCount(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <EntityListProvider>
            <WrapFilters>{children}</WrapFilters>
          </EntityListProvider>
        </MemoryRouter>
      ),
    });

    await waitFor(() =>
      expect(mockCatalogApi.queryEntities).toHaveBeenCalledWith({
        filter: {
          'relations.ownedBy': ['user:default/owner'],
        },
        limit: 0,
      }),
    );
    expect(result.current).toEqual({ count: 10, loading: false });
  });

  it(`shouldn't invoke the endpoint at startup, when filters are missing`, async () => {
    mockCatalogApi.queryEntities.mockResolvedValue({
      items: [],
      totalItems: 10,
      pageInfo: {},
    });

    const { result } = renderHook(() => useAllEntitiesCount(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <EntityListProvider>{children}</EntityListProvider>
        </MemoryRouter>
      ),
    });

    await expect(
      waitFor(() => expect(mockCatalogApi.queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();
    expect(result.current).toEqual({ count: 0, loading: false });
  });
});
