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

import { readSchedulerServiceTaskScheduleDefinitionFromConfig } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { AzureDevOpsConfig, AzureBlobStorageConfig } from './types';

const DEFAULT_PROVIDER_ID = 'default';

export function readAzureDevOpsConfigs(config: Config): AzureDevOpsConfig[] {
  const configs: AzureDevOpsConfig[] = [];

  const providerConfigs = config.getOptionalConfig(
    'catalog.providers.azureDevOps',
  );

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readAzureDevOpsConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}

function readAzureDevOpsConfig(id: string, config: Config): AzureDevOpsConfig {
  const organization = config.getString('organization');
  const project = config.getString('project');
  const host = config.getOptionalString('host') || 'dev.azure.com';
  const repository = config.getOptionalString('repository') || '*';
  const branch = config.getOptionalString('branch');
  const path = config.getOptionalString('path') || '/catalog-info.yaml';

  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : undefined;

  return {
    id,
    host,
    organization,
    project,
    repository,
    branch,
    path,
    schedule,
  };
}

export function readAzureBlobStorageConfigs(
  config: Config,
): AzureBlobStorageConfig[] {
  const configs: AzureBlobStorageConfig[] = [];

  const providerConfigs = config.getOptionalConfig(
    'catalog.providers.azureBlob',
  );

  if (!providerConfigs) {
    return configs;
  }

  if (providerConfigs.has('containerName')) {
    // simple/single config variant
    configs.push(
      readAzureBlobStorageConfig(DEFAULT_PROVIDER_ID, providerConfigs),
    );

    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readAzureBlobStorageConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}

function readAzureBlobStorageConfig(
  id: string,
  config: Config,
): AzureBlobStorageConfig {
  const containerName = config.getString('containerName');
  const accountName = config.getString('accountName');
  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : undefined;

  return {
    id,
    containerName,
    accountName,
    schedule,
  };
}
