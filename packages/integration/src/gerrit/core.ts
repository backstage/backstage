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
import { join, takeWhile, trimEnd, trimStart } from 'lodash';
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
 * @deprecated `parseGerritGitilesUrl` is deprecated. Use
 *  {@link parseGitilesUrlRef} instead.
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

  const branchIndex = parts.indexOf('heads');
  if (branchIndex <= 0) {
    throw new Error(`Unable to parse branch from url: ${url}`);
  }
  const branch = parts[branchIndex + 1];
  const filePath = parts.slice(branchIndex + 2).join('/');

  return {
    branch,
    filePath: filePath === '' ? '/' : filePath,
    project,
  };
}

/**
 * Parses Gitiles urls and returns the following:
 *
 * - The project
 * - The type of ref. I.e: branch name, SHA, HEAD or tag.
 * - The file path from the repo root.
 * - The base path as the path that points to the repo root.
 *
 * Supported types of gitiles urls that point to:
 *
 * - Branches
 * - Tags
 * - A commit SHA
 * - HEAD
 *
 * @param config - A Gerrit provider config.
 * @param url - An url to a file or folder in Gitiles.
 * @public
 */
export function parseGitilesUrlRef(
  config: GerritIntegrationConfig,
  url: string,
): {
  project: string;
  path: string;
  ref: string;
  refType: 'sha' | 'branch' | 'tag' | 'head';
  basePath: string;
} {
  const baseUrlParse = new URL(config.gitilesBaseUrl!);
  const urlParse = new URL(url);
  // Remove the gerrit authentication prefix '/a/' from the url
  // In case of the gitilesBaseUrl is https://review.gerrit.com/plugins/gitiles
  // and the url provided is https://review.gerrit.com/a/plugins/gitiles/...
  // remove the prefix only if the pathname start with '/a/'
  const urlPath = trimStart(
    urlParse.pathname
      .substring(urlParse.pathname.startsWith('/a/') ? 2 : 0)
      .replace(baseUrlParse.pathname, ''),
    '/',
  );

  // Find the project by taking everything up to "/+/".
  const parts = urlPath.split('/').filter(p => !!p);
  const projectParts = takeWhile(parts, p => p !== '+');
  if (projectParts.length === 0) {
    throw new Error(`Unable to parse gitiles url: ${url}`);
  }
  // Also remove the "+" after the project.
  const rest = parts.slice(projectParts.length + 1);
  const project = join(projectParts, '/');

  // match <project>/+/HEAD/<path>
  if (rest.length > 0 && rest[0] === 'HEAD') {
    const ref = rest.shift()!;
    const path = join(rest, '/');
    return {
      project,
      ref,
      refType: 'head' as const,
      path: path || '/',
      basePath: trimEnd(url.replace(path, ''), '/'),
    };
  }
  // match <project>/+/<sha>/<path>
  if (rest.length > 0 && rest[0].length === 40) {
    const ref = rest.shift()!;
    const path = join(rest, '/');
    return {
      project,
      ref,
      refType: 'sha' as const,
      path: path || '/',
      basePath: trimEnd(url.replace(path, ''), '/'),
    };
  }
  const remainingPath = join(rest, '/');
  // Regexp for matching "refs/tags/<tag>" or "refs/heads/<branch>/"
  const refsRegexp = /^refs\/(?<refsReference>heads|tags)\/(?<ref>.*?)(\/|$)/;
  const result = refsRegexp.exec(remainingPath);
  if (result) {
    const matchString = result[0];
    let refType;
    const { refsReference, ref } = result.groups || {};
    const path = remainingPath.replace(matchString, '');
    switch (refsReference) {
      case 'heads':
        refType = 'branch' as const;
        break;
      case 'tags':
        refType = 'tag' as const;
        break;
      default:
        throw new Error(`Unable to parse gitiles url: ${url}`);
    }
    return {
      project,
      ref,
      refType,
      path: path || '/',
      basePath: trimEnd(url.replace(path, ''), '/'),
    };
  }
  throw new Error(`Unable to parse gitiles : ${url}`);
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
  return `${
    config.gitilesBaseUrl
  }/${project}/+/refs/heads/${branch}/${trimStart(filePath, '/')}`;
}

/**
 * Build a Gerrit Gitiles archive url that targets a specific branch and path
 *
 * @param config - A Gerrit provider config.
 * @param project - The name of the git project
 * @param branch - The branch we will target.
 * @param filePath - The absolute file path.
 * @public
 * @deprecated `buildGerritGitilesArchiveUrl` is deprecated. Use
 *  {@link buildGerritGitilesArchiveUrlFromLocation} instead.
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
 * Build a Gerrit Gitiles archive url from a Gitiles url.
 *
 * @param config - A Gerrit provider config.
 * @param url - The gitiles url
 * @public
 */
export function buildGerritGitilesArchiveUrlFromLocation(
  config: GerritIntegrationConfig,
  url: string,
): string {
  const {
    path: filePath,
    ref,
    project,
    refType,
  } = parseGitilesUrlRef(config, url);
  const archiveName =
    filePath === '/' || filePath === '' ? '.tar.gz' : `/${filePath}.tar.gz`;
  if (refType === 'branch') {
    return `${getGitilesAuthenticationUrl(
      config,
    )}/${project}/+archive/refs/heads/${ref}${archiveName}`;
  }
  if (refType === 'sha') {
    return `${getGitilesAuthenticationUrl(
      config,
    )}/${project}/+archive/${ref}${archiveName}`;
  }
  throw new Error(`Unsupported gitiles ref type: ${refType}`);
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
  const { ref, refType, path, project } = parseGitilesUrlRef(config, url);

  // https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#get-content
  if (refType === 'branch') {
    return `${config.baseUrl}${getAuthenticationPrefix(
      config,
    )}projects/${encodeURIComponent(
      project,
    )}/branches/${ref}/files/${encodeURIComponent(path)}/content`;
  }
  // https://gerrit-review.googlesource.com/Documentation/rest-api-projects.html#get-content-from-commit
  if (refType === 'sha') {
    return `${config.baseUrl}${getAuthenticationPrefix(
      config,
    )}projects/${encodeURIComponent(
      project,
    )}/commits/${ref}/files/${encodeURIComponent(path)}/content`;
  }
  throw new Error(`Unsupported gitiles ref type: ${refType}`);
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
