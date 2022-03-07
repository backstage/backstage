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
import { FetchMiddleware } from './types';

/**
 * Builds a fetch API, based on the builtin fetch wrapped by a set of optional
 * middleware implementations that add behaviors.
 *
 * @remarks
 *
 * The middleware are applied in reverse order, i.e. the last one will be
 * "closest" to the base implementation. Passing in `[M1, M2, M3]` effectively
 * leads to `M1(M2(M3(baseImplementation)))`.
 *
 * @public
 */
export function createFetchApi(options: {
  baseImplementation?: typeof fetch | undefined;
  middleware?: FetchMiddleware | FetchMiddleware[] | undefined;
}): FetchApi {
  let result = options.baseImplementation || global.fetch;

  const middleware = [options.middleware ?? []].flat().reverse();
  for (const m of middleware) {
    result = m.apply(result);
  }

  return {
    fetch: result,
  };
}
