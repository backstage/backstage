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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import fs from 'fs-extra';
import path from 'path';
import { MigrationStorage } from './MigrationStorage';
import { StoredMigrationSource } from './StoredMigrationSource';

export function wrapKnexMigrations(options: {
  knex: Knex;
  pluginId: string;
  logger: LoggerService;
}): Knex {
  const { knex, pluginId, logger } = options;
  const storage = new MigrationStorage({ knex, pluginId, logger });
  const originalMigrate = knex.migrate;

  const wrappedMigrate = {
    ...originalMigrate,

    async latest(config?: Knex.MigratorConfig): Promise<[number, string[]]> {
      const tableName = config?.tableName ?? 'knex_migrations';
      const directory = config?.directory as string;

      if (!directory) {
        throw new Error('Migration directory is required');
      }

      await storage.ensureStorageTable();
      await syncMigrationsToStorage({ storage, tableName, directory });

      const migrationSource = new StoredMigrationSource({
        knex,
        storage,
        tableName,
        directory,
      });

      const remoteLatest = await getLatestAppliedMigration({ knex, tableName });
      const localLatest = await getLatestFilesystemMigration(directory);

      // Always include tableName to override any cached value in knex's Migrator
      const { directory: _, ...configWithoutDirectory } = config ?? {};
      const configWithSource = {
        ...configWithoutDirectory,
        tableName,
        migrationSource,
      };

      // Rollback if remote is ahead of local
      if (remoteLatest && localLatest && remoteLatest > localLatest) {
        let current = await getLatestAppliedMigration({ knex, tableName });
        while (current && current > localLatest) {
          await originalMigrate.down.call(originalMigrate, configWithSource);
          current = await getLatestAppliedMigration({ knex, tableName });
        }
        return [0, []];
      }

      return originalMigrate.latest.call(originalMigrate, configWithSource);
    },
  };

  return new Proxy(knex, {
    get(target, prop) {
      if (prop === 'migrate') {
        return wrappedMigrate;
      }
      return Reflect.get(target, prop);
    },
  }) as Knex;
}

async function syncMigrationsToStorage(options: {
  storage: MigrationStorage;
  tableName: string;
  directory: string;
}): Promise<void> {
  const { storage, tableName, directory } = options;

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

async function getLatestAppliedMigration(options: {
  knex: Knex;
  tableName: string;
}): Promise<string | undefined> {
  const { knex, tableName } = options;

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
