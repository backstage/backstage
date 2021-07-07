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

import { FetchFunction, FetchMiddleware } from './types';

function join(left: string, right: string): string {
  if (!right || right === '/') {
    return left;
  }

  return `${left.replace(/\/$/, '')}/${right.replace(/^\//, '')}`;
}

/**
 * Handles translation from backstage://some-plugin-id/<path> to concrete
 * http(s) URLs.
 *
 * @public
 */
export class BackstageProtocolResolverFetchMiddleware
  implements FetchMiddleware
{
  constructor(
    private readonly discovery: (pluginId: string) => Promise<string>,
  ) {}

  /**
   * {@inheritdoc FetchMiddleware.apply}
   */
  apply(next: FetchFunction): FetchFunction {
    return async (input, init) => {
      const request = new Request(input, init);
      const { protocol, hostname, pathname, search, hash, username, password } =
        new URL(request.url);

      if (protocol !== 'backstage:') {
        return next(input, init);
      }

      let base = await this.discovery(hostname);
      if (username || password) {
        const baseUrl = new URL(base);
        const authority = `${username}${password ? `:${password}` : ''}@`;
        base = `${baseUrl.protocol}//${authority}${baseUrl.host}${baseUrl.pathname}`;
      }

      const target = `${join(base, pathname)}${search}${hash}`;
      return next(target, request);
    };
  }
}
