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
  BitbucketIntegrationConfig,
  getBitbucketRequestOptions,
} from '@backstage/integration';
import fetch from 'node-fetch';
import { BitbucketRepository20 } from './types';

export class BitbucketCloudClient {
  private readonly config: BitbucketIntegrationConfig;

  constructor(options: { config: BitbucketIntegrationConfig }) {
    this.config = options.config;
  }

  async searchCode(
    workspace: string,
    query: string,
    options?: ListOptions20,
  ): Promise<PagedResponse20<CodeSearchResultItem>> {
    // load all fields relevant for creating refs later, but not more
    const fields = [
      // exclude code/content match details
      '-values.content_matches',
      // include/add relevant repository details
      '+values.file.commit.repository.mainbranch.name',
      '+values.file.commit.repository.project.key',
      '+values.file.commit.repository.slug',
      // remove irrelevant links
      '-values.*.links',
      '-values.*.*.links',
      '-values.*.*.*.links',
      // ...except the one we need
      '+values.file.commit.repository.links.html.href',
    ].join(',');

    return this.pagedRequest<CodeSearchResultItem>(
      `${this.config.apiBaseUrl}/workspaces/${encodeURIComponent(
        workspace,
      )}/search/code`,
      {
        ...options,
        fields: fields,
        search_query: query,
      },
    );
  }

  async listRepositoriesByWorkspace(
    workspace: string,
    options?: ListOptions20,
  ): Promise<PagedResponse20<BitbucketRepository20>> {
    return this.pagedRequest<BitbucketRepository20>(
      `${this.config.apiBaseUrl}/repositories/${encodeURIComponent(workspace)}`,
      options,
    );
  }

  private async pagedRequest<T = any>(
    endpoint: string,
    options?: ListOptions20,
  ): Promise<PagedResponse20<T>> {
    const request = new URL(endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key]!.toString());
      }
    }

    const response = await fetch(
      request.toString(),
      getBitbucketRequestOptions(this.config),
    );
    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
          response.status
        } - ${response.statusText}`,
      );
    }
    return response.json() as Promise<PagedResponse20<T>>;
  }
}

export type CodeSearchResultItem = {
  type: string;
  content_match_count: number;
  path_matches: Array<{
    text: string;
    match?: boolean;
  }>;
  file: {
    path: string;
    type: string;
    commit: {
      repository: BitbucketRepository20;
    };
  };
};

export type ListOptions20 = {
  [key: string]: string | number | undefined;
  page?: number | undefined;
  pagelen?: number | undefined;
};

export type PagedResponse20<T> = {
  page: number;
  pagelen: number;
  size: number;
  values: T[];
  next: string;
};

export async function* paginated20<T = any>(
  request: (options: ListOptions20) => Promise<PagedResponse20<T>>,
  options?: ListOptions20,
) {
  const opts = { page: 1, pagelen: 100, ...options };
  let res;
  do {
    res = await request(opts);
    opts.page = opts.page + 1;
    for (const item of res.values) {
      yield item;
    }
  } while (res.next);
}
