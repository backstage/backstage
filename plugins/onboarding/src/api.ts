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

export const onboardingApiRef = createApiRef<OnboardingApi>({
  id: 'onboarding',
});

export interface OnboardingApi {
  getChecklist(group?: string): Promise<any>;
  updateChecklistStatus(body: any): Promise<any>;
}

export class OnboardingClient implements OnboardingApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    // this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getChecklist(group?: string): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('onboarding');
    return await this.fetchApi.fetch(
      `${baseUrl}/getChecklists?groups=rp-rearportal-group&roles=backend`,
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
    return await this.fetchApi.fetch(`${baseUrl}/updateStatus`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
