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

describe('wrapKnexMigrations', () => {
  let knex: Knex;
  let tempDir: string;
  const mockLogger = mockServices.logger.mock();

  beforeEach(async () => {
    knex = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'migration-wrap-test-'));
  });

  afterEach(async () => {
    await knex.destroy();
    await fs.remove(tempDir);
  });

  it('wraps knex instance and runs migrations forward', async () => {
    await fs.writeFile(
      path.join(tempDir, '20250101_create_users.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('users', t => {
            t.increments('id');
            t.string('name');
          });
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('users');
        };
      `,
    );

    const wrapped = wrapKnexMigrations({
      knex,
      pluginId: 'test-plugin',
      logger: mockLogger,
    });
    await wrapped.migrate.latest({ directory: tempDir });

    const hasTable = await knex.schema.hasTable('users');
    expect(hasTable).toBe(true);

    const migrations = await knex('knex_migrations').select('*');
    expect(migrations).toHaveLength(1);
    expect(migrations[0].name).toBe('20250101_create_users');
  });

  it('rolls back when remote has migrations not in filesystem', async () => {
    await fs.writeFile(
      path.join(tempDir, '20250101_create_users.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('users', t => { t.increments('id'); });
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('users');
        };
      `,
    );
    await fs.writeFile(
      path.join(tempDir, '20250102_create_posts.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('posts', t => { t.increments('id'); });
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('posts');
        };
      `,
    );

    const wrapped = wrapKnexMigrations({
      knex,
      pluginId: 'test-plugin',
      logger: mockLogger,
    });

    // Run both migrations
    await wrapped.migrate.latest({ directory: tempDir });
    expect(await knex.schema.hasTable('users')).toBe(true);
    expect(await knex.schema.hasTable('posts')).toBe(true);

    // Simulate code rollback: remove second migration
    await fs.remove(path.join(tempDir, '20250102_create_posts.js'));

    // Run latest again - should rollback
    await wrapped.migrate.latest({ directory: tempDir });

    expect(await knex.schema.hasTable('users')).toBe(true);
    expect(await knex.schema.hasTable('posts')).toBe(false);

    const migrations = await knex('knex_migrations').select('*');
    expect(migrations).toHaveLength(1);
    expect(migrations[0].name).toBe('20250101_create_users');
  });

  it('backfills storage for already-applied migrations on first run', async () => {
    await fs.writeFile(
      path.join(tempDir, '20250101_init.js'),
      `
        exports.up = async function(knex) {
          await knex.schema.createTable('existing', t => t.increments('id'));
        };
        exports.down = async function(knex) {
          await knex.schema.dropTable('existing');
        };
      `,
    );

    // Create knex_migrations table and insert a record manually to simulate
    // a migration that was applied before storage was introduced
    await knex.schema.createTable('knex_migrations', t => {
      t.increments('id');
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    });
    await knex('knex_migrations').insert({
      name: '20250101_init',
      batch: 1,
      migration_time: new Date(),
    });

    // Run the migration manually to create the table
    await knex.schema.createTable('existing', t => t.increments('id'));
    expect(await knex.schema.hasTable('existing')).toBe(true);

    // Now use wrapped version - should backfill storage
    const wrapped = wrapKnexMigrations({
      knex,
      pluginId: 'test-plugin',
      logger: mockLogger,
    });
    await wrapped.migrate.latest({ directory: tempDir });

    const stored = await knex('backstage_migration_sources_test-plugin').select(
      '*',
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].migration_name).toBe('20250101_init');
  });
});
