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
import { CatalogClient } from '@backstage/catalog-client';
import { CacheClient } from '@backstage/backend-common';
import {
  Entity,
  EntityName,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { IdentityClient } from '@backstage/plugin-auth-backend';
import { ResponseError } from '@backstage/errors';

export type CachedEntityLoaderOptions = {
  catalog: CatalogClient;
  cache: CacheClient;
  identity: IdentityClient;
};

export class CachedEntityLoader {
  private readonly catalog: CatalogClient;
  private readonly cache: CacheClient;
  private readonly identity: IdentityClient;
  private readonly readTimeout = 1000;

  constructor({ catalog, cache, identity }: CachedEntityLoaderOptions) {
    this.catalog = catalog;
    this.cache = cache;
    this.identity = identity;
  }

  async load(
    entityName: EntityName,
    token: string | undefined,
  ): Promise<Entity | undefined> {
    const cacheKey = await this.getCacheKey(entityName, token);
    let result = await this.getFromCache(cacheKey);

    if (result) {
      return result;
    }

    try {
      result = await this.catalog.getEntityByName(entityName, { token });
    } catch (err) {
      if (err instanceof ResponseError && err.response.status === 403) {
        result = undefined;
      } else {
        throw err;
      }
    }

    if (result) {
      this.cache.set(cacheKey, result, { ttl: 5000 });
    }

    return result;
  }

  private async getFromCache(key: string): Promise<Entity | undefined> {
    // Promise.race ensures we don't hang the client for long if the cache is
    // temporarily unreachable.
    return (await Promise.race([
      this.cache.get(key),
      new Promise(cancelAfter => setTimeout(cancelAfter, this.readTimeout)),
    ])) as Entity | undefined;
  }

  private async getCacheKey(
    entityName: EntityName,
    token: string | undefined,
  ): Promise<string> {
    const key = ['catalog'];
    key.push(stringifyEntityRef(entityName));

    if (token) {
      const response = await this.identity.authenticate(token);
      key.push(response.identity.userEntityRef);
    }

    return key.join(':');
  }
}
