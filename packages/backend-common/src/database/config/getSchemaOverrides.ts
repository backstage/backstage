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
import { createSchemaOverride } from '../connection';
import { getClientType } from './getClientType';

/**
 * Provides a partial `Knex.Config` database schema override for a given
 * plugin.
 *
 * @param pluginId - Target plugin to get database schema override
 * @returns Partial `Knex.Config` with database schema override
 */
export function getSchemaOverrides(
  config: Config,
  pluginId: string,
): Knex.Config | undefined {
  return createSchemaOverride(getClientType(config, pluginId).client, pluginId);
}
