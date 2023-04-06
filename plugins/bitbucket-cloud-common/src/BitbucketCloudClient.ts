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

import { BitbucketCloudIntegrationConfig } from '@backstage/integration';
import fetch, { Request } from 'cross-fetch';
import { Models } from './models';
import { WithPagination } from './pagination';
import {
  FilterAndSortOptions,
  PartialResponseOptions,
  RequestOptions,
} from './types';

/** @public */
export class BitbucketCloudClient {
  static fromConfig(
    config: BitbucketCloudIntegrationConfig,
  ): BitbucketCloudClient {
    return new BitbucketCloudClient(config);
  }

  private constructor(
    private readonly config: BitbucketCloudIntegrationConfig,
  ) {}

  searchCode(
    workspace: string,
    query: string,
    options?: FilterAndSortOptions & PartialResponseOptions,
  ): WithPagination<Models.SearchResultPage, Models.SearchCodeSearchResult> {
    const workspaceEnc = encodeURIComponent(workspace);
    return new WithPagination(
      paginationOptions =>
        this.createUrl(`/workspaces/${workspaceEnc}/search/code`, {
          ...paginationOptions,
          ...options,
          search_query: query,
        }),
      url => this.getTypeMapped(url),
    );
  }

  listRepositoriesByWorkspace(
    workspace: string,
    options?: FilterAndSortOptions & PartialResponseOptions,
  ): WithPagination<Models.PaginatedRepositories, Models.Repository> {
    const workspaceEnc = encodeURIComponent(workspace);

    return new WithPagination(
      paginationOptions =>
        this.createUrl(`/repositories/${workspaceEnc}`, {
          ...paginationOptions,
          ...options,
        }),
      url => this.getTypeMapped(url),
    );
  }

  private createUrl(endpoint: string, options?: RequestOptions): URL {
    const request = new URL(this.config.apiBaseUrl + endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key]!.toString());
      }
    }

    return request;
  }

  private async getTypeMapped<T = any>(url: URL): Promise<T> {
    return this.get(url).then(
      (response: Response) => response.json() as Promise<T>,
    );
  }

  private async get(url: URL): Promise<Response> {
    return this.request(new Request(url.toString(), { method: 'GET' }));
  }

  private async request(req: Request): Promise<Response> {
    return fetch(req, { headers: this.getAuthHeaders() }).then(
      (response: Response) => {
        if (!response.ok) {
          throw new Error(
            `Unexpected response for ${req.method} ${req.url}. Expected 200 but got ${response.status} - ${response.statusText}`,
          );
        }

        return response;
      },
    );
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.config.username) {
      const buffer = Buffer.from(
        `${this.config.username}:${this.config.appPassword}`,
        'utf8',
      );
      headers.Authorization = `Basic ${buffer.toString('base64')}`;
    }

    return headers;
  }
}
