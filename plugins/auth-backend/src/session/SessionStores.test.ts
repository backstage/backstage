/*
 * Copyright 2021 The Backstage Authors
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

import { AuthDatabase } from '../database/AuthDatabase';
import { getVoidLogger } from '@backstage/backend-common';
import { SessionStores } from './SessionStores';
import { MemoryStore } from 'express-session';
import { MockConfigApi } from '@backstage/test-utils';
import { RedisMemoryServer } from 'redis-memory-server';

describe('SessionStores', () => {
  it('test session store config load', async () => {
    const mockConfig = new MockConfigApi({
      auth: {
        session: {
          store: {
            provider: 'memory',
          },
        },
      },
    });

    const configSpy = jest.spyOn(mockConfig, 'getOptionalConfig');
    await SessionStores.fromConfig(mockConfig, {
      logger: getVoidLogger(),
    });
    expect(configSpy).toHaveBeenCalledWith('auth.session.store');
    expect(
      mockConfig
        .getOptionalConfig('auth.session.store')
        ?.getOptionalString('provider'),
    ).toBe('memory');
  });

  it('can handle without config: default', async () => {
    const mockConfig = new MockConfigApi({});
    const sessionStore = await SessionStores.fromConfig(mockConfig, {
      logger: getVoidLogger(),
      database: AuthDatabase.forTesting(),
    });
    expect(sessionStore.constructor.name).toEqual('KnexStore');
  });

  describe('database session store', () => {
    it('fail if database instance is not provided', async () => {
      const mockConfig = new MockConfigApi({
        auth: {
          session: {
            store: {
              provider: 'database',
            },
          },
        },
      });

      await expect(
        SessionStores.fromConfig(mockConfig, {
          logger: getVoidLogger(),
        }),
      ).rejects.toThrow('Database is required for Database session store.');
    });

    it('creates database session store from configs', async () => {
      const mockConfig = new MockConfigApi({
        auth: {
          session: {
            store: {
              provider: 'database',
            },
          },
        },
      });

      const sessionStore = await SessionStores.fromConfig(mockConfig, {
        logger: getVoidLogger(),
        database: AuthDatabase.forTesting(),
      });
      expect(sessionStore.constructor.name).toEqual('KnexStore');
    });
  });

  describe('redis session store', () => {
    let redisServer: RedisMemoryServer;

    beforeAll(async () => {
      // Start Redis server
      redisServer = new RedisMemoryServer();
      await redisServer.start();
    });

    afterAll(async () => {
      await redisServer.stop();
    });

    it('creates redis session store from configs: no redis integration configured', async () => {
      const mockConfig = new MockConfigApi({
        auth: {
          session: {
            store: {
              provider: 'redis',
            },
          },
        },
      });

      await expect(
        SessionStores.fromConfig(mockConfig, {
          logger: getVoidLogger(),
        }),
      ).rejects.toThrow(
        "Unable to create RedisSessionStore. Please provide Redis integration config under 'integrations.redis'.",
      );
    });

    it('should create redis session store', async () => {
      const mockConfig = new MockConfigApi({
        integrations: {
          redis: {
            url: `redis://${await redisServer.getHost()}:${await redisServer.getPort()}`,
          },
        },
        auth: {
          session: {
            store: {
              provider: 'redis',
            },
          },
        },
      });

      const sessionStore = await SessionStores.fromConfig(mockConfig, {
        logger: getVoidLogger(),
      });
      expect(sessionStore.constructor.name).toEqual('RedisStore');
    });
  });

  describe('memory session store', () => {
    it('creates memory session store from configs', async () => {
      const mockConfig = new MockConfigApi({
        auth: {
          session: {
            store: {
              provider: 'memory',
            },
          },
        },
      });

      const sessionStore = await SessionStores.fromConfig(mockConfig, {
        logger: getVoidLogger(),
      });
      expect(sessionStore).toBeInstanceOf(MemoryStore);
    });
  });
});
