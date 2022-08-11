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
import {
  DynatraceProblems,
  DynatraceApi,
  DynatraceSyntheticResults,
  DynatraceSyntheticLocationInfo,
} from './DynatraceApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export class DynatraceClient implements DynatraceApi {
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

  async getDynatraceSyntheticFailures(
    syntheticsId: string,
  ): Promise<DynatraceSyntheticResults | undefined> {
    if (!syntheticsId) {
      throw new Error('Dynatrace syntheticId is required');
    }

    return this.callApi(
      `synthetic/execution/${encodeURIComponent(syntheticsId)}/FAILED`,
      {},
    );
  }

  async getDynatraceSyntheticLocationInfo(
    syntheticLocationId: string,
  ): Promise<DynatraceSyntheticLocationInfo | undefined> {
    if (!syntheticLocationId) {
      throw new Error('Dynatrace syntheticLocationId is required');
    }

    return this.callApi(
      `synthetic/locations/${encodeURIComponent(syntheticLocationId)}`,
      {},
    );
  }

  async getDynatraceProblems(
    dynatraceEntityId: string,
  ): Promise<DynatraceProblems | undefined> {
    if (!dynatraceEntityId) {
      throw new Error('Dynatrace entity id is required');
    }

    return this.callApi('problems', {
      entitySelector: `entityId(${dynatraceEntityId})`,
    });
  }
}
