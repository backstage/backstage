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

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi, useApiHolder } from '../apis/system';
import {
  navigationControllerApiRef,
  type NavigationControllerApi,
} from './NavigationControllerApi';
import type {
  RoutingLocation,
  RoutingNavigateOptions,
} from './RoutingContract';

function routingLocationEqual(a: RoutingLocation, b: RoutingLocation): boolean {
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash &&
    a.state === b.state
  );
}

/**
 * Subscribes to a navigation controller's `location$` when one is provided.
 * Returns `undefined` when there is no controller.
 */
function useNavigationControllerLocation(
  navigationController: NavigationControllerApi | undefined,
): RoutingLocation | undefined {
  const snapshotRef = useRef<RoutingLocation | undefined>(undefined);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!navigationController) {
        return () => {};
      }
      const subscription = navigationController.location$.subscribe(
        location => {
          if (
            !snapshotRef.current ||
            !routingLocationEqual(snapshotRef.current, location)
          ) {
            snapshotRef.current = location;
            onStoreChange();
          }
        },
      );
      return () => subscription.unsubscribe();
    },
    [navigationController],
  );

  const getSnapshot = useCallback((): RoutingLocation | undefined => {
    if (!navigationController) {
      return undefined;
    }
    if (!snapshotRef.current) {
      // location$ emits synchronously on subscribe; seed via a one-shot sub.
      const sub = navigationController.location$.subscribe(location => {
        snapshotRef.current = location;
      });
      sub.unsubscribe();
    }
    return snapshotRef.current;
  }, [navigationController]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Returns the current app location from the framework navigation controller.
 *
 * Prefer this over React Router's `useLocation` in app chrome and other
 * framework-owned UI so navigation does not depend on a root router as the
 * history authority.
 *
 * @public
 */
export function useFrameworkLocation(): RoutingLocation {
  const navigationController = useApi(navigationControllerApiRef);
  return useNavigationControllerLocation(navigationController)!;
}

/**
 * Returns a navigate function backed by the framework navigation controller.
 *
 * Prefer this over React Router's `useNavigate` for app chrome and
 * cross-plugin navigation. Paths are app-absolute (basename-stripped).
 *
 * Requires a registered navigation controller (new frontend system). For
 * plugin code that must also run under the old frontend system, prefer
 * {@link useCompatNavigate}, or use {@link useOptionalFrameworkNavigate}
 * and fall back to React Router yourself.
 *
 * @public
 */
export function useFrameworkNavigate(): (
  path: string,
  options?: RoutingNavigateOptions,
) => void {
  const navigationController = useApi(navigationControllerApiRef);
  return useCallback(
    (path: string, options?: RoutingNavigateOptions) => {
      navigationController.navigate(path, options);
    },
    [navigationController],
  );
}

/**
 * Like {@link useFrameworkNavigate}, but returns `undefined` when no
 * navigation controller is registered (old frontend system / OFS).
 *
 * Prefer {@link useCompatNavigate} in shared plugin code — it applies the
 * React Router fallback for you. Use this hook only when you need the
 * optional controller navigate function itself.
 *
 * @public
 */
export function useOptionalFrameworkNavigate():
  | ((path: string, options?: RoutingNavigateOptions) => void)
  | undefined {
  const navigationController = useApiHolder().get(navigationControllerApiRef);
  const navigate = useCallback(
    (path: string, options?: RoutingNavigateOptions) => {
      navigationController?.navigate(path, options);
    },
    [navigationController],
  );
  return navigationController ? navigate : undefined;
}

/**
 * Navigate using the framework navigation controller when registered, otherwise
 * React Router's `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Paths should be app-absolute (basename-stripped).
 *
 * @public
 */
export function useCompatNavigate(): (
  path: string,
  options?: RoutingNavigateOptions,
) => void {
  const frameworkNavigate = useOptionalFrameworkNavigate();
  const reactRouterNavigate = useNavigate();
  return useMemo(
    () =>
      frameworkNavigate ??
      ((to: string, options?: RoutingNavigateOptions) => {
        if (options) {
          reactRouterNavigate(to, options);
        } else {
          reactRouterNavigate(to);
        }
      }),
    [frameworkNavigate, reactRouterNavigate],
  );
}
