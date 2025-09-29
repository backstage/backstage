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
import { PropsWithChildren } from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import {
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { TestApiRegistry, mockApis } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react';
import { useEntityRelationGraph } from './useEntityRelationGraph';
import { useEntityRelationGraphFromBackend as useEntityRelationGraphFromBackendMocked } from './useEntityRelationGraphFromBackend';
import { useFetchMethod as useFetchMethodMocked } from './useFetchMethod';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

jest.mock('./useEntityRelationGraphFromBackend');
jest.mock('./useFetchMethod');

const useEntityRelationGraphFromBackend =
  useEntityRelationGraphFromBackendMocked as jest.Mock<
    ReturnType<typeof useEntityRelationGraphFromBackendMocked>
  >;

function GraphContext(props: PropsWithChildren<{}>) {
  const config = mockApis.config();
  return (
    <ApiProvider
      apis={TestApiRegistry.from(
        [catalogGraphApiRef, new DefaultCatalogGraphApi({ config })],
        [catalogApiRef, catalogApiMock()],
        [discoveryApiRef, mockApis.discovery()],
        [fetchApiRef, {}],
      )}
    >
      {props.children}
    </ApiProvider>
  );
}

describe('useEntityRelationGraph', () => {
  const mockEntities = {
    'b:d/c': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
      relations: [
        {
          target: {
            kind: 'k',
            name: 'a1',
            namespace: 'd',
          },
          targetRef: 'k:d/a1',
          type: RELATION_OWNER_OF,
        },
        {
          target: {
            kind: 'b',
            name: 'c1',
            namespace: 'd',
          },
          targetRef: 'b:d/c1',
          type: RELATION_HAS_PART,
        },
      ],
    },
    'k:d/a1': {
      apiVersion: 'a',
      kind: 'k',
      metadata: {
        name: 'a1',
        namespace: 'd',
      },
      relations: [
        {
          target: {
            kind: 'b',
            name: 'c',
            namespace: 'd',
          },
          targetRef: 'b:d/c',
          type: RELATION_OWNED_BY,
        },
        {
          target: {
            kind: 'b',
            name: 'c1',
            namespace: 'd',
          },
          targetRef: 'b:d/c1',
          type: RELATION_OWNED_BY,
        },
      ],
    },
    'b:d/c1': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c1',
        namespace: 'd',
      },
      relations: [
        {
          target: {
            kind: 'b',
            name: 'c',
            namespace: 'd',
          },
          targetRef: 'b:d/c',
          type: RELATION_PART_OF,
        },
        {
          target: {
            kind: 'k',
            name: 'a1',
            namespace: 'd',
          },
          targetRef: 'k:d/a1',
          type: RELATION_OWNER_OF,
        },
        {
          target: {
            kind: 'b',
            name: 'c2',
            namespace: 'd',
          },
          targetRef: 'b:d/c2',
          type: RELATION_HAS_PART,
        },
      ],
    },
    'b:d/c2': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c2',
        namespace: 'd',
      },
      relations: [
        {
          target: {
            kind: 'b',
            name: 'c1',
            namespace: 'd',
          },
          targetRef: 'b:d/c1',
          type: RELATION_PART_OF,
        },
      ],
    },
  };

  beforeEach(() => {
    useEntityRelationGraphFromBackend.mockImplementation(() => ({
      entities: mockEntities,
      loading: false,
      error: undefined,
    }));

    (
      useFetchMethodMocked as jest.Mock<ReturnType<typeof useFetchMethodMocked>>
    ).mockReturnValue('backend');
  });

  afterEach(() => jest.resetAllMocks());

  test('should return no entities for empty root entity refs', async () => {
    useEntityRelationGraphFromBackend.mockReturnValue({
      entities: {},
      loading: false,
      error: undefined,
    });

    const { result } = renderHook(
      () => useEntityRelationGraph({ rootEntityRefs: [] }),
      { wrapper: GraphContext },
    );
    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({});
    expect(useEntityRelationGraphFromBackend).toHaveBeenNthCalledWith(
      1,
      {
        maxDepth: Number.POSITIVE_INFINITY,
        rootEntityRefs: [],
      },
      { noFetch: false },
    );
  });

  test('should pass through loading state', async () => {
    useEntityRelationGraphFromBackend.mockReturnValue({
      entities: {},
      loading: true,
      error: undefined,
    });

    const { result } = renderHook(
      () => useEntityRelationGraph({ rootEntityRefs: [] }),
      { wrapper: GraphContext },
    );
    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(true);
    expect(entities).toEqual({});
    expect(useEntityRelationGraphFromBackend).toHaveBeenNthCalledWith(
      1,
      {
        maxDepth: Number.POSITIVE_INFINITY,
        rootEntityRefs: [],
      },
      { noFetch: false },
    );
  });

  test('should pass through error state', async () => {
    const err = new Error('Hello World');
    useEntityRelationGraphFromBackend.mockReturnValue({
      entities: {},
      loading: false,
      error: err,
    });

    const { result } = renderHook(
      () => useEntityRelationGraph({ rootEntityRefs: [] }),
      { wrapper: GraphContext },
    );
    const { entities, loading, error } = result.current;

    expect(error).toBe(err);
    expect(loading).toBe(false);
    expect(entities).toEqual({});
    expect(useEntityRelationGraphFromBackend).toHaveBeenNthCalledWith(
      1,
      {
        maxDepth: Number.POSITIVE_INFINITY,
        rootEntityRefs: [],
      },
      { noFetch: false },
    );
  });

  test('should walk relation tree', async () => {
    const { result } = renderHook(
      () => useEntityRelationGraph({ rootEntityRefs: ['b:d/c'] }),
      { wrapper: GraphContext },
    );

    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'b:d/c2': expect.anything(),
      'k:d/a1': expect.anything(),
    });
    expect(useEntityRelationGraphFromBackend).toHaveBeenNthCalledWith(
      1,
      {
        maxDepth: Number.POSITIVE_INFINITY,
        rootEntityRefs: ['b:d/c'],
      },
      { noFetch: false },
    );
  });

  test('should handle custom entitySet', async () => {
    (
      useFetchMethodMocked as jest.Mock<ReturnType<typeof useFetchMethodMocked>>
    ).mockReturnValue('none');

    const { result } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          entitySet: Object.entries(mockEntities)
            .filter(([key]) => key !== 'b:d/c2')
            .map(([_, entity]) => entity),
        }),
      { wrapper: GraphContext },
    );

    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'k:d/a1': expect.anything(),
    });
    expect(useEntityRelationGraphFromBackend).toHaveBeenNthCalledWith(
      1,
      {
        maxDepth: Number.POSITIVE_INFINITY,
        rootEntityRefs: ['b:d/c'],
      },
      { noFetch: true },
    );
  });

  test('should limit max depth', async () => {
    const { result } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          filter: { maxDepth: 1 },
        }),
      { wrapper: GraphContext },
    );

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'k:d/a1': expect.anything(),
    });
  });

  test('should update on filter change', async () => {
    let maxDepth: number = Number.POSITIVE_INFINITY;
    const { result, rerender } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          filter: { maxDepth },
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'b:d/c2': expect.anything(),
      'k:d/a1': expect.anything(),
    });

    maxDepth = 1;
    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'k:d/a1': expect.anything(),
    });
  });

  test('should filter by relation', async () => {
    const { result, rerender } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          filter: {
            relations: [RELATION_HAS_PART, RELATION_PART_OF],
          },
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'b:d/c2': expect.anything(),
    });
  });

  test('should filter by kind', async () => {
    const { result, rerender } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          filter: {
            relations: [RELATION_OWNED_BY, RELATION_OWNER_OF],
            kinds: ['k'],
          },
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'k:d/a1': expect.anything(),
    });
  });

  test('should filter by func', async () => {
    const { result, rerender } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c'],
          filter: {
            entityFilter: e => e.metadata.name !== 'c2',
          },
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'k:d/a1': expect.anything(),
    });
  });

  test('should support multiple roots by kind', async () => {
    const { result, rerender } = renderHook(
      () =>
        useEntityRelationGraph({
          rootEntityRefs: ['b:d/c', 'b:d/c2'],
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    expect(result.current.entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'b:d/c2': expect.anything(),
      'k:d/a1': expect.anything(),
    });
  });
});
