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

  async createRepository(
    workspace: string,
    repo_slug: string,
    repository: Models.Repository,
  ): Promise<Models.Repository> {
    const workspaceEnc = encodeURIComponent(workspace);
    const url = this.createUrl(`/repositories/${workspaceEnc}/${repo_slug}`);

    return await this.post(url, {
      body: JSON.stringify(repository),
    } as RequestInit).then((response: Response) =>
      response
        .json()
        .then((repositoryResponse: Models.Repository) => repositoryResponse),
    );
  }

  async updatePipelinesConfig(
    workspace: string,
    repo_slug: string,
    pipelinesConfig: Models.PipelinesConfig,
  ): Promise<Models.PipelinesConfig> {
    const workspaceEnc = encodeURIComponent(workspace);
    const url = this.createUrl(
      `/repositories/${workspaceEnc}/${repo_slug}/pipelines_config`,
    );

    return await this.put(url, {
      body: JSON.stringify(pipelinesConfig),
    } as RequestInit).then((response: Response) =>
      response
        .json()
        .then(
          (pipelinesConfigResponse: Models.PipelinesConfig) =>
            pipelinesConfigResponse,
        ),
    );

    // // Create request object to pass
    // const requestOptions: RequestInit = {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     enabled: true,
    //     repository: {
    //       type: 'repository_pipelines_configuration',
    //       slug: repo_slug,
    //     } as Models.Repository,
    //   }),
    // };

    // let response: Response;
    // try {
    //   response = await this.request(
    //     new Request(url.toString(), requestOptions),
    //   );
    // } catch (e) {
    //   throw new Error(`Unable to enable pipelines, ${e}`);
    // }
    // return response;
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
    return this.request(
      new Request(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }),
    );
  }

  private async put(url: URL, options: RequestInit): Promise<Response> {
    return this.request(
      new Request(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        ...options,
      }),
    );
  }

  private async post(url: URL, options: RequestInit): Promise<Response> {
    return this.request(
      new Request(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        ...options,
      }),
    );
  }

  private async request(req: Request): Promise<Response> {
    return fetch(req)
      .then((response: Response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .catch((error: Response) => {
        return error.text().then((responseText: String) => {
          throw new Error(
            `Unexpected response for ${req.method} ${
              req.url
            }. Expected 200 but got ${error.status} - ${
              error.statusText
            }: ${responseText} \n Headers: ${JSON.stringify(
              req.headers,
            )} \n Body: ${req.body}`,
          );
        });
      });
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
