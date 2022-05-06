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
import { GitHubIntegrationConfig } from './config';
import { GithubCredentials } from './types';
import { graphql } from '@octokit/graphql';
import { getRepository } from '@backstage/plugin-catalog-backend-module-github';

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
export function getGitHubFileFetchUrl(
  url: string,
  config: GitHubIntegrationConfig,
  credentials: GithubCredentials,
): string {
  try {

    // need to resolve the default branch.
    // need to get the repository to do this. 
    // copy code from GithubDiscoveryprocessor.ts that gets repos 
    // then find the correct repo with name 
    const { owner, name, ref, filepathtype, filepath, organization } = parseGitUrl(url);
    const branchName = resolveBranchName(ref, organization, name, config.apiBaseUrl, credentials);
    if (
      !owner ||
      !name ||
      !branchName ||
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
      return `${config.apiBaseUrl}/repos/${owner}/${name}/contents/${pathWithoutSlash}?ref=${branchName}`;
    }
    return `${config.rawBaseUrl}/${owner}/${name}/${branchName}/${pathWithoutSlash}`;
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
  config: GitHubIntegrationConfig,
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
  config: GitHubIntegrationConfig,
  credentials: GithubCredentials,
): 'api' | 'raw' {
  if (config.apiBaseUrl && (credentials.token || !config.rawBaseUrl)) {
    return 'api';
  }
  return 'raw';
}

async function resolveBranchName(
  currentBranchName:string, 
  org:string, 
  repoId:string, 
  githubApiUrl: string|undefined, 
  credentials: GithubCredentials ) : Promise<string> {
  if(currentBranchName !== 'dummy'){ 
    return currentBranchName;
  }
    // Building the org url here so that the github creds provider doesn't need to know
    // about how to handle the wild card which is special for this processor.
  const { headers } = credentials;
  const client = graphql.defaults({
    baseUrl: githubApiUrl,
    headers,
  });

  const repository = await getRepository(client, org, repoId);
  const name = repository?.defaultBranchRef?.name ?? '';
  return name; 
}
