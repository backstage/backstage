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
import { ScmAuthApi } from '@backstage/integration-react';
import { ConfigApi } from '@backstage/core-plugin-api';
import { getBranchName, getCatalogFilename } from '../components/helpers';
import { createAzurePullRequest } from './AzureRepoApiClient';

export interface AzureRepoParts {
  tenantUrl: string;
  repoName: string;
  project: string;
}

export function parseAzureUrl(repoUrl: string): AzureRepoParts {
  const { org, repo, project, host } = parseRepoUrl(repoUrl);
  if (!org || !repo || !project) {
    throw new Error(
      'Invalid AzureDevops Repository. Please use a valid repository url and try again ',
    );
  }
  const tenantUrl = `https://${host}/${org}`;

  return { tenantUrl, repoName: repo, project: project };
}

export async function submitAzurePrToRepo(
  options: {
    title: string;
    body: string;
    fileContent: string;
    repositoryUrl: string;
  },
  scmAuthApi: ScmAuthApi,
  configApi: ConfigApi,
) {
  const { repositoryUrl, fileContent, title, body } = options;

  const branchName = getBranchName(configApi);
  const fileName = getCatalogFilename(configApi);

  const { token } = await scmAuthApi.getCredentials({
    url: repositoryUrl,
    additionalScope: {
      repoWrite: true,
    },
  });
  const { tenantUrl, repoName, project } = parseAzureUrl(repositoryUrl);
  const result = await createAzurePullRequest({
    token,
    fileContent,
    title,
    description: body,
    project,
    repository: repoName,
    branchName,
    tenantUrl,
    fileName,
  });
  const catalogLocation = `${result.repository.webUrl}?path=/${fileName}`;
  const prLocation = `${result.repository.webUrl}/pullrequest/${result.pullRequestId}`;
  return {
    link: prLocation!,
    location: catalogLocation,
  };
}

export function parseRepoUrl(sourceUrl: string) {
  const url = new URL(sourceUrl);

  let host = url.host;
  let org;
  let project;
  let repo;

  const parts = url.pathname.split('/').map(part => decodeURIComponent(part));
  if (parts[2] === '_git') {
    org = parts[1];
    project = repo = parts[3];
  } else if (parts[3] === '_git') {
    org = parts[1];
    project = parts[2];
    repo = parts[4];
  } else if (parts[4] === '_git') {
    host = `${host}/${parts[1]}`;
    org = parts[2];
    project = parts[3];
    repo = parts[5];
  }

  return { host, org, project, repo };
}
