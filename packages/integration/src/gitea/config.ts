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
 * The configuration for a single Gitea integration.
 *
 * @public
 */
export type GiteaIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "gitea.website.com"
   */
  host: string;
  /**
   * The optional base URL of the Gitea instance. It is assumed that https
   * is used and that the base path is "/" on the host. If that is not the
   * case set the complete base url to the gitea instance, e.g.
   * "https://gitea.website.com/". This is the url that you would open
   * in a browser.
   */
  baseUrl?: string;
  /**
   * The username to use for requests to gitea.
   */
  username?: string;

  /**
   * The password or http token to use for authentication.
   */
  password?: string;

  /**
   * Signing key to to sign commits
   */
  commitSigningKey?: string;
};

/**
 * Parses a location config block for use in GiteaIntegration
 *
 * @public
 */
export function readGiteaConfig(config: Config): GiteaIntegrationConfig {
  const host = config.getString('host');
  let baseUrl = config.getOptionalString('baseUrl');
  const username = config.getOptionalString('username');
  const password = config.getOptionalString('password')?.trim();

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Gitea integration config, '${host}' is not a valid host`,
    );
  } else if (baseUrl && !isValidUrl(baseUrl)) {
    throw new Error(
      `Invalid Gitea integration config, '${baseUrl}' is not a valid baseUrl`,
    );
  }

  if (baseUrl) {
    baseUrl = trimEnd(baseUrl, '/');
  } else {
    baseUrl = `https://${host}`;
  }

  return {
    host,
    baseUrl,
    username,
    password,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}
