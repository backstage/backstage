/*
 * Copyright 2021 The Backstage Authors
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
  LoggerService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import { Knex } from 'knex';
import { MysqlConnector } from './connectors/mysql';
import { PgConnector } from './connectors/postgres';
import { Sqlite3Connector } from './connectors/sqlite3';
import { Connector, PluginDatabaseManager } from './types';

/**
 * Provides a config lookup path for a plugin's config block.
 */
function pluginPath(pluginId: string): string {
  return `plugin.${pluginId}`;
}

/**
 * Creation options for {@link DatabaseManager}.
 *
 * @public
 */
export type DatabaseManagerOptions = {
  migrations?: DatabaseService['migrations'];
  logger?: LoggerService;
};

/**
 * An interface that represents the legacy global DatabaseManager implementation.
 * @public
 */
export type LegacyRootDatabaseService = {
  forPlugin(pluginId: string): DatabaseService;
};

/**
 * Testable implementation class for {@link DatabaseManager} below.
 */
export class DatabaseManagerImpl implements LegacyRootDatabaseService {
  constructor(
    private readonly config: Config,
    private readonly connectors: Record<string, Connector>,
    private readonly options?: DatabaseManagerOptions,
    private readonly databaseCache: Map<string, Promise<Knex>> = new Map(),
  ) {}

  /**
   * Generates a PluginDatabaseManager for consumption by plugins.
   *
   * @param pluginId - The plugin that the database manager should be created for. Plugin names
   * should be unique as they are used to look up database config overrides under
   * `backend.database.plugin`.
   */
  forPlugin(
    pluginId: string,
    deps?: {
      lifecycle: LifecycleService;
      pluginMetadata: PluginMetadataService;
    },
  ): PluginDatabaseManager {
    const client = this.getClientType(pluginId).client;
    const connector = this.connectors[client];
    if (!connector) {
      throw new Error(
        `Unsupported database client type '${client}' specified for plugin '${pluginId}'`,
      );
    }
    const getClient = () => this.getDatabase(pluginId, connector, deps);

    let skip = false;
    // config options take precedence over config
    if (this.options?.migrations?.skip !== undefined) {
      skip = this.options.migrations.skip;
    } else {
      skip =
        this.config.getOptionalBoolean(
          `backend.database.plugin.${pluginId}.skipMigrations`,
        ) ??
        this.config.getOptionalBoolean('backend.database.skipMigrations') ??
        false;
    }

    return { getClient, migrations: { skip } };
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

  /**
   * Provides a scoped Knex client for a plugin as per application config.
   *
   * @param pluginId - Plugin to get a Knex client for
   * @returns Promise which resolves to a scoped Knex database client for a
   *          plugin
   */
  private async getDatabase(
    pluginId: string,
    connector: Connector,
    deps?: {
      lifecycle: LifecycleService;
      pluginMetadata: PluginMetadataService;
    },
  ): Promise<Knex> {
    if (this.databaseCache.has(pluginId)) {
      return this.databaseCache.get(pluginId)!;
    }

    const clientPromise = connector.getClient(pluginId, deps);
    this.databaseCache.set(pluginId, clientPromise);

    if (process.env.NODE_ENV !== 'test') {
      clientPromise.then(client => this.startKeepaliveLoop(pluginId, client));
    }

    return clientPromise;
  }

  private startKeepaliveLoop(pluginId: string, client: Knex): void {
    let lastKeepaliveFailed = false;

    setInterval(() => {
      // During testing it can happen that the environment is torn down and
      // this client is `undefined`, but this interval is still run.
      client?.raw('select 1').then(
        () => {
          lastKeepaliveFailed = false;
        },
        (error: unknown) => {
          if (!lastKeepaliveFailed) {
            lastKeepaliveFailed = true;
            this.options?.logger?.warn(
              `Database keepalive failed for plugin ${pluginId}, ${stringifyError(
                error,
              )}`,
            );
          }
        },
      );
    }, 60 * 1000);
  }
}

// NOTE: This class looks odd but is kept around for API compatibility reasons
/**
 * Manages database connections for Backstage backend plugins.
 *
 * @public
 * @remarks
 *
 * The database manager allows the user to set connection and client settings on
 * a per pluginId basis by defining a database config block under
 * `plugin.<pluginId>` in addition to top level defaults. Optionally, a user may
 * set `prefix` which is used to prefix generated database names if config is
 * not provided.
 */
export class DatabaseManager implements LegacyRootDatabaseService {
  /**
   * Creates a {@link DatabaseManager} from `backend.database` config.
   *
   * @param config - The loaded application configuration.
   * @param options - An optional configuration object.
   */
  static fromConfig(
    config: Config,
    options?: DatabaseManagerOptions,
  ): DatabaseManager {
    const databaseConfig = config.getConfig('backend.database');
    const prefix =
      databaseConfig.getOptionalString('prefix') || 'backstage_plugin_';
    return new DatabaseManager(
      new DatabaseManagerImpl(
        databaseConfig,
        {
          pg: new PgConnector(databaseConfig, prefix),
          sqlite3: new Sqlite3Connector(databaseConfig),
          'better-sqlite3': new Sqlite3Connector(databaseConfig),
          mysql: new MysqlConnector(databaseConfig, prefix),
          mysql2: new MysqlConnector(databaseConfig, prefix),
        },
        options,
      ),
    );
  }

  private constructor(private readonly impl: DatabaseManagerImpl) {}

  /**
   * Generates a PluginDatabaseManager for consumption by plugins.
   *
   * @param pluginId - The plugin that the database manager should be created for. Plugin names
   * should be unique as they are used to look up database config overrides under
   * `backend.database.plugin`.
   */
  forPlugin(
    pluginId: string,
    deps?: {
      lifecycle: LifecycleService;
      pluginMetadata: PluginMetadataService;
    },
  ): PluginDatabaseManager {
    return this.impl.forPlugin(pluginId, deps);
  }
}

/**
 * Helper for deleting databases.
 *
 * @public
 * @deprecated Will be removed in a future release.
 */
export async function dropDatabase(
  dbConfig: Config,
  ...databaseNames: string[]
): Promise<void> {
  const client = dbConfig.getString('client');
  const prefix = dbConfig.getOptionalString('prefix') || 'backstage_plugin_';

  if (client === 'pg') {
    await new PgConnector(dbConfig, prefix).dropDatabase(...databaseNames);
  } else if (client === 'mysql' || client === 'mysql2') {
    await new MysqlConnector(dbConfig, prefix).dropDatabase(...databaseNames);
  }
}
