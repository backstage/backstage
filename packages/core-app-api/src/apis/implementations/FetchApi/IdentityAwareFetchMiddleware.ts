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

const DEFAULT_HEADER_NAME = 'backstage-token';

/**
 * A fetch middleware, which injects a Backstage token header when the user is
 * signed in.
 *
 * @public
 */
export class IdentityAwareFetchMiddleware implements FetchMiddleware {
  private headerName: string;
  private tokenFunction: () => Promise<string | undefined>;

  constructor(tokenFunction: () => Promise<string | undefined>) {
    this.headerName = DEFAULT_HEADER_NAME;
    this.tokenFunction = tokenFunction;
  }

  /**
   * {@inheritdoc FetchMiddleware.apply}
   */
  apply(next: FetchFunction): FetchFunction {
    return async (input, init) => {
      const token = await this.tokenFunction();
      if (typeof token !== 'string') {
        return next(input, init);
      }

      const request = new Request(input, init);
      request.headers.set(this.headerName, token);
      return next(request);
    };
  }

  /**
   * Changes the header name from the default value to a custom one.
   */
  setHeaderName(name: string): IdentityAwareFetchMiddleware {
    this.headerName = name;
    return this;
  }
}
