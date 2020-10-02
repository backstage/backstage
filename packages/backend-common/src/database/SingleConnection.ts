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

import Knex from 'knex';
import { Config } from '@backstage/config';
import { createDatabaseClient, ensureDatabaseExists } from './connection';
import { PluginDatabaseClientFactory } from './types';

/**
 * Implements a Database Manager which will automatically create new databases for plugins when requested. All
 * requested databases are created with the credentials provided.
 */
export class SingleConnectionManager {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  private getDatabaseConfig(): Config {
    return this.config;
  }

  private getAdminConfig(): Config {
    return this.config;
  }

  /**
   * Generates a PluginDatabaseClientFactory for consumption by plugins.
   */
  getDatabaseClientFactory(pluginId: string): PluginDatabaseClientFactory {
    return (database?: string): Promise<Knex> => {
      return this.getDatabase(pluginId, database);
    };
  }

  private async getDatabase(pluginId: string, suffix?: string): Promise<Knex> {
    const config = this.getDatabaseConfig();
    const overrides = SingleConnectionManager.getDatabaseOverrides(
      pluginId,
      suffix,
    );
    const overrideConfig = overrides.connection as Knex.ConnectionConfig;
    await this.ensureDatabase(overrideConfig.database);

    return createDatabaseClient(config, overrides);
  }

  private static getDatabaseOverrides(
    pluginId: string,
    suffix?: string,
  ): Knex.Config {
    const dbSuffix = suffix ? `_${suffix}` : '';
    return {
      connection: {
        database: `backstage_plugin_${pluginId}${dbSuffix}`,
      },
    };
  }

  private async ensureDatabase(database: string) {
    const config = this.getAdminConfig();
    await ensureDatabaseExists(config, database);
  }
}
