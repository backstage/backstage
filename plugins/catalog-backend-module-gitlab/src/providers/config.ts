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
import { GitlabProviderConfig } from '../lib';
import { Logger } from 'winston';

/**
 * Extracts the gitlab config from a config object
 *
 * @public
 *
 * @param id - The provider key
 * @param config - The config object to extract from
 * @param logger - The logger
 */
function readGitlabConfig(
  id: string,
  config: Config,
  logger: Logger,
): GitlabProviderConfig {
  const group = config.getOptionalString('group') ?? '';
  const host = config.getString('host');
  const branch = config.getOptionalString('branch');
  const fallbackBranch = config.getOptionalString('fallbackBranch') ?? 'master';
  const catalogFile =
    config.getOptionalString('entityFilename') ?? 'catalog-info.yaml';
  const projectPattern = new RegExp(
    config.getOptionalString('projectPattern') ?? /[\s\S]*/,
  );
  const userPattern = new RegExp(
    config.getOptionalString('userPattern') ?? /[\s\S]*/,
  );
  const groupPattern = new RegExp(
    config.getOptionalString('groupPattern') ?? /[\s\S]*/,
  );
  const orgEnabled: boolean = config.getOptionalBoolean('orgEnabled') ?? false;

  const schedule = config.has('schedule')
    ? readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'))
    : undefined;

  return {
    id,
    group,
    branch,
    fallbackBranch,
    host,
    catalogFile,
    projectPattern,
    userPattern,
    groupPattern,
    schedule,
    orgEnabled,
  };
}

/**
 * Extracts the gitlab config from a config object array
 *
 * @public
 *
 * @param config - The config object to extract from
 * @param logger - The logger
 */
export function readGitlabConfigs(
  config: Config,
  logger: Logger,
): GitlabProviderConfig[] {
  const configs: GitlabProviderConfig[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.gitlab');

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(
      readGitlabConfig(
        id,
        providerConfigs.getConfig(id),
        logger.child({ target: id }),
      ),
    );
  }

  return configs;
}
