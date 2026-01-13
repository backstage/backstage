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
import knexFactory from 'knex';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { wrapKnexMigrations } from './wrapKnexMigrations';
import { mockServices } from '@backstage/backend-test-utils';

describe('Migration Storage Integration', () => {
  let knex: Knex;
  let tempDir: string;
  const mockLogger = mockServices.logger.mock();

  beforeEach(async () => {
    knex = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'migration-integration-'),
    );
  });

  afterEach(async () => {
    await knex.destroy();
    await fs.remove(tempDir);
  });

  it('handles full deployment lifecycle: deploy v1, deploy v2, rollback to v1', async () => {
    const wrapped = wrapKnexMigrations({
      knex,
      pluginId: 'catalog',
      logger: mockLogger,
    });

    // --- Deploy v1: one migration ---
    await fs.writeFile(
      path.join(tempDir, '20250101_create_entities.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('entities', t => {
            t.string('id').primary();
            t.string('kind');
          });
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('entities');
        };
      `,
    );

    await wrapped.migrate.latest({ directory: tempDir });

    expect(await knex.schema.hasTable('entities')).toBe(true);
    const v1Migrations = await knex('knex_migrations').select('*');
    expect(v1Migrations).toHaveLength(1);

    // --- Deploy v2: add second migration ---
    await fs.writeFile(
      path.join(tempDir, '20250102_add_namespace.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.alterTable('entities', t => {
            t.string('namespace');
          });
        };
        exports.down = async function(knex) {
          await knex.schema.alterTable('entities', t => {
            t.dropColumn('namespace');
          });
        };
      `,
    );

    await wrapped.migrate.latest({ directory: tempDir });

    const v2Migrations = await knex('knex_migrations').select('*');
    expect(v2Migrations).toHaveLength(2);

    // Verify namespace column exists
    const columns = await knex('entities').columnInfo();
    expect(columns).toHaveProperty('namespace');

    // --- Rollback to v1: remove second migration file ---
    await fs.remove(path.join(tempDir, '20250102_add_namespace.js'));

    await wrapped.migrate.latest({ directory: tempDir });

    // Verify rollback happened
    const postRollbackMigrations = await knex('knex_migrations').select('*');
    expect(postRollbackMigrations).toHaveLength(1);
    expect(postRollbackMigrations[0].name).toBe('20250101_create_entities');

    // Verify namespace column was dropped
    const postRollbackColumns = await knex('entities').columnInfo();
    expect(postRollbackColumns).not.toHaveProperty('namespace');

    // --- Re-deploy v2: add migration file back ---
    await fs.writeFile(
      path.join(tempDir, '20250102_add_namespace.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.alterTable('entities', t => {
            t.string('namespace');
          });
        };
        exports.down = async function(knex) {
          await knex.schema.alterTable('entities', t => {
            t.dropColumn('namespace');
          });
        };
      `,
    );

    await wrapped.migrate.latest({ directory: tempDir });

    const finalMigrations = await knex('knex_migrations').select('*');
    expect(finalMigrations).toHaveLength(2);

    const finalColumns = await knex('entities').columnInfo();
    expect(finalColumns).toHaveProperty('namespace');
  });

  it('handles custom tableName for migrations', async () => {
    const wrapped = wrapKnexMigrations({
      knex,
      pluginId: 'scheduler',
      logger: mockLogger,
    });

    await fs.writeFile(
      path.join(tempDir, '20250101_create_tasks.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('tasks', t => {
            t.string('id').primary();
          });
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('tasks');
        };
      `,
    );

    await wrapped.migrate.latest({
      directory: tempDir,
      tableName: 'backstage_backend_tasks_knex_migrations',
    });

    expect(await knex.schema.hasTable('tasks')).toBe(true);

    // Verify custom table name was used
    const migrations = await knex(
      'backstage_backend_tasks_knex_migrations',
    ).select('*');
    expect(migrations).toHaveLength(1);

    // Verify storage table has correct table_name reference
    const stored = await knex('backstage_migration_sources_scheduler').select(
      '*',
    );
    expect(stored[0].table_name).toBe(
      'backstage_backend_tasks_knex_migrations',
    );
  });
});
