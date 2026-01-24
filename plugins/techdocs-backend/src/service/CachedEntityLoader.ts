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

import {
  AuthService,
  BackstageCredentials,
  CacheService,
} from '@backstage/backend-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export type CachedEntityLoaderOptions = {
  auth: AuthService;
  catalog: CatalogApi;
  cache: CacheService;
};

export class CachedEntityLoader {
  private readonly auth: AuthService;
  private readonly catalog: CatalogApi;
  private readonly cache: CacheService;
  private readonly readTimeout = 1000;

  constructor({ auth, catalog, cache }: CachedEntityLoaderOptions) {
    this.auth = auth;
    this.catalog = catalog;
    this.cache = cache;
  }

  async load(
    credentials: BackstageCredentials,
    entityRef: CompoundEntityRef,
    token: string | undefined,
  ): Promise<Entity | undefined> {
    const cacheKey = this.getCacheKey(entityRef, credentials);
    let result = await this.getFromCache(cacheKey);

    if (result) {
      return result;
    }

    result = await this.catalog.getEntityByRef(entityRef, { token });

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

  private getCacheKey(
    entityName: CompoundEntityRef,
    credentials: BackstageCredentials,
  ): string {
    const key = ['catalog', stringifyEntityRef(entityName)];

    if (this.auth.isPrincipal(credentials, 'user')) {
      key.push(credentials.principal.userEntityRef);
    } else if (this.auth.isPrincipal(credentials, 'service')) {
      key.push(credentials.principal.subject);
    }

    return key.join(':');
  }
}
