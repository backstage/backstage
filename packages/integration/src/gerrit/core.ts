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
import { GerritIntegrationConfig } from '.';

const GERRIT_BODY_PREFIX = ")]}'";

type GitFile = {
  branch: string;
  filePath: string;
  project: string;
};

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
 * https://g.com/optional_path/{project}/+/refs/heads/{branch}/{filePath}
 *
 *
 * @param url - An URL pointing to a file stored in git.
 * @public
 */

export function parseGitilesUrl(
  config: GerritIntegrationConfig,
  url: string,
): GitFile {
  const urlPath = url.replace(config.gitilesBaseUrl!, '');
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
 * Return the url to fetch the contents of a file using the Gerrit API.
 *
 * @param url - An url pointing to a file in git.
 * @public
 */
export function getGerritFileContentsApiUrl(
  config: GerritIntegrationConfig,
  url: string,
) {
  const { branch, filePath, project } = parseGitilesUrl(config, url);

  return `${config.baseUrl}${getAuthenticationPrefix(
    config,
  )}projects/${encodeURIComponent(
    project,
  )}/branches/${branch}/files/${encodeURIComponent(filePath)}/content`;
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
