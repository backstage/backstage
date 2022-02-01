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
import fetch from 'cross-fetch';
import qs from 'qs';
import { ApacheAirflowApi } from './ApacheAirflowApi';
import {
  Dag,
  Dags,
  InstanceStatus,
  InstanceVersion,
  ListDagsParams,
} from './types';

export class ApacheAirflowClient implements ApacheAirflowApi {
  discoveryApi: DiscoveryApi;
  baseUrl: string;

  constructor({
    discoveryApi,
    baseUrl = 'http://localhost:8080',
  }: {
    discoveryApi: DiscoveryApi;
    baseUrl: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  /**
   * List all DAGs in the Airflow instance
   *
   * @remarks
   *
   * All DAGs with a limit of 100 results per request are returned; this may be
   * bogged-down for instances with many DAGs, in which case table pagination
   * should be implemented
   *
   * @param objectsPerRequest - records returned per request in pagination
   */
  async listDags(options = { objectsPerRequest: 100 }): Promise<Dag[]> {
    const dags: Dag[] = [];
    const searchParams: ListDagsParams = {
      limit: options.objectsPerRequest,
      offset: 0,
    };

    for (;;) {
      const response = await this.fetch<Dags>(
        `/dags?${qs.stringify(searchParams)}`,
      );
      dags.push(...response.dags);

      if (dags.length >= response.total_entries) {
        break;
      }
      if (typeof searchParams.offset !== 'undefined') {
        searchParams.offset += options.objectsPerRequest;
      }
    }
    return dags;
  }

  async updateDag(dagId: string, isPaused: boolean): Promise<Dag> {
    const init = {
      method: 'PATCH',
      body: JSON.stringify({ is_paused: isPaused }),
    };
    return await this.fetch<Dag>(`/dags/${dagId}`, init);
  }

  async getInstanceStatus(): Promise<InstanceStatus> {
    return await this.fetch<InstanceStatus>('/health');
  }

  async getInstanceVersion(): Promise<InstanceVersion> {
    return await this.fetch<InstanceVersion>('/version');
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const proxyUri = `${await this.discoveryApi.getBaseUrl('proxy')}/airflow`;
    const response = await fetch(`${proxyUri}${input}`, init);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  }
}
