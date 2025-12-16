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
 * to:   https://gitlab.com/api/v4/projects/a%2Fb/repository/files/c.yaml/raw?ref=master
 * -or-
 * from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
 * to:   https://gitlab.com/api/v4/projects/groupA%2Fteams%2FteamA%2FsubgroupA%2FrepoA/repository/files/filepath/raw?ref=branch
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getGitLabFileFetchUrl(
  url: string,
  config: GitLabIntegrationConfig,
): string {
  const projectPath = extractProjectPath(url, config);
  return buildProjectUrl(url, projectPath, config).toString();
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

/**
 * Extracts the project path from a GitLab URL.
 *
 * @remarks
 *
 * Converts
 * from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
 * to:   groupA/teams/teamA/subgroupA/repoA
 *
 * @param target - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function extractProjectPath(
  target: string,
  config: GitLabIntegrationConfig,
): string {
  const url = new URL(target);

  if (!url.pathname.includes('/blob/')) {
    throw new Error(
      `Failed extracting project path from ${url.pathname}. Url path must include /blob/.`,
    );
  }

  let repo = url.pathname.split('/-/blob/')[0].split('/blob/')[0];

  // Get gitlab relative path
  const relativePath = getGitLabIntegrationRelativePath(config);

  // Check relative path exist and replace it if it's the case.
  if (relativePath) {
    repo = repo.replace(relativePath, '');
  }

  // Remove leading slash
  return repo.replace(/^\//, '');
}

// Converts
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   https://gitlab.com/api/v4/projects/groupA%2Fteams%2FteamA%2FsubgroupA%2FrepoA/repository/files/filepath/raw?ref=branch
export function buildProjectUrl(
  target: string,
  projectPath: string,
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
      encodeURIComponent(projectPath),
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
