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

import {
  getGitLabIntegrationRelativePath,
  GitLabIntegrationConfig,
} from './config';

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://gitlab.example.com/a/b/blob/master/c.yaml
 * to:   https://gitlab.com/api/v4/projects/projectId/repository/c.yaml?ref=master
 * -or-
 * from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
 * to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export async function getGitLabFileFetchUrl(
  url: string,
  config: GitLabIntegrationConfig,
  token?: string,
): Promise<string> {
  const projectID = await getProjectId(url, config, token);
  return buildProjectUrl(url, projectID, config).toString();
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @param token - An optional auth token to use for communicating with GitLab. By default uses the integration token
 * @public
 */
export function getGitLabRequestOptions(
  config: GitLabIntegrationConfig,
  token?: string,
): { headers: Record<string, string> } {
  const headers: Record<string, string> = {};

  const accessToken = token || config.token;
  if (accessToken) {
    // OAuth, Personal, Project, and Group access tokens can all be passed via
    // a bearer authorization header
    // https://docs.gitlab.com/api/rest/authentication/#personalprojectgroup-access-tokens
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return { headers };
}

// Converts
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
export function buildProjectUrl(
  target: string,
  projectID: Number,
  config: GitLabIntegrationConfig,
): URL {
  try {
    const url = new URL(target);

    const branchAndFilePath = url.pathname
      .split('/blob/')
      .slice(1)
      .join('/blob/');
    const [branch, ...filePath] = branchAndFilePath.split('/');
    const relativePath = getGitLabIntegrationRelativePath(config);

    url.pathname = [
      ...(relativePath ? [relativePath] : []),
      'api/v4/projects',
      projectID,
      'repository/files',
      encodeURIComponent(decodeURIComponent(filePath.join('/'))),
      'raw',
    ].join('/');

    url.search = `?ref=${branch}`;

    return url;
  } catch (e) {
    throw new Error(`Incorrect url: ${target}, ${e}`);
  }
}

// Convert
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   The project ID that corresponds to the URL
export async function getProjectId(
  target: string,
  config: GitLabIntegrationConfig,
  token?: string,
): Promise<number> {
  const url = new URL(target);

  if (!url.pathname.includes('/blob/')) {
    throw new Error(
      `Failed converting ${url.pathname} to a project id. Url path must include /blob/.`,
    );
  }

  try {
    let repo = url.pathname.split('/-/blob/')[0].split('/blob/')[0];

    // Get gitlab relative path
    const relativePath = getGitLabIntegrationRelativePath(config);

    // Check relative path exist and replace it if it's the case.
    if (relativePath) {
      repo = repo.replace(relativePath, '');
    }

    // Convert
    // to: https://gitlab.com/api/v4/projects/groupA%2Fteams%2FsubgroupA%2FteamA%2Frepo
    const repoIDLookup = new URL(
      `${url.origin}${relativePath}/api/v4/projects/${encodeURIComponent(
        repo.replace(/^\//, ''),
      )}`,
    );

    const response = await fetchWithRetry(
      repoIDLookup.toString(),
      getGitLabRequestOptions(config, token),
    );

    if (response.ok) {
      const data = await response.json();
      return Number(data.id);
    }

    if (response.status === 401) {
      throw new Error(
        'GitLab Error: 401 - Unauthorized. The access token used is either expired, or does not have permission to read the project',
      );
    }

    const data = await response.json();
    throw new Error(`GitLab Error '${data.error}', ${data.error_description}`);
  } catch (e) {
    throw new Error(`Could not get GitLab project ID for: ${target}, ${e}`);
  }
}

export interface RetryConfig {
  maxRetries?: number;
  retryStatusCodes?: number[];
}

export async function fetchWithRetry(
  url: string | URL | Request,
  options?: RequestInit,
  config: RetryConfig = {},
): Promise<Response> {
  const { maxRetries = 3, retryStatusCodes = [429] } = config;
  let retries = 0;

  while (retries <= maxRetries) {
    const response = await fetch(url, options);

    if (!retryStatusCodes.includes(response.status) || retries >= maxRetries) {
      return response;
    }

    retries++;

    // Calculate delay from Retry-After header or use exponential backoff
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : Math.min(500 * Math.pow(2, retries - 1), 10000); // Exponential backoff, cap at 10 seconds

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // This should never be reached due to the loop condition, but TypeScript needs it
  throw new Error('Max retries exceeded');
}
