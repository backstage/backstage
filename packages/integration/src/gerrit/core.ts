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
import { trimStart } from 'lodash';
import { GerritIntegrationConfig } from './config';

const GERRIT_BODY_PREFIX = ")]}'";

/**
 * Parse a Gitiles URL and return branch, file path and project.
 *
 * @remarks
 *
 * Gerrit only handles code reviews so it does not have a native way to browse
 * or showing the content of gits. Image if Github only had the "pull requests"
 * tab.
 *
 * Any source code browsing is instead handled by optional services outside
 * Gerrit. The url format chosen for the Gerrit url reader is the one used by
 * the Gitiles project. Gerrit will work perfectly with Backstage without
 * having Gitiles installed but there are some places in the Backstage GUI
 * with links to the url used by the url reader. These will not work unless
 * the urls point to an actual Gitiles installation.
 *
 * Gitiles url:
 * https://g.com/optional_path/\{project\}/+/refs/heads/\{branch\}/\{filePath\}
 * https://g.com/a/optional_path/\{project\}/+/refs/heads/\{branch\}/\{filePath\}
 *
 *
 * @param url - An URL pointing to a file stored in git.
 * @public
 */

export function parseGerritGitilesUrl(
  config: GerritIntegrationConfig,
  url: string,
): { branch: string; filePath: string; project: string } {
  const baseUrlParse = new URL(config.gitilesBaseUrl!);
  const urlParse = new URL(url);

  // Remove the gerrit authentication prefix '/a/' from the url
  // In case of the gitilesBaseUrl is https://review.gerrit.com/plugins/gitiles
  // and the url provided is https://review.gerrit.com/a/plugins/gitiles/...
  // remove the prefix only if the pathname start with '/a/'
  const urlPath = urlParse.pathname
    .substring(urlParse.pathname.startsWith('/a/') ? 2 : 0)
    .replace(baseUrlParse.pathname, '');

  const parts = urlPath.split('/').filter(p => !!p);

  const projectEndIndex = parts.indexOf('+');

  if (projectEndIndex <= 0) {
    throw new Error(`Unable to parse project from url: ${url}`);
  }
  const project = trimStart(parts.slice(0, projectEndIndex).join('/'), '/');

  let branch: string;
  let filePath: string;

  // Parse a `refs/heads/` branch (eg, master)
  if (
    parts
      .slice(projectEndIndex + 1)
      .join('/')
      .startsWith('refs/heads/')
  ) {
    branch = parts[projectEndIndex + 3];
    filePath = parts.slice(projectEndIndex + 4).join('/');

    return {
      branch,
      filePath: filePath === '' ? '/' : filePath,
      project,
    };
  }

  // Parse a change URL like /+/refs/changes/20/884120/1/README.md
  if (
    parts
      .slice(projectEndIndex + 1, projectEndIndex + 6)
      .join('/')
      .match(new RegExp('^refs/changes/[0-9]{2}/[0-9]+/[0-9]+'))
  ) {
    // Keep 'refs/changes/20/884120/1' as the branch
    branch = parts.slice(projectEndIndex + 1, projectEndIndex + 6).join('/');
    filePath = parts.slice(projectEndIndex + 6).join('/');

    return {
      branch,
      filePath: filePath === '' ? '/' : filePath,
      project,
    };
  }

  throw new Error(`Unable to parse branch from url: ${url}`);
}

/**
 * Build a Gerrit Gitiles url that targets a specific path.
 *
 * @param config - A Gerrit provider config.
 * @param project - The name of the git project
 * @param branch - The branch we will target.
 * @param filePath - The absolute file path.
 * @public
 */
export function buildGerritGitilesUrl(
  config: GerritIntegrationConfig,
  project: string,
  branch: string,
  filePath: string,
): string {
  const ref = branch.startsWith('refs/') ? branch : `refs/heads/${branch}`;
  return `${config.gitilesBaseUrl}/${project}/+/${ref}/${trimStart(
    filePath,
    '/',
  )}`;
}

/**
 * Build a Gerrit Gitiles archive url that targets a specific branch and path
 *
 * @param config - A Gerrit provider config.
 * @param project - The name of the git project
 * @param branch - The branch we will target.
 * @param filePath - The absolute file path.
 * @public
 */
export function buildGerritGitilesArchiveUrl(
  config: GerritIntegrationConfig,
  project: string,
  branch: string,
  filePath: string,
): string {
  const archiveName =
    filePath === '/' || filePath === '' ? '.tar.gz' : `/${filePath}.tar.gz`;
  return `${getGitilesAuthenticationUrl(
    config,
  )}/${project}/+archive/refs/heads/${branch}${archiveName}`;
}

/**
 * Return the authentication prefix.
 *
 * @remarks
 *
 * To authenticate with a password the API url must be prefixed with "/a/".
 * If no password is set anonymous access (without the prefix) will
 * be used.
 *
 * @param config - A Gerrit provider config.
 * @public
 */
export function getAuthenticationPrefix(
  config: GerritIntegrationConfig,
): string {
  return config.password ? '/a/' : '/';
}

/**
 * Return the authentication gitiles url.
 *
 * @remarks
 *
 * To authenticate with a password the API url must be prefixed with "/a/".
 * If no password is set anonymous access (without the prefix) will
 * be used.
 *
 * @param config - A Gerrit provider config.
 */
export function getGitilesAuthenticationUrl(
  config: GerritIntegrationConfig,
): string {
  if (!config.baseUrl || !config.gitilesBaseUrl) {
    throw new Error(
      'Unexpected Gerrit config values. baseUrl or gitilesBaseUrl not set.',
    );
  }
  if (config.gitilesBaseUrl.startsWith(config.baseUrl)) {
    return config.gitilesBaseUrl.replace(
      config.baseUrl.concat('/'),
      config.baseUrl.concat(getAuthenticationPrefix(config)),
    );
  }
  if (config.password) {
    throw new Error(
      'Since the baseUrl (Gerrit) is not part of the gitilesBaseUrl, an authentication URL could not be constructed.',
    );
  }
  return config.gitilesBaseUrl!;
}

/**
 * Return the url to get branch info from the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @param url - An url pointing to a file in git.
 * @public
 */
export function getGerritBranchApiUrl(
  config: GerritIntegrationConfig,
  url: string,
) {
  const { branch, project } = parseGerritGitilesUrl(config, url);

  return `${config.baseUrl}${getAuthenticationPrefix(
    config,
  )}projects/${encodeURIComponent(project)}/branches/${branch}`;
}

/**
 * Return the url to clone the repo that is referenced by the url.
 *
 * @param url - An url pointing to a file in git.
 * @public
 */
export function getGerritCloneRepoUrl(
  config: GerritIntegrationConfig,
  url: string,
) {
  const { project } = parseGerritGitilesUrl(config, url);

  return `${config.cloneUrl}${getAuthenticationPrefix(config)}${project}`;
}

/**
 * Return the url to fetch the contents of a file using the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @param url - An url pointing to a file in git.
 * @public
 */
export function getGerritFileContentsApiUrl(
  config: GerritIntegrationConfig,
  url: string,
) {
  const { branch, filePath, project } = parseGerritGitilesUrl(config, url);

  if (branch.startsWith('refs/changes/')) {
    // branch should look like refs/changes/CD/ABCD/EF
    const parts = branch.split('/');
    const change = parts[3];
    const revision = parts[4];
    return `${config.baseUrl}${getAuthenticationPrefix(
      config,
    )}changes/${change}/revisions/${revision}/files/${encodeURIComponent(
      filePath,
    )}/content`;
  }

  return `${config.baseUrl}${getAuthenticationPrefix(
    config,
  )}projects/${encodeURIComponent(
    project,
  )}/branches/${branch}/files/${encodeURIComponent(filePath)}/content`;
}

/**
 * Return the url to query available projects using the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @public
 */
export function getGerritProjectsApiUrl(config: GerritIntegrationConfig) {
  return `${config.baseUrl}${getAuthenticationPrefix(config)}projects/`;
}

/**
 * Return request headers for a Gerrit provider.
 *
 * @param config - A Gerrit provider config
 * @public
 */
export function getGerritRequestOptions(config: GerritIntegrationConfig): {
  headers?: Record<string, string>;
} {
  const headers: Record<string, string> = {};

  if (!config.password) {
    return headers;
  }
  const buffer = Buffer.from(`${config.username}:${config.password}`, 'utf8');
  headers.Authorization = `Basic ${buffer.toString('base64')}`;
  return {
    headers,
  };
}

/**
 * Parse the json response from Gerrit and strip the magic prefix.
 *
 * @remarks
 *
 * To prevent against XSSI attacks the JSON response body from Gerrit starts
 * with a magic prefix that must be stripped before it can be fed to a JSON
 * parser.
 *
 * @param response - An API response.
 * @public
 */
export async function parseGerritJsonResponse(
  response: Response,
): Promise<unknown> {
  const responseBody = await response.text();
  if (responseBody.startsWith(GERRIT_BODY_PREFIX)) {
    try {
      return JSON.parse(responseBody.slice(GERRIT_BODY_PREFIX.length));
    } catch (ex) {
      throw new Error(
        `Invalid response from Gerrit: ${responseBody.slice(0, 10)} - ${ex}`,
      );
    }
  }
  throw new Error(
    `Gerrit JSON body prefix missing. Found: ${responseBody.slice(0, 10)}`,
  );
}
