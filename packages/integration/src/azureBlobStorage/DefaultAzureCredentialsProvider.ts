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
 * Default Azure Credentials Manager to dynamically select and manage Azure credentials.
 * It supports Service Principal, Managed Identity, SAS Token, Connection String, Account Key, and Anonymous access.
 */
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

  /**
   * Determines the appropriate credential method and returns credentials for BlobServiceClient.
   * Supports:
   * - Service Principal
   * - Managed Identity
   * - SAS Token
   * - Connection String
   * - Account Key
   * - Anonymous access
   */
  async getCredentials(accountName: string): Promise<TokenCredential> {
    // Check if the credentials are already cached
    if (this.cachedCredentials.has(accountName)) {
      return this.cachedCredentials.get(accountName)!;
    }

    let credential: TokenCredential;

    // Check for SAS Token
    // if (this.config.sasToken) {
    //   //   console.log('Using SAS Token for Azure Blob Storage authentication');
    //   // SAS Token does not return a credential but can be used directly in BlobServiceClient
    //   // Here we can simply return undefined or keep a placeholder if needed
    //   return this.config.sasToken; // Or return a string for the URL using the SAS token
    // }
    // // Check for Connection String
    // else if (this.config.connectionString) {
    //   //   console.log(
    //   //     'Using Connection String for Azure Blob Storage authentication',
    //   //   );
    //   //   return undefined; // Connection string will also not return a specific credential object
    // }
    // Check for Account Key
    // if (this.config.accountKey) {
    //   //   console.log('Using Account Key for Azure Blob Storage authentication');
    //   credential = new StorageSharedKeyCredential(
    //     accountName,
    //     this.config.accountKey,
    //   );
    // }
    // Check for AAD credentials

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
    }
    // Check for Anonymous access
    // else if (this.config.anonymousAccess) {
    //   console.log('Using Anonymous Credential for Azure Blob Storage access');
    //   credential = new AnonymousCredential();
    // }
    // Fallback to Managed Identity
    else {
      credential = new DefaultAzureCredential();
    }

    // Cache the credentials for future use
    this.cachedCredentials.set(accountName, credential);

    return credential;
  }
}
