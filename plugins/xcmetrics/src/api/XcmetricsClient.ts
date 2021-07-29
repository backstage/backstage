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
  BuildStatus,
  BuildStatusResult,
  BuildTime,
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
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}/build/${id}`);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return ((await response.json()) as Record<'build', Build>).build;
  }

  async getBuilds(limit: number = 10): Promise<Build[]> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}/build?per=${limit}`);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return ((await response.json()) as PaginationResult<Build>).items;
  }

  async getFilteredBuilds(
    from: string,
    to: string,
    status?: BuildStatus,
    page?: number,
    perPage?: number,
  ): Promise<PaginationResult<Build>> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}/build/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: DateTime.fromISO(from)
          .startOf('day')
          .toISO({ suppressMilliseconds: true }),
        to: DateTime.fromISO(to)
          .endOf('day')
          .startOf('second')
          .toISO({ suppressMilliseconds: true }),
        status,
        page,
        per: perPage,
      }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return (await response.json()) as PaginationResult<Build>;
  }

  async getBuildCounts(days: number): Promise<BuildCount[]> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(
      `${baseUrl}/statistics/build/count?days=${days}`,
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return (await response.json()) as BuildCount[];
  }

  async getBuildTimes(days: number): Promise<BuildTime[]> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(
      `${baseUrl}/statistics/build/time?days=${days}`,
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return (await response.json()) as BuildTime[];
  }

  async getBuildStatuses(limit: number): Promise<BuildStatusResult[]> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(
      `${baseUrl}/statistics/build/status?per=${limit}`,
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return ((await response.json()) as PaginationResult<BuildStatusResult>)
      .items;
  }
}
