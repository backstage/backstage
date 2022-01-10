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
import { ResponseError } from '@backstage/errors';
import {
  BackstageIdentityResponse,
  IdentityClient,
} from '@backstage/plugin-auth-backend';
import { EntityName } from '@backstage/catalog-model';
import { Response } from 'cross-fetch';

describe('CachedEntityLoader', () => {
  const catalog: jest.Mocked<CatalogClient> = {
    getEntityByName: jest.fn(),
  } as any;

  const cache: jest.Mocked<CacheClient> = {
    get: jest.fn(),
    set: jest.fn(),
  } as any;

  const identity: jest.Mocked<IdentityClient> = {
    authenticate: jest.fn(),
  } as any;

  const entityName: EntityName = {
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

  const identityResponse: BackstageIdentityResponse = {
    id: '',
    token,
    identity: {
      type: 'user',
      userEntityRef: 'user:default/test-user',
      ownershipEntityRefs: [],
    },
  };

  const loader = new CachedEntityLoader({ catalog, cache, identity });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('writes entities to cache', async () => {
    identity.authenticate.mockResolvedValue(identityResponse);
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByName.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(cache.set).toBeCalledWith(
      'catalog:component:default/test:user:default/test-user',
      entity,
      { ttl: 5000 },
    );
  });

  it('returns entities from cache', async () => {
    identity.authenticate.mockResolvedValue(identityResponse);
    cache.get.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
    expect(catalog.getEntityByName).not.toBeCalled();
  });

  it('does not cache missing entites', async () => {
    identity.authenticate.mockResolvedValue(identityResponse);
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByName.mockResolvedValue(undefined);

    const result = await loader.load(entityName, token);

    expect(result).toBeUndefined();
    expect(cache.set).not.toBeCalled();
  });

  it('transforms 403 responses from catalog to undefined', async () => {
    identity.authenticate.mockResolvedValue(identityResponse);
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByName.mockRejectedValue(
      await ResponseError.fromResponse(new Response(null, { status: 403 })),
    );

    const result = await loader.load(entityName, token);

    expect(result).toBeUndefined();
  });

  it('uses entity ref as cache key for anonymous users', async () => {
    cache.get.mockResolvedValue(undefined);
    catalog.getEntityByName.mockResolvedValue(entity);

    const result = await loader.load(entityName, undefined);

    expect(result).toEqual(entity);
    expect(cache.set).toBeCalledWith('catalog:component:default/test', entity, {
      ttl: 5000,
    });
  });

  it('calls the catalog if the cache read takes too long', async () => {
    identity.authenticate.mockResolvedValue(identityResponse);
    cache.get.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(undefined), 10000);
        }),
    );
    catalog.getEntityByName.mockResolvedValue(entity);

    const result = await loader.load(entityName, token);

    expect(result).toEqual(entity);
  });
});
