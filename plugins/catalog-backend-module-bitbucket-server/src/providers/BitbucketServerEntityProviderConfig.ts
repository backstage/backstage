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

import {
  readTaskScheduleDefinitionFromConfig,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { Config } from '@backstage/config';

const DEFAULT_CATALOG_PATH = '/catalog-info.yaml';
const DEFAULT_PROVIDER_ID = 'default';

export type BitbucketServerEntityProviderConfig = {
  id: string;
  host: string;
  catalogPath: string;
  filters?: {
    projectKey?: RegExp;
    repoSlug?: RegExp;
  };
  schedule?: TaskScheduleDefinition;
};

export function readProviderConfigs(
  config: Config,
): BitbucketServerEntityProviderConfig[] {
  const providersConfig = config.getOptionalConfig(
    'catalog.providers.bitbucketServer',
  );
  if (!providersConfig) {
    return [];
  }
  if (providersConfig.has('host')) {
    // simple/single config variant
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }

  return providersConfig.keys().map(id => {
    const providerConfig = providersConfig.getConfig(id);

    return readProviderConfig(id, providerConfig);
  });
}

function readProviderConfig(
  id: string,
  config: Config,
): BitbucketServerEntityProviderConfig {
  const host = config.getString('host');
  const catalogPath =
    config.getOptionalString('catalogPath') ?? DEFAULT_CATALOG_PATH;
  const projectKeyPattern = config.getOptionalString('filters.projectKey');
  const repoSlugPattern = config.getOptionalString('filters.repoSlug');

  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;

  return {
    id,
    host,
    catalogPath,
    filters: {
      projectKey: projectKeyPattern ? new RegExp(projectKeyPattern) : undefined,
      repoSlug: repoSlugPattern ? new RegExp(repoSlugPattern) : undefined,
    },
    schedule,
  };
}
