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
  BackstageUserInfo,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { mockCredentials } from '@backstage/backend-test-utils';
import { createDeferred } from '@backstage/types';
import {
  CachedUserInfoService,
  UserInfoCacheEntry,
} from './CachedUserInfoService';

const aliceInfo: BackstageUserInfo = {
  userEntityRef: 'user:default/alice',
  ownershipEntityRefs: ['user:default/alice', 'group:default/team-a'],
};

describe('CachedUserInfoService', () => {
  it('delegates to the underlying service on the first call', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);

    const result = await service.getUserInfo(mockCredentials.user());

    expect(result).toEqual(aliceInfo);
    expect(delegate.getUserInfo).toHaveBeenCalledTimes(1);
  });

  it('returns the cached result on subsequent calls within TTL', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);
    const creds = mockCredentials.user();

    await service.getUserInfo(creds);
    await service.getUserInfo(creds);
    await service.getUserInfo(creds);

    expect(delegate.getUserInfo).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent in-flight requests for the same token', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);
    const creds = mockCredentials.user();

    const [r1, r2, r3] = await Promise.all([
      service.getUserInfo(creds),
      service.getUserInfo(creds),
      service.getUserInfo(creds),
    ]);

    expect(r1).toEqual(aliceInfo);
    expect(r2).toEqual(aliceInfo);
    expect(r3).toEqual(aliceInfo);
    expect(delegate.getUserInfo).toHaveBeenCalledTimes(1);
  });

  it('caches different tokens separately', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);

    await service.getUserInfo(mockCredentials.user('user:default/alice'));
    await service.getUserInfo(mockCredentials.user('user:default/bob'));

    expect(delegate.getUserInfo).toHaveBeenCalledTimes(2);
  });

  it('re-fetches after the TTL expires', async () => {
    jest.useFakeTimers();
    try {
      const delegate: UserInfoService = {
        getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
      };
      const service = new CachedUserInfoService(delegate, { ttlMs: 50 });
      const creds = mockCredentials.user();

      await service.getUserInfo(creds);
      expect(delegate.getUserInfo).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(60);

      await service.getUserInfo(creds);
      expect(delegate.getUserInfo).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('evicts the cache entry on rejection and retries on next call', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest
        .fn()
        .mockRejectedValueOnce(new Error('auth backend down'))
        .mockResolvedValueOnce(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);
    const creds = mockCredentials.user();

    await expect(service.getUserInfo(creds)).rejects.toThrow(
      'auth backend down',
    );
    expect(delegate.getUserInfo).toHaveBeenCalledTimes(1);

    const result = await service.getUserInfo(creds);
    expect(result).toEqual(aliceInfo);
    expect(delegate.getUserInfo).toHaveBeenCalledTimes(2);
  });

  it('evicts eagerly so concurrent waiters see the rejection and the next call retries', async () => {
    const firstCall = createDeferred<BackstageUserInfo>();
    firstCall.catch(() => {});

    const delegate: UserInfoService = {
      getUserInfo: jest
        .fn()
        .mockReturnValueOnce(firstCall)
        .mockResolvedValueOnce(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);
    const creds = mockCredentials.user();

    const p1 = service.getUserInfo(creds);
    const p2 = service.getUserInfo(creds);

    firstCall.reject(new Error('boom'));

    await expect(p1).rejects.toThrow('boom');
    await expect(p2).rejects.toThrow('boom');

    const result = await service.getUserInfo(creds);
    expect(result).toEqual(aliceInfo);
    expect(delegate.getUserInfo).toHaveBeenCalledTimes(2);
  });

  it('delegates directly when credentials have no token', async () => {
    const delegate: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const service = new CachedUserInfoService(delegate);

    await service.getUserInfo(mockCredentials.none());
    await service.getUserInfo(mockCredentials.none());

    expect(delegate.getUserInfo).toHaveBeenCalledTimes(2);
  });

  it('shares cache entries across instances when given the same map', async () => {
    const delegate1: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const delegate2: UserInfoService = {
      getUserInfo: jest.fn().mockResolvedValue(aliceInfo),
    };
    const entries = new Map<string, UserInfoCacheEntry>();
    const service1 = new CachedUserInfoService(delegate1, { entries });
    const service2 = new CachedUserInfoService(delegate2, { entries });
    const creds = mockCredentials.user();

    await service1.getUserInfo(creds);
    await service2.getUserInfo(creds);

    expect(delegate1.getUserInfo).toHaveBeenCalledTimes(1);
    expect(delegate2.getUserInfo).not.toHaveBeenCalled();
  });
});
