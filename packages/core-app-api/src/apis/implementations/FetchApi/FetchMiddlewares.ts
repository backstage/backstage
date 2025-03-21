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
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { IdentityAuthInjectorFetchMiddleware } from './IdentityAuthInjectorFetchMiddleware';
import { PluginProtocolResolverFetchMiddleware } from './PluginProtocolResolverFetchMiddleware';
import { FetchMiddleware } from './types';

/**
 * A collection of common middlewares for the FetchApi.
 *
 * @public
 */
export class FetchMiddlewares {
  /**
   * Handles translation from `plugin://` URLs to concrete http(s) URLs based on
   * the discovery API.
   *
   * @remarks
   *
   * If the request is for `plugin://catalog/entities?filter=x=y`, the discovery
   * API will be queried for `'catalog'`. If it returned
   * `https://backstage.example.net/api/catalog`, the resulting query would be
   * `https://backstage.example.net/api/catalog/entities?filter=x=y`.
   *
   * If the incoming URL protocol was not `plugin`, the request is just passed
   * through verbatim to the underlying implementation.
   */
  static resolvePluginProtocol(options: {
    discoveryApi: DiscoveryApi;
  }): FetchMiddleware {
    return new PluginProtocolResolverFetchMiddleware(options.discoveryApi);
  }

  /**
   * Injects a Backstage token header when the user is signed in.
   *
   * @remarks
   *
   * Per default, an `Authorization: Bearer <token>` is generated. This can be
   * customized using the `header` option.
   *
   * The header injection only happens on allowlisted URLs. Per default, if the
   * `config` option is passed in, the `backend.baseUrl` is allowlisted, unless
   * the `urlPrefixAllowlist` or `allowUrl` options are passed in, in which case
   * they take precedence. If you pass in neither config nor an
   * allowlist/callback, the middleware will have no effect since effectively no
   * request will match the (nonexistent) rules.
   */
  static injectIdentityAuth(options: {
    identityApi: IdentityApi;
    config?: Config;
    urlPrefixAllowlist?: string[];
    allowUrl?: (url: string) => boolean;
    header?: {
      name: string;
      value: (backstageToken: string) => string;
    };
  }): FetchMiddleware {
    return IdentityAuthInjectorFetchMiddleware.create(options);
  }

  private constructor() {}
}
