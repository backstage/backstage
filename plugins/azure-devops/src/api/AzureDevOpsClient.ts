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

import { AzureDevOpsApi } from './AzureDevOpsApi';
import { RepoBuild } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { AzureDevOpsClientError } from './AzureDevOpsClientError';

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

  async getRepoBuilds(
    projectName: string,
    repoName: string,
    top: number,
  ): Promise<RepoBuild[]> {
    return await this.get(`/repo-builds/${projectName}/${repoName}?top=${top}`);
  }

  private async get(path: string): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('azure-devops');
    const url = `${baseUrl}/${path}`;

    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(url, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new AzureDevOpsClientError(response, payload);
    }

    return await response.json();
  }
}
