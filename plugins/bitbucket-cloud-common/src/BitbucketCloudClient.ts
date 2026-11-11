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

import {
  BitbucketCloudIntegrationConfig,
  getBitbucketCloudOAuthToken,
} from '@backstage/integration';
import fetch, { Request } from 'cross-fetch';
import { CodeSearch } from './codeSearch';
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

  /**
   * @deprecated Bitbucket Cloud removes the endpoint
   * `GET /2.0/workspaces/{workspace}/search/code` on 2026-11-15.
   * Use {@link BitbucketCloudClient.searchWorkspaceCode} instead.
   */
  searchCode(
    workspace: string,
    query: string,
    options?: FilterAndSortOptions & PartialResponseOptions,
    pagelen?: number,
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
      pagelen,
    );
  }

  /**
   * Searches code in all repositories of a workspace with the endpoint
   * `POST /2.0/workspaces/{workspace}/codesearch`, and yields each page of
   * results.
   *
   * The endpoint needs a credential that identifies a user, with the scopes
   * `read:repository:bitbucket` and `read:workspace:bitbucket`.
   * Bitbucket Cloud rejects app passwords for this endpoint.
   *
   * @param workspace - The workspace slug or UUID.
   * @param query - The search term and the optional filters.
   * @param options - `maxResults` sets the number of results per page (1 to 100).
   */
  async *searchWorkspaceCode(
    workspace: string,
    query: CodeSearch.Query,
    options?: { maxResults?: number },
  ): AsyncGenerator<CodeSearch.ResultPage, void> {
    const workspaceEnc = encodeURIComponent(workspace);
    const url = this.createUrl(`/workspaces/${workspaceEnc}/codesearch`);
    const config = options?.maxResults
      ? { max_results: options.maxResults }
      : undefined;

    let pagination:
      | { request_id: string; pagination: { next_cursor: string } }
      | undefined;
    do {
      const page: CodeSearch.ResultPage = await this.post(url, {
        query,
        config,
        ...pagination,
      }).then(response => response.json());
      yield page;

      const nextCursor = page.pagination?.next_cursor;
      pagination =
        page.pagination?.has_more && nextCursor
          ? { request_id: page.id, pagination: { next_cursor: nextCursor } }
          : undefined;
    } while (pagination);
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

  listProjectsByWorkspace(
    workspace: string,
    options?: FilterAndSortOptions & PartialResponseOptions,
  ): WithPagination<Models.PaginatedProjects, Models.Project> {
    const workspaceEnc = encodeURIComponent(workspace);

    return new WithPagination(
      paginationOptions =>
        this.createUrl(`/workspaces/${workspaceEnc}/projects`, {
          ...paginationOptions,
          ...options,
        }),
      url => this.getTypeMapped(url),
    );
  }

  listWorkspaces(
    options?: FilterAndSortOptions & PartialResponseOptions,
  ): WithPagination<Models.PaginatedWorkspaces, Models.Workspace> {
    return new WithPagination(
      paginationOptions =>
        this.createUrl('/workspaces', { ...paginationOptions, ...options }),
      url => this.getTypeMapped(url),
    );
  }

  listBranchesByRepository(
    repository: string,
    workspace: string,
    options?: FilterAndSortOptions & PartialResponseOptions,
  ): WithPagination<Models.PaginatedBranches, Models.Branch> {
    const workspaceEnc = encodeURIComponent(workspace);

    return new WithPagination(
      paginationOptions =>
        this.createUrl(
          `/repositories/${workspaceEnc}/${repository}/refs/branches`,
          {
            ...paginationOptions,
            ...options,
          },
        ),
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

  private async post(url: URL, body: unknown): Promise<Response> {
    return this.request(
      new Request(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  }

  private async request(req: Request): Promise<Response> {
    // The headers passed to fetch replace the headers of the request,
    // so keep the request headers and add the auth headers to them.
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    Object.assign(headers, await this.getAuthHeaders());
    return fetch(req, { headers }).then((response: Response) => {
      if (!response.ok) {
        throw new Error(
          `Unexpected response for ${req.method} ${req.url}. Expected 200 but got ${response.status} - ${response.statusText}`,
        );
      }

      return response;
    });
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // OAuth authentication (clientId/clientSecret)
    if (this.config.clientId && this.config.clientSecret) {
      const token = await getBitbucketCloudOAuthToken(
        this.config.clientId,
        this.config.clientSecret,
      );
      headers.Authorization = `Bearer ${token}`;
      return headers;
    }

    // Basic authentication (username/token or username/appPassword)
    if (
      this.config.username &&
      (this.config.token ?? this.config.appPassword)
    ) {
      const buffer = Buffer.from(
        `${this.config.username}:${
          this.config.token ?? this.config.appPassword
        }`,
        'utf8',
      );
      headers.Authorization = `Basic ${buffer.toString('base64')}`;
    }

    // Using Bearer authentication (token only)
    if (this.config.token && !this.config.username) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    return headers;
  }
}
