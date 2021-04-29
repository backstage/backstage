/*
 * Copyright 2020 Spotify AB
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

import { ConfigApi, createApiRef, DiscoveryApi } from '@backstage/core';
import { UptimerobotApi } from './types';

export class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

export const uptimerobotApiRef = createApiRef<UptimerobotApi>({
  id: 'plugin.uptimerobot.service',
  description: 'Used by the UptimeRobot plugin to make requests',
});

export class UptimerobotRestApi implements UptimerobotApi {
  public configApi: ConfigApi;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: ConfigApi;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  private async fetch<T = any>(path: string): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('uptimerobot');

    const resp = await fetch(`${baseUrl}/${path}`);
    if (!resp.ok) throw await FetchError.forResponse(resp);
    return await resp.json();
  }

  getUpdateInterval(): number {
    return (
      this.configApi.getOptionalNumber('uptimerobot.updateInterval') || 120
    );
  }

  async getAllMonitors(): Promise<Response> {
    return await this.fetch<Response>('monitors');
  }

  async getSingleMonitor(annotation?: string): Promise<Response> {
    if (!annotation) return Promise.reject({ message: 'Missing annotation' });
    return await this.fetch<Response>(`monitors/${annotation}`);
  }
}
