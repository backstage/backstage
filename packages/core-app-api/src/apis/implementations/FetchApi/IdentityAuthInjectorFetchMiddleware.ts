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

import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/core-plugin-api';
import { FetchMiddleware } from './types';

const PLUGIN_ID_TEMPLATE = /\{\{\s*pluginId\s*\}\}/g;

/**
 * A fetch middleware, which injects a Backstage token header when the user is
 * signed in.
 */
export class IdentityAuthInjectorFetchMiddleware implements FetchMiddleware {
  static create(options: {
    identityApi: IdentityApi;
    config?: Config;
    urlPrefixAllowlist?: string[];
    allowUrl?: (url: string) => boolean;
    header?: {
      name: string;
      value: (backstageToken: string) => string;
    };
  }): IdentityAuthInjectorFetchMiddleware {
    const matcher = buildMatcher(options);
    const headerName = options.header?.name || 'authorization';
    const headerValue = options.header?.value || (token => `Bearer ${token}`);

    return new IdentityAuthInjectorFetchMiddleware(
      options.identityApi,
      matcher,
      headerName,
      headerValue,
    );
  }

  /**
   * Returns an array of plugin URL prefixes derived from the static `discovery`
   * configuration, to be used as `urlPrefixAllowlist` option of {@link create}.
   */
  static getDiscoveryUrlPrefixes(config: Config): string[] {
    const endpointConfigs =
      config.getOptionalConfigArray('discovery.endpoints') || [];
    return endpointConfigs.flatMap(c => {
      const target = getExternalTarget(c);
      if (!target) {
        return [];
      }
      const plugins = c.getStringArray('plugins');
      return plugins.flatMap(pluginId => {
        if (pluginId === '*') {
          return [];
        }
        return target.replace(PLUGIN_ID_TEMPLATE, pluginId);
      });
    });
  }

  public readonly identityApi: IdentityApi;
  public readonly allowUrl: (url: string) => boolean;
  public readonly headerName: string;
  public readonly headerValue: (pluginId: string) => string;

  constructor(
    identityApi: IdentityApi,
    allowUrl: (url: string) => boolean,
    headerName: string,
    headerValue: (pluginId: string) => string,
  ) {
    this.identityApi = identityApi;
    this.allowUrl = allowUrl;
    this.headerName = headerName;
    this.headerValue = headerValue;
  }

  apply(next: typeof fetch): typeof fetch {
    return async (input, init) => {
      // Skip this middleware if the header already exists, or if the URL
      // doesn't match any of the allowlist items, or if there was no token.
      // NOTE(freben): The "as any" casts here and below are because of subtle
      // undici type differences that happened in a node types bump. Those are
      // immaterial to the code at hand at runtime, as the global fetch and
      // Request are always taken from the same place.
      const request = new Request(input as any, init);
      const { token } = await this.identityApi.getCredentials();
      if (
        request.headers.get(this.headerName) ||
        typeof token !== 'string' ||
        !token ||
        !this.allowUrl(request.url)
      ) {
        return next(input as any, init);
      }

      request.headers.set(this.headerName, this.headerValue(token));
      return next(request);
    };
  }
}

function buildMatcher(options: {
  config?: Config;
  urlPrefixAllowlist?: string[];
  allowUrl?: (url: string) => boolean;
}): (url: string) => boolean {
  if (options.allowUrl) {
    return options.allowUrl;
  } else if (options.urlPrefixAllowlist) {
    return buildPrefixMatcher(options.urlPrefixAllowlist);
  } else if (options.config) {
    const prefixMatcher = buildPrefixMatcher([
      options.config.getString('backend.baseUrl'),
      ...IdentityAuthInjectorFetchMiddleware.getDiscoveryUrlPrefixes(
        options.config,
      ),
    ]);
    const wildcardMatcher = buildWildcardDiscoveryMatcher(options.config);
    return url => prefixMatcher(url) || wildcardMatcher(url);
  }
  return () => false;
}

function getExternalTarget(config: Config): string | undefined {
  return typeof config.get('target') === 'object'
    ? config.getOptionalString('target.external')
    : config.getString('target');
}

function buildWildcardDiscoveryMatcher(
  config: Config,
): (url: string) => boolean {
  const matchers =
    config.getOptionalConfigArray('discovery.endpoints')?.flatMap(endpoint => {
      if (!endpoint.getStringArray('plugins').includes('*')) {
        return [];
      }
      const target = getExternalTarget(endpoint);
      return target ? [buildUrlPatternMatcher(target)] : [];
    }) ?? [];

  return url => matchers.some(matcher => matcher(url));
}

function buildUrlPatternMatcher(pattern: string): (url: string) => boolean {
  const parts = pattern.replace(/\/$/, '').split(PLUGIN_ID_TEMPLATE);
  let source = escapeRegExp(parts[0]);

  for (let i = 1; i < parts.length; i++) {
    source += i === 1 ? '([^/?#]+)' : '\\1';
    source += escapeRegExp(parts[i]);
  }

  const regex = new RegExp(`^${source}(?:/|$|[?#])`);
  return url => regex.test(url);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPrefixMatcher(prefixes: string[]): (url: string) => boolean {
  const trimmedPrefixes = prefixes.map(prefix => prefix.replace(/\/$/, ''));
  return url =>
    trimmedPrefixes.some(
      prefix => url === prefix || url.startsWith(`${prefix}/`),
    );
}
