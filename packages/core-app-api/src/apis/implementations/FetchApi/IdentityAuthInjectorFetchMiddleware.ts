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

/**
 * A fetch middleware, which injects a Backstage token header when the user is
 * signed in.
 */
export class IdentityAuthInjectorFetchMiddleware implements FetchMiddleware {
  static create(options: {
    identityApi: IdentityApi;
    config?: Config;
    urlPrefixAllowlist?: string[];
    header?: {
      name: string;
      value: (backstageToken: string) => string;
    };
  }): IdentityAuthInjectorFetchMiddleware {
    const allowlist: string[] = [];
    if (options.urlPrefixAllowlist) {
      allowlist.push(...options.urlPrefixAllowlist);
    } else if (options.config) {
      allowlist.push(options.config.getString('backend.baseUrl'));
    }

    const headerName = options.header?.name || 'authorization';
    const headerValue = options.header?.value || (token => `Bearer ${token}`);

    return new IdentityAuthInjectorFetchMiddleware(
      options.identityApi,
      allowlist.map(prefix => prefix.replace(/\/$/, '')),
      headerName,
      headerValue,
    );
  }

  constructor(
    public readonly identityApi: IdentityApi,
    public readonly urlPrefixAllowlist: string[],
    public readonly headerName: string,
    public readonly headerValue: (pluginId: string) => string,
  ) {}

  apply(next: typeof fetch): typeof fetch {
    return async (input, init) => {
      // Skip this middleware if the header already exists, or if the URL
      // doesn't match any of the allowlist items, or if there was no token
      const request = new Request(input, init);
      const { token } = await this.identityApi.getCredentials();
      if (
        request.headers.get(this.headerName) ||
        !this.urlPrefixAllowlist.some(
          prefix =>
            request.url === prefix || request.url.startsWith(`${prefix}/`),
        ) ||
        typeof token !== 'string' ||
        !token
      ) {
        return next(input, init);
      }

      request.headers.set(this.headerName, this.headerValue(token));
      return next(request);
    };
  }
}
