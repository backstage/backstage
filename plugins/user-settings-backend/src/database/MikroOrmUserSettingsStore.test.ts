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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import {
  resolvePackagePath,
  MikroOrmService,
} from '@backstage/backend-plugin-api';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmUserSettingsStore } from './MikroOrmUserSettingsStore';
import { UserSettingEntity } from './entities/UserSettingEntity';
import { Knex } from 'knex';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

jest.setTimeout(60_000);

const databases = TestDatabases.create({
  ids: ['SQLITE_3'],
});

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-user-settings-backend',
  'migrations',
);

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);

  // Run migrations using Knex to ensure schema compatibility
  await knex.migrate.latest({
    directory: migrationsDir,
  });

  const driver = BetterSqliteDriver;
  const dbName = ':memory:';

  const orm = await MikroORM.init({
    driver,
    dbName,
    entities: [UserSettingEntity],
    allowGlobalContext: true,
  });

  if (driver === BetterSqliteDriver) {
    // For SQLite in memory, we have to create schema again because it's a separate DB instance
    await orm.getSchemaGenerator().updateSchema();
  }

  const mikroOrmService: MikroOrmService = {
    init: async () => orm,
  };

  return {
    knex,
    orm,
    storage: await MikroOrmUserSettingsStore.create({
      mikroOrm: mikroOrmService,
    }),
  };
}

describe.each(databases.eachSupportedId())(
  'MikroOrmUserSettingsStore (%s)',
  databaseId => {
    let storage: MikroOrmUserSettingsStore;
    let knex: Knex;
    let orm: MikroORM;

    beforeAll(async () => {
      ({ storage, knex, orm } = await createStore(databaseId));
    });

    afterAll(async () => {
      await orm.close();
      await knex.destroy();
    });

    afterEach(async () => {
      // Clear data
      const em = orm.em.fork();
      await em.nativeDelete(UserSettingEntity, {});
    });

    const query = () =>
      orm.em
        .fork()
        .find(UserSettingEntity, {}, { orderBy: { userEntityRef: 'ASC' } });

    const createExpected = (value: string) => {
      return expect.objectContaining({ value });
    };

    describe('get', () => {
      it('should throw an error if not found', async () => {
        await expect(() =>
          storage.get({
            userEntityRef: 'user-1',
            bucket: 'bucket-c',
            key: 'key-c',
          }),
        ).rejects.toThrow(`Unable to find 'key-c' in bucket 'bucket-c'`);
      });

      it('should return the setting', async () => {
        // Setup data
        const em = orm.em.fork();
        await em.persistAndFlush([
          em.create(UserSettingEntity, {
            userEntityRef: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: 'value-a',
          }),
          em.create(UserSettingEntity, {
            userEntityRef: 'user-2',
            bucket: 'bucket-c',
            key: 'key-c',
            value: 'value-c',
          }),
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

        const result = await query();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(createExpected('value-a'));
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

        const result = await query();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(createExpected('value-b'));
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

      it('should delete the setting', async () => {
        const em = orm.em.fork();
        await em.persistAndFlush([
          em.create(UserSettingEntity, {
            userEntityRef: 'user-1',
            bucket: 'bucket-a',
            key: 'key-a',
            value: 'value-a',
          }),
        ]);

        await storage.delete({
          userEntityRef: 'user-1',
          bucket: 'bucket-a',
          key: 'key-a',
        });

        const result = await query();
        expect(result).toHaveLength(0);
      });
    });
  },
);
