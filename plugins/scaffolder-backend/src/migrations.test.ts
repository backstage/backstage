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
import crypto from 'crypto';
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
    '20210120143715_init, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20210120143715_init.js');
      await migrateUpOnce(knex);

      const uuid = crypto.randomUUID();
      const now = knex.fn.now();

      await knex('tasks').insert({
        id: uuid,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
      });

      await expect(knex('tasks')).resolves.toEqual([
        {
          id: uuid,
          spec: 'spec',
          status: 'status',
          created_at: expect.anything(),
          last_heartbeat_at: expect.anything(),
        },
      ]);

      const one = databaseId.match(/POSTGRES/) ? '1' : 1;

      await knex('task_events').insert({
        task_id: uuid,
        body: 'body',
        event_type: 'event_type',
      });

      await expect(knex('task_events')).resolves.toEqual([
        {
          id: one,
          task_id: uuid,
          body: 'body',
          event_type: 'event_type',
          created_at: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      // Assert table is deleted
      await expect(knex('tasks')).rejects.toEqual(expect.anything());

      // Assert table is deleted
      await expect(knex('task_events')).rejects.toEqual(expect.anything());

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20210409225200_secrets, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20210409225200_secrets.js');
      await migrateUpOnce(knex);

      const uuid = crypto.randomUUID();
      const uuid2 = crypto.randomUUID();
      const now = knex.fn.now();

      await knex('tasks').insert({
        id: uuid,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
      });

      await knex('tasks').insert({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
        secrets: 'hush',
      });

      await expect(knex('tasks').where('id', uuid).first()).resolves.toEqual({
        id: uuid,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: null,
      });

      await expect(knex('tasks').where('id', uuid2).first()).resolves.toEqual({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: 'hush',
      });

      await migrateDownOnce(knex);

      await expect(knex('tasks').where('id', uuid).first()).resolves.toEqual({
        id: uuid,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
      });

      await expect(knex('tasks').where('id', uuid2).first()).resolves.toEqual({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
      });

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20220129100000_created_by, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20220129100000_created_by.js');
      await migrateUpOnce(knex);

      const uuid = crypto.randomUUID();
      const uuid2 = crypto.randomUUID();
      const now = knex.fn.now();

      await knex('tasks').insert({
        id: uuid,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
      });

      await knex('tasks').insert({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
        created_by: 'Samothes',
      });

      await expect(knex('tasks').where('id', uuid).first()).resolves.toEqual({
        id: uuid,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: null,
        created_by: null,
      });

      await expect(knex('tasks').where('id', uuid2).first()).resolves.toEqual({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: null,
        created_by: 'Samothes',
      });

      await migrateDownOnce(knex);

      await expect(knex('tasks').where('id', uuid).first()).resolves.toEqual({
        id: uuid,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: null,
      });

      await expect(knex('tasks').where('id', uuid2).first()).resolves.toEqual({
        id: uuid2,
        spec: 'spec',
        status: 'status',
        created_at: expect.anything(),
        last_heartbeat_at: expect.anything(),
        secrets: null,
      });

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20231103165900_text, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20231103165900_text.js');
      await migrateUpOnce(knex);

      const uuid = crypto.randomUUID();
      const now = knex.fn.now();

      await knex('tasks').insert({
        id: uuid,
        spec: 'spec',
        status: 'status',
        last_heartbeat_at: now,
      });

      await expect(
        knex('task_events').insert({
          task_id: uuid,
          body: 'a'.repeat(65_535 + 1),
          event_type: 'event_type',
        }),
      ).resolves.toBeDefined();

      await migrateDownOnce(knex);

      /* eslint-disable jest/no-conditional-expect */
      if (knex.client.config.client.includes('mysql')) {
        // Truncate any existing bodies that don't fit
        await expect(
          knex('task_events').first().select('body'),
        ).resolves.toEqual({
          body: 'a'.repeat(65_535),
        });

        await expect(
          knex('task_events').insert({
            task_id: uuid,
            body: 'a'.repeat(65_535 + 1),
            event_type: 'event_type',
          }),
        ).rejects.toBeDefined();
      }
      /* eslint-enable jest/no-conditional-expect */

      await knex.destroy();
    },
  );
});
