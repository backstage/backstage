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

import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';

export const onboardingApiRef = createApiRef<OnboardingApi>({
  id: 'onboarding',
});

export interface OnboardingApi {
  getChecklist(groups: string, roles: string): Promise<any>;
  updateChecklistStatus(body: any): Promise<any>;
  getUserInfo(ref: string): Promise<any>;
}

export class OnboardingClient implements OnboardingApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly catalogApi: CatalogApi;
  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    catalogApi: CatalogApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.catalogApi = options.catalogApi;
  }

  async getUserInfo(ref: string): Promise<any> {
    return await this.catalogApi.getEntityByRef({
      kind: 'user',
      namespace: 'default',
      name: ref,
    });
  }

  async getChecklist(groups: string, roles: string): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('onboarding');
    return await this.fetchApi.fetch(
      `${baseUrl}/checklists?groups=${groups}&roles=${roles}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
  }
  async updateChecklistStatus(body: any): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('onboarding');
    return await this.fetchApi.fetch(`${baseUrl}/update-status`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
