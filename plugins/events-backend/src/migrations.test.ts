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

const databases = TestDatabases.create({
  ids: ['POSTGRES_9', 'POSTGRES_13', 'POSTGRES_16'],
});

const maybeDescribe =
  databases.eachSupportedId().length > 0 ? describe : describe.skip;

maybeDescribe('migrations', () => {
  it.each(databases.eachSupportedId())(
    '20240523100528_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20240523100528_init.js');
      await migrateUpOnce(knex);

      await knex('event_bus_events').insert({
        topic: 'test',
        created_by: 'abc',
        data_json: JSON.stringify({ message: 'hello' }),
        notified_subscribers: ['tester'],
      });
      await knex('event_bus_subscriptions').insert({
        id: 'tester',
        created_by: 'abc',
        read_until: '5',
        topics: ['test', 'test2'],
      });

      await expect(knex('event_bus_events')).resolves.toEqual([
        {
          id: '1',
          created_by: 'abc',
          topic: 'test',
          data_json: JSON.stringify({ message: 'hello' }),
          created_at: expect.anything(),
          notified_subscribers: ['tester'],
        },
      ]);
      await expect(knex('event_bus_subscriptions')).resolves.toEqual([
        {
          id: 'tester',
          created_by: 'abc',
          created_at: expect.anything(),
          updated_at: expect.anything(),
          read_until: '5',
          topics: ['test', 'test2'],
        },
      ]);

      await migrateDownOnce(knex);

      // This looks odd - you might expect a .toThrow at the end but that
      // actually is flaky for some reason specifically on sqlite when
      // performing multiple runs in sequence
      await expect(knex('event_bus_events')).rejects.toEqual(expect.anything());

      await knex.destroy();
    },
  );
});
