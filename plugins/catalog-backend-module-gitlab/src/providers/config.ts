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
import { GitlabProviderConfig } from '../lib';

/**
 * Extracts the gitlab config from a config object
 *
 * @public
 *
 * @param id - The provider key
 * @param config - The config object to extract from
 */
function readGitlabConfig(id: string, config: Config): GitlabProviderConfig {
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
  const allowInherited: boolean =
    config.getOptionalBoolean('allowInherited') ?? false;
  const relations: string[] = config.getOptionalStringArray('relations') ?? [];

  const skipForkedRepos: boolean =
    config.getOptionalBoolean('skipForkedRepos') ?? false;

  const includeArchivedRepos: boolean =
    config.getOptionalBoolean('includeArchivedRepos') ?? false;
  const excludeRepos: string[] =
    config.getOptionalStringArray('excludeRepos') ?? [];

  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : undefined;
  const restrictUsersToGroup =
    config.getOptionalBoolean('restrictUsersToGroup') ?? false;

  const includeUsersWithoutSeat =
    config.getOptionalBoolean('includeUsersWithoutSeat') ?? false;

  const membership = config.getOptionalBoolean('membership');

  const topicsArray = config.getOptionalStringArray('topics');
  const topics = topicsArray?.length ? topicsArray.join(',') : undefined;

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
    allowInherited,
    relations,
    skipForkedRepos,
    includeArchivedRepos,
    excludeRepos,
    restrictUsersToGroup,
    includeUsersWithoutSeat,
    membership,
    topics,
  };
}

/**
 * Extracts the gitlab config from a config object array
 *
 * @public
 *
 * @param config - The config object to extract from
 */
export function readGitlabConfigs(config: Config): GitlabProviderConfig[] {
  const configs: GitlabProviderConfig[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.gitlab');

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readGitlabConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}
