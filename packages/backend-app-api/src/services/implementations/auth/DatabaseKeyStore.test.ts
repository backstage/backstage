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

import {
  TestDatabaseId,
  TestDatabases,
  mockServices,
} from '@backstage/backend-test-utils';
import { DatabaseKeyStore, TABLE } from './DatabaseKeyStore';

const testKey = {
  kid: 'test-key',
  kty: 'RSA',
  e: 'ABC',
  n: 'test',
};
const testKey2 = {
  kid: 'test-key-2',
  kty: 'RSA',
  e: 'XYZ',
  n: 'test',
};

describe('DatabaseKeyStore', () => {
  const databases = TestDatabases.create();

  async function createDatabaseKeyStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    const logger = mockServices.logger.mock();
    return {
      knex,
      logger,
      keyStore: await DatabaseKeyStore.create({
        database: { getClient: async () => knex },
        logger,
      }),
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    it('should insert a key into the database and list it', async () => {
      const { keyStore } = await createDatabaseKeyStore(databaseId);
      const expiresAt = new Date(Date.now() + 3600_000);

      await expect(keyStore.listKeys()).resolves.toEqual({ keys: [] });

      await keyStore.addKey({
        id: testKey.kid,
        key: testKey,
        expiresAt,
      });

      await expect(keyStore.listKeys()).resolves.toEqual({
        keys: [{ id: testKey.kid, key: testKey, expiresAt }],
      });
    });

    it('should automatically exclude and remove expired keys when listing', async () => {
      const { keyStore, knex, logger } =
        await createDatabaseKeyStore(databaseId);
      const expiresAt = new Date(Date.now() + 3600_000);

      await expect(keyStore.listKeys()).resolves.toEqual({ keys: [] });

      await keyStore.addKey({
        id: testKey.kid,
        key: testKey,
        expiresAt,
      });
      await keyStore.addKey({
        id: testKey2.kid,
        key: testKey2,
        expiresAt: new Date(0),
      });

      await expect(knex(TABLE).select('id')).resolves.toEqual([
        { id: testKey.kid },
        { id: testKey2.kid },
      ]);

      expect(logger.info).not.toHaveBeenCalled();

      await expect(keyStore.listKeys()).resolves.toEqual({
        keys: [{ id: testKey.kid, key: testKey, expiresAt }],
      });

      expect(logger.info).toHaveBeenCalledWith(
        "Removing expired plugin service keys, 'test-key-2'",
      );

      // Key deletion happens async, so give it a bit of time to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      await expect(knex(TABLE).select('id')).resolves.toEqual([
        { id: testKey.kid },
      ]);
    });

    it('should fail to insert with invalid date', async () => {
      const { keyStore } = await createDatabaseKeyStore(databaseId);

      await expect(keyStore.listKeys()).resolves.toEqual({ keys: [] });

      await expect(
        keyStore.addKey({
          id: testKey.kid,
          key: testKey,
          expiresAt: new Date(NaN),
        }),
      ).rejects.toThrow('Invalid time value');
    });
  });
});
