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

import {
  resolvePackagePath,
  type DatabaseService,
  type LoggerService,
} from '@backstage/backend-plugin-api';

/**
 * Name of the AI service's own migration ledger table.
 *
 * @remarks
 *
 * The AI service shares the consuming plugin's database but keeps its
 * migrations in a separate named ledger, following the scaffolder
 * workspace-database precedent, so it never collides with the plugin's own
 * `knex_migrations` ledger.
 *
 * @alpha
 */
export const AI_MIGRATIONS_TABLE = 'ai_database_migrations';

/** Options for {@link runAiMigrations}. */
export interface RunAiMigrationsOptions {
  /**
   * The consuming plugin's database service. `database.migrations.skip` is
   * honored: when set, no migration is run implicitly.
   */
  readonly database: DatabaseService;
  readonly logger: LoggerService;
  /**
   * Migration directory to discover. Defaults to this package's shared
   * `migrations` directory, which contains every AI migration by name range;
   * filenames are never enumerated here.
   */
  readonly directory?: string;
}

const defaultMigrationsDir = resolvePackagePath(import.meta.url, 'migrations');

/**
 * Runs the AI service's database migrations.
 *
 * @remarks
 *
 * Discovers the whole shared migrations directory by name and records applied
 * migrations in the {@link AI_MIGRATIONS_TABLE} ledger. Honors
 * `database.migrations.skip`: when skipping is enabled, every required
 * migration must already be recorded in the ledger — a missing ledger or
 * pending migrations fail with an actionable error rather than migrating
 * implicitly.
 *
 * @alpha
 */
export async function runAiMigrations(
  options: RunAiMigrationsOptions,
): Promise<void> {
  const { database, logger } = options;
  const directory = options.directory ?? defaultMigrationsDir;
  const db = await database.getClient();

  if (database.migrations?.skip) {
    if (!(await db.schema.hasTable(AI_MIGRATIONS_TABLE))) {
      throw new Error(
        `The AI service database schema has not been created, but 'database.migrations.skip' is enabled for this plugin, so migrations are not run implicitly. Create the schema by running once without 'database.migrations.skip' (or apply the AI service migrations out-of-band), then keep skipping enabled`,
      );
    }
    // A ledger table alone does not prove the schema: verify that every
    // required migration is recorded as applied, so an empty or outdated
    // ledger under skip fails instead of reporting a missing schema.
    const [, pending] = await db.migrate.list({
      directory,
      tableName: AI_MIGRATIONS_TABLE,
    });
    if (pending.length > 0) {
      const names = pending
        .map((migration: { file: string }) => migration.file)
        .sort()
        .join(', ');
      throw new Error(
        `The AI service database schema is not up to date, but 'database.migrations.skip' is enabled for this plugin, so migrations are not run implicitly. Missing migrations: ${names}. Create the schema by running once without 'database.migrations.skip' (or apply the AI service migrations out-of-band), then keep skipping enabled`,
      );
    }
    logger.info('AI database migrations are skipped by configuration');
    return;
  }

  logger.info('Running AI database migrations');
  await db.migrate.latest({
    directory,
    tableName: AI_MIGRATIONS_TABLE,
  });
}
