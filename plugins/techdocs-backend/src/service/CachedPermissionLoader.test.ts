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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { techDocsEntityReadPermission } from '@backstage/plugin-techdocs-common';
import { CachedPermissionLoader } from './CachedPermissionLoader';

describe('CachedPermissionLoader', () => {
  const cache = mockServices.cache.mock();
  const permissions = mockServices.permissions.mock();
  const userCredentials = mockCredentials.user('user:default/test-user');
  const entityRef = 'component:default/test';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('authorizes and caches decisions per entity and principal', async () => {
    cache.get.mockResolvedValue(undefined);
    permissions.authorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);

    const loader = new CachedPermissionLoader({ permissions, cache });

    await expect(loader.isAllowed(userCredentials, entityRef)).resolves.toBe(
      false,
    );
    expect(permissions.authorize).toHaveBeenCalledWith(
      [{ permission: techDocsEntityReadPermission, resourceRef: entityRef }],
      { credentials: userCredentials },
    );
    expect(cache.set).toHaveBeenCalledWith(
      `permission:techdocs.entity.read:${entityRef}:${userCredentials}`,
      AuthorizeResult.DENY,
      { ttl: 5000 },
    );

    const otherCredentials = mockCredentials.user('user:default/other-user');
    await loader.isAllowed(otherCredentials, entityRef);
    expect(cache.set).toHaveBeenLastCalledWith(
      `permission:techdocs.entity.read:${entityRef}:${otherCredentials}`,
      AuthorizeResult.DENY,
      { ttl: 5000 },
    );
  });

  it('returns cached decisions without calling the permission framework', async () => {
    const loader = new CachedPermissionLoader({ permissions, cache });

    cache.get.mockResolvedValue(AuthorizeResult.ALLOW);
    await expect(loader.isAllowed(userCredentials, entityRef)).resolves.toBe(
      true,
    );

    cache.get.mockResolvedValue(AuthorizeResult.DENY);
    await expect(loader.isAllowed(userCredentials, entityRef)).resolves.toBe(
      false,
    );

    expect(permissions.authorize).not.toHaveBeenCalled();
  });

  it('calls the permission framework if the cache read takes too long', async () => {
    jest.useFakeTimers();
    try {
      cache.get.mockReturnValue(new Promise(() => {}));
      permissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);

      const loader = new CachedPermissionLoader({ permissions, cache });
      const result = loader.isAllowed(userCredentials, entityRef);
      await jest.advanceTimersByTimeAsync(1000);

      await expect(result).resolves.toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});
