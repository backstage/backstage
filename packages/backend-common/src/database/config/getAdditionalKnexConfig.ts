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
import { merge } from 'lodash';

/**
 * Provides the knexConfig which should be used for a given plugin.
 *
 * @param config - The database config root
 * @param pluginId - Plugin to get the knexConfig for
 * @returns The merged knexConfig value or undefined if it isn't specified
 */
export function getAdditionalKnexConfig(
  config: Config,
  pluginId: string,
): Partial<Knex.Config> | undefined {
  const pluginConfig = config
    .getOptionalConfig(`plugin.${pluginId}.knexConfig`)
    ?.get<Partial<Knex.Config>>();

  const baseConfig = config
    .getOptionalConfig('knexConfig')
    ?.get<Partial<Knex.Config>>();

  return merge(baseConfig, pluginConfig);
}
