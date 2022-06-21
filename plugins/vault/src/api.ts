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
import { NotFoundError } from '@backstage/errors';

/**
 * @public
 */
export const vaultApiRef = createApiRef<VaultApi>({
  id: 'plugin.vault.service',
});

/**
 * Object containing the secret name and some links.
 * @public
 */
export type VaultSecret = {
  name: string;
  showUrl: string;
  editUrl: string;
};

/**
 * Interface for the VaultApi.
 * @public
 */
export interface VaultApi {
  /**
   * Returns a list of secrets used to show in a table.
   * @param secretPath - The path where the secrets are stored in Vault
   */
  listSecrets(secretPath: string): Promise<VaultSecret[]>;
}

/**
 * Default implementation of the VaultApi.
 * @public
 */
export class VaultClient implements VaultApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('vault')}`;
    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    if (response.ok) {
      return (await response.json()) as T;
    } else if (response.status === 404) {
      throw new NotFoundError(`No secrets found in path '${path}'`);
    }
    throw new Error(
      `Unexpected error while fetching secrets from path '${path}'`,
    );
  }

  async listSecrets(secretPath: string): Promise<VaultSecret[]> {
    const result = await this.callApi<{ items: VaultSecret[] }>(
      `v1/secrets/${encodeURIComponent(secretPath)}`,
      {},
    );
    return result.items;
  }
}
