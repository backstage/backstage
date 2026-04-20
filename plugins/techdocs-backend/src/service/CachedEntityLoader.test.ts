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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
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

  const userCredentials = mockCredentials.user('user:default/test-user');
  const serviceCredentials = mockCredentials.service('plugin:test-plugin');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('writes entities to cache for user credentials', async () => {
    cache.get.mockResolvedValue(undefined);
    const catalog = catalogServiceMock({ entities: [entity] });
    jest.spyOn(catalog, 'getEntityByRef');

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(userCredentials, entityName);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByRef).toHaveBeenCalledWith(entityName, {
      credentials: userCredentials,
    });
    expect(cache.set).toHaveBeenCalledWith(
      `catalog:component:default/test:${userCredentials}`,
      entity,
      { ttl: 5000 },
    );
  });

  it('returns entities from cache', async () => {
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'getEntityByRef');
    cache.get.mockResolvedValue(entity);

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(userCredentials, entityName);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByRef).not.toHaveBeenCalled();
  });

  it('does not cache missing entities', async () => {
    const catalog = catalogServiceMock({ entities: [] });
    cache.get.mockResolvedValue(undefined);

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(userCredentials, entityName);

    expect(result).toBeUndefined();
    expect(cache.set).not.toHaveBeenCalled();
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
    const result = await loader.load(userCredentials, entityName);

    expect(result).toEqual(entity);
  });

  it('creates different cache keys for different credentials', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);

    const loader = new CachedEntityLoader({ catalog, cache });

    const anotherUserCredentials = mockCredentials.user(
      'user:default/another-user',
    );

    await loader.load(userCredentials, entityName);
    await loader.load(anotherUserCredentials, entityName);

    expect(cache.set).toHaveBeenCalledWith(
      `catalog:component:default/test:${userCredentials}`,
      entity,
      { ttl: 5000 },
    );
    expect(cache.set).toHaveBeenCalledWith(
      `catalog:component:default/test:${anotherUserCredentials}`,
      entity,
      { ttl: 5000 },
    );
  });

  it('uses service credentials as cache key for service credentials', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);

    const loader = new CachedEntityLoader({ catalog, cache });
    const result = await loader.load(serviceCredentials, entityName);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      `catalog:component:default/test:${serviceCredentials}`,
      entity,
      { ttl: 5000 },
    );
  });
});
