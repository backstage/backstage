/*
 * Copyright 2026 The Backstage Authors
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
  BackstageCredentials,
  CacheService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { techDocsEntityReadPermission } from '@backstage/plugin-techdocs-common';

type CachedPermissionLoaderOptions = {
  permissions: PermissionsService;
  cache: CacheService;
};

/**
 * Caches `techdocs.entity.read` decisions briefly, mirroring
 * `CachedEntityLoader`, since a single page load fires many asset requests.
 */
export class CachedPermissionLoader {
  private readonly permissions: PermissionsService;
  private readonly cache: CacheService;
  private readonly readTimeout = 1000;

  constructor({ permissions, cache }: CachedPermissionLoaderOptions) {
    this.permissions = permissions;
    this.cache = cache;
  }

  async isAllowed(
    credentials: BackstageCredentials,
    entityRef: string,
  ): Promise<boolean> {
    const cacheKey = this.getCacheKey(entityRef, credentials);
    const cached = await this.getFromCache(cacheKey);

    if (cached !== undefined) {
      return cached === AuthorizeResult.ALLOW;
    }

    const [decision] = await this.permissions.authorize(
      [{ permission: techDocsEntityReadPermission, resourceRef: entityRef }],
      { credentials },
    );

    this.cache.set(cacheKey, decision.result, { ttl: 5000 });

    return decision.result === AuthorizeResult.ALLOW;
  }

  private async getFromCache(key: string): Promise<string | undefined> {
    let timeout: NodeJS.Timeout | undefined;
    try {
      // Promise.race ensures we don't hang the client for long if the cache is
      // temporarily unreachable.
      return (await Promise.race([
        this.cache.get(key),
        new Promise(cancelAfter => {
          timeout = setTimeout(cancelAfter, this.readTimeout);
        }),
      ])) as string | undefined;
    } finally {
      clearTimeout(timeout);
    }
  }

  private getCacheKey(
    entityRef: string,
    credentials: BackstageCredentials,
  ): string {
    return [
      'permission',
      techDocsEntityReadPermission.name,
      entityRef,
      String(credentials), // these have a well defined toString method
    ].join(':');
  }
}
