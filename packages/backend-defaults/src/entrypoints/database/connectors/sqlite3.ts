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

import { DevDataStore } from '@backstage/backend-dev-utils';
import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { ensureDirSync } from 'fs-extra';
import knexFactory, { Knex } from 'knex';
import { merge, omit } from 'lodash';
import path from 'path';
import { Connector } from '../types';
import { mergeDatabaseConfig } from './mergeDatabaseConfig';

/**
 * Creates a knex SQLite3 database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function createSqliteDatabaseClient(
  pluginId: string,
  dbConfig: Config,
  deps: {
    logger: LoggerService;
    lifecycle: LifecycleService;
  },
  overrides?: Knex.Config,
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
      const dataKey = `sqlite3-db-${pluginId}`;

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
    ? parseSqliteConnectionString(connection as string)
    : connection;
}

export class Sqlite3Connector implements Connector {
  constructor(private readonly config: Config) {}

  async getClient(
    pluginId: string,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    const pluginConfig = new ConfigReader(
      this.getConfigForPlugin(pluginId) as JsonObject,
    );

    const pluginDivisionMode = this.getPluginDivisionModeConfig();
    if (pluginDivisionMode !== 'database') {
      throw new Error(
        `The SQLite driver does not support plugin division mode '${pluginDivisionMode}'`,
      );
    }

    const databaseClientOverrides = mergeDatabaseConfig(
      {},
      this.getDatabaseOverrides(pluginId),
    );

    const client = createSqliteDatabaseClient(
      pluginId,
      pluginConfig,
      deps,
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

    const sqliteFilename: string | undefined = (
      connection as Knex.Sqlite3ConnectionConfig
    ).filename;

    if (sqliteFilename === ':memory:') {
      return sqliteFilename;
    }

    const sqliteDirectory =
      (connection as { directory?: string }).directory ?? '.';

    return path.join(sqliteDirectory, sqliteFilename ?? `${pluginId}.sqlite`);
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
   * connection take precedence over the base. Base database name is omitted for
   * all supported databases excluding SQLite unless `pluginDivisionMode` is set
   * to `schema`.
   */
  private getConnectionConfig(pluginId: string): Knex.StaticConnectionConfig {
    const { client, overridden } = this.getClientType(pluginId);

    let baseConnection = normalizeConnection(this.config.get('connection'));

    if (
      client.includes('sqlite3') &&
      'filename' in baseConnection &&
      baseConnection.filename !== ':memory:'
    ) {
      throw new Error(
        '`connection.filename` is not supported for the base sqlite connection. Prefer `connection.directory` or provide a filename for the plugin connection instead.',
      );
    }

    // Databases cannot be shared unless the `pluginDivisionMode` is set to `schema`. The
    // `database` property from the base connection is omitted unless `pluginDivisionMode`
    // is set to `schema`. SQLite3's `filename` property is an exception as this is used as a
    // directory elsewhere so we preserve `filename`.
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
    return databaseName ? createSqliteNameOverride(databaseName) : {};
  }
}
