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

import {
  type AppHistoryApi,
  type FrameworkLocation,
  type FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import {
  createSyncLocationObservable,
  parseFrameworkLocation,
} from './mockFrameworkLocation';

/**
 * Options for {@link createMockAppHistory}.
 *
 * @public
 */
export interface MockAppHistoryOptions {
  /**
   * Initial location for the mock app history's `location$`.
   * Defaults to `'/'`.
   */
  initialLocation?: string;
  /**
   * Optional jest mock (or function) invoked by `navigate`. Location
   * emission still happens before this is called.
   */
  navigate?: jest.Mock | AppHistoryApi['navigate'];
  /**
   * App deploy basename prefixed onto `createHref` results, mirroring the
   * real `AppHistoryApi` implementation. Does not affect `navigate` or
   * `location$`, which are always basename-independent.
   */
  basename?: string;
}

/**
 * A mock {@link @backstage/frontend-plugin-api#AppHistoryApi} for unit tests
 * that need framework navigate without a full test app.
 *
 * @public
 */
export interface MockAppHistory extends AppHistoryApi {
  /**
   * Recorded `navigate` calls, in order.
   */
  navigateCalls: Array<{
    to: string;
    options?: FrameworkNavigateOptions;
  }>;
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#AppHistoryApi}.
 *
 * Always emits synchronously on `location$` subscribe. `navigate` updates
 * the current location and notifies subscribers, matching the real
 * app history's sync-emission invariant. Prefer `renderInTestApp` /
 * `renderTestApp` (and the returned `navigationController`) when asserting
 * navigation across a full test app.
 *
 * Also available as `mockApis.appHistory()`. Pair with
 * {@link createMockRouteResolutionApi} for NFS `RouteLink` /
 * `useNavigateRouteRef` tests.
 *
 * @public
 * @example
 * ```ts
 * const navigate = jest.fn();
 * const appHistory = createMockAppHistory({ navigate });
 * ```
 */
export function createMockAppHistory(
  options: MockAppHistoryOptions = {},
): MockAppHistory {
  const {
    initialLocation = '/',
    navigate: navigateImpl,
    basename = '',
  } = options;

  const subscribers = new Set<(value: FrameworkLocation) => void>();
  let current = parseFrameworkLocation(initialLocation);
  const navigateCalls: MockAppHistory['navigateCalls'] = [];

  const location$ = createSyncLocationObservable(() => current, subscribers);

  return {
    location$,
    navigateCalls,
    navigate(to: string, navOptions?: FrameworkNavigateOptions) {
      navigateCalls.push({ to, options: navOptions });
      current = parseFrameworkLocation(to, navOptions?.state);
      for (const subscriber of subscribers) {
        subscriber(current);
      }
      if (!navigateImpl) {
        return;
      }
      // Preserve call arity so jest assertions on optional options stay accurate.
      if (arguments.length < 2) {
        (navigateImpl as (path: string) => void)(to);
      } else {
        navigateImpl(to, navOptions);
      }
    },
    createHref(to: string) {
      if (!basename) {
        return to;
      }
      const url = new URL(to, 'http://localhost');
      return `${basename}${url.pathname}${url.search}${url.hash}`;
    },
  };
}
