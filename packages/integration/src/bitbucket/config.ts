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
import { trimEnd } from 'lodash';
import { isValidHost } from '../helpers';

const BITBUCKET_HOST = 'bitbucket.org';
const BITBUCKET_API_BASE_URL = 'https://api.bitbucket.org/2.0';

/**
 * The configuration parameters for a single Bitbucket API provider.
 *
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export type BitbucketIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "bitbucket.org"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.bitbucket.org/2.0",
   * with no trailing slash.
   *
   * Values omitted at the optional property at the app-config will be deduced
   * from the "host" value.
   */
  apiBaseUrl: string;

  /**
   * The authorization token to use for requests to a Bitbucket Server provider.
   *
   * See https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

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
   * Signing key for commits
   */
  commitSigningKey?: string;
};

/**
 * Reads a single Bitbucket integration config.
 *
 * @param config - The config object of a single integration
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export function readBitbucketIntegrationConfig(
  config: Config,
): BitbucketIntegrationConfig {
  const host = config.getOptionalString('host') ?? BITBUCKET_HOST;
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  const token = config.getOptionalString('token')?.trim();
  const username = config.getOptionalString('username');
  const appPassword = config.getOptionalString('appPassword')?.trim();

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Bitbucket integration config, '${host}' is not a valid host`,
    );
  }

  if (apiBaseUrl) {
    apiBaseUrl = trimEnd(apiBaseUrl, '/');
  } else if (host === BITBUCKET_HOST) {
    apiBaseUrl = BITBUCKET_API_BASE_URL;
  } else {
    apiBaseUrl = `https://${host}/rest/api/1.0`;
  }

  return {
    host,
    apiBaseUrl,
    token,
    username,
    appPassword,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}

/**
 * Reads a set of Bitbucket integration configs, and inserts some defaults for
 * public Bitbucket if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export function readBitbucketIntegrationConfigs(
  configs: Config[],
): BitbucketIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readBitbucketIntegrationConfig);

  // If no explicit bitbucket.org integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === BITBUCKET_HOST)) {
    result.push({
      host: BITBUCKET_HOST,
      apiBaseUrl: BITBUCKET_API_BASE_URL,
    });
  }

  return result;
}
