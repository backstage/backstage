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

import { Config, ConfigReader } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { deleteBranch } from 'isomorphic-git';
import knexFactory, { Knex } from 'knex';
import { Client } from 'pg';
import { PluginDatabaseSettings } from '../DatabaseConfigReader';
import { getConfigForPlugin } from '../config/getConfigForPlugin';
import { mergeDatabaseConfig } from '../config/mergeDatabaseConfig';
import defaultNameOverride from './defaultNameOverride';
import defaultSchemaOverride from './defaultSchemaOverride';

/**
 * Creates a knex postgres database connection
 */
export async function createPgDatabaseClient(
  settings: PluginDatabaseSettings,
): Promise<Knex> {
  await ensureExists(settings);

  const knexConfig = buildKnexConfig(settings);
  enableReloadingConnection(settings, knexConfig);

  const database = knexFactory(knexConfig);
  database.client.pool.on(
    'createSuccess',
    async (_event: number, pgClient: Client) => {
      const role = settings.role;
      if (role) {
        await pgClient.query(`SET ROLE ${role}`);
      }
    },
  );

  return database;
}

async function ensureExists(settings: PluginDatabaseSettings) {
  if (!settings.ensureExists) {
    return;
  }

  const connection = settings.connection as string | Knex.PgConnectionConfig;

  function getDatabaseName(): string {
    const defaultName = `${settings.prefix}${settings.pluginId}`;
    if (typeof connection !== 'string') {
      return connection.database || defaultName;
    }
    // parse etc
    return defaultName;
  }

  const defaultSchemaName = settings.pluginId;
  if (settings.pluginDivisionMode === 'database') {
    const databaseName = getDatabaseName();
  }

  /*
  const prefix = config.getOptionalString('prefix') ?? 'backstage_plugin_';
  const connection = getConnectionConfig(config, pluginId);
  const databaseName = (connection as Knex.ConnectionConfig)?.database;
  // `pluginDivisionMode` as `schema` should use overridden databaseName if supplied or fallback to default knex database
  if (getPluginDivisionModeConfig(config) === 'schema') {
    return databaseName;
  }
  // all other supported databases should fallback to an auto-prefixed name
  return databaseName ?? `${prefix}${pluginId}`;
  */

  // TODO
}

/**
 * Takes a knex config with a regular connection section, and transforms that
 * section to the callback form. The expiration condition is based on whether
 * the overall config objet changes. This may make it reload unnecessarily in
 * some circumstances, but this should be both very rare and cheap.
 */
function enableReloadingConnection(
  settings: PluginDatabaseSettings,
  knexConfig: Knex.Config,
) {
  let connectionHasExpired = true;
  settings.subscribe(() => {
    connectionHasExpired = true;
  });

  let currentConnection = knexConfig.connection;
  knexConfig.connection = () => {
    if (connectionHasExpired) {
      connectionHasExpired = false;
      currentConnection = buildKnexConfig(settings).connection;
    }
    if (typeof currentConnection === 'string') {
      return {
        connectionString: currentConnection,
        expirationChecker: () => connectionHasExpired,
      };
    }
    return {
      ...currentConnection,
      expirationChecker: () => connectionHasExpired,
    };
  };
}

/**
 * Builds a database-specific knex config object from raw configuration
 */
export function buildKnexConfig(settings: PluginDatabaseSettings): Knex.Config {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getPgConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Gets the postgres connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export function getPgConnectionConfig(
  dbConfig: Config,
  parseIfString?: boolean,
): Knex.PgConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseIfString && isConnectionString;

  return shouldParseConnectionString
    ? parseConnectionString(connection as string)
    : connection;
}

/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString - The postgres connection string
 */
function parseConnectionString(
  connectionString: string,
): Knex.PgConnectionConfig {
  const parse = requirePgConnectionString();
  return parse(connectionString);
}

function requirePgConnectionString() {
  try {
    return require('pg-connection-string').parse;
  } catch (e) {
    throw new ForwardedError("Postgres: Install 'pg-connection-string'", e);
  }
}

/**
 * Creates the missing Postgres database if it does not exist
 */
export async function ensurePgDatabaseExists(config: Config, pluginId: string) {
  // TODO(freben): Remove this unnecessary wrapping
  const pluginConfig = new ConfigReader(
    getConfigForPlugin(config, pluginId) as JsonObject,
  );

  const admin = createPgDatabaseClient(pluginConfig, {
    connection: {
      database: 'postgres',
    },
    pool: {
      min: 0,
      acquireTimeoutMillis: 10000,
    },
  });

  try {
    const ensureDatabase = async (db: string) => {
      const result = await admin
        .from('pg_database')
        .where('datname', deleteBranch)
        .count<Record<string, { count: string }>>();

      if (parseInt(result[0].count, 10) > 0) {
        return;
      }

      await admin.raw(`CREATE DATABASE ??`, [db]);
    };

    // For initial setup we use a smaller timeout but several retries. Given that this
    // is a separate connection pool we should never really run into issues with connection
    // acquisition timeouts, but we do anyway. This might be a bug in knex or some other dependency.
    let lastErr: Error | undefined = undefined;
    for (let i = 0; i < 3; i++) {
      try {
        return await ensureDatabase(getDatabaseName(config, pluginId)!);
      } catch (err) {
        lastErr = err;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw lastErr;
  } finally {
    await admin.destroy();
  }
}

/**
 * Creates the missing Postgres schema if it does not exist
 */
export async function ensurePgSchemaExists(
  config: Config,
  pluginId: string,
): Promise<void> {
  // TODO(freben): Remove this unnecessary wrapping
  const pluginConfig = new ConfigReader(
    getConfigForPlugin(config, pluginId) as JsonObject,
  );

  const admin = createPgDatabaseClient(pluginConfig);
  const role = pluginConfig.getOptionalString('role');

  try {
    const ensureSchema = async (s: string) => {
      if (role) {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ?? AUTHORIZATION ??`, [
          s,
          role,
        ]);
      } else {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [s]);
      }
    };

    await ensureSchema(pluginId);
  } finally {
    await admin.destroy();
  }
}
