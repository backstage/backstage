/*
 * Copyright 2021 Spotify AB
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
import { ConfigApi, createApiRef, OAuthApi } from '@backstage/core';
import { graphql } from '@octokit/graphql';

export type GithubDeployment = {
  environment: string;
  state: string;
  updatedAt: string;
  commit: {
    abbreviatedOid: string;
    commitUrl: string;
  };
};

export interface GithubDeploymentsApi {
  listDeployments(options: {
    owner: string;
    repo: string;
    last: number;
  }): Promise<GithubDeployment[]>;
}

export const githubDeploymentsApiRef = createApiRef<GithubDeploymentsApi>({
  id: 'plugin.github-deployments.service',
  description: 'Used by the GitHub Deployments plugin to make requests',
});

export type Options = {
  configApi: ConfigApi;
  githubAuthApi: OAuthApi;
};

const deploymentsQuery = `
query lastDeployments($owner: String!, $repo: String!, $last: Int) {
  repository(owner: $owner, name: $repo) {
    deployments(last: $last) {
      nodes {
        state
        environment
        updatedAt
        commit {
          abbreviatedOid
          commitUrl
        }
      }
    }
  }
}
`;

export class GithubDeploymentsApiClient implements GithubDeploymentsApi {
  private readonly configApi: ConfigApi;
  private readonly githubAuthApi: OAuthApi;

  constructor(options: Options) {
    this.configApi = options.configApi;
    this.githubAuthApi = options.githubAuthApi;
  }

  private getBaseUrl() {
    const providerConfigs =
      this.configApi.getOptionalConfigArray('integrations.github') ?? [];
    const targetProviderConfig = providerConfigs[0];
    return targetProviderConfig?.getOptionalString('apiBaseUrl');
  }

  async listDeployments(options: {
    owner: string;
    repo: string;
    last: number;
  }): Promise<GithubDeployment[]> {
    const token = await this.githubAuthApi.getAccessToken(['repo']);
    const baseUrl = this.getBaseUrl() || 'https://api.github.com';

    const graphQLWithAuth = graphql.defaults({
      baseUrl,
      headers: {
        authorization: `token ${token}`,
      },
    });

    const response: any = await graphQLWithAuth(deploymentsQuery, options);
    return response.repository?.deployments?.nodes?.reverse() || [];
  }
}
