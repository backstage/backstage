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

import { Transport } from '@opensearch-project/opensearch';
import type { OpenSearchAuthProvider } from '../auth';

/**
 * Creates an OpenSearch Transport that resolves authentication headers from
 * the given provider immediately before each request.
 *
 * @internal
 */
export function createOpenSearchAuthTransport(
  authProvider: OpenSearchAuthProvider,
): typeof Transport {
  class AuthTransport extends Transport {
    request(
      params: any,
      optionsOrCallback: any = {},
      maybeCallback?: any,
    ): any {
      const isOptionsCallback = typeof optionsOrCallback === 'function';
      const options = isOptionsCallback ? {} : optionsOrCallback;
      const callback = isOptionsCallback ? optionsOrCallback : maybeCallback;

      if (callback !== undefined) {
        authProvider
          .getAuthHeaders()
          .then(authHeaders => {
            const mergedOptions = {
              ...options,
              headers: { ...options.headers, ...authHeaders },
            };
            return super.request(params, mergedOptions, callback);
          })
          .catch(callback);

        return { abort: () => {} };
      }

      const result = authProvider.getAuthHeaders().then(authHeaders => {
        const mergedOptions = {
          ...options,
          headers: { ...options.headers, ...authHeaders },
        };
        return super.request(params, mergedOptions);
      });

      (result as any).abort = () => {};
      return result;
    }
  }

  return AuthTransport;
}
