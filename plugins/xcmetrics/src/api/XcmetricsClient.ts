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

import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { DateTime } from 'luxon';
import {
  Build,
  BuildCount,
  BuildError,
  BuildFilters,
  BuildHost,
  BuildMetadata,
  BuildStatusResult,
  BuildTime,
  BuildWarning,
  PaginationResult,
  XcmetricsApi,
} from './types';

interface Options {
  discoveryApi: DiscoveryApi;
}

export class XcmetricsClient implements XcmetricsApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
  }

  async getBuild(id: string): Promise<Build> {
    const response = await this.get(`/build/${id}`);
    return ((await response.json()) as Record<'build', Build>).build;
  }

  async getBuilds(limit: number = 10): Promise<Build[]> {
    const response = await this.get(`/build?per=${limit}`);
    return ((await response.json()) as PaginationResult<Build>).items;
  }

  async getFilteredBuilds(
    filters: BuildFilters,
    page?: number,
    perPage?: number,
  ): Promise<PaginationResult<Build>> {
    const response = await this.post('/build/filter', {
      from: DateTime.fromISO(filters.from)
        .startOf('day')
        .toISO({ suppressMilliseconds: true }),
      to: DateTime.fromISO(filters.to)
        .endOf('day')
        .startOf('second')
        .toISO({ suppressMilliseconds: true }),
      status: filters.buildStatus,
      projectName: filters.project,
      page,
      per: perPage,
    });

    return (await response.json()) as PaginationResult<Build>;
  }

  async getBuildCounts(days: number): Promise<BuildCount[]> {
    const response = await this.get(`/statistics/build/count?days=${days}`);
    return (await response.json()) as BuildCount[];
  }

  async getBuildErrors(buildId: string): Promise<BuildError[]> {
    const response = await this.get(`/build/error/${buildId}`);
    return (await response.json()) as BuildError[];
  }

  async getBuildHost(buildId: string): Promise<BuildHost> {
    const response = await this.get(`/build/host/${buildId}`);
    return (await response.json()) as BuildHost;
  }

  async getBuildMetadata(buildId: string): Promise<BuildMetadata> {
    const response = await this.get(`/build/metadata/${buildId}`);
    return ((await response.json()) as Record<'metadata', BuildMetadata>)
      .metadata;
  }

  async getBuildTimes(days: number): Promise<BuildTime[]> {
    const response = await this.get(`/statistics/build/time?days=${days}`);
    return (await response.json()) as BuildTime[];
  }

  async getBuildStatuses(limit: number): Promise<BuildStatusResult[]> {
    const response = await this.get(`/statistics/build/status?per=${limit}`);
    return ((await response.json()) as PaginationResult<BuildStatusResult>)
      .items;
  }

  async getBuildWarnings(buildId: string): Promise<BuildWarning[]> {
    const response = await this.get(`/build/warning/${buildId}`);
    return (await response.json()) as BuildWarning[];
  }

  async getProjects(): Promise<string[]> {
    const response = await this.get('/build/project');
    return (await response.json()) as string[];
  }

  private async get(path: string): Promise<Response> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}${path}`);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response;
  }

  private async post(path: string, body: Object): Promise<Response> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response;
  }
}
