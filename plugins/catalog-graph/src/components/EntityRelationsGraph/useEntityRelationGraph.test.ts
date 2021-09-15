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
import {
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { renderHook } from '@testing-library/react-hooks';
import { pick } from 'lodash';
import { useEntityRelationGraph } from './useEntityRelationGraph';
import { useEntityStore as useEntityStoreMocked } from './useEntityStore';

jest.mock('./useEntityStore');

const useEntityStore = useEntityStoreMocked as jest.Mock;

describe('useEntityRelationGraph', () => {
  const requestEntities = jest.fn();

  beforeEach(() => {
    const entities = {
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
            type: RELATION_OWNER_OF,
          },
          {
            target: {
              kind: 'b',
              name: 'c1',
              namespace: 'd',
            },
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
            type: RELATION_OWNED_BY,
          },
          {
            target: {
              kind: 'b',
              name: 'c1',
              namespace: 'd',
            },
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
            type: RELATION_PART_OF,
          },
          {
            target: {
              kind: 'k',
              name: 'a1',
              namespace: 'd',
            },
            type: RELATION_OWNER_OF,
          },
          {
            target: {
              kind: 'b',
              name: 'c2',
              namespace: 'd',
            },
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
            type: RELATION_PART_OF,
          },
        ],
      },
    };
    let rootEntityRefsFilter: string[] = [];

    requestEntities.mockImplementation(r => {
      rootEntityRefsFilter = r;
    });

    useEntityStore.mockImplementation(() => ({
      loading: false,
      entities: pick(entities, rootEntityRefsFilter),
      requestEntities,
    }));
  });

  afterEach(() => jest.resetAllMocks());

  test('should return no entities for empty root entity refs', async () => {
    useEntityStore.mockReturnValue({
      loading: false,
      entities: {},
      error: undefined,
      requestEntities,
    });

    const { result } = renderHook(() =>
      useEntityRelationGraph({ rootEntityRefs: [] }),
    );
    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({});
    expect(requestEntities).toHaveBeenNthCalledWith(1, []);
  });

  test('should pass through loading state', async () => {
    useEntityStore.mockReturnValue({
      loading: true,
      entities: {},
      error: undefined,
      requestEntities,
    });

    const { result } = renderHook(() =>
      useEntityRelationGraph({ rootEntityRefs: [] }),
    );
    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(true);
    expect(entities).toEqual({});
    expect(requestEntities).toHaveBeenNthCalledWith(1, []);
  });

  test('should pass through error state', async () => {
    const err = new Error('Hello World');
    useEntityStore.mockReturnValue({
      loading: false,
      entities: {},
      error: err,
      requestEntities,
    });

    const { result } = renderHook(() =>
      useEntityRelationGraph({ rootEntityRefs: [] }),
    );
    const { entities, loading, error } = result.current;

    expect(error).toBe(err);
    expect(loading).toBe(false);
    expect(entities).toEqual({});
    expect(requestEntities).toHaveBeenNthCalledWith(1, []);
  });

  test('should walk relation tree', async () => {
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({ rootEntityRefs: ['b:d/c'] }),
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      rerender();
    }

    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({
      'b:d/c': expect.anything(),
      'b:d/c1': expect.anything(),
      'b:d/c2': expect.anything(),
      'k:d/a1': expect.anything(),
    });
    expect(requestEntities).toHaveBeenNthCalledWith(1, ['b:d/c']);
    expect(requestEntities).toHaveBeenNthCalledWith(2, [
      'b:d/c',
      'k:d/a1',
      'b:d/c1',
    ]);
    expect(requestEntities).toHaveBeenNthCalledWith(3, [
      'b:d/c',
      'k:d/a1',
      'b:d/c1',
      'b:d/c2',
    ]);
  });

  test('should limit max depth', async () => {
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({
        rootEntityRefs: ['b:d/c'],
        filter: { maxDepth: 1 },
      }),
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

  test('should update on filter change', async () => {
    let maxDepth: number = Number.POSITIVE_INFINITY;
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({
        rootEntityRefs: ['b:d/c'],
        filter: { maxDepth },
      }),
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
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({
        rootEntityRefs: ['b:d/c'],
        filter: {
          relations: [RELATION_HAS_PART, RELATION_PART_OF],
        },
      }),
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
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({
        rootEntityRefs: ['b:d/c'],
        filter: {
          relations: [RELATION_OWNED_BY, RELATION_OWNER_OF],
          kinds: ['k'],
        },
      }),
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

  test('should support multiple roots by kind', async () => {
    const { result, rerender } = renderHook(() =>
      useEntityRelationGraph({
        rootEntityRefs: ['b:d/c', 'b:d/c2'],
      }),
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
