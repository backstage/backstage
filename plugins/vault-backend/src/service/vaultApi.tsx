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
import fetch from 'cross-fetch';

type VaultSecretList = {
  data: {
    keys: string[];
  };
};

type Secret = {
  name: string;
  showUrl: string;
  editUrl: string;
};

type RenewTokenResponse = {
  auth: {
    client_token: string;
  };
};

export interface VaultApi {
  getFrontendSecretsUrl(): string;
  listSecrets(secretPath: string): Promise<Secret[]>;
  renewToken?(): Promise<boolean>;
}

export class VaultClient implements VaultApi {
  private readonly vaultUrl: string;
  private vaultToken: string;
  private readonly kvVersion: number;
  private readonly secretEngineName: string;

  constructor({ config }: { config: Config }) {
    this.vaultUrl = config.getString('vault.sourceUrl');
    this.vaultToken = config.getString('vault.token');
    this.kvVersion = config.getOptionalNumber('vault.kvVersion') ?? 2;
    this.secretEngineName =
      config.getOptionalString('vault.secretEngine') ?? 'secrets';
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
    method: string = 'GET',
  ): Promise<T | undefined> {
    const response = await fetch(
      `${this.vaultUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        method,
        headers: {
          Accept: 'application/json',
          'X-Vault-Token': this.vaultToken,
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  private isFolder(secretName: string): boolean {
    const regex = /^.*\/$/gm;
    return regex.test(secretName);
  }

  getFrontendSecretsUrl(): string {
    return `${this.vaultUrl}/ui/vault/secrets/${this.secretEngineName}`;
  }

  async listSecrets(secretPath: string): Promise<Secret[]> {
    const listUrl =
      this.kvVersion === 2
        ? `v1/${this.secretEngineName}/metadata/${secretPath}`
        : `v1/${this.secretEngineName}/${secretPath}`;
    const result = await this.callApi<VaultSecretList>(listUrl, { list: true });
    if (!result) {
      return [];
    }

    const secrets: Secret[] = [];
    await Promise.all(
      result.data.keys.map(async secret => {
        if (this.isFolder(secret)) {
          secrets.push(
            ...(await this.listSecrets(`${secretPath}/${secret.slice(0, -1)}`)),
          );
        } else {
          secrets.push({
            name: secret,
            editUrl: `${this.vaultUrl}/ui/vault/secrets/${this.secretEngineName}/edit/${secretPath}/${secret}`,
            showUrl: `${this.vaultUrl}/ui/vault/secrets/${this.secretEngineName}/show/${secretPath}/${secret}`,
          });
        }
      }),
    );

    return secrets;
  }

  async renewToken(): Promise<boolean> {
    const result = await this.callApi<RenewTokenResponse>(
      'v1/auth/token/renew-self',
      {},
      'POST',
    );
    if (!result) {
      return false;
    }

    this.vaultToken = result.auth.client_token;
    return true;
  }
}
