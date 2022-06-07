/*
 * Copyright 2020 The Backstage Authors
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
import { DiscoveryApi, createApiRef } from '@backstage/core-plugin-api';

export const vaultApiRef = createApiRef<VaultApi>({
  id: 'plugin.vault.service',
});

export type VaultSecret = {
  name: string;
  showUrl: string;
  editUrl: string;
};

export interface VaultApi {
  listSecrets(secretPath: string): Promise<VaultSecret[]>;
}

export class VaultClient implements VaultApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('vault')}`;
    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  async listSecrets(secretPath: string): Promise<VaultSecret[]> {
    if (secretPath === '') {
      return [];
    }
    const result = await this.callApi<VaultSecret[]>(
      `v1/secrets/${encodeURIComponent(secretPath)}`,
      {},
    );
    if (!result) {
      return [];
    }
    return result;
  }
}
