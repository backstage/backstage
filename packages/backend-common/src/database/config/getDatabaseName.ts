/*
 * Copyright 2023 The Backstage Authors
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

import { Config } from '@backstage/config';
import { Knex } from 'knex';
import path from 'path';
import { getClientType } from './getClientType';
import { getConnectionConfig } from './getConnectionConfig';
import { getPluginDivisionModeConfig } from './getPluginDivisionModeConfig';

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
export function getDatabaseName(
  config: Config,
  pluginId: string,
): string | undefined {
  const prefix = config.getOptionalString('prefix') ?? 'backstage_plugin_';
  const connection = getConnectionConfig(config, pluginId);

  if (getClientType(config, pluginId).client.includes('sqlite3')) {
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

  const databaseName = (connection as Knex.ConnectionConfig)?.database;

  // `pluginDivisionMode` as `schema` should use overridden databaseName if supplied or fallback to default knex database
  if (getPluginDivisionModeConfig(config) === 'schema') {
    return databaseName;
  }

  // all other supported databases should fallback to an auto-prefixed name
  return databaseName ?? `${prefix}${pluginId}`;
}
