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

import { renderHook, waitFor } from '@testing-library/react';
import { useFacetsEntities } from './useFacetsEntities';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const mockCatalogApi = catalogApiMock.mock();

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockCatalogApi,
}));

describe('useFacetsEntities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const facetsFromEntityRefs = (entityRefs: string[]) => ({
    facets: {
      'relations.ownedBy': entityRefs.map(value => ({ count: 1, value })),
    },
  });

  it(`should return empty items when facets are loading`, () => {
    mockCatalogApi.getEntityFacets.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));
    expect(result.current[0]).toEqual({ value: { items: [] }, loading: true });
  });

  it(`should return empty response when facet is not present`, async () => {
    mockCatalogApi.getEntityFacets.mockResolvedValueOnce({
      facets: { 'metadata.tags': [{ value: 'tag', count: 1 }] },
    });
    mockCatalogApi.getEntitiesByRefs.mockResolvedValueOnce({ items: [] });
    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));
    result.current[1]({ text: '' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: { items: [] },
        loading: false,
      });
    });
  });

  it(`should return the owners`, async () => {
    const entities = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'e1', namespace: 'default', title: 'E1' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'e2', namespace: 'default', title: 'E2' },
      },
    ];
    const entityRefs = ['component:default/e1', 'component:default/e2'];
    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );

    mockCatalogApi.getEntitiesByRefs.mockResolvedValue({
      items: entities,
    });

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: entities,
        },
        loading: false,
      });
    });
  });

  it(`should return the owners sorted by kind, namespace and name`, async () => {
    const entities = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'a', namespace: 'default' },
        spec: { profile: { displayName: 'A Group' } },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'd', namespace: 'default' },
        spec: { profile: { displayName: 'D Group' } },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'e', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'team-b', namespace: 'namespace' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: {
          name: 'a',
          namespace: 'default',
        },
        spec: { profile: { displayName: 'A User' } },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: {
          name: 'b',
          namespace: 'default',
        },
        spec: { profile: { displayName: 'B Group' } },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: {
          name: 'c',
          namespace: 'default',
        },
      },
    ];

    const entityRefs = [
      'group:namespace/team-b',
      'user:default/c',
      'group:default/a',
      'user:default/a',
      'user:default/b',
      'group:default/d',
      'group:default/e',
    ];

    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );

    mockCatalogApi.getEntitiesByRefs.mockResolvedValue({
      items: entities,
    });

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: entities,
        },
        loading: false,
      });
    });
  });

  it(`should paginate the data accordingly`, async () => {
    const entities = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'a', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'team-b', namespace: 'namespace' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: { name: 'a', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: { name: 'b', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: { name: 'c', namespace: 'default' },
      },
    ];
    const entityRefs = [
      'group:namespace/team-b',
      'user:default/c',
      'group:default/a',
      'user:default/a',
      'user:default/b',
    ];

    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );

    mockCatalogApi.getEntitiesByRefs.mockResolvedValue({
      items: entities,
    });

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' }, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: entities.slice(0, 2),
          cursor: 'eyJ0ZXh0IjoiIiwic3RhcnQiOjJ9',
        },
        loading: false,
      });
    });

    result.current[1](result.current[0].value!, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: entities.slice(0, 4),
          cursor: 'eyJ0ZXh0IjoiIiwic3RhcnQiOjR9',
        },
        loading: false,
      });
    });

    result.current[1](result.current[0].value!, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: entities,
        },
        loading: false,
      });
    });
  });

  it('should filter the data accordingly', async () => {
    const entities = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'spider', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'a-component', namespace: 'spiders' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'spiderman', namespace: 'namespace' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'go', namespace: 'spiders' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: {
          name: 'go',
          namespace: 'default',
          title: 'Spider Go Group',
        },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'a-component', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'spid',
        metadata: { name: 'lemon', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'lemon', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'nade', namespace: 'default' },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'user',
        metadata: { name: 'andersson-john', namespace: 'default' },
        spec: {
          profile: {
            displayName: 'Jöhn Ändersson',
          },
        },
      },
    ];

    const entityRefs = [
      'group:namespace/spiderman',
      'group:spiders/go',
      'group:default/go',
      'component:spiders/a-component',
      'component:default/a-component',
      'component:default/spider',
      'spid:default/lemon',
      'component:default/lemon',
      'component:default/nade',
    ];

    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );

    mockCatalogApi.getEntitiesByRefs.mockResolvedValue({
      items: entities,
    });

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: 'der  ' });

    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'spider', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'a-component', namespace: 'spiders' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'spiderman', namespace: 'namespace' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'go', namespace: 'spiders' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: {
                name: 'go',
                namespace: 'default',
                title: 'Spider Go Group',
              },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'user',
              metadata: { name: 'andersson-john', namespace: 'default' },
              spec: {
                profile: {
                  displayName: 'Jöhn Ändersson',
                },
              },
            },
          ],
        },
        loading: false,
      });
    });
  });
});
