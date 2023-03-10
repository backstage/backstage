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

import { Config } from '@backstage/config';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import fetch from 'node-fetch';
import plimit from 'p-limit';
import { getVaultConfig, VaultConfig } from '../config';

/**
 * Object received as a response from the Vault API when fetching secrets
 * @internal
 */
export type VaultSecretList = {
  data: {
    keys: string[];
    subkeys: string[];
  };
};

/**
 * Object containing the secret name and some links
 * @public
 */
export type VaultSecret = {
  name: string;
  path: string;
  showUrl: string;
  editUrl: string;
};

/**
 * Object received as response when the token is renewed using the Vault API
 */
type RenewTokenResponse = {
  auth: {
    client_token: string;
  };
};

/**
 * Interface for the Vault API
 * @public
 */
export interface VaultApi {
  /**
   * Returns the URL to acces the Vault UI with the defined config.
   */
  getFrontendSecretsUrl(): string;
  /**
   * Returns a list of secrets used to show in a table.
   * @param secretPath - The path where the secrets are stored in Vault
   */
  listSecrets(secretPath: string): Promise<VaultSecret[]>;
  /**
   * Optional, to renew the token used to list the secrets. Throws an
   * error if the token renewal went wrong.
   */
  renewToken?(): Promise<void>;
}

/**
 * Implementation of the Vault API to list secrets and renew the token if necessary
 * @public
 */
export class VaultClient implements VaultApi {
  private vaultConfig: VaultConfig;
  private readonly limit = plimit(5);

  constructor(options: { config: Config }) {
    this.vaultConfig = getVaultConfig(options.config);
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
    method: string = 'GET',
    body: string | undefined = undefined,
  ): Promise<T> {
    const url = new URL(path, this.vaultConfig.baseUrl);
    let fullUrl = url.toString();
    if (query) {
      fullUrl += `?${new URLSearchParams(query).toString()}`;
    }
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (this.vaultConfig.token !== 'none') {
      // Only set token header, if we have one (approle auth must not send one)
      headers['X-Vault-Token'] = this.vaultConfig.token;
    }
    const response = await fetch(fullUrl, {
      method,
      headers: headers,
      body: body,
    });

    if (response.ok) {
      return (await response.json()) as T;
    } else if (response.status === 404) {
      throw new NotFoundError(`No secrets found in path '${path}'`);
    } else if (response.status === 403) {
      throw new NotAllowedError(response.statusText);
    }
    throw new Error(
      `Unexpected error while fetching secrets from path '${path}'`,
    );
  }

  getFrontendSecretsUrl(): string {
    return `${this.vaultConfig.baseUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}`;
  }

  async processMetadataResponse(
    result: VaultSecretList,
    secretPath: string,
  ): Promise<VaultSecret[]> {
    const secrets: VaultSecret[] = [];
    result.data.keys.map(async secret => {
      if (secret.endsWith('/')) {
        secrets.push(
          ...(await this.limit(() =>
            this.listSecrets(`${secretPath}/${secret.slice(0, -1)}`),
          )),
        );
      } else {
        const vaultUrl = this.vaultConfig.publicUrl || this.vaultConfig.baseUrl;
        secrets.push({
          name: secret,
          path: secretPath,
          editUrl: `${vaultUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}/edit/${secretPath}/${secret}`,
          showUrl: `${vaultUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}/show/${secretPath}/${secret}`,
        });
      }
    });
    return secrets;
  }

  async processSubkeysResponse(
    result: VaultSecretList,
    secretPath: string,
  ): Promise<VaultSecret[]> {
    const secrets: VaultSecret[] = [];
    for (const key of Object.keys(result.data.subkeys)) {
      const vaultUrl = this.vaultConfig.publicUrl || this.vaultConfig.baseUrl;
      secrets.push({
        name: key,
        path: '',
        editUrl: `${vaultUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}/edit/${secretPath}`,
        showUrl: `${vaultUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}/show/${secretPath}`,
      });
    }
    return secrets;
  }

  async listSecrets(secretPath: string): Promise<VaultSecret[]> {
    const listType = this.vaultConfig.listType;
    const listUrl =
      this.vaultConfig.kvVersion === 2
        ? `v1/${this.vaultConfig.secretEngine}/${listType}/${secretPath}`
        : `v1/${this.vaultConfig.secretEngine}/${secretPath}`;
    let secrets: VaultSecret[] = [];

    // Check, if initial token should be fetched:
    if (this.vaultConfig.token === 'none') {
      await this.renewToken();
    }

    if (listType === 'metadata') {
      await Promise.all(
        (secrets = await this.processMetadataResponse(
          await this.limit(() =>
            this.callApi<VaultSecretList>(listUrl, { list: true }),
          ),
          secretPath,
        )),
      );
    } else if (listType === 'subkeys') {
      await Promise.all(
        (secrets = await this.processSubkeysResponse(
          await this.limit(() => this.callApi<VaultSecretList>(listUrl, {})),
          secretPath,
        )),
      );
    }

    return secrets;
  }

  async newAppRoleToken(): Promise<string> {
    const result = await this.callApi<RenewTokenResponse>(
      'v1/auth/approle/login',
      {},
      'POST',
      JSON.stringify({
        role_id: this.vaultConfig.authRoleId,
        secret_id: this.vaultConfig.authSecretId,
      }),
    );
    return result.auth.client_token;
  }

  async newStandardToken(): Promise<string> {
    const result = await this.callApi<RenewTokenResponse>(
      'v1/auth/token/renew-self',
      {},
      'POST',
    );
    return result.auth.client_token;
  }

  async renewToken(): Promise<void> {
    if (this.vaultConfig.authMethod === 'approle') {
      this.vaultConfig.token = await this.newAppRoleToken();
    } else if (this.vaultConfig.authMethod === 'token') {
      this.vaultConfig.token = await this.newStandardToken();
    }
  }
}
