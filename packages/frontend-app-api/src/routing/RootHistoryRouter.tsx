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
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  NavigationType,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  type Location as RRLocation,
  type To,
} from 'react-router-dom';
import type {
  AppHistoryApi,
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';

/**
 * Props for {@link RootHistoryRouter}.
 *
 * @internal
 */
export interface RootHistoryRouterProps {
  history: AppHistoryApi;
  children: ReactNode;
}

const EMPTY_ROUTE_CONTEXT = {
  outlet: null,
  matches: [],
  isDataRoute: false,
};

function toPath(to: To): string {
  if (typeof to === 'string') {
    return to;
  }
  return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
}

function toRRLocation(loc: FrameworkLocation): RRLocation {
  return {
    pathname: loc.pathname,
    search: loc.search,
    hash: loc.hash,
    state: loc.state ?? null,
    key: 'default',
  };
}

/**
 * Provides a root React Router v6 context (Navigation / Location / Route)
 * projected from the framework's {@link AppHistoryApi}, without nesting a
 * `<Router>` or writing to `window.history` itself — `AppHistoryApi` remains
 * the sole history authority.
 *
 * Shared by app chrome (`plugins/app`) and test apps (`frontend-test-utils`)
 * that still need a root React Router context for legacy chrome / old
 * frontend system compatibility (`useResolvedPath`, relative `Link`
 * targets, etc.), without depending on a page-router adapter package.
 *
 * @internal
 */
export function RootHistoryRouter(props: RootHistoryRouterProps) {
  const { history, children } = props;

  const snapshotRef = useRef<FrameworkLocation | undefined>(undefined);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const sub = history.location$.subscribe(loc => {
        snapshotRef.current = loc;
        onStoreChange();
      });
      return () => sub.unsubscribe();
    },
    [history],
  );

  // location$ emits synchronously on subscribe, so a throwaway subscription
  // seeds the ref when no subscription is active yet (e.g. first render).
  const getSnapshot = useCallback((): FrameworkLocation => {
    if (!snapshotRef.current) {
      const sub = history.location$.subscribe(loc => {
        snapshotRef.current = loc;
      });
      sub.unsubscribe();
    }
    return snapshotRef.current!;
  }, [history]);

  const location = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const rrLocation = useMemo(() => toRRLocation(location), [location]);

  const navigator = useMemo(
    () => ({
      createHref: (to: To) => history.createHref(toPath(to)),
      go: () => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(
            '[RootHistoryRouter] navigator.go() is not supported by the ' +
              'framework app history; use browser back/forward instead.',
          );
        }
      },
      push: (to: To, state?: any) => {
        history.navigate(toPath(to), { state });
      },
      replace: (to: To, state?: any) => {
        history.navigate(toPath(to), { state, replace: true });
      },
    }),
    [history],
  );

  const navigationContextValue = useMemo(
    () => ({
      basename: '',
      navigator,
      static: false,
      future: { v7_relativeSplatPath: false },
    }),
    [navigator],
  );

  const locationContextValue = useMemo(
    () => ({ location: rrLocation, navigationType: NavigationType.Pop }),
    [rrLocation],
  );

  return (
    <UNSAFE_NavigationContext.Provider value={navigationContextValue}>
      <UNSAFE_LocationContext.Provider value={locationContextValue}>
        <UNSAFE_RouteContext.Provider value={EMPTY_ROUTE_CONTEXT}>
          {children}
        </UNSAFE_RouteContext.Provider>
      </UNSAFE_LocationContext.Provider>
    </UNSAFE_NavigationContext.Provider>
  );
}
