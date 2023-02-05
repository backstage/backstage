/*
 * Copyright 2021 The Backstage Authors
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

import {
  readTaskScheduleDefinitionFromConfig,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { DEFAULT_PROVIDER_ID } from './constants';

/**
 * Configuration of {@link PuppetDBEntityProvider}.
 *
 * @public
 */
export type PuppetDBEntityProviderConfig = {
  /**
   * ID of the provider.
   */
  id: string;
  /**
   * (Required) The host of PuppetDB API instance.
   */
  host: string;
  /**
   * (Optional) PQL query to filter PuppetDB nodes.
   */
  query?: string;
  /**
   * (Optional) Task schedule definition for the refresh.
   */
  schedule?: TaskScheduleDefinition;
};

/**
 * Reads the configuration of the PuppetDB Entity Providers.
 *
 * @param config - The application configuration.
 *
 * @returns PuppetDB Entity Provider configurations list.
 */
export function readProviderConfigs(
  config: Config,
): PuppetDBEntityProviderConfig[] {
  const providersConfig = config.getOptionalConfig(
    'catalog.providers.puppetdb',
  );
  if (!providersConfig) {
    return [];
  }

  if (providersConfig.has('host')) {
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }

  return providersConfig.keys().map(id => {
    return readProviderConfig(id, providersConfig.getConfig(id));
  });
}

/**
 * Reads the configuration for the PuppetDB Entity Provider.
 *
 * @param id - ID of the provider.
 * @param config - The application configuration.
 *
 * @returns The PuppetDB Entity Provider configuration.
 */
function readProviderConfig(
  id: string,
  config: Config,
): PuppetDBEntityProviderConfig {
  const host = config.getString('host').replace(/\/+$/, '');
  const query = config.getOptionalString('query');

  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;

  return {
    id,
    host,
    query,
    schedule,
  };
}
