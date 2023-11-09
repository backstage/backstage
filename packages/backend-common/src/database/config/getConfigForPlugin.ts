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
import { getAdditionalKnexConfig } from './getAdditionalKnexConfig';
import { getClientType } from './getClientType';
import { getConnectionConfig } from './getConnectionConfig';
import { getRoleConfig } from './getRoleConfig';

/**
 * Provides a Knex database config for a given plugin.
 *
 * This method provides a Knex configuration object along with the plugin's
 * client type.
 *
 * @param config - The database config root
 * @param pluginId - The plugin that the database config should correspond with
 */
export function getConfigForPlugin(
  config: Config,
  pluginId: string,
): Knex.Config {
  const { client } = getClientType(config, pluginId);
  const role = getRoleConfig(config, pluginId);

  return {
    ...getAdditionalKnexConfig(config, pluginId),
    client,
    connection: getConnectionConfig(config, pluginId),
    ...(role && { role }),
  };
}
