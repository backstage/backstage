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
  RoutingBlocker,
  RoutingContract,
  FrameworkLocation,
  FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import {
  createSyncLocationObservable,
  parseFrameworkLocation,
} from './mockFrameworkLocation';

/**
 * Options for creating a mock routing contract.
 *
 * @public
 */
export interface MockContractOptions {
  basePath: string;
  initialLocation?: string;
}

/**
 * A mock routing contract that tracks navigate calls for testing.
 *
 * @public
 */
export interface MockContract extends RoutingContract {
  navigateCalls: Array<{
    to: string;
    options?: FrameworkNavigateOptions;
  }>;
  goCalls: number[];
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#RoutingContract} for use in tests.
 *
 * Always emits synchronously on `location$` subscribe (including when the
 * initial location is the empty scoped sentinel `pathname: '/'`), matching
 * the RoutingContract out-of-scope sync-emission invariant.
 *
 * Stack helpers (`go`, `canGoBack`, `historyLength`) are lightweight stubs
 * suitable for adapter unit tests; prefer a real NavigationController with
 * memory history when asserting back/forward behavior.
 *
 * `block` gates `navigate` the same way the real HistoryBackend does —
 * sequentially, stopping at the first blocker that returns (or resolves)
 * `true` — but never gates `go`, matching the framework contract.
 *
 * @public
 */
export function createMockContract(options: MockContractOptions): MockContract {
  const { basePath, initialLocation = '/' } = options;

  const subscribers = new Set<(value: FrameworkLocation) => void>();
  let currentLocation = parseFrameworkLocation(initialLocation);
  const adapterStates = new Map<string, unknown>();
  let historyLength = 1;
  let historyIndex = 0;
  let blockers: RoutingBlocker[] = [];

  const navigateCalls: MockContract['navigateCalls'] = [];
  const goCalls: MockContract['goCalls'] = [];

  const location$ = createSyncLocationObservable(
    () => currentLocation,
    subscribers,
  );

  return {
    basePath,
    location$,
    navigateCalls,
    goCalls,
    navigate(to: string, navOptions?: FrameworkNavigateOptions) {
      navigateCalls.push({ to, options: navOptions });
      const nextLocation = parseFrameworkLocation(to, navOptions?.state);
      const performNavigate = () => {
        currentLocation = nextLocation;
        adapterStates.clear();
        if (navOptions?.adapterState) {
          for (const [id, value] of Object.entries(navOptions.adapterState)) {
            adapterStates.set(id, value);
          }
        }
        if (!navOptions?.replace) {
          historyIndex += 1;
          historyLength = historyIndex + 1;
        }
        for (const subscriber of subscribers) {
          subscriber(currentLocation);
        }
      };

      if (blockers.length === 0 || navOptions?.ignoreBlockers) {
        performNavigate();
        return;
      }
      const transition = {
        currentLocation,
        nextLocation,
        action: navOptions?.replace ? ('REPLACE' as const) : ('PUSH' as const),
      };
      void (async () => {
        for (const blocker of blockers) {
          // eslint-disable-next-line no-await-in-loop
          if (await blocker(transition)) {
            return;
          }
        }
        performNavigate();
      })();
    },
    block(blocker: RoutingBlocker) {
      blockers = [...blockers, blocker];
      return () => {
        blockers = blockers.filter(b => b !== blocker);
      };
    },
    go(delta: number) {
      goCalls.push(delta);
      const next = historyIndex + delta;
      if (next < 0 || next >= historyLength) {
        return;
      }
      historyIndex = next;
    },
    canGoBack() {
      return historyIndex > 0;
    },
    canGoForward() {
      return historyIndex < historyLength - 1;
    },
    get historyLength() {
      return historyLength;
    },
    getAdapterState(adapterId: string) {
      return adapterStates.get(adapterId);
    },
  };
}
