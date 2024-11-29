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

import { AzureUrl } from './AzureUrl';

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * - from: `https://dev.azure.com/{organization}/{project}/_git/reponame?path={path}&version=GB{commitOrBranch}&_a=contents`
 * - to:   `https://dev.azure.com/{organization}/{project}/_apis/git/repositories/reponame/items?path={path}&version={commitOrBranch}`
 *
 * @param url - A URL pointing to a file
 * @public
 */
export function getAzureFileFetchUrl(url: string): string {
  return AzureUrl.fromRepoUrl(url).toFileUrl();
}

/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @public
 */
export function getAzureDownloadUrl(url: string): string {
  return AzureUrl.fromRepoUrl(url).toArchiveUrl();
}

/**
 * Given a URL, return the API URL to fetch commits on the branch.
 *
 * @param url - A URL pointing to a repository or a sub-path
 * @public
 */
export function getAzureCommitsUrl(url: string): string {
  return AzureUrl.fromRepoUrl(url).toCommitsUrl();
}
