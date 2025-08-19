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
import { BackstageCredentials } from '@backstage/backend-plugin-api';

describe('CachedEntityLoader', () => {
  const cache = mockServices.cache.mock();
  const auth = mockServices.auth.mock();

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

  const userCredentials: BackstageCredentials = {
    $$type: '@backstage/BackstageCredentials',
    principal: {
      type: 'user',
      userEntityRef: 'user:default/test-user',
    },
  };

  const pluginCredentials: BackstageCredentials = {
    $$type: '@backstage/BackstageCredentials',
    principal: {
      type: 'plugin',
      subject: 'plugin:test-plugin',
    },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('writes entities to cache for user credentials', async () => {
    cache.get.mockResolvedValue(undefined);
    const catalog = catalogServiceMock({ entities: [entity] });
    auth.isPrincipal.mockReturnValue(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(userCredentials, entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:user:default/test-user',
      entity,
      { ttl: 5000 },
    );
  });

  it('returns entities from cache', async () => {
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'getEntityByRef');
    cache.get.mockResolvedValue(entity);
    auth.isPrincipal.mockReturnValue(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(userCredentials, entityName, token);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByRef).not.toHaveBeenCalled();
  });

  it('does not cache missing entities', async () => {
    const catalog = catalogServiceMock({ entities: [] });
    cache.get.mockResolvedValue(undefined);
    auth.isPrincipal.mockReturnValue(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(userCredentials, entityName, token);

    expect(result).toBeUndefined();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('uses entity ref as cache key for service credentials', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);
    auth.isPrincipal.mockReturnValueOnce(false).mockReturnValueOnce(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(pluginCredentials, entityName, undefined);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:plugin:test-plugin',
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
    auth.isPrincipal.mockReturnValue(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(userCredentials, entityName, token);

    expect(result).toEqual(entity);
  });

  it('creates different cache keys for different users', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);
    auth.isPrincipal.mockReturnValue(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });

    const anotherUserCredentials: BackstageCredentials = {
      $$type: '@backstage/BackstageCredentials',
      principal: {
        type: 'user',
        userEntityRef: 'user:default/another-user',
      },
    };

    await loader.load(userCredentials, entityName, token);
    await loader.load(anotherUserCredentials, entityName, token);

    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:user:default/test-user',
      entity,
      { ttl: 5000 },
    );
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:user:default/another-user',
      entity,
      { ttl: 5000 },
    );
  });

  it('creates cache key with service subject for service credentials', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);
    auth.isPrincipal.mockReturnValueOnce(false).mockReturnValueOnce(true);

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(pluginCredentials, entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test:plugin:test-plugin',
      entity,
      { ttl: 5000 },
    );
    expect(auth.isPrincipal).toHaveBeenCalledWith(pluginCredentials, 'user');
    expect(auth.isPrincipal).toHaveBeenCalledWith(pluginCredentials, 'service');
  });

  it('handles credentials that are neither user nor service', async () => {
    const catalog = catalogServiceMock({ entities: [entity] });
    cache.get.mockResolvedValue(undefined);
    auth.isPrincipal.mockReturnValue(false);

    const unknownCredentials: BackstageCredentials = {
      $$type: '@backstage/BackstageCredentials',
      principal: {
        type: 'unknown' as any,
      },
    };

    const loader = new CachedEntityLoader({ auth, catalog, cache });
    const result = await loader.load(unknownCredentials, entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toHaveBeenCalledWith(
      'catalog:component:default/test',
      entity,
      { ttl: 5000 },
    );
  });
});
