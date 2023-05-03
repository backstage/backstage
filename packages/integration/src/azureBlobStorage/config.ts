/*
 * Copyright 2023 The Backstage Authors
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

/**
 * The configuration parameters for a single Azure BlobStorage provider.
 *
 * @public
 */
export type AzureBlobStorageIntegrationConfig = {
  /**
   * derived from accountName, and defaults to {accountname}.blob.core.windows.net
   */
  host: string;

  /**
   * The account of the given Azure instance
   */
  accountName: string;

  /**
   * SAS-Token, with leading '?'
   */
  secretAccessKey?: string;
};

/**
 * Reads a single Azure BlobStorage integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readAzureBlobStorageIntegrationConfig(
  config: Config,
): AzureBlobStorageIntegrationConfig {
  const accountName = config.getString('accountName');
  const host = `${accountName}.blob.core.windows.net`;

  const secretAccessKey = config.has('secretAccessKey')
    ? config.getOptionalString('secretAccessKey')
    : '';

  return {
    host,
    accountName,
    secretAccessKey,
  };
}

/**
 * Reads a set of Azure storage integration configs
 *
 * @param config - The config objects of the integrations
 * @public
 */
export function readAzureBlobStorageIntegrationConfigs(
  config: Config[],
): AzureBlobStorageIntegrationConfig[] {
  return config.map(readAzureBlobStorageIntegrationConfig);
}
