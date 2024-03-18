/*
 * Copyright 2024 The Backstage Authors
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

import { ServiceMock, mockServices } from '@backstage/backend-test-utils';
import { RateLimitStore } from './rateLimitStore';
import { CacheService } from '@backstage/backend-plugin-api';

jest.setSystemTime(Date.parse('2024-03-15T08:39:11.869Z'));

describe('RateLimitStore', () => {
  let cacheServiceMock: ServiceMock<CacheService>;
  let rateLimitStore: RateLimitStore;

  beforeEach(() => {
    jest.clearAllMocks();
    cacheServiceMock = mockServices.cache.mock();
    rateLimitStore = RateLimitStore.fromOptions({
      prefix: 'rl_',
      cache: cacheServiceMock,
    });
  });

  it('should initialize with default options', () => {
    expect(rateLimitStore.windowMs).toBe(1 * 60 * 1000);
  });

  it('should initialize with custom options', () => {
    rateLimitStore.init({ windowMs: 10 * 60 * 1000 });
    expect(rateLimitStore.windowMs).toBe(10 * 60 * 1000);
  });

  it('should get rate limit info for existing key', async () => {
    const key = 'existingKey';
    const existingValue = {
      totalHits: 5,
      resetTime: new Date(),
    };

    cacheServiceMock.get.mockResolvedValue({
      totalHits: existingValue.totalHits,
      resetTime: existingValue.resetTime.getTime(),
    });

    const returnedValue = await rateLimitStore.get(key);

    expect(returnedValue).toEqual(existingValue);
    expect(cacheServiceMock.get).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
    );
  });

  it('should get default rate limit info for non-existing key', async () => {
    const key = 'nonExistingKey';
    const defaultValue = {
      totalHits: 0,
      resetTime: new Date(Date.now() + rateLimitStore.windowMs),
    };

    cacheServiceMock.get.mockResolvedValue(undefined);

    const returnedValue = await rateLimitStore.get(key);

    expect(returnedValue).toEqual(defaultValue);
    expect(cacheServiceMock.get).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
    );
  });

  it('should increment rate limit for existing key', async () => {
    const key = 'exisitingKey';
    const existingValue = {
      totalHits: 5,
      resetTime: new Date(),
    };

    cacheServiceMock.get.mockResolvedValue({
      totalHits: existingValue.totalHits,
      resetTime: existingValue.resetTime.getTime(),
    });

    const incrementedValue = await rateLimitStore.increment(key);

    expect(incrementedValue.totalHits).toBe(existingValue.totalHits + 1);
    expect(incrementedValue.resetTime).toEqual(existingValue.resetTime);
    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
      {
        totalHits: existingValue.totalHits + 1,
        resetTime: existingValue.resetTime.getTime(),
      },
      { ttl: rateLimitStore.windowMs },
    );
  });

  it('should increment rate limit for non-existing key', async () => {
    const key = 'nonExistingKey';

    cacheServiceMock.get.mockResolvedValue(undefined);

    const incrementedValue = await rateLimitStore.increment(key);

    expect(incrementedValue.totalHits).toBe(1);
    expect(incrementedValue.resetTime).toBeInstanceOf(Date);
    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
      {
        totalHits: incrementedValue.totalHits,
        resetTime: incrementedValue.resetTime?.getTime(),
      },
      { ttl: rateLimitStore.windowMs },
    );
  });

  it('should decrement rate limit for existing key', async () => {
    const key = 'exisitingKey';
    const existingValue = {
      totalHits: 5,
      resetTime: new Date(),
    };

    cacheServiceMock.get.mockResolvedValue({
      totalHits: existingValue.totalHits,
      resetTime: existingValue.resetTime.getTime(),
    });

    await rateLimitStore.decrement(key);

    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
      {
        totalHits: existingValue.totalHits - 1,
        resetTime: existingValue.resetTime.getTime(),
      },
      { ttl: rateLimitStore.windowMs },
    );
  });

  it('should not decrement rate limit below zero', async () => {
    const key = 'testKey';
    const existingValue = {
      totalHits: 0,
      resetTime: new Date(),
    };

    cacheServiceMock.get.mockResolvedValue({
      totalHits: existingValue.totalHits,
      resetTime: existingValue.resetTime.getTime(),
    });

    await rateLimitStore.decrement(key);

    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
      {
        totalHits: 0,
        resetTime: existingValue.resetTime.getTime(),
      },
      { ttl: rateLimitStore.windowMs },
    );
  });

  it('should reset rate limit for existing key', async () => {
    const key = 'exitingKey';

    await rateLimitStore.resetKey(key);

    expect(cacheServiceMock.delete).toHaveBeenCalledWith(
      rateLimitStore.prefixKey(key),
    );
  });
});
