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
import {
  DatabaseConfiguration,
  PluginDatabaseFactory,
  PluginDatabaseManager,
} from './types';

export class SingleDatabaseConfiguration implements DatabaseConfiguration {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  getDatabaseConfig(_pluginId: string): Config {
    return this.config;
  }

  getAdminConfig(): Config {
    return this.config;
  }
}

export class SingleDatabaseManager implements PluginDatabaseManager {
  private readonly config: DatabaseConfiguration;

  constructor(config: DatabaseConfiguration) {
    this.config = config;
  }

  getDatabaseFactory(pluginId: string): PluginDatabaseFactory {
    // eslint-disable-next-line no-use-before-define
    return new SinglePluginDatabaseFactory(this, pluginId);
  }

  async getDatabase(pluginId: string, suffix?: string): Promise<Knex> {
    const config = this.config.getDatabaseConfig(pluginId);
    const overrides = SingleDatabaseManager.getDatabaseOverrides(
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
    const config = this.config.getAdminConfig();
    await ensureDatabaseExists(config, database);
  }
}

export class SinglePluginDatabaseFactory implements PluginDatabaseFactory {
  private manager: SingleDatabaseManager;
  private readonly pluginId: string;

  constructor(manager: SingleDatabaseManager, pluginId: string) {
    this.manager = manager;
    this.pluginId = pluginId;
  }

  getDatabase(database?: string): Promise<Knex> {
    return this.manager.getDatabase(this.pluginId, database);
  }
}
