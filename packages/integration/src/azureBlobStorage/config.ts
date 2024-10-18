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

const AZURE_HOST = 'blob.core.windows.net';

/**
 * The configuration parameters for a single Azure Blob Storage account.
 *
 * @public
 */
export type AzureBlobStorageIntegrationConfig = {
  /**
   * The name of the Azure Storage Account, e.g., "mystorageaccount".
   */
  accountName?: string;

  /**
   * The primary or secondary key for the Azure Storage Account.
   * Only required if connectionString or SAS token are not specified.
   */
  accountKey?: string;

  /**
   * A Shared Access Signature (SAS) token for limited access to resources.
   */
  sasToken?: string;

  /**
   * A full connection string for the Azure Storage Account.
   * This includes the account name, key, and endpoint details.
   */
  connectionString?: string;

  /**
   * Optional endpoint suffix for custom domains or sovereign clouds.
   * e.g., "core.windows.net" for public Azure or "core.usgovcloudapi.net" for US Government cloud.
   */
  endpointSuffix?: string;

  /**
   * The host of the target that this matches on, e.g., "blob.core.windows.net".
   */
  host: string;

  endpoint?: string;
  /**
   * Optional credential to use for Azure Active Directory authentication.
   */
  aadCredential?: {
    /**
     * The client ID of the Azure AD application.
     */
    clientId: string;

    /**
     * The tenant ID for Azure AD.
     */
    tenantId: string;

    /**
     * The client secret for the Azure AD application.
     */
    clientSecret: string;
  };
};

/**
 * Reads a single Azure Blob Storage integration config.
 *
 * @param config - The config object of a single integration.
 * @public
 */
export function readAzureBlobStorageIntegrationConfig(
  config: Config,
): AzureBlobStorageIntegrationConfig {
  const endpoint = config.getOptionalString('endpoint');
  const accountName = config.getString('accountName');
  const accountKey = config.getOptionalString('accountKey')?.trim();
  const sasToken = config.getOptionalString('sasToken')?.trim();
  const connectionString = config.getOptionalString('connectionString')?.trim();
  const endpointSuffix = config.getOptionalString('endpointSuffix')?.trim();

  let host;
  let pathname;
  if (endpoint) {
    try {
      const url = new URL(endpoint);
      host = url.host;
      pathname = url.pathname;
    } catch {
      throw new Error(
        `invalid azureBlobStorage integration config, endpoint '${endpoint}' is not a valid URL`,
      );
    }
    if (pathname !== '/') {
      throw new Error(
        `invalid azureBlobStorage integration config, endpoints cannot contain path, got '${endpoint}'`,
      );
    }
  } else {
    host = AZURE_HOST;
  }
  const aadCredential = config.has('aadCredential')
    ? {
        clientId: config.getString('aadCredential.clientId'),
        tenantId: config.getString('aadCredential.tenantId'),
        clientSecret: config.getString('aadCredential.clientSecret')?.trim(),
      }
    : undefined;

  if (accountKey && sasToken) {
    throw new Error(
      `Invalid Azure Blob Storage config for ${accountName}: Both account key and SAS token cannot be used simultaneously.`,
    );
  }

  if (aadCredential && (accountKey || sasToken)) {
    throw new Error(
      `Invalid Azure Blob Storage config for ${accountName}: Cannot use both Azure AD credentials and account keys/SAS tokens for the same account.`,
    );
  }

  return {
    host,
    endpoint,
    accountName,
    accountKey,
    sasToken,
    connectionString,
    endpointSuffix,
    aadCredential,
  };
}

/**
 * Reads a set of Azure Blob Storage integration configs.
 *
 * @param configs - All of the integration config objects.
 * @public
 */
export function readAzureBlobStorageIntegrationConfigs(
  configs: Config[],
): AzureBlobStorageIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readAzureBlobStorageIntegrationConfig);

  // If no explicit blob.core.windows.net integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === AZURE_HOST)) {
    result.push({
      host: AZURE_HOST,
    });
  }
  return result;
}
