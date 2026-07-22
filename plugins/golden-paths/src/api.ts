/*
 * Copyright 2026 The Backstage Authors
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
import { parseEntityRef } from '@backstage/catalog-model';
import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  CreateTemplateOptions,
  GetTemplateEventStreamOptions,
  GetTemplateStepIdOptions,
  GetTemplateStepIdResponse,
  GoldenPathParameterSchema,
  GoldenPathsApi,
  GoldenPathsListStepResponse,
  GoldenPathsListTasksOptions,
  GoldenPathsListTasksResponse,
  GoldenPathsStartOptions,
  GoldenPathsStartResponse,
  GoldenPathStatuses,
  GoldenPathTask,
  UpdateStatusOptions,
} from '@backstage/plugin-golden-paths-react';
import queryString from 'qs';

/**
 * An API to interact with the Golden Paths backend.
 *
 * @public
 */
export class GoldenPathsClient implements GoldenPathsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly identityApi?: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi?: FetchApi;
    identityApi?: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi ?? { fetch };
    this.identityApi = options.identityApi;
  }

  private async getBaseUrl() {
    return await this.discoveryApi.getBaseUrl('golden-paths');
  }

  async getGoldenPathParameterSchema(
    goldenPathRef: string,
  ): Promise<GoldenPathParameterSchema> {
    const { namespace, kind, name } = parseEntityRef(goldenPathRef, {
      defaultKind: 'GoldenPath',
    });

    const baseUrl = await this.getBaseUrl();
    const entityPath = [namespace, kind, name]
      .map(text => encodeURIComponent(text))
      .join('/');
    const url = `${baseUrl}/goldenpaths/${entityPath}/parameter-schema`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const schema: GoldenPathParameterSchema = await response.json();
    return schema;
  }

  async startGoldenPath(
    options: GoldenPathsStartOptions,
  ): Promise<GoldenPathsStartResponse> {
    const { goldenPathRef, values } = options;
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goldenPathRef,
        values: { ...values },
      }),
    });

    if (response.status !== 201) {
      const status = `${response.status} ${response.statusText}`;
      const body = await response.text();
      throw new Error(`Backend request failed, ${status} ${body.trim()}`);
    }

    const { id } = (await response.json()) as { id: string };
    return { taskId: id };
  }

  async getTask(taskId: string): Promise<GoldenPathTask> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(taskId)}`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async createTemplate({
    taskId,
    templateId,
    templateRef,
    values,
    secrets,
  }: CreateTemplateOptions) {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(
      taskId,
    )}/templates/${encodeURIComponent(templateId)}`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateRef,
        values: { ...values },
        secrets,
      }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return;
  }

  async getTemplateStepId({
    taskId,
    templateId,
  }: GetTemplateStepIdOptions): Promise<GetTemplateStepIdResponse> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(
      taskId,
    )}/templates/${encodeURIComponent(templateId)}`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async getTemplateOutputs(taskId: string): Promise<Record<string, any>> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(taskId)}/outputs`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async getTemplateEventStream({
    stepId,
    taskId,
  }: GetTemplateEventStreamOptions) {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(
      taskId,
    )}/steps/${encodeURIComponent(stepId)}/eventstream`;

    const response = await this.fetchApi.fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok || !response.body) {
      throw await ResponseError.fromResponse(response);
    }

    return response.body;
  }

  async getStatuses(taskId: string): Promise<GoldenPathStatuses> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(taskId)}/statuses`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async updateStatus({
    taskId,
    templateId,
    status,
  }: UpdateStatusOptions): Promise<{ status: string }> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${encodeURIComponent(
      taskId,
    )}/templates/${encodeURIComponent(templateId)}/status`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
      }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async listTasks(
    options: GoldenPathsListTasksOptions,
  ): Promise<GoldenPathsListTasksResponse> {
    if (!this.identityApi) {
      throw new Error(
        'IdentityApi is not available in the GoldenPathsClient, please pass through the IdentityApi to the GoldenPathsClient constructor in order to use the listTasks method',
      );
    }
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks`;
    const { userEntityRef } = await this.identityApi.getBackstageIdentity();

    const query = queryString.stringify({
      createdBy:
        options.filterByOwnership === 'owned' ? userEntityRef : undefined,
      limit: options.limit,
      offset: options.offset,
    });

    const response = await this.fetchApi.fetch(`${url}?${query}`);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async listGoldenPathSteps(id: string): Promise<GoldenPathsListStepResponse> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${id}/statuses`;

    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async cancelGoldenPathExecution(taskId: string): Promise<{ status: string }> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${taskId}/cancel`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async completeGoldenPath(taskId: string): Promise<{ status: string }> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}/tasks/${taskId}/complete`;

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }
}
