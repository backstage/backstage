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
  getGitLabRequestOptions,
  GitLabIntegrationConfig,
} from '@backstage/integration';
import { Logger } from 'winston';
import { BlobsSearchResult, GitLabProject } from './types';
import { CacheClient } from '@backstage/backend-common';

export class GitLabClient {
  private readonly config: GitLabIntegrationConfig;
  private readonly logger: Logger;
  private readonly cache: CacheClient | undefined;

  constructor(options: {
    config: GitLabIntegrationConfig;
    logger: Logger;
    cache?: CacheClient;
  }) {
    this.config = options.config;
    this.logger = options.logger;
    this.cache = options.cache;
  }

  async listProjects(options?: ListOptions): Promise<PagedResponse<any>> {
    if (options?.group) {
      return this.pagedRequest(
        `${this.config.apiBaseUrl}/groups/${encodeURIComponent(
          options?.group,
        )}/projects`,
        {
          ...options,
          include_subgroups: true,
        },
      );
    }

    return this.pagedRequest(`${this.config.apiBaseUrl}/projects`, options);
  }

  async getProject(project_id: string | number): Promise<GitLabProject> {
    if (!this.cache) {
      return await this._getProject(project_id);
    }
    const cacheKey = `gitlabproject--${project_id}`;
    const res = this.cache.get(cacheKey) as unknown as GitLabProject;
    if (Object.keys(res).length > 0) {
      return res;
    }
    const output = await this._getProject(project_id);
    await this.cache.set(cacheKey, output);
    return output;
  }

  private async _getProject(
    project_id: string | number,
  ): Promise<GitLabProject> {
    const request = new URL(
      `${this.config.apiBaseUrl}/projects/${encodeURIComponent(project_id)}`,
    );
    const response = await fetch(
      request.toString(),
      getGitLabRequestOptions(this.config),
    );
    if (!response.ok) {
      throw new Error(
        `Could not get project ${project_id}: ${response.status} ${response.statusText} - ${response.text}`,
      );
    }
    return response.json() as unknown as GitLabProject;
  }

  async performSearch(
    options: AdvancedSearchOptions,
  ): Promise<BlobsSearchResult[]> {
    let request: URL;
    if (options?.id) {
      request = new URL(
        `${this.config.apiBaseUrl}/groups/${encodeURIComponent(
          options?.id,
        )}/search`,
      );
    } else {
      request = new URL(`${this.config.apiBaseUrl}/search`);
    }
    request.searchParams.append('scope', 'blobs');
    request.searchParams.append('search', options.search);
    const response = await fetch(
      request.toString(),
      getGitLabRequestOptions(this.config),
    );
    return response.json().then(async value => {
      if (value.message?.error !== undefined) {
        // handle case when ES is not available
        this.logger.error(`gitlab:performSearch error: ${value.message.error}`);
        throw new Error(value.message.error);
      }
      for (const result of value) {
        result.project = await this.getProject(result.project_id);
      }
      return value;
    }) as unknown as BlobsSearchResult[];
  }

  private async pagedRequest(
    endpoint: string,
    options?: ListOptions,
  ): Promise<PagedResponse<any>> {
    const request = new URL(endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key]!.toString());
      }
    }

    this.logger.debug(`Fetching: ${request.toString()}`);
    const response = await fetch(
      request.toString(),
      getGitLabRequestOptions(this.config),
    );
    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
          response.status
        } - ${response.statusText}`,
      );
    }
    return response.json().then(items => {
      const nextPage = response.headers.get('x-next-page');

      return {
        items,
        nextPage: nextPage ? Number(nextPage) : null,
      } as PagedResponse<any>;
    });
  }
}

export type ListOptions = {
  [key: string]: string | number | boolean | undefined;
  group?: string;
  per_page?: number | undefined;
  page?: number | undefined;
};

export type AdvancedSearchOptions = {
  id?: string | number;
  scope: string;
  search: string;
};

export type RawFileOptions = {
  project_id: string | number;
  file_path: string;
  file_ref?: string;
};
export type PagedResponse<T> = {
  items: T[];
  nextPage?: number;
};

export async function* paginated(
  request: (options: ListOptions) => Promise<PagedResponse<any>>,
  options: ListOptions,
) {
  let res;
  do {
    res = await request(options);
    options.page = res.nextPage;
    for (const item of res.items) {
      yield item;
    }
  } while (res.nextPage);
}
