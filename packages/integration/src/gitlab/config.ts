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
import { isValidHost, isValidUrl } from '../helpers';

const GITLAB_HOST = 'gitlab.com';
const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4';

/**
 * Reads an optional number array from config
 */
function readOptionalNumberArray(
  config: Config,
  key: string,
): number[] | undefined {
  const value = config.getOptional(key);
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(
      `Invalid ${key} config: expected an array, got ${typeof value}`,
    );
  }
  return value.map((item, index) => {
    if (typeof item !== 'number') {
      throw new Error(
        `Invalid ${key} config: all values must be numbers, got ${typeof item} at index ${index}`,
      );
    }
    return item;
  });
}

/**
 * The configuration parameters for a single GitLab integration.
 *
 * @public
 */
export type GitLabIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. `gitlab.com`.
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g.
   * `https://gitlab.com/api/v4`, with no trailing slash.
   *
   * May be omitted specifically for public GitLab; then it will be deduced.
   */
  apiBaseUrl: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The baseUrl of this provider, e.g. `https://gitlab.com`, which is passed
   * into the GitLab client.
   *
   * If no baseUrl is provided, it will default to `https://${host}`
   */
  baseUrl: string;

  /**
   * Signing key to sign commits
   */
  commitSigningKey?: string;

  /**
   * Maximum number of retries for failed requests
   * @defaultValue 0
   */
  maxRetries: number;

  /**
   * HTTP status codes that should trigger a retry
   * @defaultValue []
   */
  retryStatusCodes: number[];

  /**
   * Rate limit for requests per minute
   * @defaultValue -1
   */
  limitPerMinute: number;
};

/**
 * Reads a single GitLab integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readGitLabIntegrationConfig(
  config: Config,
): GitLabIntegrationConfig {
  const host = config.getString('host');
  let apiBaseUrl = config.getOptionalString('apiBaseUrl');
  const token = config.getOptionalString('token')?.trim();
  let baseUrl = config.getOptionalString('baseUrl');
  if (apiBaseUrl) {
    apiBaseUrl = trimEnd(apiBaseUrl, '/');
  } else if (host === GITLAB_HOST) {
    apiBaseUrl = GITLAB_API_BASE_URL;
  }

  if (baseUrl) {
    baseUrl = trimEnd(baseUrl, '/');
  } else {
    baseUrl = `https://${host}`;
  }

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid GitLab integration config, '${host}' is not a valid host`,
    );
  } else if (!apiBaseUrl || !isValidUrl(apiBaseUrl)) {
    throw new Error(
      `Invalid GitLab integration config, '${apiBaseUrl}' is not a valid apiBaseUrl`,
    );
  } else if (!isValidUrl(baseUrl)) {
    throw new Error(
      `Invalid GitLab integration config, '${baseUrl}' is not a valid baseUrl`,
    );
  }

  const maxRetries = config.getOptionalNumber('maxRetries') ?? 0;
  const limitPerMinute = config.getOptionalNumber('limitPerMinute') ?? -1;
  const retryStatusCodes =
    readOptionalNumberArray(config, 'retryStatusCodes') ?? [];

  return {
    host,
    token,
    apiBaseUrl,
    baseUrl,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
    maxRetries,
    retryStatusCodes,
    limitPerMinute,
  };
}

/**
 * Reads a set of GitLab integration configs, and inserts some defaults for
 * public GitLab if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export function readGitLabIntegrationConfigs(
  configs: Config[],
): GitLabIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readGitLabIntegrationConfig);

  // As a convenience we always make sure there's at least an unauthenticated
  // reader for public gitlab repos.
  if (!result.some(c => c.host === GITLAB_HOST)) {
    result.push({
      host: GITLAB_HOST,
      apiBaseUrl: GITLAB_API_BASE_URL,
      baseUrl: `https://${GITLAB_HOST}`,
      maxRetries: 0,
      retryStatusCodes: [],
      limitPerMinute: -1,
    });
  }

  return result;
}

/**
 * Reads a GitLab integration config, and returns
 * relative path.
 *
 * @param config - GitLabIntegrationConfig object
 * @public
 */
export function getGitLabIntegrationRelativePath(
  config: GitLabIntegrationConfig,
): string {
  let relativePath = '';
  if (config.host !== GITLAB_HOST) {
    relativePath = new URL(config.baseUrl).pathname;
  }
  return trimEnd(relativePath, '/');
}
