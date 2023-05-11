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

import parseGitUrl from 'git-url-parse';
import { GithubIntegrationConfig } from './config';
import { GithubCredentials } from './types';

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://github.com/a/b/blob/branchname/path/to/c.yaml
 * to:   https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname
 * or:   https://raw.githubusercontent.com/a/b/branchname/c.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getGithubFileFetchUrl(
  url: string,
  config: GithubIntegrationConfig,
  credentials: GithubCredentials,
): string {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUrl(url);
    if (
      !owner ||
      !name ||
      !ref ||
      // GitHub is automatically redirecting tree urls to blob urls so it's
      // fine to pass a tree url.
      (filepathtype !== 'blob' &&
        filepathtype !== 'raw' &&
        filepathtype !== 'tree')
    ) {
      throw new Error('Invalid GitHub URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');
    if (chooseEndpoint(config, credentials) === 'api') {
      return `${config.apiBaseUrl}/repos/${owner}/${name}/contents/${pathWithoutSlash}?ref=${ref}`;
    }
    return `${config.rawBaseUrl}/${owner}/${name}/${ref}/${pathWithoutSlash}`;
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @deprecated This function is no longer used internally
 * @param config - The relevant provider config
 * @public
 */
export function getGitHubRequestOptions(
  config: GithubIntegrationConfig,
  credentials: GithubCredentials,
): { headers: Record<string, string> } {
  const headers: Record<string, string> = {};

  if (chooseEndpoint(config, credentials) === 'api') {
    headers.Accept = 'application/vnd.github.v3.raw';
  }

  if (credentials.token) {
    headers.Authorization = `token ${credentials.token}`;
  }

  return { headers };
}

export function chooseEndpoint(
  config: GithubIntegrationConfig,
  credentials: GithubCredentials,
): 'api' | 'raw' {
  if (config.apiBaseUrl && (credentials.token || !config.rawBaseUrl)) {
    return 'api';
  }
  return 'raw';
}
