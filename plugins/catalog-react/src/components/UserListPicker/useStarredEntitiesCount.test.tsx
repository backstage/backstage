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

import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { EntityListProvider } from '../../hooks';
import { catalogApiRef } from '../../api';
import { MockStarredEntitiesApi, starredEntitiesApiRef } from '../../apis';
import { MemoryRouter } from 'react-router-dom';
import { useStarredEntitiesCount } from './useStarredEntitiesCount';
import { renderHook, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';

describe('useStarredEntitiesCount', () => {
  it('should return the count', async () => {
    // The namespaces are explicit since the in-memory catalog client does not
    // yet treat a missing namespace as "default" like the catalog backend does
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'favourite1', namespace: 'default' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'favourite2', namespace: 'default' },
        },
        {
          // Same name as a starred entity, but a different kind
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'API',
          metadata: { name: 'favourite1', namespace: 'default' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'not-a-favourite', namespace: 'default' },
        },
      ],
    });
    const starredEntitiesApi = new MockStarredEntitiesApi();
    starredEntitiesApi.toggleStarred('component:default/favourite1');
    starredEntitiesApi.toggleStarred('component:default/favourite2');

    const { result } = renderHook(() => useStarredEntitiesCount(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [catalogApiRef, catalogApi],
            [starredEntitiesApiRef, starredEntitiesApi],
          ]}
        >
          <MemoryRouter>
            <EntityListProvider>{children}</EntityListProvider>
          </MemoryRouter>
        </TestApiProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        count: 2,
        loading: false,
        filter: {
          refs: [
            'component:default/favourite1',
            'component:default/favourite2',
          ],
          value: 'starred',
        },
      });
    });
  });

  it(`shouldn't invoke the endpoint if there are no starred entities`, async () => {
    const catalogApi = catalogApiMock();
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');

    const { result } = renderHook(() => useStarredEntitiesCount(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [catalogApiRef, catalogApi],
            [starredEntitiesApiRef, new MockStarredEntitiesApi()],
          ]}
        >
          <MemoryRouter>
            <EntityListProvider>{children}</EntityListProvider>
          </MemoryRouter>
        </TestApiProvider>
      ),
    });

    await expect(
      waitFor(() => expect(queryEntities).toHaveBeenCalled()),
    ).rejects.toThrow();
    expect(result.current).toEqual({
      count: 0,
      loading: false,
      filter: { refs: [], value: 'starred' },
    });
  });
});
