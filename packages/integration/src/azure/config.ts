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
import { isValidHost } from '../helpers';

const AZURE_HOST = 'dev.azure.com';

/**
 * The configuration parameters for a single Azure provider.
 *
 * @public
 */
export type AzureIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "dev.azure.com".
   *
   * Currently only "dev.azure.com" is supported.
   */
  host: string;

  /**
   * The authorization token to use for requests.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The credential to use for requests.
   *
   * If no credential is specified anonymous access is used.
   */
  credential?: AzureCredential;
};

/**
 * Authenticate using a client secret that was generated for an App Registration.
 * @public
 */
export type AzureClientSecretCredential = {
  /**
   * The Azure Active Directory tenant
   */
  tenantId: string;
  /**
   * The client id
   */
  clientId: string;

  /**
   * The client secret
   */
  clientSecret: string;
};

/**
 * Authenticate using a managed identity available at the deployment environment.
 * @public
 */
export type AzureManagedIdentityCredential = {
  /**
   * The clientId
   */
  clientId: string;
};

/**
 * Credential used to authenticate to Azure Active Directory.
 * @public
 */
export type AzureCredential =
  | AzureClientSecretCredential
  | AzureManagedIdentityCredential;
export const isAzureClientSecretCredential = (
  credential: Partial<AzureCredential>,
): credential is AzureClientSecretCredential => {
  const clientSecretCredential = credential as AzureClientSecretCredential;

  return (
    Object.keys(credential).length === 3 &&
    clientSecretCredential.clientId !== undefined &&
    clientSecretCredential.clientSecret !== undefined &&
    clientSecretCredential.tenantId !== undefined
  );
};

export const isAzureManagedIdentityCredential = (
  credential: Partial<AzureCredential>,
): credential is AzureManagedIdentityCredential => {
  return (
    Object.keys(credential).length === 1 &&
    (credential as AzureManagedIdentityCredential).clientId !== undefined
  );
};

/**
 * Reads a single Azure integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readAzureIntegrationConfig(
  config: Config,
): AzureIntegrationConfig {
  const host = config.getOptionalString('host') ?? AZURE_HOST;
  const token = config.getOptionalString('token');

  const credential = config.getOptional<AzureCredential>('credential')
    ? {
        tenantId: config.getOptionalString('credential.tenantId'),
        clientId: config.getOptionalString('credential.clientId'),
        clientSecret: config.getOptionalString('credential.clientSecret'),
      }
    : undefined;

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Azure integration config, '${host}' is not a valid host`,
    );
  }

  if (
    credential &&
    !isAzureClientSecretCredential(credential) &&
    !isAzureManagedIdentityCredential(credential)
  ) {
    throw new Error(
      `Invalid Azure integration config, credential is not valid`,
    );
  }

  if (credential && host !== AZURE_HOST) {
    throw new Error(
      `Invalid Azure integration config, credential can only be used with ${AZURE_HOST}`,
    );
  }

  if (credential && token) {
    throw new Error(
      `Invalid Azure integration config, specify either a token or a credential but not both`,
    );
  }

  return { host, token, credential };
}

/**
 * Reads a set of Azure integration configs, and inserts some defaults for
 * public Azure if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export function readAzureIntegrationConfigs(
  configs: Config[],
): AzureIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readAzureIntegrationConfig);

  // If no explicit dev.azure.com integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === AZURE_HOST)) {
    result.push({ host: AZURE_HOST });
  }

  return result;
}
