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
  DefaultAzureCredential,
  ClientSecretCredential,
  TokenCredential,
} from '@azure/identity';
import { AzureBlobStorageIntegrationConfig } from './config';
import { AzureCredentialsManager } from './types';
import { ScmIntegrationRegistry } from '../registry';

/**
 * Default implementation of AzureCredentialsManager that supports multiple Azure Blob Storage integrations.
 * @public
 */
export class DefaultAzureCredentialsManager implements AzureCredentialsManager {
  private cachedCredentials: Map<string, TokenCredential>;

  private constructor(
    private readonly configProviders: Map<
      string,
      AzureBlobStorageIntegrationConfig
    >,
  ) {
    this.cachedCredentials = new Map<string, TokenCredential>();
  }

  /**
   * Creates an instance of DefaultAzureCredentialsManager from a Backstage integration registry.
   */
  static fromIntegrations(
    integrations: ScmIntegrationRegistry,
  ): DefaultAzureCredentialsManager {
    const configProviders = integrations.azureBlobStorage
      .list()
      .reduce((acc, integration) => {
        acc.set(
          integration.config.accountName || 'default',
          integration.config,
        );
        return acc;
      }, new Map<string, AzureBlobStorageIntegrationConfig>());

    return new DefaultAzureCredentialsManager(configProviders);
  }

  private createCredential(
    config: AzureBlobStorageIntegrationConfig,
  ): TokenCredential {
    if (
      config.aadCredential &&
      config.aadCredential.clientId &&
      config.aadCredential.clientSecret &&
      config.aadCredential.tenantId
    ) {
      return new ClientSecretCredential(
        config.aadCredential.tenantId,
        config.aadCredential.clientId,
        config.aadCredential.clientSecret,
      );
    }

    return new DefaultAzureCredential();
  }

  async getCredentials(accountName: string): Promise<TokenCredential> {
    if (this.cachedCredentials.has(accountName)) {
      return this.cachedCredentials.get(accountName)!;
    }

    const config = this.configProviders.get(accountName);
    if (!config) {
      throw new Error(`No configuration found for account: ${accountName}`);
    }

    const credential = this.createCredential(config);

    // Cache the credentials for future use
    this.cachedCredentials.set(accountName, credential);

    return credential;
  }
}
