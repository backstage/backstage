/*
 * Copyright 2024 The Backstage Authors
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

import { Transport as OpenSearchTransport } from '@opensearch-project/opensearch';
import { Transport as ElasticSearchTransport } from '@elastic/elasticsearch';
import { ElasticSearchAuthProvider } from '../auth';
import { ElasticSearchTransportConstructor } from './ElasticSearchClientOptions';

/**
 * Creates a custom OpenSearch Transport class that injects authentication headers
 * from the provided auth provider before each request.
 *
 * @param authProvider - The authentication provider to use for getting headers
 * @returns A Transport class constructor that can be used with the OpenSearch client
 *
 * @internal
 */
export function createOpenSearchAuthTransport(
  authProvider: ElasticSearchAuthProvider,
): ElasticSearchTransportConstructor {
  class AuthTransport extends OpenSearchTransport {
    request(
      params: any,
      optionsOrCallback: any = {},
      maybeCallback?: any,
    ): any {
      // options is optional, so if it's a function, it's the callback
      const isOptionsCallback = typeof optionsOrCallback === 'function';
      const options = isOptionsCallback ? {} : optionsOrCallback;
      const callback = isOptionsCallback ? optionsOrCallback : maybeCallback;

      // If callback style, wrap it to inject headers
      if (callback !== undefined) {
        authProvider
          .getAuthHeaders()
          .then(authHeaders => {
            const mergedOptions = {
              ...options,
              headers: {
                ...options.headers,
                ...authHeaders,
              },
            };
            return super.request(params, mergedOptions, callback);
          })
          .catch(callback);

        // Return an abort-able object similar to the AWS transport
        return {
          abort: () => {},
        };
      }

      // Promise style
      return authProvider.getAuthHeaders().then(authHeaders => {
        const mergedOptions = {
          ...options,
          headers: {
            ...options.headers,
            ...authHeaders,
          },
        };
        return super.request(params, mergedOptions);
      });
    }
  }

  return AuthTransport as unknown as ElasticSearchTransportConstructor;
}

/**
 * Creates a custom Elasticsearch Transport class that injects authentication headers
 * from the provided auth provider before each request.
 *
 * @param authProvider - The authentication provider to use for getting headers
 * @returns A Transport class constructor that can be used with the Elasticsearch client
 *
 * @internal
 */
export function createElasticSearchAuthTransport(
  authProvider: ElasticSearchAuthProvider,
): ElasticSearchTransportConstructor {
  class AuthTransport extends ElasticSearchTransport {
    request(params: any, options?: any, callback?: any): any {
      // Handle overloaded signatures
      if (typeof options === 'function') {
        // Callback style without options
        const cb = options;
        authProvider
          .getAuthHeaders()
          .then(authHeaders => {
            const mergedOptions = {
              headers: authHeaders,
            };
            return super.request(params, mergedOptions, cb);
          })
          .catch(cb);

        return { abort: () => {} };
      }

      if (callback !== undefined) {
        // Callback style with options
        authProvider
          .getAuthHeaders()
          .then(authHeaders => {
            const mergedOptions = {
              ...options,
              headers: {
                ...options?.headers,
                ...authHeaders,
              },
            };
            return super.request(params, mergedOptions, callback);
          })
          .catch(callback);

        return { abort: () => {} };
      }

      // Promise style
      const result = authProvider.getAuthHeaders().then(authHeaders => {
        const mergedOptions = {
          ...options,
          headers: {
            ...options?.headers,
            ...authHeaders,
          },
        };
        return super.request(params, mergedOptions);
      });

      // Add abort method to match TransportRequestPromise interface
      (result as any).abort = () => {};
      return result;
    }
  }

  return AuthTransport as unknown as ElasticSearchTransportConstructor;
}
