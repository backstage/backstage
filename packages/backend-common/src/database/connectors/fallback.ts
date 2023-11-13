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

import { LoggerService } from '@backstage/backend-plugin-api';
import knexFactory, { Knex } from 'knex';
import { merge } from 'lodash';
import { PluginDatabaseSettings } from '../DatabaseConfigReader';

/**
 * Creates a knex fallback database connection. This connector is only ever used
 * if an unknown driver (client parameter) is given in the database settings.
 */
export async function createFallbackDatabaseClient(
  settings: PluginDatabaseSettings,
  deps?: {
    logger?: LoggerService;
  },
): Promise<Knex> {
  deps?.logger?.warn(
    `Creating fallback database driver for plugin '${settings.plugin}' because the configured driver '${settings.client}' is not known. This may not support all features.`,
  );

  const knexConfig: Knex.Config = merge({}, settings.knexConfig ?? {}, {
    client: settings.client,
    connection: settings.connection,
  });

  return knexFactory(knexConfig);
}
