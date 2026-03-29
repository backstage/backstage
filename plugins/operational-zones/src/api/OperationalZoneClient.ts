/*
 * Copyright 2024 The Backstage Authors
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
import { ResponseError } from '@backstage/errors';
import { Zone, ZoneSchedule } from '@backstage/plugin-operational-zones-common';
import { OperationalZoneApi } from './OperationalZoneApi';

/** @public */
export class OperationalZoneClient implements OperationalZoneApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getZones(): Promise<{ zones: Zone[] }> {
    return this.request('/zones');
  }

  async getZone(operationId: string): Promise<Zone> {
    return this.request(`/zones/${encodeURIComponent(operationId)}`);
  }

  async createZone(schedule: ZoneSchedule): Promise<Zone> {
    return this.request('/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('operational-zones');
    const response = await this.fetchApi.fetch(`${baseUrl}${path}`, init);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json() as Promise<T>;
  }
}
