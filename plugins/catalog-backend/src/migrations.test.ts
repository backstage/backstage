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

describe('migrations', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  it.each(databases.eachSupportedId())(
    '20221109192547_search_add_original_value_column.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20221109192547_search_add_original_value_column.js',
      );

      await knex
        .insert({
          entity_id: 'i',
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          errors: '[]',
          next_update_at: new Date(),
          last_discovery_at: new Date(),
        })
        .into('refresh_state');
      await knex
        .insert({ entity_id: 'i', key: 'k1', value: 'v1' })
        .into('search');
      await knex
        .insert({ entity_id: 'i', key: 'k2', value: null })
        .into('search');

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null },
        ]),
      );

      await migrateUpOnce(knex);

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1', original_value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null, original_value: null },
        ]),
      );

      await migrateDownOnce(knex);

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null },
        ]),
      );

      await knex.destroy();
    },
    60_000,
  );
});
