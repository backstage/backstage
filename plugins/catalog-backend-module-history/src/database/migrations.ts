/*
 * Copyright 2020 The Backstage Authors
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
  DatabaseService,
  LifecycleService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { CatalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';

export const DB_MIGRATIONS_TABLE = 'module_history__knex_migrations';

export async function applyDatabaseMigrations(knex: Knex): Promise<void> {
  const migrationsDir = resolvePackagePath(
    '@backstage/plugin-catalog-backend-module-history',
    'migrations',
  );

  await knex.migrate.latest({
    directory: migrationsDir,
    tableName: DB_MIGRATIONS_TABLE,
  });
}

// Our migrations are dependent on the catalog having performed its own
// migrations first. Since the catalog doesn't have any explicit hooks for this,
// and modules' init run before the plugin does, we instead add a dummy provider
// just for the purpose of hooking into its connect call which happens after the
// catalog is ready.
export async function initializeDatabaseAfterCatalog(options: {
  database: DatabaseService;
  lifecycle: LifecycleService;
  catalogProcessing: CatalogProcessingExtensionPoint;
}): Promise<Knex> {
  await new Promise<void>((resolve, reject) => {
    options.catalogProcessing.addEntityProvider({
      getProviderName: () => 'historyModuleInitDummy',
      connect: async () => resolve(),
    });
    options.lifecycle.addShutdownHook(() => {
      reject(new Error('Catalog is shutting down'));
    });
  });

  const knex = await options.database.getClient();

  const client = knex.client.config.client;
  if (!client.includes('pg')) {
    throw new Error(`Feature not supported for database ${client}`);
  }

  if (options.database.migrations?.skip !== true) {
    await applyDatabaseMigrations(knex);
  }

  return knex;
}
