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
    '20230428155633_sessions.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20230428155633_sessions.js');
      await migrateUpOnce(knex);

      // Ensure that large cookies are supported
      const data = `{"cookie":"${'a'.repeat(100_000)}"}`;
      await knex
        .insert({ sid: 'abc', expired: knex.fn.now(), sess: data })
        .into('sessions');
      await knex
        .insert({ sid: 'def', expired: knex.fn.now(), sess: data })
        .into('sessions');

      await expect(knex('sessions').orderBy('sid', 'asc')).resolves.toEqual([
        { sid: 'abc', expired: expect.anything(), sess: data },
        { sid: 'def', expired: expect.anything(), sess: data },
      ]);

      await migrateDownOnce(knex);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20240510120825_user_info.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20240510120825_user_info.js');
      await migrateUpOnce(knex);

      const user_info = JSON.stringify({
        claims: {
          ent: ['group:default/group1', 'group:default/group2'],
        },
      });

      await knex
        .insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          exp: knex.fn.now(),
        })
        .into('user_info');

      await expect(knex('user_info')).resolves.toEqual([
        {
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          exp: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      await knex.destroy();
    },
  );
});
