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

import { readGitHubIntegrationConfigs } from '@backstage/integration';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { Entity } from '@backstage/catalog-model';

import type { GithubCredentialsApi } from './github-credentials-api';
import { getEntitySourceLocationInfo } from '../utils';

export class GithubCredentials implements GithubCredentialsApi {
  private readonly configApi: ConfigApi;
  private readonly githubAuthApi: OAuthApi;

  constructor(options: { configApi: ConfigApi; githubAuthApi: OAuthApi }) {
    this.configApi = options.configApi;
    this.githubAuthApi = options.githubAuthApi;
  }

  public getIntegrations() {
    return readGitHubIntegrationConfigs(
      this.configApi.getOptionalConfigArray('integrations.github') ?? [],
    );
  }

  public getIntegration(hostnameOrUrl: string | URL) {
    const hostname =
      typeof hostnameOrUrl === 'string'
        ? hostnameOrUrl
        : hostnameOrUrl.hostname;

    const integrations = this.getIntegrations();
    const githubIntegrationConfig = integrations.find(v => v.host === hostname);

    if (!githubIntegrationConfig) {
      throw new NotFoundError(`Missing integrations with ${hostname}`);
    }

    const { apiBaseUrl, host } = githubIntegrationConfig;

    if (!apiBaseUrl) {
      throw new NotFoundError(
        `Missing 'baseUrl' for integration with ${hostname}`,
      );
    }

    return { baseUrl: apiBaseUrl, host };
  }

  public getIntegrationForEntity(entity: Entity) {
    const { url, repo, owner } = getEntitySourceLocationInfo(entity);

    const { baseUrl, host } = this.getIntegration(url);

    return { baseUrl, host, repo, owner };
  }

  public async getCredentials(hostname: string | URL, scopes: string[]) {
    const { baseUrl, host } = this.getIntegration(hostname);

    // TODO: Get access token for the specified hostname
    const token = await this.githubAuthApi.getAccessToken(scopes);

    return { baseUrl, host, token };
  }

  public async getCredentialsForEntity(entity: Entity, scopes: string[]) {
    const { url, repo, owner } = getEntitySourceLocationInfo(entity);

    const { baseUrl, host, token } = await this.getCredentials(url, scopes);

    return { baseUrl, host, token, repo, owner };
  }
}
