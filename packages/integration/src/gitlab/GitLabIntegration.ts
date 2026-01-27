/*
 * Copyright 2020 The Backstage Authors
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
import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import {
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from './config';
import pThrottle from 'p-throttle';

type FetchFunction = typeof fetch;

/**
 * A GitLab based integration.
 *
 * @public
 */
export class GitLabIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GitLabIntegration> = ({ config }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new GitLabIntegration(c)),
      i => i.config.host,
    );
  };

  private readonly fetchImpl: FetchFunction;

  constructor(private readonly integrationConfig: GitLabIntegrationConfig) {
    // Configure fetch strategy based on configuration
    this.fetchImpl = this.createFetchStrategy();
  }

  get type(): string {
    return 'gitlab';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): GitLabIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    return defaultScmResolveUrl(options);
  }

  resolveEditUrl(url: string): string {
    return replaceGitLabUrlType(url, 'edit');
  }

  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return this.fetchImpl(input, init);
  }

  private createFetchStrategy(): FetchFunction {
    let fetchFn: FetchFunction = async (url, options) => {
      return fetch(url, { ...options, mode: 'same-origin' });
    };

    const retryConfig = this.integrationConfig.retry;
    if (retryConfig) {
      // Apply retry wrapper if configured
      fetchFn = this.withRetry(fetchFn, retryConfig);

      // Apply throttling wrapper if configured
      if (
        retryConfig.maxApiRequestsPerMinute &&
        retryConfig.maxApiRequestsPerMinute > 0
      ) {
        fetchFn = pThrottle({
          limit: retryConfig.maxApiRequestsPerMinute,
          interval: 60_000,
        })(fetchFn);
      }
    }

    return fetchFn;
  }

  private withRetry(
    fetchFn: FetchFunction,
    retryConfig: { maxRetries?: number; retryStatusCodes?: number[] },
  ): FetchFunction {
    const maxRetries = retryConfig?.maxRetries ?? 0;
    const retryStatusCodes = retryConfig?.retryStatusCodes ?? [];
    if (maxRetries <= 0 || retryStatusCodes.length === 0) {
      return fetchFn;
    }

    return async (url, options) => {
      const abortSignal = options?.signal;
      let response: Response;
      let attempt = 0;
      for (;;) {
        response = await fetchFn(url, options);
        // If response is not retryable, return immediately
        if (!retryStatusCodes.includes(response.status)) {
          break;
        }

        // If this was the last allowed attempt, return response
        if (attempt++ >= maxRetries) {
          break;
        }
        // Determine delay from Retry-After header if present, otherwise exponential backoff
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(100 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, cap at 10 seconds

        await sleep(delay, abortSignal);
      }

      return response;
    };
  }
}

export async function sleep(
  durationMs: number,
  abortSignal: AbortSignal | null | undefined,
): Promise<void> {
  if (abortSignal?.aborted) {
    return;
  }

  await new Promise<void>(resolve => {
    let timeoutHandle: NodeJS.Timeout | undefined = undefined;

    const done = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      abortSignal?.removeEventListener('abort', done);
      resolve();
    };

    timeoutHandle = setTimeout(done, durationMs);
    abortSignal?.addEventListener('abort', done);
  });
}

/**
 * Takes a GitLab URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. 'blob', 'tree', 'edit'
 * @public
 */
export function replaceGitLabUrlType(
  url: string,
  type: 'blob' | 'tree' | 'edit',
): string {
  return url.replace(/\/\-\/(blob|tree|edit)\//, `/-/${type}/`);
}
