/*
 * Copyright 2022 The Backstage Authors
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
import { ScoringDataApi } from './ScoringDataApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { SystemScore } from './types';

export class ScoringDataClient implements ScoringDataApi {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;

  constructor({
    discoveryApi,
    fetchApi,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/dynatrace`;
    const response = await this.fetchApi.fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    throw new Error(
      `Dynatrace API call failed: ${response.status}:${response.statusText}`,
    );
  }

  async getScore(entity: string): Promise<SystemScore | undefined> {
    if (!entity) {
      throw new Error('Entity is required');
    }

    return this.callApi('problems', {
      entitySelector: `entityId(${entity})`,
    });
  }

  async getAllScores(): Promise<SystemScore[] | undefined> {
    return undefined;
  }
}
