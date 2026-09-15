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

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  NavigationType,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  matchPath,
} from 'react-router-dom';
import {
  createAppHistoryRouter,
  useAppRouteMatches,
  usePageMount,
  type ReactRouterAdapterBindings,
} from '@internal/frontend';
import { useApiHolder } from '../apis/system';
import type { AppNode } from '../apis/definitions/AppTreeApi';
import { appHistoryApiRef, type AppHistoryApi } from '../routing/AppHistoryApi';

const LegacyPageRouterContext = createContext<AppNode | undefined>(undefined);
const warnedExtensions = new WeakMap<AppHistoryApi, Set<string>>();
const bindings: ReactRouterAdapterBindings = {
  NavigationType,
  matchPath: matchPath as ReactRouterAdapterBindings['matchPath'],
  UNSAFE_NavigationContext:
    UNSAFE_NavigationContext as ReactRouterAdapterBindings['UNSAFE_NavigationContext'],
  UNSAFE_LocationContext:
    UNSAFE_LocationContext as ReactRouterAdapterBindings['UNSAFE_LocationContext'],
  UNSAFE_RouteContext:
    UNSAFE_RouteContext as ReactRouterAdapterBindings['UNSAFE_RouteContext'],
};

/** Preserve existing new frontend pages while their owners adopt explicit adapters. */
export function LegacyPageRouter(props: {
  node: AppNode;
  children: ReactNode;
}) {
  const { node, children } = props;
  const parentNode = useContext(LegacyPageRouterContext);
  const history = useApiHolder().get(appHistoryApiRef);
  const routePattern = usePageMount()?.routePattern;
  const ownsMount = useAppRouteMatches()?.some(match => match.node === node);
  const router = useMemo(() => {
    if (!history || !routePattern || !ownsMount || parentNode === node) {
      return undefined;
    }
    return createAppHistoryRouter(bindings, history, {
      routePattern,
      navigationContextExtras: { future: { v7_relativeSplatPath: false } },
      onUse:
        process.env.NODE_ENV === 'development'
          ? () => {
              let warned = warnedExtensions.get(history);
              if (!warned) {
                warned = new Set();
                warnedExtensions.set(history, warned);
              }
              if (!warned.has(node.spec.id)) {
                warned.add(node.spec.id);
                // eslint-disable-next-line no-console
                console.warn(
                  `Extension '${node.spec.id}' uses implicit React Router v6 routing. Render ReactRouterV6PageRouter from @backstage/plugin-app-react-router-v6 in its loader to migrate. Existing routing remains supported.`,
                );
              }
            }
          : undefined,
    });
  }, [history, routePattern, ownsMount, parentNode, node]);
  if (!router) {
    return <>{children}</>;
  }
  return (
    <LegacyPageRouterContext.Provider value={node}>
      <router.Router>{children}</router.Router>
    </LegacyPageRouterContext.Provider>
  );
}
