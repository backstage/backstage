/*
 * Copyright 2020 Spotify AB
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
import { Config } from '@backstage/config';
import { createDatabaseClient, ensureDatabaseExists } from './connection';
import { PluginDatabaseManager } from './types';

/**
 * Implements a Database Manager which will automatically create new databases
 * for plugins when requested. All requested databases are created with the
 * credentials provided; if the database already exists no attempt to create
 * the database will be made.
 */
export class SingleConnectionDatabaseManager {
  /**
   * Creates a new SingleConnectionDatabaseManager instance by reading from the `backend`
   * config section, specifically the `.database` key for discovering the management
   * database configuration.
   *
   * @param config The loaded application configuration.
   */
  static fromConfig(config: Config): SingleConnectionDatabaseManager {
    return new SingleConnectionDatabaseManager(
      config.getConfig('backend.database'),
    );
  }

  private constructor(private readonly config: Config) {}

  /**
   * Generates a PluginDatabaseManager for consumption by plugins.
   *
   * @param pluginId The plugin that the database manager should be created for. Plugin names should be unique.
   */
  forPlugin(pluginId: string): PluginDatabaseManager {
    const _this = this;

    return {
      getClient(): Promise<Knex> {
        return _this.getDatabase(pluginId);
      },
    };
  }

  private async getDatabase(pluginId: string): Promise<Knex> {
    const config = this.config;
    const overrides = SingleConnectionDatabaseManager.getDatabaseOverrides(
      pluginId,
    );
    const overrideConfig = overrides.connection as Knex.ConnectionConfig;
    await this.ensureDatabase(overrideConfig.database);

    return createDatabaseClient(config, overrides);
  }

  private static getDatabaseOverrides(pluginId: string): Knex.Config {
    return {
      connection: {
        database: `backstage_plugin_${pluginId}`,
      },
    };
  }

  private async ensureDatabase(database: string) {
    const config = this.config;
    await ensureDatabaseExists(config, database);
  }
}
