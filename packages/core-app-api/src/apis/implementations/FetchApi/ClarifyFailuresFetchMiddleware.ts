/*
 * Copyright 2025 The Backstage Authors
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

import { FetchMiddleware } from './types';

/**
 * Replaces the generic "TypeError: Failed to fetch" error with a more
 * informative message that includes the HTTP method and target URL.
 */
export class ClarifyFailuresFetchMiddleware implements FetchMiddleware {
  apply(next: typeof fetch): typeof fetch {
    return async (input, init) => {
      try {
        // NOTE: The "as any" cast is because of subtle undici type differences
        // that happened in a node types bump. Immaterial at runtime.
        return await next(input as any, init);
      } catch (e) {
        if (e instanceof TypeError && e.message === 'Failed to fetch') {
          try {
            let method: string;
            let url: string;

            if (isRequestLike(input)) {
              method = input.method;
              url = input.url;
            } else {
              method = init?.method || 'GET';
              url = String(input);
            }

            e.message = `Failed to fetch: ${method} ${url}`;
          } catch {
            // intentionally ignored - clarification is best-effort
          }
        }
        throw e;
      }
    };
  }
}

function isRequestLike(input: unknown): input is Request {
  return (
    input !== null &&
    typeof input === 'object' &&
    'method' in input &&
    'url' in input &&
    typeof input.method === 'string' &&
    typeof input.url === 'string'
  );
}
