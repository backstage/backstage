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
import parseGitUrl from 'git-url-parse';
import { Config } from '@backstage/config';
import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';

export function getGitHost(url: string): string {
  const { resource } = parseGitUrl(url);
  return resource;
}

export function getGitRepoType(url: string): string {
  const typeMapping = [
    { url: /github*/g, type: 'github' },
    { url: /gitlab*/g, type: 'gitlab' },
    { url: /azure*/g, type: 'azure/api' },
  ];

  const type = typeMapping.filter(item => item.url.test(url))[0]?.type;

  return type;
}

export function getGithubHostToken(
  config: Config,
  host: string,
): string | undefined {
  const providerConfigs =
    config.getOptionalConfigArray('integrations.github') ?? [];

  const hostConfig = providerConfigs.filter(
    providerConfig => providerConfig.getOptionalString('host') === host,
  );
  const token =
    hostConfig[0]?.getOptionalString('token') ??
    config.getOptionalString('catalog.processors.github.privateToken') ??
    config.getOptionalString('catalog.processors.githubApi.privateToken') ??
    process.env.GITHUB_TOKEN;

  return token;
}

export function getGitlabHostToken(
  config: Config,
  host: string,
): string | undefined {
  const providerConfigs =
    config.getOptionalConfigArray('integrations.gitlab') ?? [];

  const hostConfig = providerConfigs.filter(
    providerConfig => providerConfig.getOptionalString('host') === host,
  );
  const token =
    hostConfig[0]?.getOptionalString('token') ??
    config.getOptionalString('catalog.processors.gitlab.privateToken') ??
    config.getOptionalString('catalog.processors.gitlabApi.privateToken') ??
    process.env.GITLAB_TOKEN;

  return token;
}

export function getAzureHostToken(
  config: Config,
  host: string,
): string | undefined {
  const providerConfigs =
    config.getOptionalConfigArray('integrations.azure') ?? [];

  const hostConfig = providerConfigs.filter(
    providerConfig => providerConfig.getOptionalString('host') === host,
  );
  const token =
    hostConfig[0]?.getOptionalString('token') ??
    config.getOptionalString('catalog.processors.azureApi.privateToken') ??
    process.env.AZURE_TOKEN;

  return token;
}

export const getTokenForGitRepo = async (
  repositoryUrl: string,
): Promise<string | undefined> => {
  // TODO(Rugvip): Config should not be loaded here, pass it in instead
  const config = await loadBackendConfig({
    logger: getRootLogger(),
    argv: process.argv,
  });

  const host = getGitHost(repositoryUrl);
  const type = getGitRepoType(repositoryUrl);

  try {
    switch (type) {
      case 'github':
        return getGithubHostToken(config, host);
      case 'gitlab':
        return getGitlabHostToken(config, host);
      case 'azure/api':
        return getAzureHostToken(config, host);

      default:
        throw new Error('Failed to get repository type');
    }
  } catch (error) {
    throw error;
  }
};
