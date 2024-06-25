/*
 * Copyright 2024 The Backstage Authors
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
import { HarnessIntegrationConfig } from './config';

/**
 * Given a URL pointing to a file, returns a URL
 * for editing the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://app.harness.io/a/b/src/branchname/path/to/c.yaml
 * or:   https://app.harness.io/a/b/_edit/branchname/path/to/c.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getHarnessEditContentsUrl(
  config: HarnessIntegrationConfig,
  url: string,
) {
  const parsedUrl = parseHarnessUrl(config, url);
  return `${parsedUrl.baseUrl}/ng/account/${parsedUrl.accountId}/module/code/orgs/${parsedUrl.orgName}/projects/${parsedUrl.projectName}/repos/${parsedUrl.repoName}/files/${parsedUrl.branch}/~/${parsedUrl.path}`;
}

/**
 * Given a file path URL,
 * it returns an API URL which returns the contents of the file .
 * @remarks
 *
 * Converts
 * from: https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml
 * to:   https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/content/all-apis.yaml?routingId=accountId&include_commit=false&ref=refMain
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getHarnessFileContentsUrl(
  config: HarnessIntegrationConfig,
  url: string,
) {
  const parsedUrl = parseHarnessUrl(config, url);
  return `${parsedUrl.baseUrl}/gateway/code/api/v1/repos/${parsedUrl.accountId}/${parsedUrl.orgName}/${parsedUrl.projectName}/${parsedUrl.repoName}/+/raw/${parsedUrl.path}?routingId=${parsedUrl.accountId}&git_ref=refs/heads/${parsedUrl.refString}`;
}

/**
 * Given a URL pointing to a repository/path, returns a URL
 * for archive contents of the repository.
 *
 * @remarks
 *
 * Converts
 * from: https://qa.harness.io/ng/account/accountId/module/code/orgs/orgId/projects/projectName/repos/repoName/files/branch/~/fileName
 * to:   https://qa.harness.io/gateway/code/api/v1/repos/accountId/orgId/projectName/repoName/+/archive/branch.zip?routingId=accountId
 *
 * @param url - A URL pointing to a repository/path
 * @param config - The relevant provider config
 * @public
 */
export function getHarnessArchiveUrl(
  config: HarnessIntegrationConfig,
  url: string,
) {
  const parsedUrl = parseHarnessUrl(config, url);
  return `${parsedUrl.baseUrl}/gateway/code/api/v1/repos/${parsedUrl.accountId}/${parsedUrl.orgName}/${parsedUrl.projectName}/${parsedUrl.repoName}/+/archive/${parsedUrl.branch}.zip?routingId=${parsedUrl.accountId}`;
}

/**
 * Given a URL pointing to a repository branch, returns a URL
 * for latest commit information.
 *
 * @remarks
 *
 * Converts
 * from: https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projectName/repos/repoName/files/branchName
 * to:   https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projectName/repoName/+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName
 *
 * @param url - A URL pointing to a repository branch
 * @param config - The relevant provider config
 * @public
 */
export function getHarnessLatestCommitUrl(
  config: HarnessIntegrationConfig,
  url: string,
) {
  const parsedUrl = parseHarnessUrl(config, url);
  return `${parsedUrl.baseUrl}/gateway/code/api/v1/repos/${parsedUrl.accountId}/${parsedUrl.orgName}/${parsedUrl.projectName}/${parsedUrl.repoName}/+/content?routingId=${parsedUrl.accountId}&include_commit=true&git_ref=refs/heads/${parsedUrl.branch}`;
}

/**
 * Return request headers for a Harness Code provider.
 *
 * @param config - A Harness Code provider config
 * @public
 */
export function getHarnessRequestOptions(config: HarnessIntegrationConfig): {
  headers?: Record<string, string>;
} {
  const headers: Record<string, string> = {};
  const { token, apiKey } = config;

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  } else if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    headers,
  };
}

/**
 * Return parsed git url properties.
 *
 * @param config - A Harness provider config
 * @param url - A URL pointing to a repository
 * @public
 */
export function parseHarnessUrl(
  config: HarnessIntegrationConfig,
  url: string,
): {
  baseUrl: string;
  accountId: string;
  orgName: string;
  projectName: string;
  refString: string;
  repoName: string;
  path: string;
  refDashStr: string;
  branch: string;
} {
  const baseUrl = `https://${config.host}`;
  try {
    const pathUrl = new URL(url);
    const pathSegments = pathUrl.pathname
      .split('/')
      .filter(segment => segment !== '');
    const urlParts = pathUrl.pathname.split('/');
    const [
      _ng,
      _account,
      accountId,
      _module,
      _moduleName,
      _org,
      orgName,
      _projects,
      projectName,
      _repos,
      repoName,
      _files,
      _ref,
      _branch,
      ..._path
    ] = pathSegments;
    const refAndPath = urlParts.slice(
      urlParts.findIndex(i => i === 'files' || i === 'edit') + 1,
    );
    const refIndex = refAndPath.findIndex(item => item === '~');
    const refString = refAndPath.slice(0, refIndex).join('/');
    const pathWithoutSlash =
      refIndex !== -1
        ? refAndPath
            .slice(refIndex + 1)
            .join('/')
            .replace(/^\//, '')
        : '';
    return {
      baseUrl: baseUrl,
      accountId: accountId,
      orgName: orgName,
      projectName: projectName,
      refString: refString,
      path: pathWithoutSlash,
      repoName: repoName,
      refDashStr: refAndPath.slice(0, refIndex).join('-'),
      branch:
        refIndex !== -1
          ? refAndPath.slice(0, refIndex).join('/')
          : refAndPath.join('/'),
    };
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}
