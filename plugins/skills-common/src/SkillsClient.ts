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

import { ResponseError } from '@backstage/errors';
import {
  RegisterSkillsRequest,
  Skill,
  SkillFile,
  SkillsApi,
  SkillsListRequest,
  SkillsListResponse,
  SkillsRequestOptions,
} from './types';

/**
 * Options for creating a {@link SkillsClient}.
 *
 * @public
 */
export interface SkillsClientOptions {
  discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
  fetchApi: { fetch: typeof fetch };
}

/**
 * Client for the skills backend plugin.
 *
 * @public
 */
export class SkillsClient implements SkillsApi {
  private readonly discoveryApi: SkillsClientOptions['discoveryApi'];
  private readonly fetchApi: SkillsClientOptions['fetchApi'];

  constructor(options: SkillsClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async baseUrl(): Promise<string> {
    return this.discoveryApi.getBaseUrl('skills');
  }

  private createHeaders(
    requestOptions?: SkillsRequestOptions,
    headers?: HeadersInit,
  ): Headers | undefined {
    if (!headers && !requestOptions?.token) {
      return undefined;
    }

    const nextHeaders = new Headers(headers);

    if (requestOptions?.token) {
      nextHeaders.set('Authorization', `Bearer ${requestOptions.token}`);
    }

    return nextHeaders;
  }

  async listSkills(
    request?: SkillsListRequest,
    requestOptions?: SkillsRequestOptions,
  ): Promise<SkillsListResponse> {
    const baseUrl = await this.baseUrl();
    const params = new URLSearchParams();
    if (request?.search) params.set('search', request.search);
    if (request?.source) params.set('source', request.source);
    if (request?.offset !== undefined)
      params.set('offset', String(request.offset));
    if (request?.limit !== undefined)
      params.set('limit', String(request.limit));
    if (request?.orderBy) params.set('orderBy', request.orderBy);
    if (request?.order) params.set('order', request.order);

    const query = params.toString();
    const urlSuffix = query ? `?${query}` : '';
    const url = `${baseUrl}/skills${urlSuffix}`;
    const headers = this.createHeaders(requestOptions);
    const response = headers
      ? await this.fetchApi.fetch(url, { headers })
      : await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json() as Promise<SkillsListResponse>;
  }

  async getSkill(
    name: string,
    requestOptions?: SkillsRequestOptions,
  ): Promise<Skill> {
    const baseUrl = await this.baseUrl();
    const url = `${baseUrl}/skills/${encodeURIComponent(name)}`;
    const headers = this.createHeaders(requestOptions);
    const response = headers
      ? await this.fetchApi.fetch(url, { headers })
      : await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json() as Promise<Skill>;
  }

  async getSkillFiles(
    name: string,
    requestOptions?: SkillsRequestOptions,
  ): Promise<SkillFile[]> {
    const baseUrl = await this.baseUrl();
    const url = `${baseUrl}/skills/${encodeURIComponent(name)}/files`;
    const headers = this.createHeaders(requestOptions);
    const response = headers
      ? await this.fetchApi.fetch(url, { headers })
      : await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return (await response.json()) as SkillFile[];
  }

  async registerSkills(
    request: RegisterSkillsRequest,
    requestOptions?: SkillsRequestOptions,
  ): Promise<Skill[]> {
    const baseUrl = await this.baseUrl();
    const response = await this.fetchApi.fetch(`${baseUrl}/skills`, {
      method: 'PUT',
      headers: this.createHeaders(requestOptions, {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    const data = (await response.json()) as { skills: Skill[] };
    return data.skills;
  }
}
