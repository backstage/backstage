/*
 * Copyright 2020 Spotify AB
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

const GITLAB_HOST = 'gitlab.com';
const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4';

/**
 * The configuration parameters for a single GitLab integration.
 */
export type GitLabIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "gitlab.com"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://gitlab.com/api/v4",
   * with no trailing slash.
   *
   * May be omitted specifically for GitLab; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The authorization token to use for requests this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The baseUrl of this provider, e.g "https://gitlab.com",
   * which is passed into the gitlab client.
   *
   * If no baseUrl is provided, it will default to https://${host}
   */
  baseUrl?: string;
};

/**
 * Reads a single GitLab integration config.
 *
 * @param config The config object of a single integration
 */
export function readGitLabIntegrationConfig(
  config: Config,
): GitLabIntegrationConfig {
  const host = config.getOptionalString('host') ?? GITLAB_HOST;
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  const token = config.getOptionalString('token');
  const baseUrl = config.getOptionalString('baseUrl') ?? `https://${host}`;

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid GitLab integration config, '${host}' is not a valid host`,
    );
  }

  if (apiBaseUrl) {
    apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
  } else if (host === GITLAB_HOST) {
    apiBaseUrl = GITLAB_API_BASE_URL;
  }

  return { host, token, apiBaseUrl, baseUrl };
}

/**
 * Reads a set of GitLab integration configs, and inserts some defaults for
 * public GitLab if not specified.
 *
 * @param configs All of the integration config objects
 */
export function readGitLabIntegrationConfigs(
  configs: Config[],
): GitLabIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readGitLabIntegrationConfig);

  // As a convenience we always make sure there's at least an unauthenticated
  // reader for public gitlab repos.
  if (!result.some(c => c.host === GITLAB_HOST)) {
    result.push({ host: GITLAB_HOST, apiBaseUrl: GITLAB_API_BASE_URL });
  }

  return result;
}
