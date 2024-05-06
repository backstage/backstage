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
  try {
    const baseUrl = `https://${config.host}`;
    const [
      _blank,
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
      ...path
    ] = url.replace(baseUrl, '').split('/');
    const pathWithoutSlash = path.join('/').replace(/^\//, '');
    return `${baseUrl}/gateway/code/api/v1/repos/${accountId}/${orgName}/${projectName}/${repoName}/+/edit/${pathWithoutSlash}`;
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Given a file path URL,
 * it returns an API URL which returns the contents of the file.
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
  try {
    const baseUrl = `https://${config.host}`;
    const [
      _blank,
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
      ...path
    ] = url.replace(baseUrl, '').split('/');
    const urlParts = url.replace(baseUrl, '').split('/');
    const refAndPath = urlParts.slice(13);
    const refIndex = refAndPath.findIndex(item => item === '~');
    const refString = refAndPath.slice(0, refIndex);
    const pathWithoutSlash = path.join('/').replace(/^\//, '');
    return `${baseUrl}/gateway/code/api/v1/repos/${accountId}/${orgName}/${projectName}/${repoName}/+/raw/${pathWithoutSlash}?routingId=${accountId}&git_ref=${refString}`;
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
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
