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

const isCloud = (host: string) => host === 'dev.azure.com';
const PAGE_SIZE = 1000;

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

  let items: CodeSearchResultItem[] = [];
  let hasMorePages = true;

  do {
    const credentials = await credentialsProvider.getCredentials({
      url: `https://${azureConfig.host}/${org}`,
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
