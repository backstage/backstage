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

const BITBUCKET_CLOUD_HOST = 'bitbucket.org';
const BITBUCKET_CLOUD_API_BASE_URL = 'https://api.bitbucket.org/2.0';

/**
 * The configuration parameters for a single Bitbucket Cloud API provider.
 *
 * @public
 */
export type BitbucketCloudIntegrationConfig = {
  /**
   * Constant. bitbucket.org
   */
  host: string;

  /**
   * Constant. https://api.bitbucket.org/2.0
   */
  apiBaseUrl: string;

  /**
   * The username to use for requests to Bitbucket Cloud (bitbucket.org).
   */
  username?: string;

  /**
   * Authentication with Bitbucket Cloud (bitbucket.org) is done using app passwords.
   *
   * See https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/
   */
  appPassword?: string;

  /**
   * The access token to use for requests to Bitbucket Cloud (bitbucket.org).
   */
  token?: string;

  /** PGP private key for signing commits. */
  commitSigningKey?: string;
};

/**
 * Reads a single Bitbucket Cloud integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readBitbucketCloudIntegrationConfig(
  config: Config,
): BitbucketCloudIntegrationConfig {
  const host = BITBUCKET_CLOUD_HOST;
  const apiBaseUrl = BITBUCKET_CLOUD_API_BASE_URL;
  // If config is provided, we assume authenticated access is desired
  // (as the anonymous one is provided by default).
  const username = config.getString('username');
  const appPassword = config.getString('appPassword')?.trim();

  return {
    host,
    apiBaseUrl,
    username,
    appPassword,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}

/**
 * Reads a set of Bitbucket Cloud integration configs,
 * and inserts one for public Bitbucket Cloud if none specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export function readBitbucketCloudIntegrationConfigs(
  configs: Config[],
): BitbucketCloudIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readBitbucketCloudIntegrationConfig);

  // If no explicit bitbucket.org integration was added,
  // put one in the list as a convenience
  if (result.length === 0) {
    result.push({
      host: BITBUCKET_CLOUD_HOST,
      apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
    });
  }

  return result;
}
