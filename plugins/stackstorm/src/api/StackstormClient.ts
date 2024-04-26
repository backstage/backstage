/*
 * Copyright 2023 The Backstage Authors
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
import { Action, Execution, Pack, StackstormApi } from './types';
import { ConfigApi, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class StackstormClient implements StackstormApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly webUrl: string;

  private constructor({
    discoveryApi,
    fetchApi,
    webUrl,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    webUrl: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
    this.webUrl = webUrl;
  }

  static fromConfig(
    config: ConfigApi,
    dependencies: {
      discoveryApi: DiscoveryApi;
      fetchApi: FetchApi;
    },
  ): StackstormClient {
    return new StackstormClient({
      discoveryApi: dependencies.discoveryApi,
      fetchApi: dependencies.fetchApi,
      webUrl: config.getString('stackstorm.webUrl'),
    });
  }

  private async get<T = any>(input: string): Promise<T> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/stackstorm`;
    const response = await this.fetchApi.fetch(`${apiUrl}${input}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw await ResponseError.fromResponse(response);
    return (await response.json()) as T;
  }

  async getExecutions(limit?: number, offset?: number): Promise<Execution[]> {
    const params = {
      limit: limit?.toString() || '10',
      offset: offset?.toString() || '0',
      include_attributes:
        'id,status,start_timestamp,action.ref,action.name,rule.ref',
      parent: 'null',
    };
    const path = `/executions?${new URLSearchParams(params)}`;
    return this.get<Execution[]>(path);
  }

  async getExecution(id: string): Promise<Execution> {
    const path = `/executions/${encodeURIComponent(id)}`;
    return this.get<Execution>(path);
  }

  async getPacks(): Promise<Pack[]> {
    return this.get<Pack[]>('/packs');
  }

  async getActions(pack: string): Promise<Action[]> {
    const params = {
      include_attributes: 'id,ref,name,pack,description,runner_type',
      pack: pack,
    };
    const path = `/actions?${new URLSearchParams(params)}`;
    return this.get<Action[]>(path);
  }

  getExecutionHistoryUrl(id: string): string {
    return `${this.webUrl}/?#/history/${encodeURIComponent(id)}`;
  }

  getActionUrl(ref: string): string {
    return `${this.webUrl}/?#/actions/${encodeURIComponent(ref)}`;
  }
}
