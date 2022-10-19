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

import { AzureSitesApi } from './AzureSitesApi';
import {
  AzureSiteListRequest,
  AzureSiteListResponse,
  AzureSiteStartStopRequest,
} from '@backstage/plugin-azure-sites-common';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

/** @public */
export class AzureSitesApiBackendClient implements AzureSitesApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;
  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async stop(request: AzureSiteStartStopRequest): Promise<void> {
    const url = `${await this.discoveryApi.getBaseUrl('azure-functions')}/${
      request.subscription
    }/${request.resourceGroup}/${request.name}/stop`;
    const { token: accessToken } = await this.identityApi.getCredentials();
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  }
  async start(request: AzureSiteStartStopRequest): Promise<void> {
    const url = `${await this.discoveryApi.getBaseUrl('azure-functions')}/${
      request.subscription
    }/${request.resourceGroup}/${request.name}/start`;
    const { token: accessToken } = await this.identityApi.getCredentials();
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  }

  async list(request: AzureSiteListRequest): Promise<AzureSiteListResponse> {
    const url = `${await this.discoveryApi.getBaseUrl('azure-sites')}/list/${
      request.name
    }`;
    const { token: accessToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return await response.json();
  }
}
