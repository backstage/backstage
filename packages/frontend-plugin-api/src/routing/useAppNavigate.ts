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

import { useCallback, useMemo } from 'react';
import { resolveAppPath } from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { useAppNode } from '../components/AppNodeProvider';
import { routeResolutionApiRef } from '../apis/definitions/RouteResolutionApi';
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import type { AppNavigateOptions } from './AppLocation';
import {
  DataRouterContext,
  LocationContext,
  NavigationContext,
  useRouteBasePaths,
  useRouterContext,
} from './reactRouterContext';

/** React Router's route-relative navigate, read without requiring a router. */
function useOptionalReactRouterNavigate():
  | AppHistoryApi['navigate']
  | undefined {
  const navigation = useRouterContext(NavigationContext);
  const dataRouter = useRouterContext(DataRouterContext);
  const location = useRouterContext(LocationContext)?.location;
  const routeBasePaths = useRouteBasePaths();

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
      const resolved = resolveAppPath(
        pathOrDelta,
        routeBasePaths,
        location?.pathname ?? '/',
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
  }, [dataRouter, navigation, location?.pathname, routeBasePaths]);
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
  const routes = apis.get(routeResolutionApiRef);
  const node = useAppNode();
  const navigate = useCallback(
    (pathOrDelta: string | number, options?: AppNavigateOptions) => {
      if (typeof pathOrDelta === 'number') {
        appHistory?.navigate(pathOrDelta);
      } else if (appHistory) {
        const target = routes
          ? routes.resolveTarget({
              to: pathOrDelta,
              pathname: appHistory.location.pathname,
              node,
            })
          : pathOrDelta;
        appHistory.navigate(target, options);
      }
    },
    [appHistory, routes, node],
  );
  return appHistory ? (navigate as AppHistoryApi['navigate']) : undefined;
}

/**
 * Navigate using the app history when registered, otherwise React Router's
 * `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Relative targets resolve against the calling extension's
 * route ancestry, just like {@link useHref}; each leading `..` climbs one
 * path-contributing route. App-absolute paths exclude the deployment basename.
 * With app history, navigation reads the latest location when called, including
 * for query-only and hash-only targets. A number traverses that many history
 * entries. External URLs are supported when app history is registered; the old
 * frontend system retains React Router navigation semantics.
 *
 * The react-aria-style counterpart to this hook is {@link useHref}.
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
