/*
 * Copyright 2022 The Backstage Authors
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
import { isValidHost, isValidUrl } from '../helpers';

/**
 * The configuration parameters for a single Gerrit API provider.
 *
 * @public
 */
export type GerritIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "gerrit-review.com"
   */
  host: string;

  /**
   * The optional base URL of the Gerrit instance. It is assumed that https
   * is used and that the base path is "/" on the host. If that is not the
   * case set the complete base url to the gerrit instance, e.g.
   * "https://gerrit-review.com/gerrit". This is the url that you would open
   * in a browser.
   */
  baseUrl?: string;

  /**
   * The optional base url to use for cloning a repository. If not set the
   * baseUrl will be used.
   */
  cloneUrl?: string;

  /**
   * Base url for Gitiles. This is needed for creating a valid
   * user-friendly url that can be used for browsing the content of the
   * provider.
   */
  gitilesBaseUrl: string;

  /**
   * The username to use for requests to gerrit.
   */
  username?: string;

  /**
   * The password or http token to use for authentication.
   */
  password?: string;

  /**
   * The signing key to use for signing commits.
   */
  commitSigningKey?: string;
};

/**
 * Reads a single Gerrit integration config.
 *
 * @param config - The config object of a single integration
 *
 * @public
 */
export function readGerritIntegrationConfig(
  config: Config,
): GerritIntegrationConfig {
  const host = config.getString('host');
  let baseUrl = config.getOptionalString('baseUrl');
  let cloneUrl = config.getOptionalString('cloneUrl');
  let gitilesBaseUrl = config.getString('gitilesBaseUrl');
  const username = config.getOptionalString('username');
  const password = config.getOptionalString('password')?.trim();

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Gerrit integration config, '${host}' is not a valid host`,
    );
  } else if (baseUrl && !isValidUrl(baseUrl)) {
    throw new Error(
      `Invalid Gerrit integration config, '${baseUrl}' is not a valid baseUrl`,
    );
  } else if (cloneUrl && !isValidUrl(cloneUrl)) {
    throw new Error(
      `Invalid Gerrit integration config, '${cloneUrl}' is not a valid cloneUrl`,
    );
  } else if (!isValidUrl(gitilesBaseUrl)) {
    throw new Error(
      `Invalid Gerrit integration config, '${gitilesBaseUrl}' is not a valid gitilesBaseUrl`,
    );
  }
  if (baseUrl) {
    baseUrl = trimEnd(baseUrl, '/');
  } else {
    baseUrl = `https://${host}`;
  }
  if (gitilesBaseUrl) {
    gitilesBaseUrl = trimEnd(gitilesBaseUrl, '/');
  } else {
    gitilesBaseUrl = `https://${host}`;
  }
  if (cloneUrl) {
    cloneUrl = trimEnd(cloneUrl, '/');
  } else {
    cloneUrl = baseUrl;
  }

  return {
    host,
    baseUrl,
    cloneUrl,
    gitilesBaseUrl,
    username,
    password,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}

/**
 * Reads a set of Gerrit integration configs.
 *
 * @param configs - All of the integration config objects
 *
 * @public
 */
export function readGerritIntegrationConfigs(
  configs: Config[],
): GerritIntegrationConfig[] {
  return configs.map(readGerritIntegrationConfig);
}
