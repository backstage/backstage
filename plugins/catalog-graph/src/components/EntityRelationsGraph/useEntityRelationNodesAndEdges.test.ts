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
  Entity,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { renderHook } from '@testing-library/react-hooks';
import { filter, keyBy } from 'lodash';
import { useEntityRelationGraph as useEntityRelationGraphMocked } from './useEntityRelationGraph';
import { useEntityRelationNodesAndEdges } from './useEntityRelationNodesAndEdges';

jest.mock('./useEntityRelationGraph');

const useEntityRelationGraph = useEntityRelationGraphMocked as jest.Mock;

describe('useEntityRelationNodesAndEdges', () => {
  beforeEach(() => {
    const entities: { [key: string]: Entity } = {
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

    useEntityRelationGraph.mockImplementation(({ filter: { kinds } }) => ({
      loading: false,
      entities: keyBy(
        filter(entities, e => !kinds || kinds.includes(e.kind)),
        stringifyEntityRef,
      ),
    }));
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should forward loading state', async () => {
    useEntityRelationGraph.mockReturnValue({
      loading: true,
    });

    const { result } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
      }),
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(true);
    expect(error).toBeUndefined();
    expect(nodes).toBeUndefined();
    expect(edges).toBeUndefined();
  });

  test('should forward error state', async () => {
    const returnError = new Error('Test');
    useEntityRelationGraph.mockReturnValue({
      loading: false,
      error: returnError,
    });

    const { result } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
      }),
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBe(returnError);
    expect(nodes).toBeUndefined();
    expect(edges).toBeUndefined();
  });

  test('should generate unidirectional graph with merged relations', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        unidirectional: true,
        mergeRelations: true,
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
    ]);
  });

  test('should generate unidirectional graph', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        unidirectional: true,
        mergeRelations: false,
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c2',
      },
    ]);
  });

  test('should generate bidirectional graph with merged relations', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        unidirectional: false,
        mergeRelations: true,
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
    ]);
  });

  test('should generate bidirectional graph with all relations', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        unidirectional: false,
        mergeRelations: false,
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_PART_OF],
        to: 'b:d/c',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c2',
      },
      {
        from: 'b:d/c2',
        label: 'visible',
        relations: [RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        from: 'k:d/a1',
        label: 'visible',
        relations: [RELATION_OWNED_BY],
        to: 'b:d/c',
      },
      {
        from: 'k:d/a1',
        label: 'visible',
        relations: [RELATION_OWNED_BY],
        to: 'b:d/c1',
      },
    ]);
  });

  test('should generate graph with multiple root nodes', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c', 'b:d/c2'],
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: ['hasPart', 'partOf'],
        to: 'b:d/c2',
      },
      {
        from: 'b:d/c',
        label: 'visible',
        relations: ['hasPart', 'partOf'],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: ['ownerOf', 'ownedBy'],
        to: 'k:d/a1',
      },
    ]);
  });

  test('should filter by relation', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        relations: [RELATION_OWNER_OF],
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        kind: 'k',
        name: 'a1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
    ]);
  });

  test('should filter by kind', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useEntityRelationNodesAndEdges({
        rootEntityRefs: ['b:d/c'],
        kinds: ['b'],
      }),
    );

    await waitForValueToChange(
      () => result.current.nodes && result.current.edges,
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        kind: 'b',
        name: 'c',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        kind: 'b',
        name: 'c1',
        namespace: 'd',
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        kind: 'b',
        name: 'c2',
        namespace: 'd',
      },
    ]);
    expect(edges).toEqual([
      {
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
    ]);
  });
});
