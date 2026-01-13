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
import { MigrationStorage } from './MigrationStorage';
import { mockServices } from '@backstage/backend-test-utils';

describe('MigrationStorage', () => {
  let knex: Knex;
  let storage: MigrationStorage;
  const mockLogger = mockServices.logger.mock();

  beforeEach(async () => {
    knex = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    storage = new MigrationStorage({
      knex,
      pluginId: 'test-plugin',
      logger: mockLogger,
    });
  });

  afterEach(async () => {
    await knex.destroy();
  });

  describe('ensureStorageTable', () => {
    it('creates the storage table if it does not exist', async () => {
      await storage.ensureStorageTable();

      const hasTable = await knex.schema.hasTable(
        'backstage_migration_sources_test-plugin',
      );
      expect(hasTable).toBe(true);
    });

    it('is idempotent - can be called multiple times', async () => {
      await storage.ensureStorageTable();
      await storage.ensureStorageTable();

      const hasTable = await knex.schema.hasTable(
        'backstage_migration_sources_test-plugin',
      );
      expect(hasTable).toBe(true);
    });
  });

  describe('storeMigration', () => {
    beforeEach(async () => {
      await storage.ensureStorageTable();
    });

    it('stores a migration source', async () => {
      await storage.storeMigration(
        'knex_migrations',
        '20250101_init',
        'exports.up = async () => {}; exports.down = async () => {};',
      );

      const stored = await knex('backstage_migration_sources_test-plugin')
        .where({
          table_name: 'knex_migrations',
          migration_name: '20250101_init',
        })
        .first();

      expect(stored).toBeDefined();
      expect(stored.source_content).toBe(
        'exports.up = async () => {}; exports.down = async () => {};',
      );
      expect(stored.checksum).toHaveLength(64); // SHA256 hex
    });

    it('does not duplicate if called twice with same content', async () => {
      const content = 'exports.up = async () => {};';
      await storage.storeMigration('knex_migrations', '20250101_init', content);
      await storage.storeMigration('knex_migrations', '20250101_init', content);

      const count = await knex('backstage_migration_sources_test-plugin')
        .where({ migration_name: '20250101_init' })
        .count('* as cnt')
        .first();

      expect(count?.cnt).toBe(1);
    });

    it('warns if migration content changed but does not throw', async () => {
      await storage.storeMigration(
        'knex_migrations',
        '20250101_init',
        'original',
      );

      // Should not throw, but should log a warning
      await storage.storeMigration(
        'knex_migrations',
        '20250101_init',
        'modified',
      );

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('has changed'),
      );
    });
  });

  describe('getMigration', () => {
    beforeEach(async () => {
      await storage.ensureStorageTable();
    });

    it('retrieves a stored migration', async () => {
      const content =
        'exports.up = async () => {}; exports.down = async () => {};';
      await storage.storeMigration('knex_migrations', '20250101_init', content);

      const result = await storage.getMigration(
        'knex_migrations',
        '20250101_init',
      );

      expect(result).toBeDefined();
      expect(result?.source_content).toBe(content);
    });

    it('returns undefined for non-existent migration', async () => {
      const result = await storage.getMigration(
        'knex_migrations',
        'nonexistent',
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getAllMigrations', () => {
    beforeEach(async () => {
      await storage.ensureStorageTable();
    });

    it('retrieves all stored migrations for a table', async () => {
      await storage.storeMigration(
        'knex_migrations',
        '20250101_a',
        'content a',
      );
      await storage.storeMigration(
        'knex_migrations',
        '20250102_b',
        'content b',
      );
      await storage.storeMigration('other_table', '20250103_c', 'content c');

      const result = await storage.getAllMigrations('knex_migrations');

      expect(result).toHaveLength(2);
      expect(result.map(m => m.migration_name)).toEqual([
        '20250101_a',
        '20250102_b',
      ]);
    });
  });
});
