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
import { DagRun } from './types/Dags';

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

  async getDags(
    dagIds: string[],
  ): Promise<{ dags: Dag[]; dagsNotFound: string[] }> {
    const dagsNotFound: string[] = [];
    const response = await Promise.all(
      dagIds.map(id => {
        return this.fetch<Dag>(`/dags/${id}`).catch(e => {
          if (e.message.toUpperCase('en-US') === 'NOT FOUND') {
            dagsNotFound.push(id);
          } else {
            throw e;
          }
        });
      }),
    );
    const dags = response.filter(Boolean) as Dag[];
    return { dags, dagsNotFound };
  }

  async updateDag(dagId: string, isPaused: boolean): Promise<Dag> {
    const init = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_paused: isPaused }),
    };
    return await this.fetch<Dag>(`/dags/${dagId}`, init);
  }

  /**
   * Get the latest DAG Runs of a specific DAG.
   * The DAG runs are ordered by start date
   *
   * @remarks
   *
   * The "limit" option means the maximum number of DAG runs to return
   * "objectsPerRequest" means the maximum number of DAG runs to be taken per fetch request.
   * This is just to make sure the response payloads are not too big
   */
  async getDagRuns(
    dagId: string,
    options = { objectsPerRequest: 100, limit: 5 },
  ): Promise<DagRun[]> {
    const dagRuns: DagRun[] = [];
    const searchParams: ListDagsParams = {
      limit: Math.min(options.objectsPerRequest || 100, options.limit || 5),
      offset: 0,
      order_by: '-start_date',
    };

    for (;;) {
      const response = await this.fetch<{
        dag_runs: DagRun[];
        total_entries: number;
      }>(`/dags/${dagId}/dagRuns?${qs.stringify(searchParams)}`);
      dagRuns.push(...response.dag_runs);

      if (response.dag_runs.length < searchParams.limit!) {
        break;
      }
      if (
        dagRuns.length >= response.total_entries ||
        dagRuns.length >= options.limit
      ) {
        break;
      }
      searchParams.offset! += response.dag_runs.length;
    }
    return dagRuns;
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
