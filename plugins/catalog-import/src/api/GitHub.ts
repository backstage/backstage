/*
 * Copyright 2020 Spotify AB
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

import { ConfigApi } from '@backstage/core';
import { ScmIntegrations } from '@backstage/integration';
import parseGitUrl from 'git-url-parse';

export const getGithubIntegrationConfig = (
  config: ConfigApi,
  location: string,
) => {
  const { name: repo, owner } = parseGitUrl(location);

  const scmIntegrations = ScmIntegrations.fromConfig(config);
  const githubIntegrationConfig = scmIntegrations.github.byUrl(location);

  if (!githubIntegrationConfig) {
    return undefined;
  }

  return {
    repo,
    owner,
    githubIntegrationConfig: githubIntegrationConfig.config,
  };
};
