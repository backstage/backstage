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
  DiscoveryApi,
  IdentityApi,
  createApiRef,
} from '@backstage/core-plugin-api';

export const IncidentApiRef = createApiRef<Incident>({
  id: 'plugin.incident.service',
});

type HTTPMethods = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

export interface Incident {
  request<T>({
    method,
    path,
    body,
  }: {
    method?: HTTPMethods;
    path: string;
    body?: string;
  }): Promise<T>;
}

const DEFAULT_PROXY_PATH = '/incident/api';

type Options = {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  proxyPath?: string;
};

export class IncidentApi implements Incident {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly proxyPath: string;

  constructor(opts: Options) {
    this.discoveryApi = opts.discoveryApi;
    this.identityApi = opts.identityApi;
    this.proxyPath = opts.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  async request<T = any>({
    path,
    method = 'GET',
    body,
  }: {
    path: string;
    method?: HTTPMethods;
    body?: string;
  }): Promise<T> {
    const apiUrl =
      (await this.discoveryApi.getBaseUrl('proxy')) + this.proxyPath;
    const { token } = await this.identityApi.getCredentials();

    const resp = await fetch(`${apiUrl}${path}`, {
      method: method,
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!resp.ok) {
      throw new Error(`${resp.status} ${resp.statusText}`);
    }

    return await resp.json();
  }
}
