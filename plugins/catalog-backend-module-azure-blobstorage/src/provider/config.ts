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

import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { AzureBlobStorageConfig } from '../../config';

export function readAzureBlobStorageConfigs(
  config: Config,
): AzureBlobStorageConfig[] {
  const configs: AzureBlobStorageConfig[] = [];

  const providerStorageConfigs = config.getOptionalConfig(
    'catalog.providers.azureBlobStorage',
  );

  if (!providerStorageConfigs) {
    return configs;
  }

  if (providerStorageConfigs.has('accountName')) {
    configs.push(readAzureBlobStorageConfig('default', providerStorageConfigs));
    return configs;
  }

  for (const id of providerStorageConfigs.keys()) {
    configs.push(
      readAzureBlobStorageConfig(id, providerStorageConfigs.getConfig(id)),
    );
  }

  return configs;
}

function readAzureBlobStorageConfig(
  id: string,
  config: Config,
): AzureBlobStorageConfig {
  const accountName = config.getString('accountName');
  const containerName = config.getString('containerName');
  const prefix = config.getOptionalString('prefix');
  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;
  return {
    id,
    accountName,
    containerName,
    prefix,
    schedule,
  };
}
