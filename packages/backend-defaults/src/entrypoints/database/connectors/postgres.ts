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
import { Config, ConfigReader } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import knexFactory, { Knex } from 'knex';
import { merge, omit } from 'lodash';
import limiterFactory from 'p-limit';
import { Client } from 'pg';
import { Connector } from '../types';
import defaultNameOverride from './defaultNameOverride';
import defaultSchemaOverride from './defaultSchemaOverride';
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
  } = await import('@google-cloud/cloud-sql-connector');
  const connector = new CloudSqlConnector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: config.connection.instance,
    ipType: IpAddressTypes.PUBLIC,
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

export class PgConnector implements Connector {
  constructor(
    private readonly config: Config,
    private readonly prefix: string,
  ) {}

  async getClient(
    pluginId: string,
    _deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    const pluginConfig = new ConfigReader(
      this.getConfigForPlugin(pluginId) as JsonObject,
    );

    const databaseName = this.getDatabaseName(pluginId);
    if (databaseName && this.getEnsureExistsConfig(pluginId)) {
      try {
        await ensurePgDatabaseExists(pluginConfig, databaseName);
      } catch (error) {
        throw new Error(
          `Failed to connect to the database to make sure that '${databaseName}' exists, ${error}`,
        );
      }
    }

    let schemaOverrides;
    if (this.getPluginDivisionModeConfig() === 'schema') {
      schemaOverrides = defaultSchemaOverride(pluginId);
      if (
        this.getEnsureSchemaExistsConfig(pluginId) ||
        this.getEnsureExistsConfig(pluginId)
      ) {
        try {
          await ensurePgSchemaExists(pluginConfig, pluginId);
        } catch (error) {
          throw new Error(
            `Failed to connect to the database to make sure that schema for plugin '${pluginId}' exists, ${error}`,
          );
        }
      }
    }

    const databaseClientOverrides = mergeDatabaseConfig(
      {},
      this.getDatabaseOverrides(pluginId),
      schemaOverrides,
    );

    const client = createPgDatabaseClient(
      pluginConfig,
      databaseClientOverrides,
    );

    return client;
  }

  /**
   * Provides the canonical database name for a given plugin.
   *
   * This method provides the effective database name which is determined using global
   * and plugin specific database config. If no explicit database name is configured
   * and `pluginDivisionMode` is not `schema`, this method will provide a generated name
   * which is the pluginId prefixed with 'backstage_plugin_'. If `pluginDivisionMode` is
   * `schema`, it will fallback to using the default database for the knex instance.
   *
   * @param pluginId - Lookup the database name for given plugin
   * @returns String representing the plugin's database name
   */
  private getDatabaseName(pluginId: string): string | undefined {
    const connection = this.getConnectionConfig(pluginId);

    const databaseName = (connection as Knex.ConnectionConfig)?.database;

    // `pluginDivisionMode` as `schema` should use overridden databaseName if supplied or fallback to default knex database
    if (this.getPluginDivisionModeConfig() === 'schema') {
      return databaseName;
    }

    // all other supported databases should fallback to an auto-prefixed name
    return databaseName ?? `${this.prefix}${pluginId}`;
  }

  /**
   * Provides the client type which should be used for a given plugin.
   *
   * The client type is determined by plugin specific config if present.
   * Otherwise the base client is used as the fallback.
   *
   * @param pluginId - Plugin to get the client type for
   * @returns Object with client type returned as `client` and boolean
   *          representing whether or not the client was overridden as
   *          `overridden`
   */
  private getClientType(pluginId: string): {
    client: string;
    overridden: boolean;
  } {
    const pluginClient = this.config.getOptionalString(
      `${pluginPath(pluginId)}.client`,
    );

    const baseClient = this.config.getString('client');
    const client = pluginClient ?? baseClient;
    return {
      client,
      overridden: client !== baseClient,
    };
  }

  private getRoleConfig(pluginId: string): string | undefined {
    return (
      this.config.getOptionalString(`${pluginPath(pluginId)}.role`) ??
      this.config.getOptionalString('role')
    );
  }

  /**
   * Provides the knexConfig which should be used for a given plugin.
   *
   * @param pluginId - Plugin to get the knexConfig for
   * @returns The merged knexConfig value or undefined if it isn't specified
   */
  private getAdditionalKnexConfig(pluginId: string): JsonObject | undefined {
    const pluginConfig = this.config
      .getOptionalConfig(`${pluginPath(pluginId)}.knexConfig`)
      ?.get<JsonObject>();

    const baseConfig = this.config
      .getOptionalConfig('knexConfig')
      ?.get<JsonObject>();

    return merge(baseConfig, pluginConfig);
  }

  private getEnsureExistsConfig(pluginId: string): boolean {
    const baseConfig = this.config.getOptionalBoolean('ensureExists') ?? true;
    return (
      this.config.getOptionalBoolean(`${pluginPath(pluginId)}.ensureExists`) ??
      baseConfig
    );
  }

  private getEnsureSchemaExistsConfig(pluginId: string): boolean {
    const baseConfig =
      this.config.getOptionalBoolean('ensureSchemaExists') ?? false;
    return (
      this.config.getOptionalBoolean(
        `${pluginPath(pluginId)}.getEnsureSchemaExistsConfig`,
      ) ?? baseConfig
    );
  }

  private getPluginDivisionModeConfig(): string {
    return this.config.getOptionalString('pluginDivisionMode') ?? 'database';
  }

  /**
   * Provides a Knex connection plugin config by combining base and plugin
   * config.
   *
   * This method provides a baseConfig for a plugin database connector. If the
   * client type has not been overridden, the global connection config will be
   * included with plugin specific config as the base. Values from the plugin
   * connection take precedence over the base. Base database name is omitted
   * unless `pluginDivisionMode` is set to `schema`.
   */
  private getConnectionConfig(pluginId: string): Knex.StaticConnectionConfig {
    const { overridden } = this.getClientType(pluginId);

    let baseConnection = normalizeConnection(this.config.get('connection'));

    // Databases cannot be shared unless the `pluginDivisionMode` is set to `schema`. The
    // `database` property from the base connection is omitted unless `pluginDivisionMode`
    // is set to `schema`.
    if (this.getPluginDivisionModeConfig() !== 'schema') {
      baseConnection = omit(baseConnection, 'database');
    }

    // get and normalize optional plugin specific database connection
    const connection = normalizeConnection(
      this.config.getOptional(`${pluginPath(pluginId)}.connection`),
    );

    (
      baseConnection as Knex.PgConnectionConfig
    ).application_name ||= `backstage_plugin_${pluginId}`;

    return {
      // include base connection if client type has not been overridden
      ...(overridden ? {} : baseConnection),
      ...connection,
    } as Knex.StaticConnectionConfig;
  }

  /**
   * Provides a Knex database config for a given plugin.
   *
   * This method provides a Knex configuration object along with the plugin's
   * client type.
   *
   * @param pluginId - The plugin that the database config should correspond with
   */
  private getConfigForPlugin(pluginId: string): Knex.Config {
    const { client } = this.getClientType(pluginId);
    const role = this.getRoleConfig(pluginId);

    return {
      ...this.getAdditionalKnexConfig(pluginId),
      client,
      connection: this.getConnectionConfig(pluginId),
      ...(role && { role }),
    };
  }

  /**
   * Provides a partial `Knex.Config`• database name override for a given plugin.
   *
   * @param pluginId - Target plugin to get database name override
   * @returns Partial `Knex.Config` with database name override
   */
  private getDatabaseOverrides(pluginId: string): Knex.Config {
    const databaseName = this.getDatabaseName(pluginId);
    return databaseName ? defaultNameOverride(databaseName) : {};
  }
}
