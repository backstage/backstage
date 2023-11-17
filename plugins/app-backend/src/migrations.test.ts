/*
 * Copyright 2023 The Backstage Authors
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

import { Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import fs from 'fs';

const migrationsDir = `${__dirname}/../migrations`;
const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUpOnce(knex: Knex): Promise<void> {
  await knex.migrate.up({ directory: migrationsDir });
}

async function migrateDownOnce(knex: Knex): Promise<void> {
  await knex.migrate.down({ directory: migrationsDir });
}

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await migrateUpOnce(knex);
  }
}

jest.setTimeout(60_000);

describe('migrations', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'MYSQL_8', 'SQLITE_3'],
  });

  it.each(databases.eachSupportedId())(
    '20211229105307_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20211229105307_init.js');
      await migrateUpOnce(knex);

      const content = Buffer.from('010101010101010101');
      const one = databaseId.match(/POSTGRES/) ? '1' : 1;

      await knex('static_assets_cache').insert({
        path: '/foo/bar',
        content: content,
      });

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          id: one,
          path: '/foo/bar',
          content: content,
          last_modified_at: expect.anything(),
        },
      ]);

      // Assert uniqueness constraint applies
      await expect(
        knex('static_assets_cache').insert({
          path: '/foo/bar',
          content: 'whatever',
        }),
      ).rejects.toBeDefined();

      await migrateDownOnce(knex);

      // Assert table is deleted
      await expect(knex('static_assets_cache')).rejects.toEqual(
        expect.anything(),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20231009201211_add_incrementing_pk, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      const content = Buffer.from('010101010101010101');
      const one = databaseId.match(/POSTGRES/) ? '1' : 1;
      const two = databaseId.match(/POSTGRES/) ? '2' : 2;

      await migrateUntilBefore(knex, '20231009201211_add_incrementing_pk.js');

      await knex('static_assets_cache').insert({
        path: '/foo/bar',
        content: content,
      });

      await migrateUpOnce(knex);

      await knex('static_assets_cache').insert({
        path: '/another/path',
        content: content,
      });

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          id: one,
          path: '/foo/bar',
          content: content,
          last_modified_at: expect.anything(),
        },
        {
          id: two,
          path: '/another/path',
          content: content,
          last_modified_at: expect.anything(),
        },
      ]);

      // Assert uniqueness constraint applies
      await expect(
        knex('static_assets_cache').insert({
          path: '/foo/bar',
          content: 'whatever',
        }),
      ).rejects.toBeDefined();

      await migrateDownOnce(knex);

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          path: '/foo/bar',
          content: content,
          last_modified_at: expect.anything(),
        },
        {
          path: '/another/path',
          content: content,
          last_modified_at: expect.anything(),
        },
      ]);

      await knex.destroy();
    },
  );
});
