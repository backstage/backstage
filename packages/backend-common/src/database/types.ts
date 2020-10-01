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

import knex from 'knex';
import { Config } from '@backstage/config';

/**
 * DatabaseConfiguration exposes the Application configuration to PluginDatabaseManager instances.
 */
export interface DatabaseConfiguration {
  /**
   * Returns the database configuration for the given Plugin.
   */
  getDatabaseConfig(pluginId: string): Config;

  /**
   * Returns the database configuration for administrating the database server.
   */
  getAdminConfig(): Config;
}

/**
 * The PluginDatabaseManager produces PluginDatabaseFactory objects for plugins to consume and store their data.
 */
export type PluginDatabaseManager = {
  /**
   * getDatabaseFactory returns the database factory object for plugins to obtain database connections.
   */
  getDatabaseFactory(pluginId: string): PluginDatabaseFactory;
};

/**
 * The PluginDatabaseFactory is used to provide a mechanism for backend plugins to obtain database connections for
 * itself.
 *
 * The purpose of this factory is to allow plugins to get isolated data stores so that plugins are discouraged from database integration.
 */
export type PluginDatabaseFactory = {
  /**
   * Returns a database connection. Plugins can omit the `database` parameter to get the default plugin database, or
   * provide an identifier that will be used to identify a separate database from the default.
   *
   * Plugins completely own and manage the state of the database (including schema/migrations/data.)
   */
  getDatabase(database?: String): Promise<knex>;
};
