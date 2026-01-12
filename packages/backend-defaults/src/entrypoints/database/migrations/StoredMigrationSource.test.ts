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
import knexFactory from 'knex';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { StoredMigrationSource } from './StoredMigrationSource';
import { MigrationStorage } from './MigrationStorage';

describe('StoredMigrationSource', () => {
  let knex: Knex;
  let storage: MigrationStorage;
  let tempDir: string;

  beforeEach(async () => {
    knex = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    storage = new MigrationStorage(knex, 'test-plugin');
    await storage.ensureStorageTable();

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'migration-test-'));
  });

  afterEach(async () => {
    await knex.destroy();
    await fs.remove(tempDir);
  });

  describe('getMigrations', () => {
    it('returns migrations from filesystem', async () => {
      await fs.writeFile(
        path.join(tempDir, '20250101_init.js'),
        'exports.up = async () => {}; exports.down = async () => {};',
      );
      await fs.writeFile(
        path.join(tempDir, '20250102_add_column.js'),
        'exports.up = async () => {}; exports.down = async () => {};',
      );

      const source = new StoredMigrationSource(
        storage,
        'knex_migrations',
        tempDir,
      );
      const migrations = await source.getMigrations();

      expect(migrations).toEqual(['20250101_init', '20250102_add_column']);
    });

    it('includes stored migrations not in filesystem', async () => {
      await fs.writeFile(path.join(tempDir, '20250101_init.js'), 'content');
      await storage.storeMigration(
        'knex_migrations',
        '20250102_orphan',
        'orphan content',
      );

      const source = new StoredMigrationSource(
        storage,
        'knex_migrations',
        tempDir,
      );
      const migrations = await source.getMigrations();

      expect(migrations).toEqual(['20250101_init', '20250102_orphan']);
    });
  });

  describe('getMigration', () => {
    it('returns migration from filesystem', async () => {
      const content = `
        exports.up = async function(knex) { await knex.schema.createTable('test', t => t.increments('id')); };
        exports.down = async function(knex) { await knex.schema.dropTable('test'); };
      `;
      await fs.writeFile(path.join(tempDir, '20250101_init.js'), content);

      const source = new StoredMigrationSource(
        storage,
        'knex_migrations',
        tempDir,
      );
      const migration = await source.getMigration('20250101_init');

      expect(migration.up).toBeDefined();
      expect(migration.down).toBeDefined();
      expect(typeof migration.up).toBe('function');
    });

    it('returns migration from storage when not in filesystem', async () => {
      const content = `
        exports.up = async function(knex) { await knex.schema.createTable('orphan', t => t.increments('id')); };
        exports.down = async function(knex) { await knex.schema.dropTable('orphan'); };
      `;
      await storage.storeMigration(
        'knex_migrations',
        '20250101_orphan',
        content,
      );

      const source = new StoredMigrationSource(
        storage,
        'knex_migrations',
        tempDir,
      );
      const migration = await source.getMigration('20250101_orphan');

      expect(migration.up).toBeDefined();
      expect(migration.down).toBeDefined();
    });

    it('throws if migration not found anywhere', async () => {
      const source = new StoredMigrationSource(
        storage,
        'knex_migrations',
        tempDir,
      );

      await expect(source.getMigration('nonexistent')).rejects.toThrow(
        /not found/,
      );
    });
  });
});
