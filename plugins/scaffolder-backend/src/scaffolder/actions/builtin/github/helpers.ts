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
import { InputError } from '@backstage/errors';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { OctokitOptions } from '@octokit/core/dist-types/types';
import { parseRepoUrl } from '../publish/util';

const DEFAULT_TIMEOUT_MS = 60_000;

export async function getOctokitOptions(options: {
  integrations: ScmIntegrationRegistry;
  credentialsProvider?: GithubCredentialsProvider;
  token?: string;
  repoUrl: string;
}): Promise<OctokitOptions> {
  const { integrations, credentialsProvider, repoUrl, token } = options;
  const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

  const requestOptions = {
    // set timeout to 60 seconds
    timeout: DEFAULT_TIMEOUT_MS,
  };

  if (!owner) {
    throw new InputError(`No owner provided for repo ${repoUrl}`);
  }

  const integrationConfig = integrations.github.byHost(host)?.config;

  if (!integrationConfig) {
    throw new InputError(`No integration for host ${host}`);
  }

  // short circuit the `githubCredentialsProvider` if there is a token provided by the caller already
  if (token) {
    return {
      auth: token,
      baseUrl: integrationConfig.apiBaseUrl,
      previews: ['nebula-preview'],
      request: requestOptions,
    };
  }

  const githubCredentialsProvider =
    credentialsProvider ??
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  // TODO(blam): Consider changing this API to take host and repo instead of repoUrl, as we end up parsing in this function
  // and then parsing in the `getCredentials` function too the other side
  const { token: credentialProviderToken } =
    await githubCredentialsProvider.getCredentials({
      url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo,
      )}`,
    });

  if (!credentialProviderToken) {
    throw new InputError(
      `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
    );
  }

  return {
    auth: credentialProviderToken,
    baseUrl: integrationConfig.apiBaseUrl,
    previews: ['nebula-preview'],
  };
}
