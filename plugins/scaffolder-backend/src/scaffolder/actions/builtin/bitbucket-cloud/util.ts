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
import { parseRepoUrl } from '../publish/util';
import { ScmIntegrationRegistry } from '@backstage/integration';

const getAuthorizationHeader = (config: {
  username?: string;
  appPassword?: string;
  token?: string;
}) => {
  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );

    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket Cloud. Please add either username + appPassword to the Integrations config or a user login auth token`,
  );
};

export function getBitbucketCloudConfig(config: {
  repoUrl: string;
  token?: string;
  integrations: ScmIntegrationRegistry;
}) {
  const { workspace, project, repo, host } = parseRepoUrl(
    config.repoUrl,
    config.integrations,
  );

  if (!workspace) {
    throw new InputError(
      `Invalid URL provider was included in the repo URL to create ${config.repoUrl}, missing workspace`,
    );
  }

  if (!project) {
    throw new InputError(
      `Invalid URL provider was included in the repo URL to create ${config.repoUrl}, missing project`,
    );
  }

  const integrationConfig = config.integrations.bitbucketCloud.byHost(host);
  if (!integrationConfig) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  const authorization = getAuthorizationHeader(
    config.token ? { token: config.token } : integrationConfig.config,
  );

  const apiBaseUrl = integrationConfig.config.apiBaseUrl;

  return {
    apiBaseUrl: apiBaseUrl,
    authorization: authorization,
    integrationConfig: integrationConfig,
    project: project,
    repo: repo,
    workspace: workspace,
  };
}
