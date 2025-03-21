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
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20211229105307_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20211229105307_init.js');
      await migrateUpOnce(knex);

      await knex('static_assets_cache').insert({
        path: 'main.js',
        content: Buffer.from('some-script'),
        last_modified_at: knex.fn.now(),
      });

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          path: 'main.js',
          content: Buffer.from('some-script'),
          last_modified_at: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      // This looks odd - you might expect a .toThrow at the end but that
      // actually is flaky for some reason specifically on sqlite when
      // performing multiple runs in sequence
      await expect(knex('static_assets_cache')).rejects.toEqual(
        expect.anything(),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20240113144027_assets-namespace.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20240113144027_assets-namespace.js');

      await knex('static_assets_cache').insert({
        path: 'main.js',
        content: Buffer.from('some-script'),
        last_modified_at: knex.fn.now(),
      });

      await migrateUpOnce(knex);

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          path: 'main.js',
          content: Buffer.from('some-script'),
          namespace: 'default',
          last_modified_at: expect.anything(),
        },
      ]);

      await knex('static_assets_cache').insert({
        path: 'main.js',
        content: Buffer.from('other-script'),
        namespace: 'other',
        last_modified_at: knex.fn.now(),
      });

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          path: 'main.js',
          content: Buffer.from('some-script'),
          namespace: 'default',
          last_modified_at: expect.anything(),
        },
        {
          path: 'main.js',
          content: Buffer.from('other-script'),
          namespace: 'other',
          last_modified_at: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      await expect(knex('static_assets_cache')).resolves.toEqual([
        {
          path: 'main.js',
          content: Buffer.from('some-script'),
          last_modified_at: expect.anything(),
        },
      ]);

      await knex.destroy();
    },
  );
});
