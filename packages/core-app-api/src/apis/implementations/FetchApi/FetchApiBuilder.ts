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

import { FetchApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import { FetchFunction, FetchMiddleware } from './types';

/**
 * Builds a fetch API, based on the builtin fetch wrapped by a set of optional
 * middleware implementations that add behaviors.
 *
 * @public
 */
export class FetchApiBuilder {
  static create(): FetchApiBuilder {
    return new FetchApiBuilder(crossFetch, []);
  }

  private constructor(
    private readonly implementation: FetchFunction,
    private readonly middleware: FetchMiddleware[],
  ) {}

  with(middleware: FetchMiddleware): FetchApiBuilder {
    return new FetchApiBuilder(this.implementation, [
      ...this.middleware,
      middleware,
    ]);
  }

  build(): FetchApi {
    let result = this.implementation;

    for (const m of this.middleware) {
      result = m.apply(result);
    }

    return {
      fetch: result,
    };
  }
}
