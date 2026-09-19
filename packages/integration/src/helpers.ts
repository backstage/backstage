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

import { Config } from '@backstage/config';
import parseGitUrl from 'git-url-parse';
import pThrottle from 'p-throttle';
import { trimEnd } from 'lodash';
import { ScmIntegration, ScmIntegrationsGroup } from './types';

/**
 * Wraps git-url-parse and rejects URLs whose filepath contains path traversal
 * segments. Without this check, a URL like
 * `https://github.com/o/r/blob/main/%2e%2e%2f%2e%2e%2fuser/repos` would be
 * decoded to `../../user/repos` and could escape the expected API path when
 * interpolated into provider API URLs.
 */
export function parseGitUrlSafe(url: string) {
  const parsed = parseGitUrl(url);
  if (parsed.filepath) {
    let decoded = parsed.filepath;
    let previous;
    do {
      previous = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch {
        break;
      }
    } while (decoded !== previous);

    if (
      decoded.split('/').some(segment => segment === '..' || segment === '.')
    ) {
      throw new Error(
        'Invalid SCM URL: path traversal is not allowed in the URL',
      );
    }
  }
  return parsed;
}

/** Checks whether the given argument is a valid URL hostname */
export function isValidHost(host: string): boolean {
  const check = new URL('http://example.com');
  check.host = host;
  return check.host === host;
}

/** Checks whether the given argument is a valid URL */
export function isValidUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function basicIntegrations<T extends ScmIntegration>(
  integrations: T[],
  getHost: (integration: T) => string,
): ScmIntegrationsGroup<T> {
  return {
    list(): T[] {
      return integrations;
    },
    byUrl(url: string | URL): T | undefined {
      try {
        const parsed = typeof url === 'string' ? new URL(url) : url;
        return integrations.find(i => getHost(i) === parsed.host);
      } catch {
        return undefined;
      }
    },
    byHost(host: string): T | undefined {
      return integrations.find(i => getHost(i) === host);
    },
  };
}

/**
 * Default implementation of {@link ScmIntegration} `resolveUrl`, that only
 * works with URL pathname based providers.
 *
 * @public
 */
export function defaultScmResolveUrl(options: {
  url: string;
  base: string;
  lineNumber?: number;
}): string {
  const { url, base, lineNumber } = options;

  // If it is a fully qualified URL - then return it verbatim
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    // ignore intentionally
  }

  let updated: URL;

  if (url.startsWith('/')) {
    // If it is an absolute path, move relative to the repo root
    const { href, filepath } = parseGitUrlSafe(base);

    updated = new URL(href);

    const repoRootPath = trimEnd(
      updated.pathname.substring(0, updated.pathname.length - filepath.length),
      '/',
    );
    updated.pathname = `${repoRootPath}${url}`;
  } else {
    // For relative URLs, just let the default URL constructor handle the
    // resolving. Note that this essentially will treat the last segment of the
    // base as a file - NOT a folder - unless the url ends in a slash.
    updated = new URL(url, base);
  }

  updated.search = new URL(base).search;
  if (lineNumber) {
    updated.hash = `L${lineNumber}`;
  }
  return updated.toString();
}

/**
 * Reads an optional number array from config.
 *
 * @internal
 */
export function readOptionalNumberArray(
  config: Config,
  key: string,
): number[] | undefined {
  const value = config.getOptional(key);
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(
      `Invalid ${key} config: expected an array, got ${typeof value}`,
    );
  }
  return value.map((item, index) => {
    if (typeof item !== 'number') {
      throw new Error(
        `Invalid ${key} config: all values must be numbers, got ${typeof item} at index ${index}`,
      );
    }
    return item;
  });
}

/**
 * Turns a `Retry-After` header value into a delay in milliseconds, falling back
 * to the given value when the header is absent or cannot be parsed.
 *
 * @internal
 */
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

/**
 * Waits for the given duration, returning early if the signal is aborted.
 *
 * @internal
 */
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

/** @internal */
export type FetchFunction = typeof fetch;

/** @internal */
export type FetchRetryConfig = {
  maxRetries?: number;
  retryStatusCodes?: number[];
  maxApiRequestsPerMinute?: number;
};

/**
 * Builds the fetch function that an integration should use, adding retries and
 * a requests per minute limit when the integration is configured to want them.
 *
 * @param options - `retry` is the retry section of the integration config, if
 *        any. `resolveRetryDelayMs` reads the cooldown that the provider asks
 *        for off a response, falling back to the given exponential backoff.
 *        `baseFetch` replaces the underlying fetch, for integrations that need
 *        to wrap every attempt, retries included.
 *
 * @internal
 */
export function createFetchStrategy(options: {
  retry?: FetchRetryConfig;
  resolveRetryDelayMs?: (response: Response, fallbackMs: number) => number;
  baseFetch?: FetchFunction;
}): FetchFunction {
  const {
    retry,
    baseFetch,
    resolveRetryDelayMs = (response, fallbackMs) =>
      parseRetryAfterMs(response.headers.get('Retry-After'), fallbackMs),
  } = options;

  let fetchFn: FetchFunction = baseFetch ?? ((url, init) => fetch(url, init));

  if (!retry) {
    return fetchFn;
  }

  fetchFn = withRetry(fetchFn, retry, resolveRetryDelayMs);

  if (retry.maxApiRequestsPerMinute && retry.maxApiRequestsPerMinute > 0) {
    fetchFn = pThrottle({
      limit: retry.maxApiRequestsPerMinute,
      interval: 60_000,
    })(fetchFn);
  }

  return fetchFn;
}

function withRetry(
  fetchFn: FetchFunction,
  retryConfig: FetchRetryConfig,
  resolveRetryDelayMs: (response: Response, fallbackMs: number) => number,
): FetchFunction {
  const maxRetries = retryConfig.maxRetries ?? 0;
  const retryStatusCodes = retryConfig.retryStatusCodes ?? [];
  if (maxRetries <= 0 || retryStatusCodes.length === 0) {
    return fetchFn;
  }

  // Exponential backoff, cap at 10 seconds
  const backoffDelay = (a: number) => Math.min(100 * Math.pow(2, a - 1), 10000);

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

      const delay = resolveRetryDelayMs(response, backoffDelay(attempt));

      // Release the underlying connection so it can be reused, since we're
      // about to discard this response in favor of a retry.
      await response.body?.cancel().catch(() => {});

      await sleep(delay, abortSignal);
      if (abortSignal?.aborted) return response;
    }
  };
}
