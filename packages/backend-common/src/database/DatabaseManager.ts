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
  LifecycleService,
  LoggerService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import { Knex } from 'knex';
import { DatabaseConfigReader } from './DatabaseConfigReader';
import { createFallbackDatabaseClient } from './connectors/fallback';
import { createMysqlDatabaseClient } from './connectors/mysql';
import { createPgDatabaseClient } from './connectors/postgres';
import { createSqliteDatabaseClient } from './connectors/sqlite3';
import { ClientFactory, PluginDatabaseManager } from './types';

/**
 * Creation options for {@link DatabaseManager}.
 *
 * @public
 */
export type DatabaseManagerOptions = {
  migrations?: PluginDatabaseManager['migrations'];
  logger?: LoggerService;
};

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
    config: Config,
    options?: DatabaseManagerOptions,
  ): DatabaseManager {
    const reader = DatabaseConfigReader.fromConfig(config);
    return new DatabaseManager(reader, options);
  }

  private constructor(
    private readonly configReader: DatabaseConfigReader,
    private readonly options?: DatabaseManagerOptions,
    private readonly clientFactories: Map<string, ClientFactory> = new Map([
      ['pg', createPgDatabaseClient],
      ['better-sqlite3', createSqliteDatabaseClient],
      ['sqlite3', createSqliteDatabaseClient],
      ['mysql', createMysqlDatabaseClient],
      ['mysql2', createMysqlDatabaseClient],
    ]),
    private readonly fallbackClientFactory: ClientFactory = createFallbackDatabaseClient,
    private readonly clientInstances: Map<string, Promise<Knex>> = new Map(),
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
    const getClient = () => this.getDatabase(pluginId, deps);
    const migrations = { skip: false, ...this.options?.migrations };
    return { getClient, migrations };
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
    deps?: {
      lifecycle: LifecycleService;
      pluginMetadata: PluginMetadataService;
    },
  ): Promise<Knex> {
    if (this.clientInstances.has(pluginId)) {
      return this.clientInstances.get(pluginId)!;
    }

    const instancePromise = Promise.resolve().then(async () => {
      /*
      const databaseName = getDatabaseName(this.config, pluginId);
      if (databaseName && getEnsureExistsConfig(this.config, pluginId)) {
        try {
          await ensureDatabaseExists(this.config, pluginId);
        } catch (error) {
          throw new Error(
            `Failed to connect to the database to make sure that '${databaseName}' exists, ${error}`,
          );
        }
      }

      let schemaOverrides;
      if (getPluginDivisionModeConfig(this.config) === 'schema') {
        schemaOverrides = getSchemaOverrides(this.config, pluginId);
        if (getEnsureExistsConfig(this.config, pluginId)) {
          try {
            await ensureSchemaExists(this.config, pluginId);
          } catch (error) {
            throw new Error(
              `Failed to connect to the database to make sure that schema for plugin '${pluginId}' exists, ${error}`,
            );
          }
        }
      }

      const databaseClientOverrides = mergeDatabaseConfig(
        {},
        getDatabaseOverrides(this.config, pluginId),
        schemaOverrides,
      );

      const pluginConfig = new ConfigReader(
        getConfigForPlugin(this.config, pluginId) as JsonObject,
      );

      const client = createDatabaseClient(
        pluginConfig,
        databaseClientOverrides,
        deps,
      );
      */

      const pluginConfig = this.configReader.forPlugin(pluginId);

      const factory =
        this.clientFactories.get(pluginConfig.client) ??
        this.fallbackClientFactory;

      const instance = await factory(pluginConfig, deps);

      if (process.env.NODE_ENV !== 'test') {
        this.startKeepaliveLoop(pluginId, instance);
      }

      return instance;
    });

    this.clientInstances.set(pluginId, instancePromise);

    return instancePromise;
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
