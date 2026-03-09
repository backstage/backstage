/*
 * Copyright 2026 The Backstage Authors
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
import fs from 'node:fs';
import { migrationsDir } from './migrateQueueItems';

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

describe('queue migrations', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20260309120000_create_queue_items.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20260309120000_create_queue_items.js');
      await migrateUpOnce(knex);

      await knex('backstage_queue_items').insert({
        id: 'test',
        queue_name: 'queue',
        payload: JSON.stringify({ hello: 'world' }),
        attempt: 0,
        priority: 20,
        available_at: knex.fn.now(),
        lease_expires_at: null,
        lease_token: null,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });

      await expect(knex('backstage_queue_items')).resolves.toEqual([
        expect.objectContaining({
          id: 'test',
          queue_name: 'queue',
          attempt: 0,
          priority: 20,
          lease_expires_at: null,
          lease_token: null,
        }),
      ]);

      await migrateDownOnce(knex);

      await expect(knex('backstage_queue_items')).rejects.toEqual(
        expect.anything(),
      );

      await knex.destroy();
    },
  );
});
