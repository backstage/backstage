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
import { CatalogApi } from '@backstage/catalog-client';

const mockedGetEntityFacets: jest.MockedFn<CatalogApi['getEntityFacets']> =
  jest.fn();

const mockCatalogApi: Partial<CatalogApi> = {
  getEntityFacets: mockedGetEntityFacets,
};

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockCatalogApi,
}));

describe('useFacetsEntities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it(`should return empty items when facets are loading`, async () => {
    mockedGetEntityFacets.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));
    await waitFor(() => {
      expect(result.current[0]).toEqual({
        value: { items: [] },
        loading: true,
      });
    });
  });

  it(`should return the owners`, async () => {
    mockedGetEntityFacets.mockResolvedValue({
      facets: {
        'relations.ownedBy': [
          { count: 1, value: 'component:default/e2' },
          { count: 1, value: 'component:default/e1' },
        ],
      },
    });

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

  it(`should return the owners sorted by namespace, name and kind`, async () => {
    const entityRefs = [
      'group:namespace/team-b',
      'component:default/c',
      'group:default/a',
      'component:default/a',
      'component:default/b',
    ];

    mockedGetEntityFacets.mockResolvedValue({
      facets: {
        'relations.ownedBy': entityRefs.map(value => ({ count: 1, value })),
      },
    });

    const { result } = renderHook(() => useFacetsEntities({ enabled: true }));

    result.current[1]({ text: '' });
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

  it(`should paginate the data accordingly`, async () => {
    const entityRefs = [
      'group:namespace/team-b',
      'component:default/c',
      'group:default/a',
      'component:default/a',
      'component:default/b',
    ];

    mockedGetEntityFacets.mockResolvedValue({
      facets: {
        'relations.ownedBy': entityRefs.map(value => ({ count: 1, value })),
      },
    });

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

    mockedGetEntityFacets.mockResolvedValue({
      facets: {
        'relations.ownedBy': entityRefs.map(value => ({ count: 1, value })),
      },
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
