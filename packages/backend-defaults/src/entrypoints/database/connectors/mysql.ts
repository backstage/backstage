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
import { InputError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import knexFactory, { Knex } from 'knex';
import { merge, omit } from 'lodash';
import limiterFactory from 'p-limit';
import yn from 'yn';
import { Connector } from '../types';
import defaultNameOverride from './defaultNameOverride';
import { mergeDatabaseConfig } from './mergeDatabaseConfig';

// Limits the number of concurrent DDL operations to 1
const ddlLimiter = limiterFactory(1);

/**
 * Creates a knex mysql database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function createMysqlDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = buildMysqlDatabaseConfig(dbConfig, overrides);
  const database = knexFactory(knexConfig);
  return database;
}

/**
 * Builds a knex mysql database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function buildMysqlDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getMysqlConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Gets the mysql connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export function getMysqlConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): Knex.MySqlConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseConnectionString && isConnectionString;

  return shouldParseConnectionString
    ? parseMysqlConnectionString(connection as string)
    : connection;
}

/**
 * Parses a mysql connection string.
 *
 * e.g. mysql://examplename:somepassword@examplehost:3306/dbname
 * @param connectionString - The mysql connection string
 */
export function parseMysqlConnectionString(
  connectionString: string,
): Knex.MySqlConnectionConfig {
  try {
    const {
      protocol,
      username,
      password,
      port,
      hostname,
      pathname,
      searchParams,
    } = new URL(connectionString);

    if (protocol !== 'mysql:') {
      throw new Error(`Unknown protocol ${protocol}`);
    } else if (!username || !password) {
      throw new Error(`Missing username/password`);
    } else if (!pathname.match(/^\/[^/]+$/)) {
      throw new Error(`Expected single path segment`);
    }

    const result: Knex.MySqlConnectionConfig = {
      user: username,
      password,
      host: hostname,
      port: Number(port || 3306),
      database: decodeURIComponent(pathname.substring(1)),
    };

    const ssl = searchParams.get('ssl');
    if (ssl) {
      result.ssl = ssl;
    }

    const debug = searchParams.get('debug');
    if (debug) {
      result.debug = yn(debug);
    }

    return result;
  } catch (e) {
    throw new InputError(
      `Error while parsing MySQL connection string, ${e}`,
      e,
    );
  }
}

/**
 * Creates the missing mysql database if it does not exist
 *
 * @param dbConfig - The database config
 * @param databases - The names of the databases to create
 */
export async function ensureMysqlDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createMysqlDatabaseClient(dbConfig, {
    connection: {
      database: null as unknown as string,
    },
    pool: {
      min: 0,
      acquireTimeoutMillis: 10000,
    },
  });

  try {
    const ensureDatabase = async (database: string) => {
      await admin.raw(`CREATE DATABASE IF NOT EXISTS ??`, [database]);
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
 * Drops the given mysql databases.
 *
 * @param dbConfig - The database config
 * @param databases - The names of the databases to create
 */
export async function dropMysqlDatabase(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createMysqlDatabaseClient(dbConfig, {
    connection: {
      database: null as unknown as string,
    },
    pool: {
      min: 0,
      acquireTimeoutMillis: 10000,
    },
  });

  try {
    const dropDatabase = async (database: string) => {
      await admin.raw(`DROP DATABASE ??`, [database]);
    };
    await Promise.all(
      databases.map(async database => {
        return await ddlLimiter(() => dropDatabase(database));
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
    ? parseMysqlConnectionString(connection as string)
    : connection;
}

export class MysqlConnector implements Connector {
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
        await ensureMysqlDatabaseExists(pluginConfig, databaseName);
      } catch (error) {
        throw new Error(
          `Failed to connect to the database to make sure that '${databaseName}' exists, ${error}`,
        );
      }
    }

    const pluginDivisionMode = this.getPluginDivisionModeConfig();
    if (pluginDivisionMode !== 'database') {
      throw new Error(
        `The MySQL driver does not support plugin division mode '${pluginDivisionMode}'`,
      );
    }

    const databaseClientOverrides = mergeDatabaseConfig(
      {},
      this.getDatabaseOverrides(pluginId),
    );

    const client = createMysqlDatabaseClient(
      pluginConfig,
      databaseClientOverrides,
    );

    return client;
  }

  /**
   * Provides the canonical database name for a given plugin.
   *
   * This method provides the effective database name which is determined using
   * global and plugin specific database config. If no explicit database name,
   * this method will provide a generated name which is the pluginId prefixed
   * with 'backstage_plugin_'.
   *
   * @param pluginId - Lookup the database name for given plugin
   * @returns String representing the plugin's database name
   */
  private getDatabaseName(pluginId: string): string | undefined {
    const connection = this.getConnectionConfig(pluginId);
    const databaseName = (connection as Knex.ConnectionConfig)?.database;
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
