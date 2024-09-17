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
import { mockServices } from '@backstage/backend-test-utils';
import { RateLimitStoreFactory } from './RateLimitStoreFactory';
import { RedisStore } from 'rate-limit-redis';
import KeyvRedis from '@keyv/redis';

jest.mock('@keyv/redis');
(KeyvRedis as jest.Mocked<any>).mockImplementation(() => {
  return {
    redis: {
      call: jest.fn().mockResolvedValue('OK'),
    },
  };
});

describe('CacheRateLimitStoreFactory', () => {
  it('should return redis store with auto configuration', () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          cache: {
            store: 'redis',
          },
          rateLimit: {
            store: undefined,
          },
        },
      },
    });
    const factory = new RateLimitStoreFactory(config);
    const store = factory.create();
    expect(store).toBeInstanceOf(RedisStore);
  });

  it('should return undefined store with auto configuration if redis is not available', () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          cache: {
            store: 'memory',
          },
          database: {
            client: 'sqlite3',
          },
          rateLimit: {
            store: undefined,
          },
        },
      },
    });
    const factory = new RateLimitStoreFactory(config);
    const store = factory.create();
    expect(store).toBeUndefined();
  });

  it('should return redis store if configured explicitly', () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          rateLimit: {
            store: 'redis',
          },
        },
      },
    });
    const factory = new RateLimitStoreFactory(config);
    const store = factory.create();
    expect(store).toBeInstanceOf(RedisStore);
  });
});
