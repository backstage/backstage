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
import { RateLimitStoreFactory } from './RateLimitStoreFactory.ts';
import { RedisStore } from 'rate-limit-redis';

jest.mock('@keyv/redis', () => {
  const Actual = jest.requireActual('@keyv/redis');
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn(() => {
      return {
        getClient: jest.fn(() => ({
          sendCommand: jest.fn().mockReturnValue('mock'),
        })),
      };
    }),
  };
});

describe('CacheRateLimitStoreFactory', () => {
  afterEach(jest.clearAllMocks);

  it('should return undefined store with auto configuration if redis is not available', () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          rateLimit: {
            store: undefined,
          },
        },
      },
    });
    const store = RateLimitStoreFactory.create({ config });
    expect(store).toBeUndefined();
  });

  it('should return redis store if configured explicitly', async () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          rateLimit: {
            store: {
              type: 'redis',
              connection: 'redis://localhost:6379',
            },
          },
        },
      },
    });
    const store = RateLimitStoreFactory.create({ config });
    expect(store).toBeInstanceOf(RedisStore);
  });
});
