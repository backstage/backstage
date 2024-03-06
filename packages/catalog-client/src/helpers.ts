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

import { DefaultApiClient } from './generated';
import { CatalogRequestOptions } from './types';

// Ensures that only one feature callback is started at any given time, and
// memoizes its result.
export function featureDetector<TArgs extends any[]>(
  hasFeature: (...args: TArgs) => Promise<boolean | undefined>,
  options?: {
    timeoutMillis?: number;
  },
): (...args: TArgs) => Promise<boolean | undefined> {
  // The current (or last, when an end state has been reached) promise that
  // performs a single feature check.
  let promise: Promise<boolean | undefined> | undefined;

  // On the very first run of the feature check, a deadline is picked which is a
  // timestamp after which we no longer keep trying to do this feature check at
  // all. This is in place just to avoid infinitely calling a check that seems
  // to have no plans of ever starting to succeed at all.
  let deadline: Date | undefined;

  return (...args) => {
    if (!promise) {
      promise = new Promise<boolean | undefined>(resolve => {
        if (!deadline) {
          deadline = new Date(Date.now() + (options?.timeoutMillis ?? 30_000));
        }

        const millisUntilDeadline = deadline.getTime() - Date.now();
        if (millisUntilDeadline <= 0) {
          // stop trying
          resolve(false);
          return;
        }

        let timeoutHandle: NodeJS.Timeout;
        const timeoutPromise = new Promise<'timeout'>(r => {
          timeoutHandle = setTimeout(() => r('timeout'), millisUntilDeadline);
        });

        const featurePromise = Promise.resolve()
          .then(() => {
            return hasFeature(...args);
          })
          .catch(() => {
            return undefined;
          });

        Promise.race([timeoutPromise, featurePromise]).then(res => {
          if (res === 'timeout') {
            // deadline was hit; resolve to false and leave this promise in
            // place indefinitely
            resolve(false);
            return;
          }
          clearTimeout(timeoutHandle!);
          if (res === undefined) {
            // we don't know for sure yet, try again next round
            promise = undefined;
          }
          resolve(res);
        });
      });
    }

    return promise;
  };
}

export function hasQueryEntities(
  client: DefaultApiClient,
): (options?: CatalogRequestOptions) => Promise<boolean | undefined> {
  return async (options?: CatalogRequestOptions) => {
    const response = await client.getEntitiesByQuery(
      { query: { limit: 1 } },
      options,
    );
    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      return undefined;
    }
    return true;
  };
}
