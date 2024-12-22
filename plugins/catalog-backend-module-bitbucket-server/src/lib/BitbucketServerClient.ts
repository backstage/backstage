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
  BitbucketServerIntegrationConfig,
  getBitbucketServerRequestOptions,
} from '@backstage/integration';
import { BitbucketServerProject, BitbucketServerRepository } from './types';
import pThrottle from 'p-throttle';

// 1 per second
const throttle = pThrottle({
  limit: 1,
  interval: 1000,
});

const throttledFetch = throttle(
  async (url: RequestInfo, options?: RequestInit) => {
    return await fetch(url, options);
  },
);

/**
 * A client for interacting with a Bitbucket Server instance
 *
 * @public
 */
export class BitbucketServerClient {
  private readonly config: BitbucketServerIntegrationConfig;

  static fromConfig(options: {
    config: BitbucketServerIntegrationConfig;
  }): BitbucketServerClient {
    return new BitbucketServerClient(options);
  }

  constructor(options: { config: BitbucketServerIntegrationConfig }) {
    this.config = options.config;
  }

  async listProjects(options: {
    listOptions?: BitbucketServerListOptions;
  }): Promise<BitbucketServerPagedResponse<BitbucketServerProject>> {
    return this.pagedRequest(
      `${this.config.apiBaseUrl}/projects`,
      options.listOptions,
    );
  }

  async listRepositories(options: {
    projectKey: string;
    listOptions?: BitbucketServerListOptions;
  }): Promise<BitbucketServerPagedResponse<BitbucketServerRepository>> {
    return this.pagedRequest(
      `${this.config.apiBaseUrl}/projects/${encodeURIComponent(
        options.projectKey,
      )}/repos`,
      options.listOptions,
    );
  }

  async getFile(options: {
    projectKey: string;
    repo: string;
    path: string;
  }): Promise<Response> {
    const base = new URL(this.config.apiBaseUrl);
    return throttledFetch(
      `${base.protocol}//${base.host}/projects/${options.projectKey}/repos/${options.repo}/raw/${options.path}`,
      getBitbucketServerRequestOptions(this.config),
    );
  }

  async getRepository(options: {
    projectKey: string;
    repo: string;
  }): Promise<BitbucketServerRepository> {
    const request = `${this.config.apiBaseUrl}/projects/${options.projectKey}/repos/${options.repo}`;
    const response = await throttledFetch(
      request,
      getBitbucketServerRequestOptions(this.config),
    );
    return response.json();
  }

  resolvePath(options: { projectKey: string; repo: string; path: string }): {
    path: string;
  } {
    const base = new URL(this.config.apiBaseUrl || '');

    return {
      path: `${base.protocol}//${base.host}/projects/${options.projectKey}/repos/${options.repo}${options.path}`,
    };
  }

  private async pagedRequest(
    endpoint: string,
    options?: BitbucketServerListOptions,
  ): Promise<BitbucketServerPagedResponse<any>> {
    const request = new URL(endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key]!.toString());
      }
    }
    return this.getTypeMapped(request);
  }

  private async getTypeMapped<T = any>(url: URL): Promise<T> {
    return this.get(url).then((response: Response) => {
      return response.json() as Promise<T>;
    });
  }

  private async get(url: URL): Promise<Response> {
    return this.request(new Request(url.toString(), { method: 'GET' }));
  }

  private async request(req: Request): Promise<Response> {
    return throttledFetch(
      req,
      getBitbucketServerRequestOptions(this.config),
    ).then((response: Response) => {
      if (!response.ok) {
        throw new Error(
          `Unexpected response for ${req.method} ${req.url}. Expected 200 but got ${response.status} - ${response.statusText}`,
        );
      }
      return response;
    });
  }
}

/**
 * @public
 */
export type BitbucketServerListOptions = {
  [key: string]: number | undefined;
  limit?: number | undefined;
  start?: number | undefined;
};

/**
 * @public
 */
export type BitbucketServerPagedResponse<T> = {
  size: number;
  limit: number;
  start: number;
  isLastPage: boolean;
  values: T[];
  nextPageStart: number;
};

export async function* paginated(
  request: (
    options: BitbucketServerListOptions,
  ) => Promise<BitbucketServerPagedResponse<any>>,
  options?: BitbucketServerListOptions,
) {
  const opts = options || { start: 0 };
  let res;
  do {
    res = await request(opts);
    opts.start = res.nextPageStart;
    for (const item of res.values) {
      yield item;
    }
  } while (!res.isLastPage);
}
