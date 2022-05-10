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
import { BitbucketCloudIntegrationConfig } from './config';

/**
 * Given a URL pointing to a path on a provider, returns the default branch.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketCloudDefaultBranch(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): Promise<string> {
  const { name: repoName, owner: project } = parseGitUrl(url);

  const branchUrl = `${config.apiBaseUrl}/repositories/${project}/${repoName}`;
  const response = await fetch(
    branchUrl,
    getBitbucketCloudRequestOptions(config),
  );

  if (!response.ok) {
    const message = `Failed to retrieve default branch from ${branchUrl}, ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const repoInfo = await response.json();
  const defaultBranch = repoInfo.mainbranch.name;
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
export async function getBitbucketCloudDownloadUrl(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): Promise<string> {
  const {
    name: repoName,
    owner: project,
    ref,
    protocol,
    resource,
  } = parseGitUrl(url);

  let branch = ref;
  if (!branch) {
    branch = await getBitbucketCloudDefaultBranch(url, config);
  }
  return `${protocol}://${resource}/${project}/${repoName}/get/${branch}.tar.gz`;
}

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
 * to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getBitbucketCloudFileFetchUrl(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): string {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUrl(url);
    if (!owner || !name || (filepathtype !== 'src' && filepathtype !== 'raw')) {
      throw new Error('Invalid Bitbucket Cloud URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');

    if (!ref) {
      throw new Error('Invalid Bitbucket Cloud URL or file path');
    }
    return `${config.apiBaseUrl}/repositories/${owner}/${name}/src/${ref}/${pathWithoutSlash}`;
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
export function getBitbucketCloudRequestOptions(
  config: BitbucketCloudIntegrationConfig,
): { headers: Record<string, string> } {
  const headers: Record<string, string> = {};

  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );
    headers.Authorization = `Basic ${buffer.toString('base64')}`;
  }

  return {
    headers,
  };
}
