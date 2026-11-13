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
import { MemoryRouter } from 'react-router-dom';
import { EntityOwnerFilter } from '../../filters';
import { useMountEffect } from '@react-hookz/web';
import { TestApiProvider } from '@backstage/test-utils';

describe('useAllEntitiesCount', () => {
  it('should return the count', async () => {
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-1' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/owner' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'owned-2' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/owner' }],
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'not-owned' },
          relations: [{ type: 'ownedBy', targetRef: 'user:default/other' }],
        },
      ],
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
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <MemoryRouter>
            <EntityListProvider>
              <WrapFilters>{children}</WrapFilters>
            </EntityListProvider>
          </MemoryRouter>
        </TestApiProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current).toEqual({ count: 2, loading: false });
    });
  });

  it(`shouldn't invoke the endpoint at startup, when filters are missing`, async () => {
    const catalogApi = catalogApiMock();
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

    const { result } = renderHook(() => useAllEntitiesCount(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <MemoryRouter>
            <EntityListProvider>{children}</EntityListProvider>
          </MemoryRouter>
        </TestApiProvider>
      ),
    });

    await expect(
      waitFor(() => expect(queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();
    expect(result.current).toEqual({ count: 0, loading: false });
  });
});
