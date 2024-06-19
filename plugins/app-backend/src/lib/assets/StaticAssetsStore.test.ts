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

import { Knex as KnexType } from 'knex';
import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { StaticAssetsStore } from './StaticAssetsStore';

const logger = mockServices.logger.mock();

function createDatabaseManager(
  client: KnexType,
  skipMigrations: boolean = false,
) {
  return {
    getClient: async () => client,
    migrations: {
      skip: skipMigrations,
    },
  };
}

jest.setTimeout(60_000);

describe('StaticAssetsStore', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'should store and retrieve assets, %p',
    async databaseId => {
      const client = await databases.init(databaseId);
      const database = createDatabaseManager(client);
      const store = await StaticAssetsStore.create({
        logger,
        database,
      });

      await store.storeAssets([
        {
          path: 'foo.txt',
          content: async () => Buffer.from('foo'),
        },
        {
          path: 'dir/bar.txt',
          content: async () => Buffer.from('bar'),
        },
      ]);

      const now = new Date().getTime();

      const foo = await store.getAsset('foo.txt');
      expect(foo!.path).toBe('foo.txt');
      expect(foo!.lastModifiedAt.getTime()).toBeGreaterThan(now - 5000);
      expect(foo!.lastModifiedAt.getTime()).toBeLessThan(now + 5000);
      expect(foo!.content).toEqual(Buffer.from('foo'));

      const bar = await store.getAsset('dir/bar.txt');
      expect(bar!.path).toBe('dir/bar.txt');
      expect(
        Math.abs(bar!.lastModifiedAt.getTime() - foo!.lastModifiedAt.getTime()),
      ).toBeLessThan(1001); // 1s resolution on the timestamps
      expect(bar!.content).toEqual(Buffer.from('bar'));

      await expect(
        store.getAsset('does-not-exist.txt'),
      ).resolves.toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should update assets timestamps, but not contents, %p',
    async databaseId => {
      const client = await databases.init(databaseId);
      const database = createDatabaseManager(client);
      const store = await StaticAssetsStore.create({
        logger,
        database,
      });

      await store.storeAssets([
        {
          path: 'foo',
          content: async () => Buffer.from('foo'),
        },
        {
          path: 'bar',
          content: async () => Buffer.from('bar'),
        },
      ]);

      const oldFoo = await store.getAsset('foo');
      expect(oldFoo?.lastModifiedAt).toBeDefined();

      const oldBar = await store.getAsset('bar');
      expect(oldBar?.lastModifiedAt).toBeDefined();

      // SQLite dates end up with second precision, so make sure we wait at least 1s
      await new Promise(resolve => setTimeout(resolve, 1500));

      await store.storeAssets([
        {
          path: 'foo',
          content: async () => Buffer.from('newFoo'),
        },
      ]);

      const newFoo = await store.getAsset('foo');
      expect(oldFoo!.lastModifiedAt).not.toEqual(newFoo!.lastModifiedAt);
      expect(oldFoo!.lastModifiedAt.getTime()).toBeLessThan(
        newFoo!.lastModifiedAt.getTime(),
      );

      // The "static" in "StaticAssetsStore" means that assets aren't allowed to change
      expect(newFoo!.content).toEqual(Buffer.from('foo'));

      const sameBar = await store.getAsset('bar');
      expect(oldBar!.lastModifiedAt).toEqual(sameBar!.lastModifiedAt);
    },
  );

  it.each(databases.eachSupportedId())(
    'should trim old assets, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const database = createDatabaseManager(knex);
      const store = await StaticAssetsStore.create({
        logger,
        database,
      });

      await store.storeAssets([
        {
          path: 'new',
          content: async () => Buffer.alloc(0),
        },
        {
          path: 'old',
          content: async () => Buffer.alloc(0),
        },
      ]);
      // interval check for postgresql
      let hourPast = `now() + interval '-3600 seconds'`;
      if (knex.client.config.client.includes('mysql')) {
        hourPast = `date_sub(now(), interval 3600 second)`;
      } else if (knex.client.config.client.includes('sqlite3')) {
        hourPast = `datetime('now', '-3600 seconds')`;
      }
      // Rewrite modified time of "old" to be 1h in the past
      const updated = await knex('static_assets_cache')
        .where({ path: 'old' })
        .update({
          last_modified_at: knex.raw(hourPast),
        });
      expect(updated).toBe(1);

      await expect(store.getAsset('new')).resolves.toBeDefined();
      await expect(store.getAsset('old')).resolves.toBeDefined();

      await store.trimAssets({ maxAgeSeconds: 1800 });

      await expect(store.getAsset('new')).resolves.toBeDefined();
      await expect(store.getAsset('old')).resolves.toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should isolate assets in namespace, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const database = createDatabaseManager(knex);
      const store = await StaticAssetsStore.create({
        logger,
        database,
      });
      const otherStore = store.withNamespace('other');

      await store.storeAssets([
        {
          path: 'foo',
          content: async () => Buffer.alloc(0),
        },
      ]);
      await otherStore.storeAssets([
        {
          path: 'bar',
          content: async () => Buffer.alloc(0),
        },
      ]);

      await expect(store.getAsset('foo')).resolves.toBeDefined();
      await expect(store.getAsset('bar')).resolves.not.toBeDefined();
      await expect(otherStore.getAsset('foo')).resolves.not.toBeDefined();
      await expect(otherStore.getAsset('bar')).resolves.toBeDefined();

      await store.trimAssets({ maxAgeSeconds: 0 });

      await expect(store.getAsset('foo')).resolves.not.toBeDefined();
      await expect(otherStore.getAsset('bar')).resolves.toBeDefined();

      await otherStore.trimAssets({ maxAgeSeconds: 0 });

      await expect(otherStore.getAsset('bar')).resolves.not.toBeDefined();
    },
  );
});
