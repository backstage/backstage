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
  type AppNavigateOptions,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createAppHistory } from '../../../frontend-app-api/src/routing/AppHistory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createMemoryHistoryBackend } from '../../../frontend-app-api/src/routing/HistoryBackend';

/**
 * Options for {@link createMockAppHistory}.
 *
 * @public
 */
export interface MockAppHistoryOptions {
  /**
   * Initial location for the mock app history's `location$`.
   * Defaults to `'/'`.
   *
   * Stands in for the browser URL, so a `basename` is stripped from it just as
   * the real app history strips it from `window.location` — every location the
   * API then hands out is app-relative.
   */
  initialLocation?: string;
  /**
   * Optional jest mock (or function) invoked by `navigate`. Location
   * emission still happens before this is called.
   */
  navigate?: jest.Mock | AppHistoryApi['navigate'];
  /**
   * App deploy basename prefixed onto `createHref` results, mirroring the
   * real `AppHistoryApi` implementation — including leaving targets that are
   * not app-relative alone, and stripping the prefix back off
   * {@link MockAppHistoryOptions.initialLocation}.
   *
   * `navigate` targets and `location$` emissions are app-relative on both
   * sides of the basename, exactly as in production: the real implementation
   * prepends the basename on the way into the History API and strips it on the
   * way back out, so a round trip through it is invisible.
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
    to: string | number;
    options?: AppNavigateOptions;
  }>;
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#AppHistoryApi}.
 *
 * Uses the production app history with an in-memory backend, including its
 * synchronous location subscriptions, stable snapshots, href resolution, and
 * numeric traversal. Prefer `renderInTestApp` / `renderTestApp` (and the
 * returned `appHistory`) for navigation across a full test app.
 *
 * Also available as `mockApis.appHistory()`. Pair with
 * {@link createMockRouteResolutionApi} for `RouteLink` /
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

  const instance = createAppHistory({
    history: createMemoryHistoryBackend({ initialEntries: [initialLocation] }),
    basename,
  });
  const navigateCalls: MockAppHistory['navigateCalls'] = [];
  const navigate = instance.navigate.bind(instance);

  return Object.assign(instance, {
    navigateCalls,
    navigate(to: string | number, navOptions?: AppNavigateOptions) {
      if (typeof to === 'number') {
        navigateCalls.push({ to });
        navigate(to);
        (navigateImpl as ((delta: number) => void) | undefined)?.(to);
      } else {
        navigateCalls.push({ to, options: navOptions });
        navigate(to, navOptions);
        // Preserve call arity for assertions on optional arguments.
        if (arguments.length < 2) {
          navigateImpl?.(to);
        } else {
          navigateImpl?.(to, navOptions);
        }
      }
    },
  });
}
