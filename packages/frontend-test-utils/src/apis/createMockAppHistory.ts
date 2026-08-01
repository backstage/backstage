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
import { isExternalTarget } from '@internal/frontend';
import {
  createSyncLocationObservable,
  emitFrameworkLocation,
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
    to: string;
    options?: FrameworkNavigateOptions;
  }>;
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#AppHistoryApi}.
 *
 * Always emits synchronously on `location$` subscribe. `navigate` updates
 * the current location and notifies subscribers, matching the real
 * app history's sync-emission invariant. `location` keeps the same object
 * reference until the location actually changes, exactly like the real app
 * history, so tests exercise the same `useSyncExternalStore` snapshot
 * behavior as production. Targets that are not app-relative (absolute,
 * protocol-relative, or opaque schemes such as `mailto:`) are treated exactly
 * as the real implementation treats them: `createHref` passes them through
 * unchanged and `navigate` throws. Prefer `renderInTestApp` /
 * `renderTestApp` (and the returned `appHistory`) when asserting
 * navigation across a full test app.
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

  const subscribers = new Set<(value: FrameworkLocation) => void>();
  const navigateCalls: MockAppHistory['navigateCalls'] = [];

  /**
   * Mirrors the real app history's `stripBasename`: the initial location
   * stands in for the browser URL, which carries the deploy basename, while
   * every location the API hands out is app-relative.
   */
  function stripBasename(pathname: string): string {
    if (
      basename &&
      (pathname === basename || pathname.startsWith(`${basename}/`))
    ) {
      return pathname.slice(basename.length) || '/';
    }
    return pathname;
  }

  const initial = parseFrameworkLocation(initialLocation);
  let current: FrameworkLocation = {
    ...initial,
    pathname: stripBasename(initial.pathname),
  };

  // Mirrors the real app history: the reference is only replaced when
  // something observable about the location changed, so `location` is safe to
  // hand straight to `useSyncExternalStore` and a navigate to the location we
  // are already on does not force a re-render.
  function commitLocation(next: FrameworkLocation): FrameworkLocation {
    if (
      current.pathname !== next.pathname ||
      current.search !== next.search ||
      current.hash !== next.hash ||
      !Object.is(current.state, next.state)
    ) {
      current = next;
    }
    return current;
  }

  const location$ = createSyncLocationObservable(() => current, subscribers);

  return {
    get location() {
      return current;
    },
    location$,
    navigateCalls,
    navigate(to: string, navOptions?: FrameworkNavigateOptions) {
      if (isExternalTarget(to)) {
        throw new Error(
          'AppHistory.navigate does not support absolute or protocol-relative URLs',
        );
      }
      navigateCalls.push({ to, options: navOptions });
      // `?? undefined` mirrors the real app history, which reads state back out
      // of the History API — where an absent state is `null` — and normalizes
      // it before emitting.
      commitLocation(
        parseFrameworkLocation(to, navOptions?.state ?? undefined),
      );
      emitFrameworkLocation(current, subscribers);
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
      if (isExternalTarget(to)) {
        return to;
      }
      // Normalised through URL even without a basename, because the real
      // implementation always is. Skipping it here would let a target the app
      // history would have turned app-absolute (`catalog`, `/a/../b`) survive a
      // test unchanged, which is exactly the kind of gap that hides a bug until
      // production.
      const url = new URL(to, 'http://localhost');
      return `${basename}${url.pathname}${url.search}${url.hash}`;
    },
  };
}
