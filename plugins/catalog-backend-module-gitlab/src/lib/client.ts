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

import fetch from 'node-fetch';
import {
  getGitLabRequestOptions,
  GitLabIntegrationConfig,
} from '@backstage/integration';
import { Logger } from 'winston';

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

export class GitLabClient {
  private readonly config: GitLabIntegrationConfig;
  private readonly logger: Logger;

  constructor(options: { config: GitLabIntegrationConfig; logger: Logger }) {
    this.config = options.config;
    this.logger = options.logger;
  }

  /**
   * Indicates whether the client is for a SaaS or self managed GitLab instance.
   */
  isSelfManaged(): boolean {
    return this.config.host !== 'gitlab.com';
  }

  async listProjects(options?: ListOptions): Promise<PagedResponse<any>> {
    if (options?.group) {
      return this.pagedRequest(
        `/groups/${encodeURIComponent(options?.group)}/projects`,
        {
          ...options,
          include_subgroups: true,
        },
      );
    }

    return this.pagedRequest(`/projects`, options);
  }

  /**
   * General existence check.
   *
   * @param projectPath - The path to the project
   * @param branch - The branch used to search
   * @param filePath - The path to the file
   */
  async hasFile(
    projectPath: string,
    branch: string,
    filePath: string,
  ): Promise<boolean> {
    const endpoint: string = `/projects/${encodeURIComponent(
      projectPath,
    )}/repository/files/${encodeURIComponent(filePath)}`;
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);
    request.searchParams.append('ref', branch);

    const response = await fetch(request.toString(), {
      headers: getGitLabRequestOptions(this.config).headers,
      method: 'HEAD',
    });

    if (!response.ok) {
      if (response.status >= 500) {
        this.logger.debug(
          `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
            response.status
          } - ${response.statusText}`,
        );
      }
      return false;
    }

    return true;
  }

  /**
   * Performs a request against a given paginated GitLab endpoint.
   *
   * This method may be used to perform authenticated REST calls against any
   * paginated GitLab endpoint which uses X-NEXT-PAGE headers. The return value
   * can be be used with the {@link paginated} async-generator function to yield
   * each item from the paged request.
   *
   * @see {@link paginated}
   * @param endpoint - The request endpoint, e.g. /projects.
   * @param options - Request queryString options which may also include page variables.
   */
  async pagedRequest<T = any>(
    endpoint: string,
    options?: ListOptions,
  ): Promise<PagedResponse<T>> {
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);
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

/**
 * Advances through each page and provides each item from a paginated request.
 *
 * The async generator function yields each item from repeated calls to the
 * provided request function. The generator walks through each available page by
 * setting the page key in the options passed into the request function and
 * making repeated calls until there are no more pages.
 *
 * @see {@link pagedRequest}
 * @param request - Function which returns a PagedResponse to walk through.
 * @param options - Initial ListOptions for the request function.
 */
export async function* paginated<T = any>(
  request: (options: ListOptions) => Promise<PagedResponse<T>>,
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
