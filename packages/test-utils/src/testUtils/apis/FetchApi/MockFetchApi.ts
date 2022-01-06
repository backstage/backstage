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
import crossFetch, { Request } from 'cross-fetch';

/**
 * A test helper implementation of {@link @backstage/core-plugin-api#FetchApi}.
 *
 * @public
 */
export class MockFetchApi implements FetchApi {
  #implementation: typeof crossFetch;

  /**
   * Creates a {@link MockFetchApi}.
   *
   * @param mockImplementation - Here you can pass in a `jest.fn()` for example,
   *        if you want to track the calls being made through the
   *        {@link @backstage/core-plugin-api#MockFetchApi}. If you pass in no
   *        mock implementation, the created
   *        {@link @backstage/core-plugin-api#MockFetchApi} will make actual
   *        requests using the global `fetch`.
   */
  constructor(implementation?: typeof crossFetch) {
    this.#implementation = implementation ?? crossFetch;
  }

  /** {@inheritdoc @backstage/core-plugin-api#FetchApi.fetch} */
  get fetch(): typeof crossFetch {
    return this.#implementation;
  }

  /**
   * Adds token based Authorization headers to requests, basically simulating
   * what {@link @backstage/core-app-api#FetchMiddlewares.injectIdentityAuth}
   * does.
   *
   * @remarks
   *
   * You can supply either a static mock token or a mock identity API. If
   * neither is given, the static token string "mocked" is used.
   */
  setAuthorization(options?: {
    identityApi?: Pick<IdentityApi, 'getCredentials'>;
    token?: string;
  }): this {
    const next = this.#implementation;

    const getToken = async () => {
      if (options?.token) {
        return options.token;
      } else if (options?.identityApi) {
        const { token } = await options.identityApi.getCredentials();
        return token;
      }
      return 'mocked';
    };

    this.#implementation = async (input, init) => {
      const request = new Request(input, init);
      const token = await getToken();
      if (token && !request.headers.get('authorization')) {
        request.headers.set('authorization', `Bearer ${token}`);
      }
      return next(request);
    };

    return this;
  }
}
