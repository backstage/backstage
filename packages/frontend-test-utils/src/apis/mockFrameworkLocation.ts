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
 * Each subscription gets its own handler, exactly as the real app history's
 * `location$` does. Registering the caller's own function instead would key
 * the subscriber set by caller identity: the same callback subscribing twice
 * would collapse into one subscription, and unsubscribing either would silence
 * both — behavior no real observable has, and one a test could easily mistake
 * for a missed emission in the code under test.
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
      let closed = false;
      const next =
        typeof observerOrNext === 'function'
          ? observerOrNext
          : observerOrNext?.next?.bind(observerOrNext);

      const handler = (value: FrameworkLocation) => {
        if (!closed && next) {
          next(value);
        }
      };

      subscribers.add(handler);
      // Replay the current location immediately on subscribe.
      handler(getCurrent());

      return {
        unsubscribe() {
          closed = true;
          subscribers.delete(handler);
        },
        get closed() {
          return closed;
        },
      };
    },
  };
}

/**
 * Emits a location to every current subscriber.
 *
 * Iterates a copy, so a subscriber that unsubscribes (or subscribes) while
 * being notified does not mutate the set mid-emission — the same thing the
 * real app history does.
 *
 * @internal
 */
export function emitFrameworkLocation(
  location: FrameworkLocation,
  subscribers: Set<(value: FrameworkLocation) => void>,
): void {
  for (const subscriber of [...subscribers]) {
    subscriber(location);
  }
}
