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

import { useCallback, useContext, useMemo } from 'react';
import { resolveAppPath } from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef, type AppHistoryApi } from './AppHistoryApi';
import type { AppNavigateOptions } from './AppLocation';
import {
  DataRouterContext,
  LocationContext,
  NavigationContext,
  RouteContext,
  useRouterContext,
} from './reactRouterContext';

/** React Router's route-relative navigate, read without requiring a router. */
function useOptionalReactRouterNavigate():
  | AppHistoryApi['navigate']
  | undefined {
  const navigation = useRouterContext(NavigationContext);
  const dataRouter = useRouterContext(DataRouterContext);
  const location = useRouterContext(LocationContext)?.location;
  const matches = useContext(RouteContext).matches;
  const relativeSplatPath = navigation?.future?.v7_relativeSplatPath ?? false;
  const routeBasePaths = useMemo(() => {
    const contributing = matches.filter(
      (match, index) => index === 0 || !!match.route.path,
    );
    return contributing.map((match, index) =>
      relativeSplatPath && index === contributing.length - 1
        ? match.pathname
        : match.pathnameBase,
    );
  }, [matches, relativeSplatPath]);

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
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const navigate = useCallback(
    (pathOrDelta: string | number, options?: AppNavigateOptions) => {
      if (typeof pathOrDelta === 'number') {
        appHistory?.navigate(pathOrDelta);
      } else {
        appHistory?.navigate(pathOrDelta, options);
      }
    },
    [appHistory],
  );
  return appHistory ? (navigate as AppHistoryApi['navigate']) : undefined;
}

/**
 * Navigate using the app history when registered, otherwise React Router's
 * `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Paths should be app-absolute (basename-stripped); a number
 * traverses that many entries through the current history authority.
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
