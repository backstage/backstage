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
import fs from 'fs-extra';
import path from 'path';
import { MigrationStorage } from './MigrationStorage';
import { StoredMigrationSource } from './StoredMigrationSource';

export function wrapKnexMigrations(knex: Knex, pluginId: string): Knex {
  const storage = new MigrationStorage(knex, pluginId);
  const originalMigrate = knex.migrate;

  const wrappedMigrate = {
    ...originalMigrate,

    async latest(config?: Knex.MigratorConfig): Promise<[number, string[]]> {
      const tableName = config?.tableName ?? 'knex_migrations';
      const directory = config?.directory as string;

      if (!directory) {
        throw new Error('Migration directory is required');
      }

      // 1. Ensure storage table exists
      await storage.ensureStorageTable();

      // 2. Backfill any applied migrations not yet stored
      await backfillStorageFromApplied(knex, storage, tableName, directory);

      // 3. Sync filesystem migrations to storage
      await syncMigrationsToStorage(storage, tableName, directory);

      // 4. Create migration source
      const migrationSource = new StoredMigrationSource(
        storage,
        tableName,
        directory,
      );

      // 5. Get current state
      const remoteLatest = await getLatestAppliedMigration(knex, tableName);
      const localLatest = await getLatestFilesystemMigration(directory);

      // Remove FS-related options that conflict with migrationSource
      const { directory: _, ...configWithoutDirectory } = config ?? {};
      const configWithSource = { ...configWithoutDirectory, migrationSource };

      // 6. Determine direction and execute
      if (remoteLatest && localLatest && remoteLatest > localLatest) {
        // Need to rollback - remote is ahead of local
        let current = await getLatestAppliedMigration(knex, tableName);
        while (current && current > localLatest) {
          await originalMigrate.down.call(originalMigrate, configWithSource);
          current = await getLatestAppliedMigration(knex, tableName);
        }
        return [0, []];
      }

      // Go forward
      return originalMigrate.latest.call(originalMigrate, configWithSource);
    },
  };

  // Use Proxy to intercept migrate property while preserving all knex functionality
  return new Proxy(knex, {
    get(target, prop) {
      if (prop === 'migrate') {
        return wrappedMigrate;
      }
      return Reflect.get(target, prop);
    },
  }) as Knex;
}

async function backfillStorageFromApplied(
  knex: Knex,
  storage: MigrationStorage,
  tableName: string,
  directory: string,
): Promise<void> {
  const hasTable = await knex.schema.hasTable(tableName);
  if (!hasTable) {
    return;
  }

  const applied = await knex(tableName).select('name');

  for (const { name } of applied) {
    const migrationName = name.replace(/\.js$/, '');
    const existing = await storage.getMigration(tableName, migrationName);

    if (!existing) {
      const fsPath = path.join(directory, `${migrationName}.js`);
      if (await fs.pathExists(fsPath)) {
        const content = await fs.readFile(fsPath, 'utf8');
        await storage.storeMigration(tableName, migrationName, content);
      }
      // If file doesn't exist, skip storing it - it's a legacy migration
      // that predates the migration storage feature. Rollback for this
      // migration won't be possible, but forward migrations will work.
    }
  }
}

async function syncMigrationsToStorage(
  storage: MigrationStorage,
  tableName: string,
  directory: string,
): Promise<void> {
  if (!(await fs.pathExists(directory))) {
    return;
  }

  const files = await fs.readdir(directory);
  const migrationFiles = files.filter(f => f.endsWith('.js'));

  for (const file of migrationFiles) {
    const migrationName = path.basename(file, '.js');
    const content = await fs.readFile(path.join(directory, file), 'utf8');
    await storage.storeMigration(tableName, migrationName, content);
  }
}

async function getLatestAppliedMigration(
  knex: Knex,
  tableName: string,
): Promise<string | undefined> {
  const hasTable = await knex.schema.hasTable(tableName);
  if (!hasTable) {
    return undefined;
  }

  const result = await knex(tableName)
    .select('name')
    .orderBy('name', 'desc')
    .first();

  return result?.name?.replace(/\.js$/, '');
}

async function getLatestFilesystemMigration(
  directory: string,
): Promise<string | undefined> {
  if (!(await fs.pathExists(directory))) {
    return undefined;
  }

  const files = await fs.readdir(directory);
  const migrationNames = files
    .filter(f => f.endsWith('.js'))
    .map(f => path.basename(f, '.js'))
    .sort();

  return migrationNames[migrationNames.length - 1];
}
