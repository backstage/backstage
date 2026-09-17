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
    let fetchFn: FetchFunction = (url, options) => fetch(url, options);

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

    // Exponential backoff, cap at 10 seconds
    const backoffDelay = (a: number) =>
      Math.min(100 * Math.pow(2, a - 1), 10000);

    return async (url, options) => {
      const abortSignal = options?.signal;
      let attempt = 0;
      for (;;) {
        let response: Response;
        try {
          response = await fetchFn(url, options);
        } catch (e) {
          // The caller aborted — surface that immediately rather than retrying.
          if (abortSignal?.aborted) throw e;
          // No more attempts left — propagate the network error.
          if (attempt++ >= maxRetries) throw e;
          await sleep(backoffDelay(attempt), abortSignal);
          if (abortSignal?.aborted) throw e;
          continue;
        }

        // Successful, non-retryable response: return immediately
        if (!retryStatusCodes.includes(response.status)) {
          return response;
        }

        // No more attempts left — return the last (retryable) response.
        if (attempt++ >= maxRetries) {
          return response;
        }

        // Retry-After is either delay-seconds or an HTTP-date (RFC 9110 §10.2.3).
        const delay = parseRetryAfterMs(
          response.headers.get('Retry-After'),
          backoffDelay(attempt),
        );

        // Release the underlying connection so it can be reused, since we're
        // about to discard this response in favor of a retry.
        await response.body?.cancel().catch(() => {});

        await sleep(delay, abortSignal);
        if (abortSignal?.aborted) return response;
      }
    };
  }
}

/** @internal */
export function parseRetryAfterMs(
  headerValue: string | null,
  fallbackMs: number,
): number {
  if (!headerValue) {
    return fallbackMs;
  }

  // delay-seconds per RFC 9110 is 1*DIGIT
  if (/^\d+$/.test(headerValue)) {
    return Number(headerValue) * 1000;
  }

  // HTTP-dates (IMF-fixdate) always contain a comma, e.g.
  // "Sun, 06 Nov 1994 08:49:37 GMT" — use that as a prerequisite
  // to avoid Date.parse interpreting random strings as dates.
  if (headerValue.includes(',')) {
    const dateMs = Date.parse(headerValue);
    if (Number.isFinite(dateMs)) {
      const deltaMs = dateMs - Date.now();
      return deltaMs > 0 ? deltaMs : 0;
    }
  }

  return fallbackMs;
}

/** @internal */
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
