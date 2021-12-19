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
import { InputError } from '@backstage/errors';
import { ScmIntegration, ScmIntegrationsGroup, ScmLocation } from './types';

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
 * Default implementation of {@link ScmIntegration.resolveUrl}, that only works
 * with URL pathname based providers.
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
    const {
      target: { path },
    } = defaultScmParseUrl(base);
    updated = new URL(base);
    const repoRootPath = trimEnd(
      updated.pathname.substring(0, updated.pathname.length - path!.length),
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
 * Default implementation of {@link ScmIntegrationRegistry.parseUrl}.
 *
 * @public
 */
export function defaultScmParseUrl(url: string): ScmLocation {
  try {
    const result = parseGitUrl(url);
    const raw = new URL(url);

    if (!result.owner || !result.name) {
      throw new TypeError('Missing repository owner or name');
    }

    return {
      url: {
        host: raw.hostname,
        root: `${raw.protocol}//${raw.host}`,
      },
      repository: {
        organization: result.organization || undefined,
        owner: result.owner,
        name: result.name,
      },
      target: {
        ref: result.ref || undefined,
        path: ensureLeadingSlash(result.filepath),
        pathType: result.filepathtype || undefined,
      },
    };
  } catch (error) {
    throw new InputError(`Unparseable URL, ${error}`);
  }
}

/**
 * Parses a special-format shorthand URL. Returns false if not a valid shorthand
 * URL.
 *
 * @remarks
 *
 * These shorthands are formed only from the base URL of a provider (with or
 * without a protocol), and any number of the following query parameters:
 * - organization
 * - owner
 * - name
 * - ref
 * - path
 * - pathType
 *
 * @exampleValue github.com?owner=backstage&name=backstage&ref=master&path=%2Fapp-config.yaml&pathType=blob
 *
 * @public
 */
export function parseShorthandScmUrl(url: string): ScmLocation | false {
  try {
    // Support shorthands both with and without a protocol part
    const urlWithProtocol = url.includes('://') ? url : `https://${url}`;
    const raw = new URL(urlWithProtocol);

    // Exclude things that just plain don't look like a shorthand or aren't
    // supported
    if (
      raw.hash ||
      raw.username ||
      raw.password ||
      raw.pathname.split('/').length > 2
    ) {
      return false;
    }

    const organization = raw.searchParams.get('organization');
    const owner = raw.searchParams.get('owner');
    const name = raw.searchParams.get('name');
    const ref = raw.searchParams.get('ref');
    const path = raw.searchParams.get('path');
    const pathType = raw.searchParams.get('pathType');

    // These are required to exist and be non-empty
    if (!owner || !name) {
      return false;
    }

    return {
      url: {
        host: raw.hostname,
        root: `${raw.protocol}//${raw.host}${raw.pathname}`.replace(/\/$/, ''),
      },
      repository: {
        organization: organization || undefined,
        owner,
        name,
      },
      target: {
        ref: ref || undefined,
        path: ensureLeadingSlash(path),
        pathType: pathType || undefined,
      },
    };
  } catch {
    return false;
  }
}

function ensureLeadingSlash(p: unknown): string | undefined {
  if (typeof p !== 'string' || !p) {
    return undefined;
  } else if (!p.startsWith('/')) {
    return `/${p}`;
  }
  return p;
}
