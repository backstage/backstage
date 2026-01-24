/*
 * Copyright 2025 The Backstage Authors
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

const migrationsDir = `${__dirname}/../../migrations`;
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
    '20221109192547_search_add_original_value_column.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20250317_addTopic.js');

      await knex
        .insert({
          user: 'user1',
          channel: 'channel1',
          origin: 'origin1',
          enabled: true,
        })
        .into('user_settings');

      await migrateUpOnce(knex);

      let rows = await knex('user_settings');
      let normalized = rows.map(r => ({ ...r, enabled: !!r.enabled }));

      expect(normalized).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: 'user1',
            channel: 'channel1',
            origin: 'origin1',
            enabled: true,
            settings_key_hash:
              '73f97aff883b8b08a7f4e366234ef4f86827702b0016574ac4c1bf313c703d15',
            topic: null,
          }),
        ]),
      );

      await migrateDownOnce(knex);

      rows = await knex('user_settings');
      normalized = rows.map(r => ({ ...r, enabled: !!r.enabled }));

      expect(normalized).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: 'user1',
            channel: 'channel1',
            origin: 'origin1',
            enabled: true,
          }),
        ]),
      );
    },
  );
});
