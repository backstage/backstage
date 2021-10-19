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
  getGitLabFileFetchUrl,
} from '@backstage/integration';
import { Logger } from 'winston';

export class GitLabClient {
  private readonly config: GitLabIntegrationConfig;
  private readonly logger: Logger;

  constructor(options: { config: GitLabIntegrationConfig; logger: Logger }) {
    this.config = options.config;
    this.logger = options.logger;
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

  public fileExists(
    project_weburl: string,
    project_branch: string,
    catalog_path: string,
  ): boolean {
    const fileUrl = getGitLabFileFetchUrl(
      `${project.web_url}/-/blob/${project_branch}/${catalogPath}`,
    );
    const response = fetch(fileUrl);
    return response.ok;
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
