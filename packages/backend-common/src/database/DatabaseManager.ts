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
import { Config, ConfigReader } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { getConfigForPlugin } from './config/getConfigForPlugin';
import { getDatabaseName } from './config/getDatabaseName';
import { getDatabaseOverrides } from './config/getDatabaseOverrides';
import { getEnsureExistsConfig } from './config/getEnsureExistsConfig';
import { getPluginDivisionModeConfig } from './config/getPluginDivisionModeConfig';
import { getSchemaOverrides } from './config/getSchemaOverrides';
import { mergeDatabaseConfig } from './config/mergeDatabaseConfig';
import {
  createDatabaseClient,
  ensureDatabaseExists,
  ensureSchemaExists,
} from './connection';
import { PluginDatabaseManager } from './types';

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
    const databaseConfig = config.getConfig('backend.database');

    return new DatabaseManager(databaseConfig, options);
  }

  private constructor(
    private readonly config: Config,
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
    if (this.databaseCache.has(pluginId)) {
      return this.databaseCache.get(pluginId)!;
    }

    const clientPromise = Promise.resolve().then(async () => {
      const pluginConfig = new ConfigReader(
        getConfigForPlugin(this.config, pluginId) as JsonObject,
      );

      const databaseName = getDatabaseName(this.config, pluginId);
      if (databaseName && getEnsureExistsConfig(this.config, pluginId)) {
        try {
          await ensureDatabaseExists(pluginConfig, databaseName);
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
            await ensureSchemaExists(pluginConfig, pluginId);
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

      const client = createDatabaseClient(
        pluginConfig,
        databaseClientOverrides,
        deps,
      );
      if (process.env.NODE_ENV !== 'test') {
        this.startKeepaliveLoop(pluginId, client);
      }
      return client;
    });

    this.databaseCache.set(pluginId, clientPromise);

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
