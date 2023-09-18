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
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { JiraResponse } from '@backstage/plugin-jira-dashboard-common';
import { JiraDashboardApi } from './JiraDashboardApi';
import { ResponseError } from '@backstage/errors';

export class JiraDashboardClient implements JiraDashboardApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getJiraResponseByEntity(entityRef: string): Promise<JiraResponse> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    const resp = await this.fetchApi.fetch(
      `${apiUrl}/${encodeURIComponent(entityRef)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!resp.ok) throw await ResponseError.fromResponse(resp);
    return resp.json();
  }

  async getProjectAvatar(entityRef: string): Promise<string> {
    const apiUrl = await this.discoveryApi.getBaseUrl('jira-dashboard');
    return `${apiUrl}/avatar/${encodeURIComponent(entityRef)}`;
  }
}
