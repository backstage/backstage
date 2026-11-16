/*
 * Copyright 2026 The Backstage Authors
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

import { DiscoveryApi, FetchApi } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createFetchApi as createBaseFetchApi,
  FetchMiddleware,
  FetchMiddlewares,
} from '../../../../packages/core-app-api/src/apis/implementations';

/**
 * Creates a Fetch API for the new frontend system with support for `plugin://`
 * URLs through the Discovery API.
 *
 * @remarks
 *
 * Protocol resolution runs before all supplied middleware, including identity
 * authentication, so that they receive the resolved HTTP(S) URL. Custom middleware
 * does not replace protocol resolution. Middleware runs in array order, with the
 * last entry closest to the base implementation.
 *
 * Set `resolvePluginProtocol` to `false` only when the supplied middleware or base
 * implementation handles `plugin://` URLs itself. Do not also add protocol
 * resolution middleware when using the default behavior.
 *
 * Authentication middleware must be supplied separately.
 *
 * @public
 */
export function createFetchApi(options: {
  discoveryApi: DiscoveryApi;
  baseImplementation?: typeof fetch;
  middleware?: FetchMiddleware | FetchMiddleware[];
  resolvePluginProtocol?: boolean;
}): FetchApi {
  const middleware = [options.middleware ?? []].flat();
  if (options.resolvePluginProtocol !== false) {
    middleware.unshift(
      FetchMiddlewares.resolvePluginProtocol({
        discoveryApi: options.discoveryApi,
      }),
    );
  }

  return createBaseFetchApi({
    baseImplementation: options.baseImplementation,
    middleware,
  });
}
