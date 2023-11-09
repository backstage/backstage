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
import { omit } from 'lodash';
import { normalizeConnection } from '../connection';
import { getClientType } from './getClientType';
import { getPluginDivisionModeConfig } from './getPluginDivisionModeConfig';

/**
 * Provides a Knex connection plugin config by combining base and plugin
 * config.
 *
 * This method provides a baseConfig for a plugin database connector. If the
 * client type has not been overridden, the global connection config will be
 * included with plugin specific config as the base. Values from the plugin
 * connection take precedence over the base. Base database name is omitted for
 * all supported databases excluding SQLite unless `pluginDivisionMode` is set
 * to `schema`.
 */
export function getConnectionConfig(
  config: Config,
  pluginId: string,
): Knex.StaticConnectionConfig {
  const { client, overridden } = getClientType(config, pluginId);

  let baseConnection = normalizeConnection(
    config.get('connection'),
    config.getString('client'),
  );

  if (
    client.includes('sqlite3') &&
    'filename' in baseConnection &&
    baseConnection.filename !== ':memory:'
  ) {
    throw new Error(
      '`connection.filename` is not supported for the base sqlite connection. Prefer `connection.directory` or provide a filename for the plugin connection instead.',
    );
  }

  // Databases cannot be shared unless the `pluginDivisionMode` is set to `schema`. The
  // `database` property from the base connection is omitted unless `pluginDivisionMode`
  // is set to `schema`. SQLite3's `filename` property is an exception as this is used as a
  // directory elsewhere so we preserve `filename`.
  if (getPluginDivisionModeConfig(config) !== 'schema') {
    baseConnection = omit(baseConnection, 'database');
  }

  // get and normalize optional plugin specific database connection
  const connection = normalizeConnection(
    config.getOptional(`plugin.${pluginId}.connection`),
    client,
  );

  if (client === 'pg') {
    (
      baseConnection as Knex.PgConnectionConfig
    ).application_name ||= `backstage_plugin_${pluginId}`;
  }

  return {
    // include base connection if client type has not been overridden
    ...(overridden ? {} : baseConnection),
    ...connection,
  } as Knex.StaticConnectionConfig;
}
