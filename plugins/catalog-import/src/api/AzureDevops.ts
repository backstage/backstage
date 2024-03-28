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
import { AzureIntegration } from '@backstage/integration';
import { ScmAuthApi } from '@backstage/integration-react';
import { ConfigApi } from '@backstage/core-plugin-api';
import { getBranchName, getCatalogFilename } from '../components/helpers';
import { createAzurePullRequest } from './AzureRepoApiClient';
import parseGitUrl from 'git-url-parse';

export interface AzureRepoParts {
  tenantUrl: string;
  repoName: string;
  project: string;
}

export function parseAzureUrl(
  repoUrl: string,
  integration: AzureIntegration,
): AzureRepoParts {
  const { organization, owner, name } = parseGitUrl(repoUrl);
  const tenantUrl = `https://${integration.config.host}/${organization}`;
  return { tenantUrl, repoName: name, project: owner };
}

export async function submitAzurePrToRepo(
  integration: AzureIntegration,
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
  const { tenantUrl, repoName, project } = parseAzureUrl(
    repositoryUrl,
    integration,
  );
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
