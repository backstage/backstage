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
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import type {
  FrameworkLocation,
  FrameworkNavigateOptions,
} from './FrameworkLocation';
import { frameworkLocationEqual } from './useObservableAsState';

/**
 * Subscribes to the app history's `location$` when one is provided.
 * Returns `undefined` when there is no app history registered.
 */
function useAppHistoryLocation(
  appHistory: AppHistoryApi | undefined,
): FrameworkLocation | undefined {
  const snapshotRef = useRef<FrameworkLocation | undefined>(undefined);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!appHistory) {
        return () => {};
      }
      const subscription = appHistory.location$.subscribe(location => {
        if (
          !snapshotRef.current ||
          !frameworkLocationEqual(snapshotRef.current, location)
        ) {
          snapshotRef.current = location;
          onStoreChange();
        }
      });
      return () => subscription.unsubscribe();
    },
    [appHistory],
  );

  const getSnapshot = useCallback((): FrameworkLocation | undefined => {
    if (!appHistory) {
      return undefined;
    }
    if (!snapshotRef.current) {
      // location$ emits synchronously on subscribe; seed via a one-shot sub.
      const sub = appHistory.location$.subscribe(location => {
        snapshotRef.current = location;
      });
      sub.unsubscribe();
    }
    return snapshotRef.current;
  }, [appHistory]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Returns the current app location from the framework's app history.
 *
 * Prefer this over React Router's `useLocation` in app chrome and other
 * framework-owned UI so navigation does not depend on a root router as the
 * history authority.
 *
 * @public
 */
export function useFrameworkLocation(): FrameworkLocation {
  const appHistory = useApi(appHistoryApiRef);
  return useAppHistoryLocation(appHistory)!;
}

/**
 * Returns a navigate function backed by the framework's app history.
 *
 * Package-internal helper for NFS-only call sites (e.g. {@link RouteLink}).
 * App shell code should use {@link appHistoryApiRef} directly.
 * Plugin code should prefer {@link useAppNavigate}.
 *
 * @internal
 */
export function useFrameworkNavigate(): (
  path: string,
  options?: FrameworkNavigateOptions,
) => void {
  const appHistory = useApi(appHistoryApiRef);
  return useCallback(
    (path: string, options?: FrameworkNavigateOptions) => {
      appHistory.navigate(path, options);
    },
    [appHistory],
  );
}

/**
 * Returns a navigate function backed by the framework's app history, or
 * `undefined` when no app history is registered (old frontend system / OFS).
 *
 * Prefer {@link useAppNavigate} in shared plugin code — it applies the
 * React Router fallback for you. Use this hook only when you need the
 * optional navigate function itself.
 *
 * @public
 */
export function useOptionalFrameworkNavigate():
  | ((path: string, options?: FrameworkNavigateOptions) => void)
  | undefined {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const navigate = useCallback(
    (path: string, options?: FrameworkNavigateOptions) => {
      appHistory?.navigate(path, options);
    },
    [appHistory],
  );
  return appHistory ? navigate : undefined;
}

/**
 * Navigate using the framework's app history when registered, otherwise
 * React Router's `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Paths should be app-absolute (basename-stripped).
 *
 * The react-aria-style counterpart to this hook is {@link useHref}.
 *
 * @public
 */
export function useAppNavigate(): (
  path: string,
  options?: FrameworkNavigateOptions,
) => void {
  const frameworkNavigate = useOptionalFrameworkNavigate();
  const reactRouterNavigate = useNavigate();
  return useMemo(
    () =>
      frameworkNavigate ??
      ((to: string, options?: FrameworkNavigateOptions) => {
        if (options) {
          reactRouterNavigate(to, options);
        } else {
          reactRouterNavigate(to);
        }
      }),
    [frameworkNavigate, reactRouterNavigate],
  );
}
