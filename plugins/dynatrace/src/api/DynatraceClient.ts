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
import fetch from 'cross-fetch';
import { Problems, DynatraceApi } from './DynatraceApi';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class DynatraceClient implements DynatraceApi {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;

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

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    const { token: idToken } = await this.identityApi.getCredentials();

    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/dynatrace`;
    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  async getProblems(dynatraceEntityId: string): Promise<Problems | undefined> {
    if (!dynatraceEntityId) {
      return undefined;
    }

    return this.callApi('problems', {
      entitySelector: `entityId(${dynatraceEntityId})`,
    });
  }
}
