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

import { TestDatabases } from '@backstage/backend-test-utils';
import { mockServices } from '@backstage/backend-test-utils';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runAiMigrations, AI_MIGRATIONS_TABLE } from './migrations';

const databases = TestDatabases.create({ ids: ['SQLITE_3'] });

function makeMigrationsDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-node-migrations-'));
  fs.writeFileSync(
    path.join(dir, '1001_create_ai_things.js'),
    [
      'exports.up = async knex => {',
      '  await knex.schema.createTable("ai_things", table => {',
      '    table.increments("id");',
      '    table.string("name");',
      '  });',
      '};',
      'exports.down = async knex => {',
      '  await knex.schema.dropTableIfExists("ai_things");',
      '};',
    ].join('\n'),
  );
  return dir;
}

describe('runAiMigrations', () => {
  it('runs the whole migrations directory into the named ledger', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();
    const logger = mockServices.logger.mock();

    await runAiMigrations({
      database: { getClient: async () => db },
      logger,
      directory,
    });

    expect(await db.schema.hasTable(AI_MIGRATIONS_TABLE)).toBe(true);
    expect(await db.schema.hasTable('ai_things')).toBe(true);
    const ledger = await db(AI_MIGRATIONS_TABLE).select('name');
    expect(ledger.map(row => row.name)).toEqual(['1001_create_ai_things.js']);

    // Re-running is a no-op.
    await runAiMigrations({
      database: { getClient: async () => db },
      logger,
      directory,
    });
    expect(await db(AI_MIGRATIONS_TABLE).count('id as count')).toEqual([
      { count: 1 },
    ]);
  });

  it('fails actionably when skipping with a missing schema', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();

    await expect(
      runAiMigrations({
        database: { getClient: async () => db, migrations: { skip: true } },
        logger: mockServices.logger.mock(),
        directory,
      }),
    ).rejects.toThrow(
      /schema has not been created.*'database.migrations.skip'.*not run implicitly/s,
    );
    expect(await db.schema.hasTable(AI_MIGRATIONS_TABLE)).toBe(false);
  });

  it('honors skip once the schema exists', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();

    await runAiMigrations({
      database: { getClient: async () => db },
      logger: mockServices.logger.mock(),
      directory,
    });
    fs.rmSync(path.join(directory, '1001_create_ai_things.js'));

    await runAiMigrations({
      database: { getClient: async () => db, migrations: { skip: true } },
      logger: mockServices.logger.mock(),
      directory,
    });
    expect(await db.schema.hasTable('ai_things')).toBe(true);
  });
});
