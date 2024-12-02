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
import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { ErrorLike, InputError, isError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Gitlab } from '@gitbeaker/rest';

export function createGitlabApi(options: {
  integrations: ScmIntegrationRegistry;
  token?: string;
  repoUrl: string;
}): InstanceType<typeof Gitlab> {
  const { integrations, token: providedToken, repoUrl } = options;

  const { host } = parseRepoUrl(repoUrl, integrations);

  const integrationConfig = integrations.gitlab.byHost(host);

  if (!integrationConfig) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  if (!integrationConfig.config.token && !providedToken) {
    throw new InputError(`No token available for host ${host}`);
  }

  const token = providedToken ?? integrationConfig.config.token!;
  const tokenType = providedToken ? 'oauthToken' : 'token';

  return new Gitlab({
    host: integrationConfig.config.baseUrl,
    [tokenType]: token,
  });
}

interface GitlabError extends ErrorLike {
  // Errors from Gitlab may also include a description field that contains additional info
  description: string;
}

function isGitlabError(e: unknown): e is GitlabError {
  return isError(e) && 'description' in e && typeof e.description === 'string';
}

export function getErrorMessage(e: unknown): string {
  if (isGitlabError(e)) return `${e} - ${e.description}`;
  return String(e);
}
