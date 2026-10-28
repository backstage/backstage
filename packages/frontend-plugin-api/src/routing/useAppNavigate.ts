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
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import type { AppNavigateOptions } from './AppLocation';
import {
  DataRouterContext,
  LocationContext,
  NavigationContext,
  useRouterContext,
} from './reactRouterContext';

/** Adapts framework targets to a legacy React Router without requiring one. */
function useOptionalReactRouterNavigate():
  | AppHistoryApi['navigate']
  | undefined {
  const navigation = useRouterContext(NavigationContext);
  const dataRouter = useRouterContext(DataRouterContext);
  const location = useRouterContext(LocationContext)?.location;

  return useMemo(() => {
    if (!navigation) {
      return undefined;
    }

    const navigate = (
      pathOrDelta: string | number,
      options?: AppNavigateOptions,
    ) => {
      if (typeof pathOrDelta === 'number') {
        navigation.navigator.go(pathOrDelta);
        return;
      }
      const resolved = parsePath(
        resolveAppTarget(pathOrDelta, location?.pathname ?? '/'),
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
    return navigate as AppHistoryApi['navigate'];
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
export function useOptionalAppNavigate():
  | AppHistoryApi['navigate']
  | undefined {
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
 * basename. Relative paths belong to routing adapters and are rejected.
 * With app history, navigation reads the latest location when called, including
 * for empty, query-only, and hash-only targets. A number traverses that many history
 * entries. External URLs are supported when app history is registered; the old
 * frontend system retains React Router navigation semantics.
 *
 * The react-aria-style counterpart to this hook is {@link useAppHref}.
 *
 * @public
 */
export function useAppNavigate(): AppHistoryApi['navigate'] {
  const appNavigate = useOptionalAppNavigate();
  const reactRouterNavigate = useOptionalReactRouterNavigate();
  return useMemo(() => {
    const navigate = appNavigate ?? reactRouterNavigate;
    if (navigate) {
      return navigate as AppHistoryApi['navigate'];
    }
    return (() => {
      throw new Error(
        'useAppNavigate requires either an app history or a React Router context',
      );
    }) as AppHistoryApi['navigate'];
  }, [appNavigate, reactRouterNavigate]);
}
