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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import {
  DatabaseUserSettingsStore,
  RawDbUserSettingsRow,
} from './DatabaseUserSettingsStore';

jest.setTimeout(60_000);

const databases = TestDatabases.create({
  ids: ['POSTGRES_13', 'SQLITE_3'],
});

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  const databaseManager = {
    getClient: async () => knex,
    migrations: {
      skip: false,
    },
  };

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
