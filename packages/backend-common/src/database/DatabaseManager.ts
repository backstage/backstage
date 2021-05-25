/*
 * Copyright 2021 Spotify AB
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
import { omit } from 'lodash';
import { Config, ConfigReader } from '@backstage/config';
import {
  createDatabaseClient,
  ensureDatabaseExists,
  createNameOverride,
  normalizeConnection,
} from './connection';
import { PluginDatabaseManager } from './types';

function pluginPath(pluginId: string): string {
  return `plugin.${pluginId}`;
}

export class DatabaseManager {
  /**
   * Creates a DatabaseManager from `backend.database` config.
   *
   * The database manager allows the user to set connection and client settings on a per pluginId
   * basis by defining a database config block under `plugin.<pluginId>` in addition to top level
   * defaults. Optionally, a user may set `prefix` which is used to prefix generated database
   * names if config is not provided.
   *
   * @param config The loaded application configuration.
   */
  static fromConfig(config: Config): DatabaseManager {
    const databaseConfig = config.getConfig('backend.database');

    return new DatabaseManager(
      databaseConfig,
      databaseConfig.getOptionalString('prefix'),
    );
  }

  private constructor(
    private readonly config: Config,
    private readonly prefix: string = 'backstage_plugin_',
  ) {}

  /**
   * Generates a PluginDatabaseManager for consumption by plugins.
   *
   * @param pluginId The plugin that the database manager should be created for. Plugin names should be unique
   * as they are used to look up database config overrides under `backend.database.plugin`.
   */
  forPlugin(pluginId: string): PluginDatabaseManager {
    const _this = this;

    return {
      getClient(): Promise<Knex> {
        return _this.getDatabase(pluginId);
      },
    };
  }

  /**
   * Provides the canonical database name for a given pluginId.
   *
   * This method provides the effective database name which is determined using global
   * and plugin specific database config. If no explicit database name is configured,
   * this method will provide a generated name which is the pluginId prefixed with
   * 'backstage_plugin_'.
   *
   * @param pluginId Lookup the database name for given plugin
   */
  private getDatabaseName(pluginId: string): string {
    const pluginConfig: Config = this.getConfigForPlugin(pluginId);

    // determine root sqlite config to pass through as this is a special case
    const rootConnection = this.config.get('connection');
    const rootSqliteName =
      typeof rootConnection === 'string'
        ? rootConnection
        : this.config.getOptionalString('connection.filename') ?? ':memory:';

    const isSqlite = this.config.getString('client') === 'sqlite3';
    return (
      // attempt to lookup pg and mysql database name
      pluginConfig.getOptionalString('connection.database') ??
      // attempt to lookup sqlite3 database file name
      pluginConfig.getOptionalString('connection.filename') ??
      // if root is sqlite - attempt to use top level connection, fallback to :memory:
      (isSqlite ? rootSqliteName : null) ??
      // generate a database name using prefix and pluginId
      `${this.prefix}${pluginId}`
    );
  }

  /**
   * Provides a base database connector config by merging different config sources.
   *
   * This method provides a baseConfig for a database connector without the target
   * database's name property ('database', 'filename'). The client type is determined
   * by plugin specific config which uses the default as the fallback.
   *
   * If the client type is the same as the plugin or not specified, the global
   * connection config will be extended with plugin specific config.
   *
   * @param pluginId The plugin that the database baseConfig should correspond to
   */
  private getConfigForPlugin(pluginId: string): Config {
    const pluginConfig = this.config.getOptionalConfig(pluginPath(pluginId));

    const baseClient = this.config.getString('client');
    const client = pluginConfig?.getOptionalString('client') ?? baseClient;

    const baseConnection = normalizeConnection(
      this.config.get('connection'),
      baseClient,
    );
    const connection = normalizeConnection(
      pluginConfig?.getOptional('connection') ?? {},
      client,
    );

    return new ConfigReader({
      client,
      connection: {
        // if same client type, extend original connection config without dbname config
        ...(client === baseClient
          ? omit(baseConnection, ['database', 'filename'])
          : {}),
        ...connection,
      },
    });
  }

  private async getDatabase(pluginId: string): Promise<Knex> {
    const pluginConfig = this.getConfigForPlugin(pluginId);

    await ensureDatabaseExists(pluginConfig, this.getDatabaseName(pluginId));
    return createDatabaseClient(
      pluginConfig,
      this.getDatabaseOverrides(pluginId),
    );
  }

  private getDatabaseOverrides(pluginId: string): Knex.Config {
    return createNameOverride(
      this.getConfigForPlugin(pluginId).get('client'),
      this.getDatabaseName(pluginId),
    );
  }
}
