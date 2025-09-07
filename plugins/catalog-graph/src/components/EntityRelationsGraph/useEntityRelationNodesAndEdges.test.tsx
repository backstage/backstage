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
import {
  DEFAULT_NAMESPACE,
  Entity,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry, mockApis } from '@backstage/test-utils';
import { createDeferred, DeferredPromise } from '@backstage/types';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderHook, waitFor } from '@testing-library/react';

import { useEntityRelationNodesAndEdges } from './useEntityRelationNodesAndEdges';
import { EntityNode } from '../../lib/types';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';
import { useFetchMethod as useFetchMethodMocked } from './useFetchMethod';

jest.mock('./useFetchMethod');

/*
  This is the full test graph:
  - b:d/c -> k:d/a1 (ownerOf)
  - b:d/c -> b:d/c1 (hasPart)
  - k:d/a1 -> b:d/c (ownedBy)
  - k:d/a1 -> b:d/c1 (ownedBy)
  - b:d/c1 -> b:d/c (partOf)
  - b:d/c1 -> k:d/a1 (ownerOf)
  - b:d/c1 -> b:d/c2 (hasPart)
  - b:d/c2 -> b:d/c1 (partOf)
*/
const entities: { [ref: string]: Entity } = {
  'b:d/c': {
    apiVersion: 'a',
    kind: 'b',
    metadata: {
      name: 'c',
      namespace: 'd',
    },
    relations: [
      {
        targetRef: 'k:d/a1',
        type: RELATION_OWNER_OF,
      },
      {
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
        targetRef: 'b:d/c',
        type: RELATION_OWNED_BY,
      },
      {
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
        targetRef: 'b:d/c',
        type: RELATION_PART_OF,
      },
      {
        targetRef: 'k:d/a1',
        type: RELATION_OWNER_OF,
      },
      {
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
        targetRef: 'b:d/c1',
        type: RELATION_PART_OF,
      },
    ],
  },
};

function deprecatedProperties(entity: Entity): Partial<EntityNode> {
  return {
    kind: entity.kind,
    name: entity.metadata.name,
    namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
    title: entity.metadata.title,
  };
}

const fetchApi: typeof fetchApiRef.T = {} as any;
let deferred: DeferredPromise<void, Error> = undefined as any;

function GraphContext(props: PropsWithChildren<{}>) {
  const config = mockApis.config();
  return (
    <ApiProvider
      apis={TestApiRegistry.from(
        [
          catalogGraphApiRef,
          new DefaultCatalogGraphApi({
            config,
            discoveryApi: mockApis.discovery(),
            fetchApi,
          }),
        ],
        [catalogApiRef, catalogApiMock()],
        [discoveryApiRef, mockApis.discovery()],
        [fetchApiRef, fetchApi],
        [errorApiRef, {}],
      )}
    >
      {props.children}
    </ApiProvider>
  );
}

describe('useEntityRelationNodesAndEdges', () => {
  beforeEach(() => {
    deferred = createDeferred();
    fetchApi.fetch = jest.fn(async () => ({
      json: async () => {
        setTimeout(() => {
          deferred.resolve();
        }, 1);
        return { entities: Object.values(entities) };
      },
      ok: true,
    })) as any;

    (
      useFetchMethodMocked as jest.Mock<ReturnType<typeof useFetchMethodMocked>>
    ).mockReturnValue('backend');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should forward loading state', async () => {
    const rootEntityRefs = ['b:d/c'];
    deferred = createDeferred();
    fetchApi.fetch = jest.fn(async () => ({
      json: async () => {
        await deferred;
        return { entities: Object.values(entities) };
      },
      ok: true,
    })) as any;

    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
        }),
      { wrapper: GraphContext },
    );

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(true);
    expect(error).toBeUndefined();
    expect(nodes).toBeUndefined();
    expect(edges).toBeUndefined();

    deferred.resolve();
  });

  test('should forward error state with failing request', async () => {
    const rootEntityRefs = ['b:d/c'];
    const returnError = new Error('Intentional error');
    fetchApi.fetch = jest.fn(async () => ({
      json: async () => {
        deferred.resolve(undefined);
        throw returnError;
      },
      ok: false,
      statusText: 'Intentional error',
    })) as any;

    const { result, rerender } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
        }),
      { wrapper: GraphContext },
    );

    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      await new Promise(resolve => setTimeout(resolve, 1));
      rerender();
    }

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error?.message).toContain(returnError.message);
    expect(nodes).toBeUndefined();
    expect(edges).toBeUndefined();
  });

  test('should forward error state with invalid json', async () => {
    const rootEntityRefs = ['b:d/c'];
    const returnError = new Error('Test');
    fetchApi.fetch = jest.fn(async () => ({
      json: async () => {
        deferred.resolve(undefined);
        throw returnError;
      },
      ok: true,
    })) as any;

    const { result, rerender } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
        }),
      { wrapper: GraphContext },
    );

    await deferred;
    // Simulate rerendering as this is triggered automatically due to the mock
    for (let i = 0; i < 5; ++i) {
      await new Promise(resolve => setTimeout(resolve, 1));
      rerender();
    }

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBe(returnError);
    expect(nodes).toBeUndefined();
    expect(edges).toBeUndefined();
  });

  test('should generate unidirectional graph with merged relations', async () => {
    const rootEntityRefs = ['b:d/c'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          unidirectional: true,
          mergeRelations: true,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
    ]);
  });

  test('should generate unidirectional graph', async () => {
    const rootEntityRefs = ['b:d/c'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          unidirectional: true,
          mergeRelations: false,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c2',
      },
    ]);
  });

  test('should generate bidirectional graph with merged relations', async () => {
    const rootEntityRefs = ['b:d/c'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          unidirectional: false,
          mergeRelations: true,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
    ]);
  });

  test('should generate bidirectional graph with all relations', async () => {
    const rootEntityRefs = ['b:d/c'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          unidirectional: false,
          mergeRelations: false,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c1',
      },
      {
        distance: 1,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_PART_OF],
        to: 'b:d/c',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_OWNER_OF],
        to: 'k:d/a1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART],
        to: 'b:d/c2',
      },
      {
        distance: 2,
        from: 'b:d/c2',
        label: 'visible',
        relations: [RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        distance: 1,
        from: 'k:d/a1',
        label: 'visible',
        relations: [RELATION_OWNED_BY],
        to: 'b:d/c',
      },
      {
        distance: 2,
        from: 'k:d/a1',
        label: 'visible',
        relations: [RELATION_OWNED_BY],
        to: 'b:d/c1',
      },
    ]);
  });

  test('should generate graph with multiple root nodes', async () => {
    const rootEntityRefs = ['b:d/c', 'b:d/c2'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    nodes?.sort((a, b) => a.id.localeCompare(b.id));

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c1',
        label: 'visible',
        relations: ['hasPart', 'partOf'],
        to: 'b:d/c2',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: ['hasPart', 'partOf'],
        to: 'b:d/c1',
      },
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: ['ownerOf', 'ownedBy'],
        to: 'k:d/a1',
      },
    ]);
  });

  test('should filter by relation', async () => {
    const rootEntityRefs = ['b:d/c'];
    const relations = [RELATION_OWNER_OF];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          relations,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'k:d/a1',
        entity: entities['k:d/a1'],
        ...deprecatedProperties(entities['k:d/a1']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_OWNER_OF, RELATION_OWNED_BY],
        to: 'k:d/a1',
      },
    ]);
  });

  test('should filter by kind', async () => {
    const rootEntityRefs = ['b:d/c'];
    const kinds = ['b'];
    const { result } = renderHook(
      () =>
        useEntityRelationNodesAndEdges({
          rootEntityRefs,
          kinds,
        }),
      { wrapper: GraphContext },
    );

    await waitFor(() => {
      expect(result.current.nodes && result.current.edges).toBeDefined();
    });

    const { nodes, edges, loading, error } = result.current;
    // nodes?.sort((a, b) => a.id.localeCompare(b.id));

    expect(loading).toBe(false);
    expect(error).toBeUndefined();
    expect(nodes).toEqual([
      {
        color: 'secondary',
        focused: true,
        id: 'b:d/c',
        entity: entities['b:d/c'],
        ...deprecatedProperties(entities['b:d/c']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c1',
        entity: entities['b:d/c1'],
        ...deprecatedProperties(entities['b:d/c1']),
      },
      {
        color: 'primary',
        focused: false,
        id: 'b:d/c2',
        entity: entities['b:d/c2'],
        ...deprecatedProperties(entities['b:d/c2']),
      },
    ]);
    expect(edges).toEqual([
      {
        distance: 1,
        from: 'b:d/c',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c1',
      },
      {
        distance: 2,
        from: 'b:d/c1',
        label: 'visible',
        relations: [RELATION_HAS_PART, RELATION_PART_OF],
        to: 'b:d/c2',
      },
    ]);
  });
});
