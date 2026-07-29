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

import parseGitUrl from 'git-url-parse';
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
