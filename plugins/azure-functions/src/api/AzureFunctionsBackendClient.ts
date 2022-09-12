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

import { AzureFunctionsApi } from './AzureFunctionsApi';
import { FunctionsData } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class AzureFunctionsBackendClient implements AzureFunctionsApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;
  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async list({
    functionName,
  }: {
    functionName: string;
  }): Promise<FunctionsData[]> {
    try {
      const url = `${await this.discoveryApi.getBaseUrl(
        'azure-functions',
      )}/list`;
      const { token: idToken } = await this.identityApi.getCredentials();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
        body: JSON.stringify({ functionName: functionName }),
      });
      return await response.json();
    } catch (e: any) {
      throw new Error('MissingAzureBackendException');
    }
  }
}
