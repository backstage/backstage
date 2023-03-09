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
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  it.each(databases.eachSupportedId())(
    '20210928160613_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20210928160613_init.js');
      await migrateUpOnce(knex);

      await knex('backstage_backend_tasks__tasks').insert({
        id: 'test',
        settings_json: '{}',
        next_run_start_at: knex.fn.now(),
      });

      await expect(knex('backstage_backend_tasks__tasks')).resolves.toEqual([
        {
          id: 'test',
          settings_json: '{}',
          next_run_start_at: expect.anything(),
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        },
      ]);

      await migrateDownOnce(knex);

      // This looks odd - you might expect a .toThrow at the end but that
      // actually is flaky for some reason specifically on sqlite when
      // performing multiple runs in sequence
      await expect(knex('backstage_backend_tasks__tasks')).rejects.toEqual(
        expect.anything(),
      );

      await knex.destroy();
    },
    60_000,
  );
});
