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

import { FrameworkLocation } from '@backstage/frontend-plugin-api';
import { Observable, Subscription } from '@backstage/types';

/** @internal */
export function parseFrameworkLocation(
  path: string,
  state?: unknown,
): FrameworkLocation {
  const url = new URL(path, 'http://localhost');
  return {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    state,
  };
}

/**
 * Creates a location observable that always emits the current location
 * synchronously on subscribe.
 *
 * @internal
 */
export function createSyncLocationObservable(
  getCurrent: () => FrameworkLocation,
  subscribers: Set<(value: FrameworkLocation) => void>,
): Observable<FrameworkLocation> {
  return {
    [Symbol.observable]() {
      return this;
    },
    subscribe(observerOrNext): Subscription {
      const next =
        typeof observerOrNext === 'function'
          ? observerOrNext
          : observerOrNext?.next?.bind(observerOrNext);
      if (next) {
        subscribers.add(next);
        next(getCurrent());
      }
      let closed = false;
      return {
        unsubscribe() {
          if (next) {
            subscribers.delete(next);
          }
          closed = true;
        },
        get closed() {
          return closed;
        },
      };
    },
  };
}
