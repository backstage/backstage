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
import { useApi } from '@backstage/core-plugin-api';
import { CatalogApi } from '@backstage/plugin-catalog-react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useEntityStore } from './useEntityStore';

jest.mock('@backstage/core-plugin-api');

describe('useEntityStore', () => {
  let catalogApi: jest.Mocked<CatalogApi>;

  beforeEach(() => {
    catalogApi = {
      getEntities: jest.fn(),
      getEntityByName: jest.fn(),
      removeEntityByUid: jest.fn(),
      getLocationById: jest.fn(),
      getOriginLocationByEntity: jest.fn(),
      getLocationByEntity: jest.fn(),
      addLocation: jest.fn(),
      removeLocationById: jest.fn(),
    };

    (useApi as jest.Mock<any>).mockReturnValue(catalogApi);
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

    catalogApi.getEntityByName.mockResolvedValue(entity);

    const { result, waitFor } = renderHook(() => useEntityStore());

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
    catalogApi.getEntityByName.mockRejectedValue(err);

    const { result, waitFor } = renderHook(() => useEntityStore());

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
    catalogApi.getEntityByName.mockReturnValue(new Promise(() => {}));

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

    catalogApi.getEntityByName.mockResolvedValue(entity1);

    const { result, waitFor } = renderHook(() => useEntityStore());

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

    catalogApi.getEntityByName.mockResolvedValue(entity2);

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

    catalogApi.getEntityByName.mockResolvedValue(entity1);

    const { result, waitFor } = renderHook(() => useEntityStore());

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

    catalogApi.getEntityByName.mockResolvedValue(entity2);

    act(() => {
      result.current.requestEntities(['kind:namespace/name2']);
    });

    await waitFor(() => {
      const { entities, loading, error } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeUndefined();
      expect(entities).toEqual({
        'kind:namespace/name2': entity2,
      });
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

    expect(catalogApi.getEntityByName).toBeCalledTimes(2);
  });
});
