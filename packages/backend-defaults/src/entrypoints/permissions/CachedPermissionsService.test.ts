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

import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { CachedPermissionsService } from './CachedPermissionsService';

const allow = [{ result: AuthorizeResult.ALLOW }];
const deny = [{ result: AuthorizeResult.DENY }];

const readPermission = {
  permission: {
    type: 'resource' as const,
    name: 'catalog.entity.read',
    resourceType: 'catalog-entity',
    attributes: {},
  },
};

function createDelegate() {
  return mockServices.permissions.mock({
    authorize: jest.fn().mockResolvedValue(allow),
    authorizeConditional: jest.fn().mockResolvedValue(allow),
  });
}

describe('CachedPermissionsService', () => {
  describe('authorizeConditional', () => {
    it('delegates on first call', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);

      const result = await service.authorizeConditional([readPermission], {
        credentials: mockCredentials.user(),
      });

      expect(result).toEqual(allow);
      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(1);
    });

    it('returns cached result on subsequent calls within TTL', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      await service.authorizeConditional([readPermission], opts);
      await service.authorizeConditional([readPermission], opts);
      await service.authorizeConditional([readPermission], opts);

      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(1);
    });

    it('coalesces concurrent in-flight requests', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      const [r1, r2, r3] = await Promise.all([
        service.authorizeConditional([readPermission], opts),
        service.authorizeConditional([readPermission], opts),
        service.authorizeConditional([readPermission], opts),
      ]);

      expect(r1).toEqual(allow);
      expect(r2).toEqual(allow);
      expect(r3).toEqual(allow);
      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(1);
    });

    it('caches different tokens separately', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);

      await service.authorizeConditional([readPermission], {
        credentials: mockCredentials.user('user:default/alice'),
      });
      await service.authorizeConditional([readPermission], {
        credentials: mockCredentials.user('user:default/bob'),
      });

      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(2);
    });

    it('caches different permission names separately', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      const deletePermission = {
        permission: {
          type: 'resource' as const,
          name: 'catalog.entity.delete',
          resourceType: 'catalog-entity',
          attributes: {},
        },
      };

      await service.authorizeConditional([readPermission], opts);
      await service.authorizeConditional([deletePermission], opts);

      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(2);
    });

    it('re-fetches after TTL expires', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate, { ttlMs: 50 });
      const opts = { credentials: mockCredentials.user() };

      await service.authorizeConditional([readPermission], opts);
      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(1);

      await new Promise(resolve => setTimeout(resolve, 60));

      await service.authorizeConditional([readPermission], opts);
      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(2);
    });

    it('evicts on rejection and retries on next call', async () => {
      const delegate = mockServices.permissions.mock({
        authorizeConditional: jest
          .fn()
          .mockRejectedValueOnce(new Error('permission backend down'))
          .mockResolvedValueOnce(allow),
      });
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      await expect(
        service.authorizeConditional([readPermission], opts),
      ).rejects.toThrow('permission backend down');

      const result = await service.authorizeConditional([readPermission], opts);
      expect(result).toEqual(allow);
      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(2);
    });

    it('bypasses cache when credentials have no token', async () => {
      const delegate = mockServices.permissions.mock({
        authorizeConditional: jest.fn().mockResolvedValue(deny),
      });
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.none() };

      await service.authorizeConditional([readPermission], opts);
      await service.authorizeConditional([readPermission], opts);

      expect(delegate.authorizeConditional).toHaveBeenCalledTimes(2);
    });
  });

  describe('authorize', () => {
    it('caches results including resourceRef in the key', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      await service.authorize(
        [{ permission: readPermission.permission, resourceRef: 'ref:1' }],
        opts,
      );
      await service.authorize(
        [{ permission: readPermission.permission, resourceRef: 'ref:1' }],
        opts,
      );

      expect(delegate.authorize).toHaveBeenCalledTimes(1);
    });

    it('caches different resourceRefs separately', async () => {
      const delegate = createDelegate();
      const service = new CachedPermissionsService(delegate);
      const opts = { credentials: mockCredentials.user() };

      await service.authorize(
        [{ permission: readPermission.permission, resourceRef: 'ref:1' }],
        opts,
      );
      await service.authorize(
        [{ permission: readPermission.permission, resourceRef: 'ref:2' }],
        opts,
      );

      expect(delegate.authorize).toHaveBeenCalledTimes(2);
    });
  });

  describe('shared entries', () => {
    it('shares cache across instances when given the same map', async () => {
      const delegate1 = createDelegate();
      const delegate2 = createDelegate();
      const entries = new Map();
      const service1 = new CachedPermissionsService(delegate1, { entries });
      const service2 = new CachedPermissionsService(delegate2, { entries });
      const opts = { credentials: mockCredentials.user() };

      await service1.authorizeConditional([readPermission], opts);
      await service2.authorizeConditional([readPermission], opts);

      expect(delegate1.authorizeConditional).toHaveBeenCalledTimes(1);
      expect(delegate2.authorizeConditional).not.toHaveBeenCalled();
    });
  });
});
