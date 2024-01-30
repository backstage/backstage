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

import { Entity } from '@backstage/catalog-model';
import { useApi as useApiMocked } from '@backstage/core-plugin-api';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useEntityStore } from './useEntityStore';

jest.mock('@backstage/core-plugin-api');

const useApi = useApiMocked as jest.Mocked<any>;

describe('useEntityStore', () => {
  const catalogApi = {
    getEntities: jest.fn(),
    getEntityByRef: jest.fn(),
    getEntitiesByRefs: jest.fn(),
    removeEntityByUid: jest.fn(),
    getLocationById: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
    validateEntity: jest.fn(),
  };

  beforeEach(() => {
    useApi.mockReturnValue(catalogApi);
  });

  afterEach(() => jest.resetAllMocks());

  test('request nothing', () => {
    const { result } = renderHook(() => useEntityStore());
    const { entities, loading, error } = result.current;

    expect(error).toBeUndefined();
    expect(loading).toBe(false);
    expect(entities).toEqual({});
  });

  test('request a single entity', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [entity] });

    const { result } = renderHook(() => useEntityStore());

    act(() => {
      result.current.requestEntities(['kind:namespace/name']);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name': entity,
      });
    });
  });

  test('handles request failures', async () => {
    const err = new Error('Hello World');
    catalogApi.getEntitiesByRefs.mockRejectedValue(err);

    const { result } = renderHook(() => useEntityStore());

    act(() => {
      result.current.requestEntities(['kind:namespace/name']);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBe(err);
      expect(entities).toEqual({});
    });
  });

  test('handles loading', async () => {
    catalogApi.getEntitiesByRefs.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useEntityStore());

    act(() => {
      result.current.requestEntities(['kind:namespace/name']);
    });

    const { entities, loading, error } = result.current;
    expect(loading).toBe(true);
    expect(error).toBeUndefined();
    expect(entities).toEqual({});
  });

  test('request multiple entities', async () => {
    const entity1: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name1',
      },
    };
    const entity2: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name2',
      },
    };
    const entity3: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name3',
      },
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [entity1] });

    const { result } = renderHook(() => useEntityStore());

    act(() => {
      result.current.requestEntities(['kind:namespace/name1']);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name1': entity1,
      });
    });

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [entity2, entity3],
    });

    act(() => {
      result.current.requestEntities([
        'kind:namespace/name1',
        'kind:namespace/name2',
        'kind:namespace/name3',
      ]);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name1': entity1,
        'kind:namespace/name2': entity2,
        'kind:namespace/name3': entity3,
      });
    });
  });

  test('request cached entity', async () => {
    const entity1: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name1',
      },
    };
    const entity2: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name2',
      },
    };
    const entity3: Entity = {
      apiVersion: 'v1',
      kind: 'kind',
      metadata: {
        namespace: 'namespace',
        name: 'name3',
      },
    };

    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [entity1, entity2],
    });

    const { result } = renderHook(() => useEntityStore());

    act(() => {
      result.current.requestEntities([
        'kind:namespace/name1',
        'kind:namespace/name2',
      ]);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name1': entity1,
        'kind:namespace/name2': entity2,
      });
    });

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledTimes(1);
    expect(catalogApi.getEntitiesByRefs).toHaveBeenLastCalledWith({
      entityRefs: ['kind:namespace/name1', 'kind:namespace/name2'],
    });

    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [entity3] });

    act(() => {
      result.current.requestEntities([
        'kind:namespace/name2',
        'kind:namespace/name3',
      ]);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name2': entity2,
        'kind:namespace/name3': entity3,
      });
    });

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledTimes(2);
    expect(catalogApi.getEntitiesByRefs).toHaveBeenLastCalledWith({
      entityRefs: ['kind:namespace/name3'],
    });

    act(() => {
      result.current.requestEntities(['kind:namespace/name1']);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name1': entity1,
      });
    });

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledTimes(2);
  });
});
