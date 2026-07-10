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
  NavigationControllerApi,
  RoutingBlocker,
  RoutingLocation,
  RoutingNavigateOptions,
  type RoutingContract,
} from '@backstage/frontend-plugin-api';
import {
  createSyncLocationObservable,
  parseRoutingLocation,
} from './mockRoutingLocation';

/**
 * Options for {@link createMockNavigationController}.
 *
 * @public
 */
export interface MockNavigationControllerOptions {
  /**
   * Initial location for {@link NavigationControllerApi.location$}.
   * Defaults to `'/'`.
   */
  initialLocation?: string;
  /**
   * Optional jest mock (or function) invoked by
   * {@link NavigationControllerApi.navigate}. Location emission still
   * happens before this is called.
   */
  navigate?: jest.Mock | NavigationControllerApi['navigate'];
  /**
   * Optional jest mock (or function) invoked by
   * {@link NavigationControllerApi.go}.
   */
  go?: jest.Mock | NavigationControllerApi['go'];
}

/**
 * A mock {@link @backstage/frontend-plugin-api#NavigationControllerApi}
 * for unit tests that need framework navigate without a full test app.
 *
 * @public
 */
export interface MockNavigationController extends NavigationControllerApi {
  /**
   * Recorded {@link NavigationControllerApi.navigate} calls, in order.
   */
  navigateCalls: Array<{
    to: string;
    options?: RoutingNavigateOptions;
  }>;
  /**
   * Recorded {@link NavigationControllerApi.go} deltas, in order.
   */
  goCalls: number[];
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#NavigationControllerApi}.
 *
 * Always emits synchronously on `location$` subscribe. `navigate` updates
 * the current location and notifies subscribers, matching the real
 * controller's sync-emission invariant. Prefer a real
 * {@link @backstage/frontend-app-api#NavigationController} with memory
 * history when asserting back/forward stack behavior.
 *
 * Also available as {@link mockApis.navigationController}. Pair with
 * {@link createMockRouteResolutionApi} and optionally
 * {@link createMockContract} under `RoutingContractContext` for NFS
 * `RouteLink` / `useNavigateRouteRef` tests.
 *
 * @public
 * @example
 * ```ts
 * const navigate = jest.fn();
 * const controller = createMockNavigationController({ navigate });
 * ```
 */
export function createMockNavigationController(
  options: MockNavigationControllerOptions = {},
): MockNavigationController {
  const { initialLocation = '/', navigate: navigateImpl, go: goImpl } = options;

  const subscribers = new Set<(value: RoutingLocation) => void>();
  let current = parseRoutingLocation(initialLocation);
  const adapterStates = new Map<string, unknown>();
  const navigateCalls: MockNavigationController['navigateCalls'] = [];
  const goCalls: MockNavigationController['goCalls'] = [];

  const location$ = createSyncLocationObservable(() => current, subscribers);

  return {
    location$,
    navigateCalls,
    goCalls,
    navigate(to: string, navOptions?: RoutingNavigateOptions) {
      navigateCalls.push({ to, options: navOptions });
      current = parseRoutingLocation(to, navOptions?.state);
      adapterStates.clear();
      if (navOptions?.adapterState) {
        for (const [id, value] of Object.entries(navOptions.adapterState)) {
          adapterStates.set(id, value);
        }
      }
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
    go(delta: number) {
      goCalls.push(delta);
      goImpl?.(delta);
    },
    canGoBack() {
      return false;
    },
    canGoForward() {
      return false;
    },
    get historyLength() {
      return 1;
    },
    getAdapterState(adapterId: string) {
      return adapterStates.get(adapterId);
    },
    block(_blocker: RoutingBlocker) {
      return () => {};
    },
    createContract(_basePath: string): RoutingContract {
      return {
        basePath: '/',
        location$,
        navigate() {},
        go() {},
        canGoBack: () => false,
        canGoForward: () => false,
        historyLength: 1,
        getAdapterState: () => undefined,
        block: () => () => {},
      };
    },
  };
}
