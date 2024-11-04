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

export class DefaultAzureCredentialsManager implements AzureCredentialsManager {
  private config: AzureBlobStorageIntegrationConfig;
  private cachedCredentials: Map<string, TokenCredential>;

  constructor(config: AzureBlobStorageIntegrationConfig) {
    this.config = config;
    this.cachedCredentials = new Map<string, TokenCredential>();
  }

  /**
   * Creates an instance of DefaultAzureCredentialsManager from a Backstage Config.
   */
  static fromIntegrations(
    integration: ScmIntegrationRegistry,
  ): DefaultAzureCredentialsManager {
    const azureConfig = integration.azureBlobStorage.list().length
      ? integration.azureBlobStorage.list()[0].config
      : { host: 'blob.core.windows.net' }; // Default to Azure Blob Storage host if no config found

    return new DefaultAzureCredentialsManager(azureConfig);
  }

  async getCredentials(accountName: string): Promise<TokenCredential> {
    if (this.cachedCredentials.has(accountName)) {
      return this.cachedCredentials.get(accountName)!;
    }

    let credential: TokenCredential;

    if (
      this.config.aadCredential &&
      this.config.aadCredential.clientId &&
      this.config.aadCredential.clientSecret &&
      this.config.aadCredential.tenantId
    ) {
      credential = new ClientSecretCredential(
        this.config.aadCredential.tenantId,
        this.config.aadCredential.clientId,
        this.config.aadCredential.clientSecret,
      );
    } else {
      credential = new DefaultAzureCredential();
    }

    // Cache the credentials for future use
    this.cachedCredentials.set(accountName, credential);

    return credential;
  }
}
