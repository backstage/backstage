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

import { FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import crossFetch, { Request, Response } from 'cross-fetch';

/**
 * The options given when constructing a {@link MockFetchApi}.
 *
 * @public
 */
export interface MockFetchApiOptions {
  /**
   * Define the underlying base `fetch` implementation.
   *
   * @defaultValue 'fetch'
   * @remarks
   *
   * `'fetch'` uses the global `fetch` implementation to make real network
   * requests. This is the default.
   *
   * `'none'` swallows all calls and makes no requests at all.
   *
   * You can also pass in any `fetch` compatible callback, such as a
   * `jest.fn()`, if you want to use a custom implementation or to just track
   * and assert on calls.
   */
  baseImplementation?: 'fetch' | 'none' | typeof crossFetch | undefined;

  /**
   * If defined, adds token based Authorization headers to requests, basically
   * simulating what
   * {@link @backstage/core-app-api#FetchMiddlewares.injectIdentityAuth} does.
   *
   * @defaultValue undefined
   * @remarks
   *
   * You can supply either a static token or an identity API.
   */
  authorization?:
    | { token: string }
    | { identityApi: Pick<IdentityApi, 'getCredentials'> }
    | undefined;
}

/**
 * A test helper implementation of {@link @backstage/core-plugin-api#FetchApi}.
 *
 * @public
 */
export class MockFetchApi implements FetchApi {
  private readonly implementation: typeof crossFetch;

  /**
   * Creates a mock {@link @backstage/core-plugin-api#FetchApi}.
   */
  constructor(options?: MockFetchApiOptions) {
    this.implementation = build(options);
  }

  /** {@inheritdoc @backstage/core-plugin-api#FetchApi.fetch} */
  get fetch(): typeof crossFetch {
    return this.implementation;
  }
}

//
// Helpers
//

const dummyFetch: typeof crossFetch = () => Promise.resolve(new Response(null));

function build(options?: MockFetchApiOptions): typeof crossFetch {
  let implementation = baseImplementation(options);
  implementation = authorization(options, implementation);
  return implementation;
}

function baseImplementation(
  options: MockFetchApiOptions | undefined,
): typeof crossFetch {
  const implementation = options?.baseImplementation ?? 'fetch';
  if (implementation === 'fetch') {
    return crossFetch;
  } else if (implementation === 'none') {
    return dummyFetch;
  }
  return implementation;
}

function authorization(
  options: MockFetchApiOptions | undefined,
  next: typeof crossFetch,
): typeof crossFetch {
  const auth = options?.authorization;
  if (!auth) {
    return next;
  }

  const getToken = async () => {
    if ('token' in auth) {
      return auth.token;
    }
    const { token } = await auth.identityApi.getCredentials();
    return token;
  };

  return async (input, init) => {
    const request = new Request(input, init);
    if (!request.headers.get('authorization')) {
      const token = await getToken();
      if (token) {
        request.headers.set('authorization', `Bearer ${token}`);
      }
    }
    return next(request);
  };
}
