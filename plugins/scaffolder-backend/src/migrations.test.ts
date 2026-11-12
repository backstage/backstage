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
import { randomUUID as uuid } from 'node:crypto';

const migrationsDir = `${__dirname}/../migrations`;
const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await knex.migrate.up({ directory: migrationsDir });
  }
}

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())('migrations, %p', databaseId => {
  it('20261112061000_template_ref.js backfills the template ref', async () => {
    const knex = await databases.init(databaseId);
    await migrateUntilBefore(knex, '20261112061000_template_ref.js');

    const withTemplate = uuid();
    const withoutTemplate = uuid();
    const invalidSpec = uuid();
    await knex('tasks').insert([
      {
        id: withTemplate,
        spec: JSON.stringify({
          templateInfo: { entityRef: 'template:default/foo' },
        }),
        status: 'open',
      },
      { id: withoutTemplate, spec: JSON.stringify({}), status: 'open' },
      { id: invalidSpec, spec: 'not json', status: 'open' },
    ]);

    await knex.migrate.up({ directory: migrationsDir });

    const rows = await knex('tasks').select('id', 'template_ref');
    expect(Object.fromEntries(rows.map(r => [r.id, r.template_ref]))).toEqual({
      [withTemplate]: 'template:default/foo',
      [withoutTemplate]: null,
      [invalidSpec]: null,
    });

    await knex.migrate.down({ directory: migrationsDir });
    expect(await knex.schema.hasColumn('tasks', 'template_ref')).toBe(false);

    await knex.destroy();
  });
});
