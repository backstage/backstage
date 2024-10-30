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
import { Entity, parseEntityRef } from '@backstage/catalog-model';

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

  const entitiesFromEntityRefs = (
    entityRefs: string[],
    enrichedEntities: { [key: string]: Entity } = {},
  ) => ({
    items: entityRefs.map(ref => {
      const compoundRef = parseEntityRef(ref);
      return (
        enrichedEntities[ref] || {
          apiVersion: 'backstage.io/v1beta1',
          kind: compoundRef.kind,
          metadata: {
            name: compoundRef.name,
            namespace: compoundRef.namespace,
          },
        }
      );
    }),
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
    const entityRefs = ['component:default/e1', 'component:default/e2'];
    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );
    mockCatalogApi.getEntitiesByRefs.mockResolvedValue(
      entitiesFromEntityRefs(entityRefs),
    );

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'e1', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'e2', namespace: 'default' },
            },
          ],
        },
        loading: false,
      });
    });
  });

  it(`should return the owners sorted by namespace, (displayName or title or name) and kind`, async () => {
    const entityRefs = [
      'group:namespace/team-b',
      'component:default/c',
      'group:default/a',
      'component:default/a',
      'component:default/b',
      'group:default/d',
      'group:default/e',
    ];

    const enrichedEntities: { [key: string]: Entity } = {
      'group:default/a': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'a', namespace: 'default', title: 'My title A' },
      },
      'component:default/a': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'a', namespace: 'default', title: 'My title B' },
      },
      'group:default/d': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'd', namespace: 'default' },
        spec: { profile: { displayName: 'My display name D' } },
      },
      'group:default/e': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'e', namespace: 'default' },
        spec: { profile: { displayName: 'My display name E' } },
      },
    };

    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );
    mockCatalogApi.getEntitiesByRefs.mockResolvedValue(
      entitiesFromEntityRefs(entityRefs, enrichedEntities),
    );

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'b', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'c', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'd', namespace: 'default' },
              spec: { profile: { displayName: 'My display name D' } },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'e', namespace: 'default' },
              spec: { profile: { displayName: 'My display name E' } },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: {
                name: 'a',
                namespace: 'default',
                title: 'My title A',
              },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: {
                name: 'a',
                namespace: 'default',
                title: 'My title B',
              },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'team-b', namespace: 'namespace' },
            },
          ],
        },
        loading: false,
      });
    });
  });

  it(`should paginate the data accordingly`, async () => {
    const entityRefs = [
      'group:namespace/team-b',
      'component:default/c',
      'group:default/a',
      'component:default/a',
      'component:default/b',
    ];

    mockCatalogApi.getEntityFacets.mockResolvedValue(
      facetsFromEntityRefs(entityRefs),
    );
    mockCatalogApi.getEntitiesByRefs.mockResolvedValue(
      entitiesFromEntityRefs(entityRefs),
    );

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' }, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'a', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'a', namespace: 'default' },
            },
          ],
          cursor: 'eyJ0ZXh0IjoiIiwic3RhcnQiOjJ9',
        },
        loading: false,
      });
    });

    result.current[1](result.current[0].value!, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'a', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'a', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'b', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'c', namespace: 'default' },
            },
          ],
          cursor: 'eyJ0ZXh0IjoiIiwic3RhcnQiOjR9',
        },
        loading: false,
      });
    });

    result.current[1](result.current[0].value!, { limit: 2 });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'a', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'a', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'b', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'c', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'team-b', namespace: 'namespace' },
            },
          ],
        },
        loading: false,
      });
    });
  });

  it('should filter the data accordingly', async () => {
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
    const enrichedEntities: { [key: string]: Entity } = {
      'group:default/go': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'group',
        metadata: { name: 'go', namespace: 'default', title: 'Hidden Spider' },
      },
      'component:default/lemon': {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'component',
        metadata: { name: 'lemon', namespace: 'default' },
        spec: {
          profile: { displayName: 'Lemon Spider' },
        },
      },
    };
    mockCatalogApi.getEntitiesByRefs.mockResolvedValue(
      entitiesFromEntityRefs(entityRefs, enrichedEntities),
    );

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: 'der  ' });
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: {
          items: [
            enrichedEntities['group:default/go'],
            enrichedEntities['component:default/lemon'],
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'spider', namespace: 'default' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'spiderman', namespace: 'namespace' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'component',
              metadata: { name: 'a-component', namespace: 'spiders' },
            },
            {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'group',
              metadata: { name: 'go', namespace: 'spiders' },
            },
          ],
        },
        loading: false,
      });
    });
  });
});
