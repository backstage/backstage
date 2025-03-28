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

import fetch from 'cross-fetch';
import {
  getGitLabIntegrationRelativePath,
  GitLabIntegrationConfig,
} from './config';

// Cache for branch lists to avoid repeated API calls
const branchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface GitLabBranch {
  name: string;
  commit: {
    id: string;
    short_id: string;
    title: string;
    created_at: string;
    parent_ids: string[];
    message: string;
    authored_date: string;
    author_name: string;
    author_email: string;
    committed_date: string;
    committer_name: string;
    committer_email: string;
  };
  protected: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
}

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
): Promise<string> {
  const projectID = await getProjectId(url, config);
  const fetchUrl = (await buildProjectUrl(url, projectID, config)).toString();
  return fetchUrl;
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 */
export function getGitLabRequestOptions(
  config: GitLabIntegrationConfig,
  token?: string,
): { headers: Record<string, string> } {
  if (token) {
    // If token comes from the user and starts with "gl", it's a private token (see https://docs.gitlab.com/ee/security/token_overview.html#token-prefixes)
    return {
      headers: token.startsWith('gl')
        ? { 'PRIVATE-TOKEN': token }
        : { Authorization: `Bearer ${token}` }, // Otherwise, it's a bearer token
    };
  }

  // If token not provided, fetch the integration token
  const { token: configToken = '' } = config;
  return {
    headers: { 'PRIVATE-TOKEN': configToken },
  };
}

// Converts
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
export async function buildProjectUrl(
  target: string,
  projectID: Number,
  config: GitLabIntegrationConfig,
): Promise<URL> {
  try {
    const url = new URL(target);
    const relativePath = getGitLabIntegrationRelativePath(config);

    // Use resolveGitLabPath to get the correct branch and file path
    const resolvedUrl = await resolveGitLabPath(url, {
      projectID: Number(projectID),
      relativePath,
      token: config.token,
    });

    return resolvedUrl;
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

    const response = await fetch(
      repoIDLookup.toString(),
      getGitLabRequestOptions(config),
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `GitLab Error '${data.error}', ${data.error_description}`,
      );
    }

    return Number(data.id);
  } catch (e) {
    throw new Error(`Could not get GitLab project ID for: ${target}, ${e}`);
  }
}

export async function resolveGitLabPath(
  url: URL,
  {
    projectID,
    relativePath = '',
    token = null,
    cacheTTL = CACHE_TTL,
  }: {
    projectID: number;
    relativePath?: string;
    token?: string | null;
    cacheTTL?: number;
  },
) {
  if (!url || !(url instanceof URL)) {
    throw new TypeError('URL parameter must be a valid URL object');
  }

  if (!projectID) {
    throw new TypeError('projectID is required');
  }

  // Get everything after '/blob/'
  const blobParts = url.pathname.split('/blob/');
  if (blobParts.length !== 2) {
    throw new Error('Invalid GitLab URL format: missing /blob/ path segment');
  }

  const segments = blobParts[1].split('/');
  if (segments.length < 2) {
    throw new Error('Invalid GitLab URL format: missing branch or file path');
  }

  // Generate all possible branch name combinations
  const possibleBranches = [];
  for (let i = 1; i <= segments.length - 1; i++) {
    possibleBranches.push(segments.slice(0, i).join('/'));
  }

  // Create a new URL for the branches API
  const branchesUrl = new URL(url.origin);

  branchesUrl.pathname = [
    ...(relativePath ? [relativePath] : []),
    'api/v4/projects',
    projectID,
    'repository/branches',
  ].join('/');

  // Try branches from longest to shortest match
  const sortedBranches = [...possibleBranches].reverse();
  let matchingBranch = null;

  for (const branchToTry of sortedBranches) {
    // Check cache first
    const cacheKey = `${branchesUrl.toString()}_${token || ''}_${branchToTry}`;
    const cachedData = branchCache.get(cacheKey);
    let branch;

    if (cachedData && Date.now() - cachedData.timestamp < cacheTTL) {
      branch = cachedData.branch;
      if (branch) {
        matchingBranch = branch.name;
        break;
      }
      continue;
    }

    try {
      const headers = {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const searchUrl = new URL(branchesUrl.toString());
      searchUrl.searchParams.set('search', branchToTry);

      const response = await fetch(searchUrl.toString(), {
        headers,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or missing token');
      }
      if (response.status === 403) {
        throw new Error('Forbidden: Insufficient permissions');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (!response.ok) {
        throw new Error(
          `GitLab API error: ${response.status} ${response.statusText}`,
        );
      }

      const branches = await response.json();
      const exactMatch = branches.find(
        (b: GitLabBranch) => b.name === branchToTry,
      );

      // Update cache
      branchCache.set(cacheKey, {
        branch: exactMatch || null,
        timestamp: Date.now(),
      });

      if (exactMatch) {
        matchingBranch = exactMatch.name;
        break;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('GitLab API request timed out');
      }
      throw error;
    }
  }

  if (!matchingBranch) {
    throw new Error('No matching branch found in repository');
  }

  // Everything after the branch name is the file path
  const branchSegments = matchingBranch.split('/').length;
  const filePathSegments = segments.slice(branchSegments);

  if (filePathSegments.length === 0) {
    throw new Error('No file path found after branch name');
  }

  // Create a new URL instance to avoid modifying the input
  const resultUrl = new URL(url.origin);

  // Update the URL for the file content
  resultUrl.pathname = [
    ...(relativePath ? [relativePath] : []),
    'api/v4/projects',
    projectID,
    'repository/files',
    encodeURIComponent(decodeURIComponent(filePathSegments.join('/'))),
    'raw',
  ].join('/');

  resultUrl.search = `?ref=${encodeURIComponent(matchingBranch)}`;
  return resultUrl;
}
