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
import { CompoundEntityRef } from '@backstage/catalog-model';
import { mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

describe('CachedEntityLoader', () => {
  const cache = mockServices.cache.mock();

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('writes entities to cache', async () => {
    cache.get.mockResolvedValue(undefined);
    const catalog = catalogServiceMock({ entities: [entity] });

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:test-token',
      entity,
      { ttl: 5000 },
    );
  });

  it('returns entities from cache', async () => {
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'getEntityByRef');
    cache.get.mockResolvedValue(entity);

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByRef).not.toHaveBeenCalled();
  });

  it('does not cache missing entites', async () => {
    const catalog = catalogServiceMock({ entities: [] });
    cache.get.mockResolvedValue(undefined);

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(entityName, token);

    expect(result).toBeUndefined();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('uses entity ref as cache key for anonymous users', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);

    const loader = new CachedEntityLoader({ catalog, cache });
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
    const catalog = catalogServiceMock({ entities: [entity] });

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
  });
});
