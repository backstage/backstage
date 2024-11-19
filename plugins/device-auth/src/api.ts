/*
 * Copyright 2024 The Backstage Authors
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
} from '@backstage/core-plugin-api';

export interface VerificationResponse {
  error?: string;
}

export interface DeviceAuthApi {
  verifyUserCode(userCode: string): Promise<VerificationResponse>;
  denyUserCode(userCode: string): Promise<VerificationResponse>;
}

export const deviceAuthApiRef = createApiRef<DeviceAuthApi>({
  id: 'plugin.device-auth.service',
});

export class DeviceAuthClient implements DeviceAuthApi {
  constructor(public discovery: DiscoveryApi, public fetchApi: FetchApi) {}

  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    const url = await this.discovery.getBaseUrl('device-auth');
    return await this.fetchApi.fetch(`${url}/${path}`, init);
  }

  async verifyUserCode(userCode: string): Promise<VerificationResponse> {
    const resp = await this.fetch('user_code/verify', {
      method: 'POST',
      body: JSON.stringify({ user_code: userCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) {
      const respJson = await resp.json();
      return {
        error: respJson.error,
      };
    }
    return {};
  }

  async denyUserCode(userCode: string): Promise<VerificationResponse> {
    const resp = await this.fetch('user_code/deny', {
      method: 'POST',
      body: JSON.stringify({ user_code: userCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) {
      const respJson = await resp.json();
      return {
        error: respJson.error,
      };
    }
    return {};
  }
}
