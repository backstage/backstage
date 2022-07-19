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
  createFetchApi,
  FetchMiddleware,
  FetchMiddlewares,
} from '@backstage/core-app-api';
import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import crossFetch, { Response } from 'cross-fetch';

/**
 * The options given when constructing a {@link MockFetchApi}.
 *
 * @public
 */
export interface MockFetchApiOptions {
  /**
   * Define the underlying base `fetch` implementation.
   *
   * @defaultValue undefined
   * @remarks
   *
   * Leaving out this parameter or passing `undefined`, makes the API use the
   * global `fetch` implementation to make real network requests.
   *
   * `'none'` swallows all calls and makes no requests at all.
   *
   * You can also pass in any `fetch` compatible callback, such as a
   * `jest.fn()`, if you want to use a custom implementation or to just track
   * and assert on calls.
   */
  baseImplementation?: undefined | 'none' | typeof crossFetch;

  /**
   * Add translation from `plugin://` URLs to concrete http(s) URLs, basically
   * simulating what
   * {@link @backstage/core-app-api#FetchMiddlewares.resolvePluginProtocol}
   * does.
   *
   * @defaultValue undefined
   * @remarks
   *
   * Leaving out this parameter or passing `undefined`, disables plugin protocol
   * translation.
   *
   * To enable the feature, pass in a discovery API which is then used to
   * resolve the URLs.
   */
  resolvePluginProtocol?:
    | undefined
    | { discoveryApi: Pick<DiscoveryApi, 'getBaseUrl'> };

  /**
   * Add token based Authorization headers to requests, basically simulating
   * what {@link @backstage/core-app-api#FetchMiddlewares.injectIdentityAuth}
   * does.
   *
   * @defaultValue undefined
   * @remarks
   *
   * Leaving out this parameter or passing `undefined`, disables auth injection.
   *
   * To enable the feature, pass in either a static token or an identity API
   * which is queried on each request for a token.
   */
  injectIdentityAuth?:
    | undefined
    | { token: string }
    | { identityApi: Pick<IdentityApi, 'getCredentials'> };
}

/**
 * A test helper implementation of {@link @backstage/core-plugin-api#FetchApi}.
 *
 * @public
 */
export class MockFetchApi implements FetchApi {
  private readonly implementation: FetchApi;

  /**
   * Creates a mock {@link @backstage/core-plugin-api#FetchApi}.
   */
  constructor(options?: MockFetchApiOptions) {
    this.implementation = build(options);
  }

  /** {@inheritdoc @backstage/core-plugin-api#FetchApi.fetch} */
  get fetch(): typeof crossFetch {
    return this.implementation.fetch;
  }
}

//
// Helpers
//

function build(options?: MockFetchApiOptions): FetchApi {
  return createFetchApi({
    baseImplementation: baseImplementation(options),
    middleware: [
      resolvePluginProtocol(options),
      injectIdentityAuth(options),
    ].filter((x): x is FetchMiddleware => Boolean(x)),
  });
}

function baseImplementation(
  options: MockFetchApiOptions | undefined,
): typeof crossFetch {
  const implementation = options?.baseImplementation;
  if (!implementation) {
    return crossFetch;
  } else if (implementation === 'none') {
    return () => Promise.resolve(new Response());
  }
  return implementation;
}

function resolvePluginProtocol(
  allOptions: MockFetchApiOptions | undefined,
): FetchMiddleware | undefined {
  const options = allOptions?.resolvePluginProtocol;
  if (!options) {
    return undefined;
  }

  return FetchMiddlewares.resolvePluginProtocol({
    discoveryApi: options.discoveryApi,
  });
}

function injectIdentityAuth(
  allOptions: MockFetchApiOptions | undefined,
): FetchMiddleware | undefined {
  const options = allOptions?.injectIdentityAuth;
  if (!options) {
    return undefined;
  }

  const identityApi: Pick<IdentityApi, 'getCredentials'> =
    'token' in options
      ? { getCredentials: async () => ({ token: options.token }) }
      : options.identityApi;

  return FetchMiddlewares.injectIdentityAuth({
    identityApi: identityApi as IdentityApi,
    allowUrl: () => true,
  });
}
