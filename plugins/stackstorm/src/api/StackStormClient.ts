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
import { Action, Execution, Pack, StackStormApi } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class StackStormClient implements StackStormApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor({
    discoveryApi,
    identityApi,
  }: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  private async get<T = any>(input: string): Promise<T> {
    const { token: idToken } = await this.identityApi.getCredentials();
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/stackstorm`;
    const response = await fetch(`${apiUrl}${input}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) throw new Error(`Unable to get data: ${response.status}`);
    return await response.json();
  }

  async getExecutions(limit?: number, offset?: number): Promise<Execution[]> {
    const params = {
      limit: limit?.toString() || '25',
      offset: offset?.toString() || '0',
      include_attributes:
        'id,status,start_timestamp,action.ref,action.name,rule.ref',
      parent: 'null',
    };
    const path = `/executions?${new URLSearchParams(params)}`;
    return this.get<Execution[]>(path);
  }

  async getExecution(id: string): Promise<Execution> {
    const path = `/executions/${id}`;
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
}
