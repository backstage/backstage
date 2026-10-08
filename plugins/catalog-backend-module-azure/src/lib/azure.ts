/*
 * Copyright 2021 The Backstage Authors
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
  AzureDevOpsCredentialsProvider,
  AzureIntegrationConfig,
} from '@backstage/integration';

export interface CodeSearchResponse {
  count: number;
  results: CodeSearchResultItem[];
}

export interface CodeSearchResultItem {
  fileName: string;
  path: string;
  repository: {
    name: string;
  };
  project: {
    name: string;
  };
  branch?: string;
}

interface CodeSearchRequest {
  searchText: string;
  $orderBy: Array<{ field: string; sortOrder: string }>;
  $skip: number;
  $top: number;
  filters?: {
    Branch: string[];
  };
}

export interface GitRepositoryListResponse {
  count: number;
  value: GitRepository[];
}

export interface GitRepository {
  id: string;
  name: string;
  // Missing when the repository is empty
  defaultBranch?: string;
  isDisabled?: boolean;
  // Only present on forks
  isFork?: boolean;
  project: {
    name: string;
  };
}

const isCloud = (host: string) => {
  if (host === 'dev.azure.com') {
    return true;
  }

  if (host.endsWith('.visualstudio.com')) {
    return true;
  }

  return false;
};

const getOrganizationUrl = (azureConfig: AzureIntegrationConfig, org: string) =>
  azureConfig.host.endsWith('.visualstudio.com')
    ? `https://${azureConfig.host}`
    : `https://${azureConfig.host}/${org}`;

const PAGE_SIZE = 1000;
const GIT_API_VERSION = '6.0';

// codeSearch returns all files that matches the given search path.
export async function codeSearch(
  credentialsProvider: AzureDevOpsCredentialsProvider,
  azureConfig: AzureIntegrationConfig,
  org: string,
  project: string,
  repo: string,
  path: string,
  branch: string,
): Promise<CodeSearchResultItem[]> {
  const searchBaseUrl = isCloud(azureConfig.host)
    ? 'https://almsearch.dev.azure.com'
    : `https://${azureConfig.host}`;
  const searchUrl = `${searchBaseUrl}/${org}/_apis/search/codesearchresults?api-version=6.0-preview.1`;

  const url = getOrganizationUrl(azureConfig, org);

  let items: CodeSearchResultItem[] = [];
  let hasMorePages = true;

  do {
    const credentials = await credentialsProvider.getCredentials({
      url,
    });

    const searchRequestBody: CodeSearchRequest = {
      searchText: `path:${path} repo:${repo || '*'} proj:${project || '*'}`,
      $orderBy: [
        {
          field: 'path',
          sortOrder: 'ASC',
        },
      ],
      $skip: items.length,
      $top: PAGE_SIZE,
    };

    if (branch) {
      searchRequestBody.filters = { Branch: [branch] };
    }

    const response = await fetch(searchUrl, {
      headers: {
        ...credentials?.headers,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(searchRequestBody),
    });

    if (response.status !== 200) {
      throw new Error(
        `Azure DevOps search failed with response status ${response.status}`,
      );
    }

    const body: CodeSearchResponse = await response.json();
    items = [...items, ...body.results];
    hasMorePages = body.count > items.length;
  } while (hasMorePages);

  return items;
}

// listRepositories returns the Git repositories of a project, or of the whole
// organization when no project is given.
export async function listRepositories(
  credentialsProvider: AzureDevOpsCredentialsProvider,
  azureConfig: AzureIntegrationConfig,
  org: string,
  project?: string,
): Promise<GitRepository[]> {
  const url = getOrganizationUrl(azureConfig, org);
  const scopeUrl = project ? `${url}/${encodeURIComponent(project)}` : url;

  const credentials = await credentialsProvider.getCredentials({
    url,
  });

  const response = await fetch(
    `${scopeUrl}/_apis/git/repositories?api-version=${GIT_API_VERSION}`,
    {
      headers: credentials?.headers,
    },
  );

  if (response.status !== 200) {
    throw new Error(
      `Azure DevOps repository listing failed with response status ${response.status}`,
    );
  }

  const body: GitRepositoryListResponse = await response.json();
  return body.value;
}

// fileExists checks whether a file exists in a repository, on the given branch
// or on the default branch of the repository.
export async function fileExists(
  credentialsProvider: AzureDevOpsCredentialsProvider,
  azureConfig: AzureIntegrationConfig,
  org: string,
  project: string,
  repositoryId: string,
  path: string,
  branch?: string,
): Promise<boolean> {
  const url = getOrganizationUrl(azureConfig, org);
  const itemUrl = new URL(
    `${url}/${encodeURIComponent(
      project,
    )}/_apis/git/repositories/${encodeURIComponent(repositoryId)}/items`,
  );
  itemUrl.searchParams.set('path', path);
  itemUrl.searchParams.set('$format', 'json');
  itemUrl.searchParams.set('api-version', GIT_API_VERSION);
  if (branch) {
    itemUrl.searchParams.set('versionDescriptor.version', branch);
    itemUrl.searchParams.set('versionDescriptor.versionType', 'branch');
  }

  const credentials = await credentialsProvider.getCredentials({
    url,
  });

  const response = await fetch(itemUrl, {
    headers: credentials?.headers,
  });

  // Also returned when the branch does not exist in the repository
  if (response.status === 404) {
    return false;
  }

  if (response.status !== 200) {
    throw new Error(
      `Azure DevOps file lookup failed with response status ${response.status}`,
    );
  }

  return true;
}
