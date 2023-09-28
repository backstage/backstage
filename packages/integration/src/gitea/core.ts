/*
 * Copyright 2022 The Backstage Authors
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
import { GiteaIntegrationConfig } from './config';

/**
 * Given a URL pointing to a file, returns a URL
 * for editing the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://gitea.com/a/b/src/branchname/path/to/c.yaml
 * or:   https://gitea.com/a/b/_edit/branchname/path/to/c.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getGiteaEditContentsUrl(
  config: GiteaIntegrationConfig,
  url: string,
) {
  const giteaUrl = parseGiteaUrl(config, url);
  return `${giteaUrl.url}/${giteaUrl.owner}/${giteaUrl.name}/_edit/${giteaUrl.ref}/${giteaUrl.path}`;
}

/**
 * Given a URL pointing to a file, returns an api URL
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://gitea.com/a/b/src/branch/branchname/path/to/c.yaml
 * to:   https://gitea.com/api/v1/repos/a/b/contents/path/to/c.yaml?ref=branchname
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getGiteaFileContentsUrl(
  config: GiteaIntegrationConfig,
  url: string,
) {
  const giteaUrl = parseGiteaUrl(config, url);
  return `${giteaUrl.url}/api/v1/repos/${giteaUrl.owner}/${giteaUrl.name}/contents/${giteaUrl.path}?ref=${giteaUrl.ref}`;
}

/**
 * Given a URL pointing to a repository/path, returns a URL
 * for archive contents of the repository.
 *
 * @remarks
 *
 * Converts
 * from: https://gitea.com/a/b/src/branchname
 * or:   https://gitea.com/api/v1/repos/a/b/archive/branchname.tar.gz
 *
 * @param url - A URL pointing to a repository/path
 * @param config - The relevant provider config
 * @public
 */
export function getGiteaArchiveUrl(
  config: GiteaIntegrationConfig,
  url: string,
) {
  const giteaUrl = parseGiteaUrl(config, url);
  return `${giteaUrl.url}/api/v1/repos/${giteaUrl.owner}/${giteaUrl.name}/archive/${giteaUrl.ref}.tar.gz`;
}

/**
 * Given a URL pointing to a repository branch, returns a URL
 * for latest commit information.
 *
 * @remarks
 *
 * Converts
 * from: https://gitea.com/a/b/src/branchname
 * or:   https://gitea.com/api/v1/repos/a/b/git/commits/branchname
 *
 * @param url - A URL pointing to a repository branch
 * @param config - The relevant provider config
 * @public
 */
export function getGiteaLatestCommitUrl(
  config: GiteaIntegrationConfig,
  url: string,
) {
  const giteaUrl = parseGiteaUrl(config, url);
  return `${giteaUrl.url}/api/v1/repos/${giteaUrl.owner}/${giteaUrl.name}/git/commits/${giteaUrl.ref}`;
}

/**
 * Return request headers for a Gitea provider.
 *
 * @param config - A Gitea provider config
 * @public
 */
export function getGiteaRequestOptions(config: GiteaIntegrationConfig): {
  headers?: Record<string, string>;
} {
  const headers: Record<string, string> = {};
  const { username, password } = config;

  if (!password) {
    return headers;
  }

  if (username) {
    headers.Authorization = `basic ${Buffer.from(
      `${username}:${password}`,
    ).toString('base64')}`;
  } else {
    headers.Authorization = `token ${password}`;
  }

  return {
    headers,
  };
}

/**
 * Return parsed git url properties.
 *
 * @param config - A Gitea provider config
 * @param url - A URL pointing to a repository
 * @public
 */
export function parseGiteaUrl(
  config: GiteaIntegrationConfig,
  url: string,
): {
  url: string;
  owner: string;
  name: string;
  ref: string;
  path: string;
} {
  const baseUrl = config.baseUrl ?? `https://${config.host}`;
  try {
    const [_blank, owner, name, _src, _branch, ref, ...path] = url
      .replace(baseUrl, '')
      .split('/');
    const pathWithoutSlash = path.join('/').replace(/^\//, '');

    return {
      url: baseUrl,
      owner: owner,
      name: name,
      ref: ref,
      path: pathWithoutSlash,
    };
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}
