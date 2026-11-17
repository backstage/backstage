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

  it('fails actionably when skipping with an empty ledger', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();
    const logger = mockServices.logger.mock();

    // An empty ledger is not a complete schema: run once against a directory
    // with no migrations, then require a migration the ledger does not know.
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-node-empty-'));
    await runAiMigrations({
      database: { getClient: async () => db },
      logger,
      directory: emptyDir,
    });
    expect(await db.schema.hasTable(AI_MIGRATIONS_TABLE)).toBe(true);

    await expect(
      runAiMigrations({
        database: { getClient: async () => db, migrations: { skip: true } },
        logger,
        directory,
      }),
    ).rejects.toThrow(/not up to date.*1001_create_ai_things.js/s);
  });

  it('fails actionably when skipping with an outdated ledger', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();
    const logger = mockServices.logger.mock();

    await runAiMigrations({
      database: { getClient: async () => db },
      logger,
      directory,
    });
    fs.writeFileSync(
      path.join(directory, '1002_create_ai_other.js'),
      'exports.up = async knex => { await knex.schema.createTable("ai_other", t => { t.increments("id"); }); };\n' +
        'exports.down = async knex => { await knex.schema.dropTableIfExists("ai_other"); };\n',
    );

    await expect(
      runAiMigrations({
        database: { getClient: async () => db, migrations: { skip: true } },
        logger,
        directory,
      }),
    ).rejects.toThrow(/not up to date.*1002_create_ai_other.js/s);
  });

  it('discovers the whole shared migrations directory by name range', async () => {
    const db = await databases.init('SQLITE_3');
    const logger = mockServices.logger.mock();

    // No directory override: this runs against the package's real shared
    // migrations directory, so the reserved name ranges (T2's 1000s,
    // T-cred's 2000s) must all be discovered and applied.
    await runAiMigrations({
      database: { getClient: async () => db },
      logger,
    });

    const ledger = await db(AI_MIGRATIONS_TABLE).select('name');
    expect(ledger.map(row => row.name).sort()).toEqual([
      '1000_storage.js',
      '2000_credentials.js',
      '3000_ownership_recovery.js',
      '4000_journal.js',
    ]);
    expect(await db.schema.hasTable('ai_namespace_leases')).toBe(true);
    expect(await db.schema.hasTable('ai_credential_user_secrets')).toBe(true);
    expect(await db.schema.hasTable('ai_recovery_sessions')).toBe(true);
    expect(await db.schema.hasTable('ai_journal_events')).toBe(true);

    // Up to date: skipping now succeeds without touching the schema.
    await runAiMigrations({
      database: { getClient: async () => db, migrations: { skip: true } },
      logger,
    });
  });

  it('honors skip once the schema exists', async () => {
    const db = await databases.init('SQLITE_3');
    const directory = makeMigrationsDir();

    await runAiMigrations({
      database: { getClient: async () => db },
      logger: mockServices.logger.mock(),
      directory,
    });

    // Up to date: skipping succeeds without touching the schema.
    await runAiMigrations({
      database: { getClient: async () => db, migrations: { skip: true } },
      logger: mockServices.logger.mock(),
      directory,
    });
    expect(await db.schema.hasTable('ai_things')).toBe(true);
  });
});
