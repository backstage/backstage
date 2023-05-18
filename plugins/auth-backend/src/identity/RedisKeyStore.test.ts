/*
 * Copyright 2020 The Backstage Authors
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

import {getVoidLogger} from '@backstage/backend-common';
import {Config} from '@backstage/config';
import {MockConfigApi} from '@backstage/test-utils';
import {RedisMemoryServer} from 'redis-memory-server';
import {RedisKeyStore} from "./RedisKeyStore";
import {DateTime} from "luxon";
import {StoredKey} from "./types";

// First time this test runs it requires more time in order to download redis binaries
jest.setTimeout(20000);

const keyBase = {
  use: 'sig',
  kty: 'plain',
  alg: 'Base64',
} as const;

function sortKeys(list: { items: StoredKey[] }) {
  list.items.sort((a, b) => Number(a.key.kid) - Number(b.key.kid));
}

describe('RedisKeyStore', () => {
  let redisServer: RedisMemoryServer;

  beforeAll(async () => {
    // Start Redis server
    redisServer = new RedisMemoryServer();
    await redisServer.start();
  });

  afterAll(async () => {
    await redisServer.stop();
  });

  describe('redis key store configuration', () => {
    it('throw error if redis is not configured', async () => {
      const mockConfig = new MockConfigApi({
        integrations: {},
      });

      await expect(
        RedisKeyStore.create({
          config: mockConfig,
          logger: getVoidLogger(),
        })
      ).rejects.toThrow("Unable to create RedisKeyStore. Please provide Redis integration config under 'integrations.redis'.");
    });

    it('should connect to redis and return a RedisKeyStore instance', async () => {
      const mockConfig = new MockConfigApi({
        integrations: {
          redis: {
            url: `redis://${await redisServer.getHost()}:${await redisServer.getPort()}`,
          },
        },
      });

      const tokenStore = await RedisKeyStore.create({
        config: mockConfig,
        logger: getVoidLogger(),
      })!;

      expect(tokenStore).toBeDefined();
    });
  });

  describe('connect to redis and validate RedisKeyStore operations', () => {
    let mockConfig: Config;
    let keyStore: RedisKeyStore;

    const key1 = {kid: '1', ...keyBase};
    const key2 = {kid: '2', ...keyBase};
    const key3 = {kid: '3', ...keyBase};

    beforeAll(async () => {
      mockConfig = new MockConfigApi({
        integrations: {
          redis: {
            url: `redis://${await redisServer.getHost()}:${await redisServer.getPort()}`,
          },
        },
      });

      keyStore = await RedisKeyStore.create({
        config: mockConfig,
        logger: getVoidLogger(),
      })!;
    });

    it('should store a key', async () => {

      const keys = await keyStore.listKeys();
      expect(keys).toEqual({items: []});

      await keyStore.addKey(key1);

      const {items} = await keyStore.listKeys();
      expect(items).toEqual([{createdAt: expect.anything(), key: key1}]);
      expect(
        Math.abs(
          DateTime.fromJSDate(items[ 0 ].createdAt).diffNow('seconds').seconds,
        ),
      ).toBeLessThan(10);
    });

    it('should remove stored keys', async () => {

      await keyStore.addKey(key1);
      await keyStore.addKey(key2);
      await keyStore.addKey(key3);

      let keys = await keyStore.listKeys();
      sortKeys(keys);
      expect(keys).toEqual({
        items: [
          {key: key1, createdAt: expect.anything()},
          {key: key2, createdAt: expect.anything()},
          {key: key3, createdAt: expect.anything()},
        ],
      });

      await keyStore.removeKeys(['1']);

      keys = await keyStore.listKeys();
      sortKeys(keys);
      expect(keys).toEqual({
        items: [
          {key: key2, createdAt: expect.anything()},
          {key: key3, createdAt: expect.anything()},
        ],
      });

      await keyStore.removeKeys(['1', '2']);

      keys = await keyStore.listKeys();
      sortKeys(keys);
      expect(keys).toEqual({
        items: [{key: key3, createdAt: expect.anything()}],
      });

      await keyStore.removeKeys([]);

      keys = await keyStore.listKeys();
      sortKeys(keys);
      expect(keys).toEqual({
        items: [{key: key3, createdAt: expect.anything()}],
      });

      await keyStore.removeKeys(['3', '4']);

      keys = await keyStore.listKeys();
      expect(keys).toEqual({
        items: [],
      });

      await keyStore.addKey(key1);
      await keyStore.addKey(key2);
      await keyStore.addKey(key3);

      keys = await keyStore.listKeys();
      sortKeys(keys);
      expect(keys).toEqual({
        items: [
          {key: key1, createdAt: expect.anything()},
          {key: key2, createdAt: expect.anything()},
          {key: key3, createdAt: expect.anything()},
        ],
      });

      await keyStore.removeKeys(['1', '2', '3']);

      keys = await keyStore.listKeys();
      expect(keys).toEqual({
        items: [],
      });
    });
  });
});
