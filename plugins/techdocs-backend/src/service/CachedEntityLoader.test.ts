/*
 * Copyright 2022 The Backstage Authors
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
import { CachedEntityLoader } from './CachedEntityLoader';
import { CatalogClient } from '@backstage/catalog-client';
import { CacheClient } from '@backstage/backend-common';
import { CompoundEntityRef } from '@backstage/catalog-model';

describe('CachedEntityLoader', () => {
  const catalog: jest.Mocked<CatalogClient> = {
    getEntityByRef: jest.fn(),
  } as any;

  const cache: jest.Mocked<CacheClient> = {
    get: jest.fn(),
    set: jest.fn(),
  } as any;

  const entityName: CompoundEntityRef = {
    kind: 'component',
    namespace: 'default',
    name: 'test',
  };

  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test',
      namespace: 'default',
    },
  };

  const token = 'test-token';

  const loader = new CachedEntityLoader({ catalog, cache });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('writes entities to cache', async () => {
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByRef.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:test-token',
      entity,
      { ttl: 5000 },
    );
  });

  it('returns entities from cache', async () => {
    cache.get.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByRef).not.toHaveBeenCalled();
  });

  it('does not cache missing entites', async () => {
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByRef.mockResolvedValue(undefined);

    const result = await loader.load(entityName, token);

    expect(result).toBeUndefined();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('uses entity ref as cache key for anonymous users', async () => {
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByRef.mockResolvedValue(entity);

    const result = await loader.load(entityName, undefined);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test',
      entity,
      {
        ttl: 5000,
      },
    );
  });

  it('calls the catalog if the cache read takes too long', async () => {
    cache.get.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(undefined), 10000);
        }),
    );
    catalog.getEntityByRef.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
  });
});
