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

/**
 * The configuration parameters for a single Bitbucket Server API provider.
 *
 * @public
 */
export type BitbucketServerIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "bitbucket.company.com"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://<host>/rest/api/1.0",
   * with no trailing slash.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
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
   * The credentials for Basic Authentication for requests to a Bitbucket Server provider.
   *
   * If `token` was provided, it will be preferred.
   *
   * See https://developer.atlassian.com/server/bitbucket/how-tos/command-line-rest/#authentication
   */
  username?: string;

  /**
   * The credentials for Basic Authentication for requests to a Bitbucket Server provider.
   *
   * If `token` was provided, it will be preferred.
   *
   * See https://developer.atlassian.com/server/bitbucket/how-tos/command-line-rest/#authentication
   */
  password?: string;

  /**
   * Signing key for commits
   */
  commitSigningKey?: string;
};

/**
 * Reads a single Bitbucket Server integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readBitbucketServerIntegrationConfig(
  config: Config,
): BitbucketServerIntegrationConfig {
  const host = config.getString('host');
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  const token = config.getOptionalString('token')?.trim();
  const username = config.getOptionalString('username');
  const password = config.getOptionalString('password');

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Bitbucket Server integration config, '${host}' is not a valid host`,
    );
  }

  if (apiBaseUrl) {
    apiBaseUrl = trimEnd(apiBaseUrl, '/');
  } else {
    apiBaseUrl = `https://${host}/rest/api/1.0`;
  }

  return {
    host,
    apiBaseUrl,
    token,
    username,
    password,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}

/**
 * Reads a set of Bitbucket Server integration configs.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export function readBitbucketServerIntegrationConfigs(
  configs: Config[],
): BitbucketServerIntegrationConfig[] {
  // Read all the explicit integrations
  // No default integration will be added
  return configs.map(readBitbucketServerIntegrationConfig);
}
