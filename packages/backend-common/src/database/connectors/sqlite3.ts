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

import { Config } from '@backstage/config';
import { ensureDirSync } from 'fs-extra';
import knexFactory, { Knex } from 'knex';
import path from 'path';
import { DevDataStore } from '@backstage/backend-dev-utils';
import { mergeDatabaseConfig } from '../config';
import { DatabaseConnector } from '../types';
import {
  LifecycleService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';

/**
 * Creates a knex SQLite3 database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function createSqliteDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
  deps?: {
    lifecycle: LifecycleService;
    pluginMetadata: PluginMetadataService;
  },
) {
  const knexConfig = buildSqliteDatabaseConfig(dbConfig, overrides);
  const connConfig = knexConfig.connection as Knex.Sqlite3ConnectionConfig;

  const filename = connConfig.filename ?? ':memory:';

  // If storage on disk is used, ensure that the directory exists
  if (filename !== ':memory:') {
    const directory = path.dirname(filename);
    ensureDirSync(directory);
  }

  let database: Knex;

  if (deps && filename === ':memory:') {
    // The dev store is used during watch mode to store and restore the database
    // across reloads. It is only available when running the backend through
    // `backstage-cli package start`.
    const devStore = DevDataStore.get();

    if (devStore) {
      const dataKey = `sqlite3-db-${deps.pluginMetadata.getId()}`;

      const connectionLoader = async () => {
        // If seed data is available, use it tconnectionLoader restore the database
        const { data: seedData } = await devStore.load(dataKey);

        return {
          ...(knexConfig.connection as Knex.Sqlite3ConnectionConfig),
          filename: seedData ?? ':memory:',
        };
      };

      database = knexFactory({
        ...knexConfig,
        connection: Object.assign(connectionLoader, {
          // This is a workaround for the knex SQLite driver always warning when using a config loader
          filename: ':memory:',
        }),
      });

      // If the dev store is available we save the database state on shutdown
      deps.lifecycle.addShutdownHook(async () => {
        const connection = await database.client.acquireConnection();
        const data = connection.serialize();
        await devStore.save(dataKey, data);
      });
    } else {
      database = knexFactory(knexConfig);
    }
  } else {
    database = knexFactory(knexConfig);
  }

  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  return database;
}

/**
 * Builds a knex SQLite3 connection config
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function buildSqliteDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
): Knex.Config {
  const baseConfig = dbConfig.get<Knex.Config>();

  // Normalize config to always contain a connection object
  if (typeof baseConfig.connection === 'string') {
    baseConfig.connection = { filename: baseConfig.connection };
  }
  if (overrides && typeof overrides.connection === 'string') {
    overrides.connection = { filename: overrides.connection };
  }

  const config: Knex.Config = mergeDatabaseConfig(
    {
      connection: {},
    },
    baseConfig,
    {
      useNullAsDefault: true,
    },
    overrides,
  );

  return config;
}

/**
 * Provides a partial knex SQLite3 config to override database name.
 */
export function createSqliteNameOverride(name: string): Partial<Knex.Config> {
  return {
    connection: parseSqliteConnectionString(name),
  };
}

/**
 * Produces a partial knex SQLite3 connection config with database name.
 */
export function parseSqliteConnectionString(
  name: string,
): Knex.Sqlite3ConnectionConfig {
  return {
    filename: name,
  };
}

/**
 * SQLite3 database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export const sqlite3Connector: DatabaseConnector = Object.freeze({
  createClient: createSqliteDatabaseClient,
  createNameOverride: createSqliteNameOverride,
  parseConnectionString: parseSqliteConnectionString,
});
