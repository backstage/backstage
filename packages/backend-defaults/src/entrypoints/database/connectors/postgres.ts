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

import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import knexFactory, { Knex } from 'knex';
import { merge, omit } from 'lodash';
import limiterFactory from 'p-limit';
import { Client } from 'pg';
import { Connector } from '../types';
import { mergeDatabaseConfig } from './mergeDatabaseConfig';
import format from 'pg-format';

// Limits the number of concurrent DDL operations to 1
const ddlLimiter = limiterFactory(1);

/**
 * Creates a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export async function createPgDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = await buildPgDatabaseConfig(dbConfig, overrides);
  const database = knexFactory(knexConfig);

  const role = dbConfig.getOptionalString('role');

  if (role) {
    database.client.pool.on(
      'createSuccess',
      async (_event: number, pgClient: Client) => {
        const query = format('SET ROLE %I', role);
        await pgClient.query(query);
      },
    );
  }
  return database;
}

/**
 * Builds a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export async function buildPgDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const config = mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getPgConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );

  const sanitizedConfig = JSON.parse(JSON.stringify(config));

  // Trim additional properties from the connection object passed to knex
  delete sanitizedConfig.connection.type;
  delete sanitizedConfig.connection.instance;

  if (config.connection.type === 'default' || !config.connection.type) {
    return sanitizedConfig;
  }

  if (config.connection.type !== 'cloudsql') {
    throw new Error(`Unknown connection type: ${config.connection.type}`);
  }

  if (config.client !== 'pg') {
    throw new Error('Cloud SQL only supports the pg client');
  }

  if (!config.connection.instance) {
    throw new Error('Missing instance connection name for Cloud SQL');
  }

  const {
    Connector: CloudSqlConnector,
    IpAddressTypes,
    AuthTypes,
  } = require('@google-cloud/cloud-sql-connector') as typeof import('@google-cloud/cloud-sql-connector');
  const connector = new CloudSqlConnector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: config.connection.instance,
    ipType: config.connection.ipAddressType ?? IpAddressTypes.PUBLIC,
    authType: AuthTypes.IAM,
  });

  return {
    ...sanitizedConfig,
    client: 'pg',
    connection: {
      ...sanitizedConfig.connection,
      ...clientOpts,
    },
  };
}

/**
 * Gets the postgres connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export function getPgConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): Knex.PgConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseConnectionString && isConnectionString;

  return shouldParseConnectionString
    ? parsePgConnectionString(connection as string)
    : connection;
}

/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString - The postgres connection string
 */
export function parsePgConnectionString(connectionString: string) {
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
 *
 * @param dbConfig - The database config
 * @param databases - The name of the databases to create
 */
export async function ensurePgDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = await createPgDatabaseClient(dbConfig, {
    connection: {
      database: 'postgres',
    },
    pool: {
      min: 0,
      acquireTimeoutMillis: 10000,
    },
  });

  try {
    const ensureDatabase = async (database: string) => {
      const result = await admin
        .from('pg_database')
        .where('datname', database)
        .count<Record<string, { count: string }>>();

      if (parseInt(result[0].count, 10) > 0) {
        return;
      }

      await admin.raw(`CREATE DATABASE ??`, [database]);
    };

    await Promise.all(
      databases.map(async database => {
        // For initial setup we use a smaller timeout but several retries. Given that this
        // is a separate connection pool we should never really run into issues with connection
        // acquisition timeouts, but we do anyway. This might be a bug in knex or some other dependency.
        let lastErr: Error | undefined = undefined;
        for (let i = 0; i < 3; i++) {
          try {
            return await ddlLimiter(() => ensureDatabase(database));
          } catch (err) {
            lastErr = err;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw lastErr;
      }),
    );
  } finally {
    await admin.destroy();
  }
}

/**
 * Creates the missing Postgres schema if it does not exist
 *
 * @param dbConfig - The database config
 * @param schemas - The name of the schemas to create
 */
export async function ensurePgSchemaExists(
  dbConfig: Config,
  ...schemas: Array<string>
): Promise<void> {
  const admin = await createPgDatabaseClient(dbConfig);
  const role = dbConfig.getOptionalString('role');

  try {
    const ensureSchema = async (database: string) => {
      if (role) {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ?? AUTHORIZATION ??`, [
          database,
          role,
        ]);
      } else {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [database]);
      }
    };

    await Promise.all(
      schemas.map(database => ddlLimiter(() => ensureSchema(database))),
    );
  } finally {
    await admin.destroy();
  }
}

/**
 * Drops the Postgres databases.
 *
 * @param dbConfig - The database config
 * @param databases - The name of the databases to drop
 */
export async function dropPgDatabase(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = await createPgDatabaseClient(dbConfig);
  try {
    await Promise.all(
      databases.map(async database => {
        await ddlLimiter(() => admin.raw(`DROP DATABASE ??`, [database]));
      }),
    );
  } finally {
    await admin.destroy();
  }
}

/**
 * Provides a config lookup path for a plugin's config block.
 */
function pluginPath(pluginId: string): string {
  return `plugin.${pluginId}`;
}

function normalizeConnection(
  connection: Knex.StaticConnectionConfig | JsonObject | string | undefined,
): Partial<Knex.StaticConnectionConfig> {
  if (typeof connection === 'undefined' || connection === null) {
    return {};
  }

  return typeof connection === 'string' || connection instanceof String
    ? parsePgConnectionString(connection as string)
    : connection;
}

/**
 * The computed configuration for a plugin's postgres database connection.
 */
export interface PgPluginDatabaseConfig {
  /** The database client type (e.g. 'pg') */
  client: string;
  /** Whether the client type was overridden at the plugin level */
  clientOverridden: boolean;
  /** The optional role to set on connections */
  role: string | undefined;
  /** Additional knex configuration merged from base and plugin config */
  additionalKnexConfig: JsonObject | undefined;
  /** Whether to ensure the database exists */
  ensureExists: boolean;
  /** Whether to ensure the schema exists */
  ensureSchemaExists: boolean;
  /** The plugin division mode ('database' or 'schema') */
  pluginDivisionMode: string;
  /** The connection configuration */
  connection: Knex.PgConnectionConfig;
  /** The database name, if any */
  databaseName: string | undefined;
  /** Database client overrides including schema overrides if applicable */
  databaseClientOverrides: Knex.Config;
  /** The full knex config for the plugin */
  knexConfig: Knex.Config;
}

/**
 * Computes all postgres database configuration for a plugin from the provided config.
 *
 * @param config - The database config object
 * @param pluginId - The plugin ID to compute config for
 * @param prefix - The database name prefix (e.g. 'backstage_plugin_')
 * @returns All computed configuration values for the plugin
 */
export function computePgPluginConfig(
  config: Config,
  pluginId: string,
  prefix: string,
): PgPluginDatabaseConfig {
  // Client type
  const pluginClient = config.getOptionalString(
    `${pluginPath(pluginId)}.client`,
  );
  const baseClient = config.getString('client');
  const client = pluginClient ?? baseClient;
  const clientOverridden = client !== baseClient;

  // Role
  const role =
    config.getOptionalString(`${pluginPath(pluginId)}.role`) ??
    config.getOptionalString('role');

  // Additional knex config
  const pluginKnexConfig = config
    .getOptionalConfig(`${pluginPath(pluginId)}.knexConfig`)
    ?.get<JsonObject>();
  const baseKnexConfig = config
    .getOptionalConfig('knexConfig')
    ?.get<JsonObject>();
  const additionalKnexConfig = merge(baseKnexConfig, pluginKnexConfig);

  // Ensure exists flags
  const baseEnsureExists = config.getOptionalBoolean('ensureExists') ?? true;
  const ensureExists =
    config.getOptionalBoolean(`${pluginPath(pluginId)}.ensureExists`) ??
    baseEnsureExists;

  const baseEnsureSchemaExists =
    config.getOptionalBoolean('ensureSchemaExists') ?? false;
  const ensureSchemaExists =
    config.getOptionalBoolean(
      `${pluginPath(pluginId)}.getEnsureSchemaExistsConfig`,
    ) ?? baseEnsureSchemaExists;

  // Plugin division mode
  const pluginDivisionMode =
    config.getOptionalString('pluginDivisionMode') ?? 'database';

  // Connection config
  let baseConnection = normalizeConnection(config.get('connection'));

  // Databases cannot be shared unless the `pluginDivisionMode` is set to `schema`.
  // The `database` property from the base connection is omitted unless
  // `pluginDivisionMode` is set to `schema`.
  if (pluginDivisionMode !== 'schema') {
    baseConnection = omit(baseConnection, 'database');
  }

  // Get and normalize optional plugin specific database connection
  const pluginConnection = normalizeConnection(
    config.getOptional(`${pluginPath(pluginId)}.connection`),
  );

  (
    baseConnection as Knex.PgConnectionConfig
  ).application_name ||= `backstage_plugin_${pluginId}`;

  const connection = {
    // Include base connection if client type has not been overridden
    ...(clientOverridden ? {} : baseConnection),
    ...pluginConnection,
  } as Knex.PgConnectionConfig;

  // Database name
  const connectionDatabaseName = (connection as Knex.ConnectionConfig)
    ?.database;
  let databaseName: string | undefined;

  if (pluginDivisionMode === 'schema') {
    // `pluginDivisionMode` as `schema` should use overridden databaseName if supplied
    // or fallback to default knex database
    databaseName = connectionDatabaseName;
  } else {
    // All other supported databases should fallback to an auto-prefixed name
    databaseName = connectionDatabaseName ?? `${prefix}${pluginId}`;
  }

  // Database client overrides
  let databaseClientOverrides: Knex.Config = {};
  if (databaseName) {
    databaseClientOverrides = { connection: { database: databaseName } };
  }
  if (pluginDivisionMode === 'schema') {
    databaseClientOverrides = mergeDatabaseConfig({}, databaseClientOverrides, {
      searchPath: [pluginId],
    });
  }

  // Full knex config for plugin
  const knexConfig: Knex.Config = {
    ...additionalKnexConfig,
    client,
    connection,
    ...(role && { role }),
  };

  return {
    client,
    clientOverridden,
    role,
    additionalKnexConfig,
    ensureExists,
    ensureSchemaExists,
    pluginDivisionMode,
    connection,
    databaseName,
    databaseClientOverrides,
    knexConfig,
  };
}

export class PgConnector implements Connector {
  private readonly config: Config;
  private readonly prefix: string;

  constructor(config: Config, prefix: string) {
    this.config = config;
    this.prefix = prefix;
  }

  async getClient(
    pluginId: string,
    _deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    const pluginDbConfig = computePgPluginConfig(
      this.config,
      pluginId,
      this.prefix,
    );

    if (pluginDbConfig.databaseName && pluginDbConfig.ensureExists) {
      try {
        await ensurePgDatabaseExists(this.config, pluginDbConfig.databaseName);
      } catch (error) {
        throw new Error(
          `Failed to connect to the database to make sure that '${pluginDbConfig.databaseName}' exists, ${error}`,
        );
      }
    }

    if (pluginDbConfig.pluginDivisionMode === 'schema') {
      if (pluginDbConfig.ensureSchemaExists || pluginDbConfig.ensureExists) {
        try {
          await ensurePgSchemaExists(this.config, pluginId);
        } catch (error) {
          throw new Error(
            `Failed to connect to the database to make sure that schema for plugin '${pluginId}' exists, ${error}`,
          );
        }
      }
    }

    const client = createPgDatabaseClient(
      this.config,
      mergeDatabaseConfig(
        pluginDbConfig.knexConfig,
        pluginDbConfig.databaseClientOverrides,
      ),
    );

    return client;
  }
}
