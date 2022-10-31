/*
 * Copyright 2022 The Backstage Authors
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

import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { GerritProviderConfig } from './types';

function readGerritConfig(id: string, config: Config): GerritProviderConfig {
  const branch = config.getOptionalString('branch') ?? 'master';
  const host = config.getString('host');
  const query = config.getString('query');

  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;

  return {
    branch,
    host,
    id,
    query,
    schedule,
  };
}

export function readGerritConfigs(config: Config): GerritProviderConfig[] {
  const configs: GerritProviderConfig[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.gerrit');

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readGerritConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}
