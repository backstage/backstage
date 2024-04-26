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
import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  FetchProjectsResponse,
  Project,
  FetchAnalysesResponse,
  Analysis,
} from './types';

export const codesceneApiRef = createApiRef<CodeSceneApi>({
  id: 'plugin.codescene.service',
});

export interface CodeSceneApi {
  fetchProjects(): Promise<FetchProjectsResponse>;
  fetchProject(projectId: number): Promise<Project>;
  fetchAnalyses(projectId: number): Promise<FetchAnalysesResponse>;
  fetchLatestAnalysis(projectId: number): Promise<Analysis>;
}

type Options = {
  discoveryApi: DiscoveryApi;
};

export class CodeSceneClient implements CodeSceneApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
  }

  async fetchProjects(): Promise<FetchProjectsResponse> {
    return this.fetchFromApi('projects');
  }

  async fetchProject(projectId: number): Promise<Project> {
    return this.fetchFromApi(`projects/${projectId}`);
  }

  async fetchAnalyses(projectId: number): Promise<FetchAnalysesResponse> {
    return this.fetchFromApi(`projects/${projectId}/analyses`);
  }

  async fetchLatestAnalysis(projectId: number): Promise<Analysis> {
    return this.fetchFromApi(`projects/${projectId}/analyses/latest`);
  }

  private async fetchFromApi(path: string): Promise<any> {
    const apiUrl = await this.getApiUrl();
    const res = await fetch(`${apiUrl}/${path}`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    return await res.json();
  }

  private async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxyUrl}/codescene-api`;
  }
}
