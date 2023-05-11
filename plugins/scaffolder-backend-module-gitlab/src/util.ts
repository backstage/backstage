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

import { InputError } from '@backstage/errors';
import {
  GitLabIntegration,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { z } from 'zod';
import commonGitlabConfig from './commonGitlabConfig';

export const parseRepoHost = (repoUrl: string): string => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  return parsed.host;
};

export const getToken = (
  config: z.infer<typeof commonGitlabConfig>,
  integrations: ScmIntegrationRegistry,
): { token: string; integrationConfig: GitLabIntegration } => {
  const host = parseRepoHost(config.repoUrl);
  const integrationConfig = integrations.gitlab.byHost(host);

  if (!integrationConfig) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  const token = config.token || integrationConfig.config.token!;
  const tokenType = config.token ? 'oauthToken' : 'token';

  if (tokenType === 'oauthToken') {
    throw new InputError(`OAuth Token is currently not supported`);
  }

  return { token: token, integrationConfig: integrationConfig };
};
