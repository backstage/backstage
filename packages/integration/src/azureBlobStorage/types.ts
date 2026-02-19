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

import type { TokenCredential } from '@azure/identity';
import type {
  StorageSharedKeyCredential,
  AnonymousCredential,
} from '@azure/storage-blob';

/**
 * This allows implementations to be provided to retrieve Azure Storage accounts credentials.
 *
 * @public
 *
 */
export interface AzureCredentialsManager {
  /**
   * Retrieves the appropriate credential for the specified Azure storage account.
   *
   * Returns different credential types based on the configured authentication method:
   * - StorageSharedKeyCredential for account key authentication
   * - AnonymousCredential for SAS token authentication (token is embedded in the service URL)
   * - TokenCredential (ClientSecretCredential or DefaultAzureCredential) for Azure AD authentication
   *
   * @param accountName - The name of the Azure storage account
   * @returns A promise that resolves to the credential object
   */
  getCredentials(
    accountName: string,
  ): Promise<
    TokenCredential | StorageSharedKeyCredential | AnonymousCredential
  >;

  /**
   * Constructs the service URL for the specified Azure storage account.
   *
   * Returns the appropriate URL based on configuration:
   * - Custom endpoint URL if configured (with optional SAS token appended as query parameter)
   * - Default Azure Blob Storage URL in the format: https://{accountName}.blob.core.windows.net
   *
   * @param accountName - The name of the Azure storage account
   * @returns The service URL string
   */
  getServiceUrl(accountName: string): string;
}
