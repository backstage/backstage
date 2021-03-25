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
import { createApiRef, DiscoveryApi } from '@backstage/core';
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
  description: 'Used by the Github Deployments plugin to make requests',
});

export type Options = {
  discoveryApi: DiscoveryApi;
  proxyPath?: string;
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
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
  }

  private async getProxyUrl() {
    return await this.discoveryApi.getBaseUrl('proxy');
  }

  async listDeployments(options: {
    owner: string;
    repo: string;
    last: number;
  }): Promise<GithubDeployment[]> {
    const proxyUrl = await this.getProxyUrl();
    const graphQlWithBaseURL = graphql.defaults({
      baseUrl: `${proxyUrl}/github/api`,
    });

    const response: any = await graphQlWithBaseURL(deploymentsQuery, options);
    return response.repository?.deployments?.nodes?.reverse() || [];
  }
}
