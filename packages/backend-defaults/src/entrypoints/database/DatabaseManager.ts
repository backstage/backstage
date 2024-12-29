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
  RootConfigService,
  RootLifecycleService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import { Knex } from 'knex';
import { MysqlConnector } from './connectors/mysql';
import { PgConnector } from './connectors/postgres';
import { Sqlite3Connector } from './connectors/sqlite3';
import { Connector } from './types';

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
  rootLogger?: RootLoggerService;
  rootLifecycle?: RootLifecycleService;
};

/**
 * Testable implementation class for {@link DatabaseManager} below.
 */
export class DatabaseManagerImpl {
  constructor(
    private readonly config: Config,
    private readonly connectors: Record<string, Connector>,
    private readonly options?: DatabaseManagerOptions,
    private readonly databaseCache: Map<string, Promise<Knex>> = new Map(),
    private readonly keepaliveIntervals: Map<
      string,
      NodeJS.Timeout
    > = new Map(),
  ) {
    // If a rootLifecycle service was provided, register a shutdown hook to
    // clean up any database connections.
    if (options?.rootLifecycle !== undefined) {
      options.rootLifecycle.addShutdownHook(async () => {
        await this.shutdown({ logger: options.rootLogger });
      });
    }
  }

  /**
   * Generates a DatabaseService for consumption by plugins.
   *
   * @param pluginId - The plugin that the database manager should be created for. Plugin names
   * should be unique as they are used to look up database config overrides under
   * `backend.database.plugin`.
   */
  forPlugin(
    pluginId: string,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): DatabaseService {
    const client = this.getClientType(pluginId).client;
    const connector = this.connectors[client];
    if (!connector) {
      throw new Error(
        `Unsupported database client type '${client}' specified for plugin '${pluginId}'`,
      );
    }
    const getClient = () => this.getDatabase(pluginId, connector, deps);

    const skip =
      this.options?.migrations?.skip ??
      this.config.getOptionalBoolean(`plugin.${pluginId}.skipMigrations`) ??
      this.config.getOptionalBoolean('skipMigrations') ??
      false;

    return { getClient, migrations: { skip } };
  }

  /**
   * Destroys all known connections.
   */
  private async shutdown(deps?: { logger?: LoggerService }): Promise<void> {
    const pluginIds = Array.from(this.databaseCache.keys());
    await Promise.allSettled(
      pluginIds.map(async pluginId => {
        // We no longer need to keep connections alive.
        clearInterval(this.keepaliveIntervals.get(pluginId));

        const connection = await this.databaseCache.get(pluginId);
        if (connection) {
          if (connection.client.config.includes('sqlite3')) {
            return; // sqlite3 does not support destroy, it hangs
          }
          await connection.destroy().catch((error: unknown) => {
            deps?.logger?.error(
              `Problem closing database connection for ${pluginId}: ${stringifyError(
                error,
              )}`,
            );
          });
        }
      }),
    );
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
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    if (this.databaseCache.has(pluginId)) {
      return this.databaseCache.get(pluginId)!;
    }

    const clientPromise = connector.getClient(pluginId, deps);
    this.databaseCache.set(pluginId, clientPromise);

    if (process.env.NODE_ENV !== 'test') {
      clientPromise.then(client =>
        this.startKeepaliveLoop(pluginId, client, deps.logger),
      );
    }

    return clientPromise;
  }

  private startKeepaliveLoop(
    pluginId: string,
    client: Knex,
    logger: LoggerService,
  ): void {
    let lastKeepaliveFailed = false;

    this.keepaliveIntervals.set(
      pluginId,
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
              logger.warn(
                `Database keepalive failed for plugin ${pluginId}, ${stringifyError(
                  error,
                )}`,
              );
            }
          },
        );
      }, 60 * 1000),
    );
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
export class DatabaseManager {
  /**
   * Creates a {@link DatabaseManager} from `backend.database` config.
   *
   * @param config - The loaded application configuration.
   * @param options - An optional configuration object.
   */
  static fromConfig(
    config: RootConfigService,
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
   * Generates a DatabaseService for consumption by plugins.
   *
   * @param pluginId - The plugin that the database manager should be created for. Plugin names
   * should be unique as they are used to look up database config overrides under
   * `backend.database.plugin`.
   */
  forPlugin(
    pluginId: string,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): DatabaseService {
    return this.impl.forPlugin(pluginId, deps);
  }
}
