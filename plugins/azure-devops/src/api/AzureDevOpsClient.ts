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

import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import {
  PullRequest,
  PullRequestOptions,
  RepoBuild,
  RepoBuildOptions,
} from '@backstage/plugin-azure-devops-common';

import { AzureDevOpsApi } from './AzureDevOpsApi';
import { ResponseError } from '@backstage/errors';

export class AzureDevOpsClient implements AzureDevOpsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  public async getRepoBuilds(
    projectName: string,
    repoName: string,
    options?: RepoBuildOptions,
  ): Promise<{ items: RepoBuild[] }> {
    const items = await this.get<RepoBuild[]>(
      `repo-builds/${projectName}/${repoName}?top=${options?.top}`,
    );
    return { items };
  }

  public async getPullRequests(
    projectName: string,
    repoName: string,
    options?: PullRequestOptions,
  ): Promise<{ items: PullRequest[] }> {
    const items = await this.get<PullRequest[]>(
      `pull-requests/${projectName}/${repoName}?top=${options?.top}&status=${options?.status}`,
    );
    return { items };
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('azure-devops')}/`;
    const url = new URL(path, baseUrl);

    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(url.toString(), {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
