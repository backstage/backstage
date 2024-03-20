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

import {
  GithubIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { ScmAuthApi } from '@backstage/integration-react';
import { Octokit } from '@octokit/rest';
import { getBranchName, getCatalogFilename } from '../components/helpers';
import { ConfigApi } from '@backstage/core-plugin-api';
import { Base64 } from 'js-base64';

export interface GitHubOptions {
  owner: string;
  repo: string;
  title: string;
  body: string;
  fileContent: string;
  repositoryUrl: string;
  githubIntegrationConfig: GithubIntegrationConfig;
}
export const getGithubIntegrationConfig = (
  scmIntegrationsApi: ScmIntegrationRegistry,
  location: string,
) => {
  const integration = scmIntegrationsApi.github.byUrl(location);
  if (!integration) {
    return undefined;
  }

  const { name: repo, owner } = parseGitUrl(location);
  return {
    repo,
    owner,
    githubIntegrationConfig: integration.config,
  };
};

export async function submitGitHubPrToRepo(
  options: GitHubOptions,
  scmAuthApi: ScmAuthApi,
  configApi: ConfigApi,
): Promise<{ link: string; location: string }> {
  const {
    owner,
    repo,
    title,
    body,
    fileContent,
    repositoryUrl,
    githubIntegrationConfig,
  } = options;

  const { token } = await scmAuthApi.getCredentials({
    url: repositoryUrl,
    additionalScope: {
      repoWrite: true,
    },
  });

  const octo = new Octokit({
    auth: token,
    baseUrl: githubIntegrationConfig.apiBaseUrl,
  });

  const branchName = getBranchName(configApi);
  const fileName = getCatalogFilename(configApi);

  const repoData = await octo.repos
    .get({
      owner,
      repo,
    })
    .catch(e => {
      throw new Error(formatHttpErrorMessage("Couldn't fetch repo data", e));
    });

  const parentRef = await octo.git
    .getRef({
      owner,
      repo,
      ref: `heads/${repoData.data.default_branch}`,
    })
    .catch(e => {
      throw new Error(
        formatHttpErrorMessage("Couldn't fetch default branch data", e),
      );
    });

  await octo.git
    .createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: parentRef.data.object.sha,
    })
    .catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          `Couldn't create a new branch with name '${branchName}'`,
          e,
        ),
      );
    });

  await octo.repos
    .createOrUpdateFileContents({
      owner,
      repo,
      path: fileName,
      message: title,
      content: Base64.encode(fileContent),
      branch: branchName,
    })
    .catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          `Couldn't create a commit with ${fileName} file added`,
          e,
        ),
      );
    });

  const pullRequestResponse = await octo.pulls
    .create({
      owner,
      repo,
      title,
      head: branchName,
      body,
      base: repoData.data.default_branch,
    })
    .catch(e => {
      throw new Error(
        formatHttpErrorMessage(
          `Couldn't create a pull request for ${branchName} branch`,
          e,
        ),
      );
    });

  return {
    link: pullRequestResponse.data.html_url,
    location: `https://${githubIntegrationConfig.host}/${owner}/${repo}/blob/${repoData.data.default_branch}/${fileName}`,
  };
}

function formatHttpErrorMessage(
  message: string,
  error: { status: number; message: string },
) {
  return `${message}, received http response status code ${error.status}: ${error.message}`;
}
