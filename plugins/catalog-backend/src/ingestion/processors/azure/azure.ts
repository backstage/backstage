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

import fetch from 'cross-fetch';
import {
  AzureIntegrationConfig,
  getAzureRequestOptions,
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
}

// codeSearch returns all files that matches the given search path.
export async function codeSearch(
  azureConfig: AzureIntegrationConfig,
  org: string,
  project: string,
  repo: string,
  path: string,
): Promise<CodeSearchResultItem[]> {
  // TODO:  What's the search URL for onpremises DevOps?
  const searchUrl = `https://almsearch.dev.azure.com/${org}/${project}/_apis/search/codesearchresults?api-version=6.0-preview.1`;
  const opts = getAzureRequestOptions(azureConfig);
  const response = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      ...opts.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchText: `path:${path} repo:${repo || '*'}`,
      $top: 1000,
    }),
  });

  if (response.status !== 200) {
    throw new Error(
      `Azure DevOps search failed with response status ${response.status}`,
    );
  }

  const responseBody: CodeSearchResponse = await response.json();
  return responseBody.results;
}
