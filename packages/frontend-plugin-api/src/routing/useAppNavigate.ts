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

import { useMemo } from 'react';
import { resolveAppTarget, parsePath } from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import {
  DataRouterContext,
  LocationContext,
  NavigationContext,
  useRouterContext,
  stripLegacyBasename,
} from './reactRouterContext';

/**
 * Navigates to an app-absolute destination or traverses app history.
 *
 * @public
 */
export interface AppNavigate {
  /** Traverse a relative number of history entries. */
  (delta: number): void;
  /** Navigate to an app-absolute path or an external URL. */
  (
    path: string,
    options?: {
      replace?: boolean;
      /** User-visible state exposed on AppLocation.state. */
      state?: unknown;
    },
  ): void;
}

/** Adapts framework targets to a legacy React Router without requiring one. */
function useOptionalReactRouterNavigate(): AppNavigate | undefined {
  const navigation = useRouterContext(NavigationContext);
  const dataRouter = useRouterContext(DataRouterContext);
  const location = useRouterContext(LocationContext)?.location;

  return useMemo(() => {
    if (!navigation) {
      return undefined;
    }

    const navigate = (
      pathOrDelta: string | number,
      options?: Parameters<AppNavigate>[1],
    ) => {
      if (typeof pathOrDelta === 'number') {
        navigation.navigator.go(pathOrDelta);
        return;
      }
      const resolved = parsePath(
        resolveAppTarget(
          stripLegacyBasename(pathOrDelta, navigation.basename),
          location?.pathname ?? '/',
        ),
      );
      if (!dataRouter && navigation.basename !== '/') {
        resolved.pathname =
          resolved.pathname === '/'
            ? navigation.basename
            : `${navigation.basename}/${resolved.pathname}`.replace(
                /\/\/+/g,
                '/',
              );
      }
      if (options?.replace) {
        navigation.navigator.replace(resolved, options.state, options);
      } else {
        navigation.navigator.push(resolved, options?.state, options);
      }
    };
    return navigate as AppNavigate;
  }, [dataRouter, navigation, location?.pathname]);
}

/**
 * Returns a navigate function backed by the app history, or `undefined` when
 * no app history is registered (old frontend system / OFS).
 *
 * Not exported from the package: {@link useAppNavigate} is the supported
 * entry point and applies the React Router fallback for you. App shell code
 * that genuinely needs the optional navigate itself should read
 * {@link appHistoryApiRef} from the API holder directly.
 *
 * @internal
 */
export function useOptionalAppNavigate(): AppNavigate | undefined {
  const apis = useApiHolder();
  const appHistory = apis.get(appHistoryApiRef);
  return useMemo(() => appHistory?.navigate.bind(appHistory), [appHistory]);
}

/**
 * Navigate using the app history when registered, otherwise React Router's
 * `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Paths must start with `/` and exclude the deployment
 * basename. The old frontend fallback also accepts legacy route-ref URLs that
 * already include its configured basename. Relative paths belong to routing adapters and are rejected.
 * With app history, navigation reads the latest location when called, including
 * for empty, query-only, and hash-only targets. A number traverses that many history
 * entries. External URLs are supported when app history is registered; the old
 * frontend system retains React Router navigation semantics.
 *
 * The react-aria-style counterpart to this hook is {@link useAppHref}.
 *
 * @public
 */
export function useAppNavigate(): AppNavigate {
  const appNavigate = useOptionalAppNavigate();
  const reactRouterNavigate = useOptionalReactRouterNavigate();
  return useMemo(() => {
    const navigate = appNavigate ?? reactRouterNavigate;
    if (navigate) {
      return navigate as AppNavigate;
    }
    return (() => {
      throw new Error(
        'useAppNavigate requires either an app history or a React Router context',
      );
    }) as AppNavigate;
  }, [appNavigate, reactRouterNavigate]);
}
