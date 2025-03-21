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
import parseGitUrl from 'git-url-parse';
import { BitbucketServerIntegrationConfig } from './config';

/**
 * Given a URL pointing to a path on a provider, returns the default branch.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketServerDefaultBranch(
  url: string,
  config: BitbucketServerIntegrationConfig,
): Promise<string> {
  const { name: repoName, owner: project } = parseGitUrl(url);

  // Bitbucket Server https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp184
  let branchUrl = `${config.apiBaseUrl}/projects/${project}/repos/${repoName}/default-branch`;

  let response = await fetch(
    branchUrl,
    getBitbucketServerRequestOptions(config),
  );

  if (response.status === 404) {
    // First try the new format, and then if it gets specifically a 404 it should try the old format
    // (to support old  Atlassian Bitbucket Server v5.11.1 format )
    branchUrl = `${config.apiBaseUrl}/projects/${project}/repos/${repoName}/branches/default`;
    response = await fetch(branchUrl, getBitbucketServerRequestOptions(config));
  }

  if (!response.ok) {
    const message = `Failed to retrieve default branch from ${branchUrl}, ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const { displayId } = await response.json();
  const defaultBranch = displayId;
  if (!defaultBranch) {
    throw new Error(
      `Failed to read default branch from ${branchUrl}. ` +
        `Response ${response.status} ${response.json()}`,
    );
  }
  return defaultBranch;
}

/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketServerDownloadUrl(
  url: string,
  config: BitbucketServerIntegrationConfig,
): Promise<string> {
  const { name: repoName, owner: project, ref, filepath } = parseGitUrl(url);

  let branch = ref;
  if (!branch) {
    branch = await getBitbucketServerDefaultBranch(url, config);
  }
  // path will limit the downloaded content
  // /docs will only download the docs folder and everything below it
  // /docs/index.md will download the docs folder and everything below it
  const path = filepath
    ? `&path=${encodeURIComponent(decodeURIComponent(filepath))}`
    : '';
  return `${config.apiBaseUrl}/projects/${project}/repos/${repoName}/archive?format=tgz&at=${branch}&prefix=${project}-${repoName}${path}`;
}

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://bitbucket.company.com/projectname/reponame/src/main/file.yaml
 * to:   https://bitbucket.company.com/rest/api/1.0/project/projectname/reponame/raw/file.yaml?at=main
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getBitbucketServerFileFetchUrl(
  url: string,
  config: BitbucketServerIntegrationConfig,
): string {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUrl(url);
    if (
      !owner ||
      !name ||
      (filepathtype !== 'browse' &&
        filepathtype !== 'raw' &&
        filepathtype !== 'src')
    ) {
      throw new Error('Invalid Bitbucket Server URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');
    return `${config.apiBaseUrl}/projects/${owner}/repos/${name}/raw/${pathWithoutSlash}?at=${ref}`;
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 */
export function getBitbucketServerRequestOptions(
  config: BitbucketServerIntegrationConfig,
): { headers: Record<string, string> } {
  const headers: Record<string, string> = {};

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  } else if (config.username && config.password) {
    const buffer = Buffer.from(`${config.username}:${config.password}`, 'utf8');
    headers.Authorization = `Basic ${buffer.toString('base64')}`;
  }

  return {
    headers,
  };
}
