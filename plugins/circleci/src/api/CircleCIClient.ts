/*
 * Copyright 2020 The Backstage Authors
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

import { ResponseError } from '@backstage/errors';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  Build,
  PipelineListResponse,
  RerunWorkflowResponse,
  Workflow,
  WorkflowJobListResponse,
  WorkflowListResponse,
} from '../types';
import { CircleCIApi } from './CircleCIApi';

const DEFAULT_PROXY_PATH = '/circleci/api';

export class CircleCIClient implements CircleCIApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly proxyPath: string;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    /**
     * Path to use for requests via the proxy, defaults to /circleci/api
     */
    proxyPath?: string;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.proxyPath = options.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  private async callApi<T>(
    path: string,
    options?: {
      query?: { [key in string]: any };
      format?: string;
      method?: string;
    },
  ): Promise<T> {
    const apiUrl = await this.getApiUrl();
    const queryParams = options?.query
      ? `?${new URLSearchParams(options?.query).toString()}`
      : '';
    const response = await this.fetchApi.fetch(
      `${apiUrl}/${path}${queryParams}`,
      { method: options?.method || 'GET' },
    );

    if (!response.ok) throw await ResponseError.fromResponse(response);

    if (options?.format === 'text') {
      return response.text() as T;
    }

    return (await response.json()) as T;
  }

  async rerunWorkflow(workflowId: string): Promise<RerunWorkflowResponse> {
    return this.callApi<RerunWorkflowResponse>(
      `v2/workflow/${workflowId}/rerun`,
      {
        method: 'POST',
      },
    );
  }

  async getPipelinesForProject(
    projectSlug: string,
    pageToken?: string,
  ): Promise<PipelineListResponse> {
    return this.callApi<PipelineListResponse>(
      `v2/project/${projectSlug}/pipeline`,
      {
        query: { ...(pageToken && { 'page-token': pageToken }) },
      },
    );
  }

  async getWorkflowsForPipeline(
    pipelineId: string,
    pageToken?: string,
  ): Promise<WorkflowListResponse> {
    return this.callApi<WorkflowListResponse>(
      `v2/pipeline/${pipelineId}/workflow`,
      {
        query: { ...(pageToken && { 'page-token': pageToken }) },
      },
    );
  }

  async getWorkflow(workflowId: string): Promise<Workflow> {
    return this.callApi<Workflow>(`v2/workflow/${workflowId}`);
  }

  async getWorkflowJobs(
    workflowId: string,
    pageToken?: string,
  ): Promise<WorkflowJobListResponse> {
    return this.callApi<WorkflowJobListResponse>(
      `v2/workflow/${workflowId}/job`,
      {
        query: { ...(pageToken && { 'page-token': pageToken }) },
      },
    );
  }

  async getBuild(projectSlug: string, buildNumber: number): Promise<Build> {
    return this.callApi<Build>(`v1.1/project/${projectSlug}/${buildNumber}`);
  }

  async getStepOutput(
    projectSlug: string,
    buildNumber: number,
    index: number,
    step: number,
  ): Promise<string> {
    return this.callApi<string>(
      `private/output/raw/${projectSlug}/${buildNumber}/output/${index}/${step}`,
      { format: 'text' },
    );
  }

  private async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
