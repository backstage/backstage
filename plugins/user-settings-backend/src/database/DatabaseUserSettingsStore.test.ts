/*
 * Copyright 2022 The Backstage Authors
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
import { Knex } from 'knex';
import {
  DatabaseUserSettingsStore,
  RawDbUserSettingsRow,
} from './DatabaseUserSettingsStore';

jest.setTimeout(60_000);

const databases = TestDatabases.create({
  ids: ['POSTGRES_14', 'SQLITE_3'],
});

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  const databaseManager = mockServices.database({ knex });

  return {
    knex,
    storage: await DatabaseUserSettingsStore.create({
      database: databaseManager,
    }),
  };
}

describe.each(databases.eachSupportedId())(
  'DatabaseUserSettingsStore (%s)',
  databaseId => {
    let storage: DatabaseUserSettingsStore;
    let knex: Knex;

    beforeAll(async () => {
      ({ storage, knex } = await createStore(databaseId));
    });

    afterEach(async () => {
      jest.resetAllMocks();

      await knex('user_settings').del();
    });

    const insert = (data: RawDbUserSettingsRow[]) =>
      knex<RawDbUserSettingsRow>('user_settings').insert(data);
    const query = () =>
      knex<RawDbUserSettingsRow>('user_settings')
        .orderBy('user_entity_ref')
        .select();

    describe('get', () => {
      it('should throw an error', async () => {
        await expect(() =>
          storage.get({
            userEntityRef: 'user-1',
            bucket: 'bucket-c',
            key: 'key-c',
          }),
        ).rejects.toThrow(`Unable to find 'key-c' in bucket 'bucket-c'`);
      });

      it('should return the setting', async () => {
        await insert([
          {
            user_entity_ref: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: JSON.stringify('value-a'),
          },
          {
            user_entity_ref: 'user-2',
            bucket: 'bucket-c',
            key: 'key-c',
            value: JSON.stringify('value-c'),
          },
        ]);

        await expect(
          storage.get({
            userEntityRef: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
          }),
        ).resolves.toEqual({
          bucket: 'bucket-a',
          key: 'key-a',
          value: 'value-a',
        });
      });
    });

    describe('multiget', () => {
      it('should return empty', async () => {
        await expect(
          storage.multiget({
            userEntityRef: 'user-1',
            items: [
              {
                bucket: 'bucket-c',
                key: 'key-c',
              },
            ],
          }),
        ).resolves.toEqual([null]);
      });

      it('should handle large inputs and return existing values', async () => {
        // Create 30 buckets with 300 keys in each.
        const BUCKETS = 30;
        const KEYS_PER_BUCKET = 300;

        const buckets = Array.from(Array(BUCKETS)).map(
          (_, i) => `mget-bucket-${i}`,
        );

        const items = buckets.flatMap(bucket => {
          const keys = Array.from(Array(KEYS_PER_BUCKET)).map(
            (_, i) => `mget-key-${i}`,
          );
          return keys.map(key => ({ bucket, key }));
        });

        const chunkify = <T>(keys: Array<T>, size: number): T[][] => {
          const chunks: T[][] = [];
          for (let i = 0; i < keys.length; i += size) {
            chunks.push(keys.slice(i, i + size));
          }
          return chunks;
        };

        const valueOfKey = (bucket: string, key: string) => ({
          theValue: `Value of ${bucket} / ${key}`,
        });

        const chunkedItems = chunkify(items, 100);
        for (const chunk of chunkedItems) {
          await insert(
            chunk.map(({ bucket, key }) => ({
              user_entity_ref: 'user-1',
              bucket,
              key,
              value: JSON.stringify(valueOfKey(bucket, key)),
            })),
          );
        }

        const result = await storage.multiget({
          userEntityRef: 'user-1',
          // Include a missing key which shouldn't exist in the result
          items: [...items, { bucket: 'missing', key: 'missing' }],
        });
        expect(result).toEqual([
          ...items.map(({ bucket, key }) => ({
            value: valueOfKey(bucket, key),
          })),
          null, // The missing key
        ]);

        const rows = await knex<RawDbUserSettingsRow>('user_settings')
          .where('user_entity_ref', 'user-1')
          .count<{ count: string }[]>('* as count');
        const savedRows = Number(rows[0].count);
        expect(savedRows).toEqual(BUCKETS * KEYS_PER_BUCKET);
      });
    });

    describe('set', () => {
      it('should insert a new setting', async () => {
        await storage.set({
          userEntityRef: 'user-1',
          bucket: 'bucket-a',
          key: 'key-a',
          value: 'value-a',
        });

        await expect(query()).resolves.toEqual([
          {
            user_entity_ref: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: JSON.stringify('value-a'),
          },
        ]);
      });

      it('should overwrite an existing setting', async () => {
        await storage.set({
          userEntityRef: 'user-1',
          bucket: 'bucket-a',
          key: 'key-a',
          value: 'value-a',
        });

        await storage.set({
          userEntityRef: 'user-1',
          bucket: 'bucket-a',
          key: 'key-a',
          value: 'value-b',
        });

        await expect(query()).resolves.toEqual([
          {
            user_entity_ref: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: JSON.stringify('value-b'),
          },
        ]);
      });
    });

    describe('delete', () => {
      it('should not throw an error if the entry does not exist', async () => {
        await expect(
          storage.delete({
            userEntityRef: 'user-1',
            bucket: 'bucket-c',
            key: 'key-c',
          }),
        ).resolves.toBeUndefined();
      });

      it('should return the setting', async () => {
        await insert([
          {
            user_entity_ref: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: JSON.stringify('value-a'),
          },
          {
            user_entity_ref: 'user-2',
            bucket: 'bucket-c',
            key: 'key-c',
            value: JSON.stringify('value-c'),
          },
        ]);

        await storage.delete({
          userEntityRef: 'user-1',
          bucket: 'bucket-a',
          key: 'key-a',
        });
        await expect(query()).resolves.toEqual([
          {
            user_entity_ref: 'user-2',
            bucket: 'bucket-c',
            key: 'key-c',
            value: JSON.stringify('value-c'),
          },
        ]);
      });
    });
  },
);
