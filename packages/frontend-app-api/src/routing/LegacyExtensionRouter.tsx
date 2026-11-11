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
  resolveAppPath,
  createPath,
  isExternalTarget,
  sanitizeHref,
  unwrapReactRouterContext,
  type ReactRouterAdapterBindings,
} from '@internal/frontend';
import {
  appHistoryApiRef,
  NavigationProvider,
  useApi,
  useApiHolder,
  useRouteResolution,
  type AppHistoryApi,
  type AppNode,
  type Navigation,
} from '@backstage/frontend-plugin-api';

const LegacyExtensionRouterContext = createContext<AppNode | undefined>(
  undefined,
);
const warnedExtensions = new WeakMap<AppHistoryApi, Set<string>>();

function warnImplicitRouting(history: AppHistoryApi, node: AppNode) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  let warned = warnedExtensions.get(history);
  if (!warned) {
    warned = new Set();
    warnedExtensions.set(history, warned);
  }
  if (!warned.has(node.spec.id)) {
    warned.add(node.spec.id);
    // eslint-disable-next-line no-console
    console.warn(
      `Extension '${node.spec.id}' uses implicit React Router v6 routing. Render ReactRouterV6PageRouter from @backstage/frontend-adapter-react-router-v6 in its loader to migrate. Existing routing remains supported.`,
    );
  }
}

/** Called by each navigation consumer, inside its own React Router route context. */
function useLegacyNavigation(): Navigation {
  const history = useApi(appHistoryApiRef);
  const node = useContext(LegacyExtensionRouterContext)!;
  // Framework-supported targets do not consume implicit routing. Native router
  // hooks still observe these contexts and report their own compatibility use.
  const { location } = unwrapReactRouterContext(
    useContext(UNSAFE_LocationContext),
  );
  const { matches } = unwrapReactRouterContext(useContext(UNSAFE_RouteContext));
  const bases = matches
    .filter((match, index) => index === 0 || !!match.route.path)
    .map(match => match.pathnameBase);
  const resolveTarget = (to: string) => {
    const safeTo = sanitizeHref(to);
    if (
      safeTo === '' ||
      safeTo.startsWith('/') ||
      safeTo.startsWith('?') ||
      safeTo.startsWith('#') ||
      isExternalTarget(safeTo)
    ) {
      return safeTo;
    }
    warnImplicitRouting(history, node);
    return createPath(resolveAppPath(safeTo, bases, location.pathname));
  };
  return {
    navigate: (to, options) => history.navigate(resolveTarget(to), options),
    createHref: to => history.createHref(resolveTarget(to)),
    pathname: new URL(
      history.createHref(location.pathname),
      'http://backstage.local',
    ).pathname,
  };
}

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

/** Preserve implicit v6 routing around the complete output of a matched route-bearing extension. */
export function LegacyExtensionRouter(props: {
  node: AppNode;
  children: ReactNode;
}) {
  const { node, children } = props;
  const parentNode = useContext(LegacyExtensionRouterContext);
  const history = useApiHolder().get(appHistoryApiRef);
  const mounts = useRouteResolution().matches;
  const routePattern = mounts.at(-1)?.routePattern;
  const ownsMount = mounts.some(match => match.node === node);
  const router = useMemo(() => {
    if (!history || !routePattern || !ownsMount || parentNode === node) {
      return undefined;
    }
    return createAppHistoryRouter(bindings, history, {
      routePattern,
      navigationContextExtras: { future: { v7_relativeSplatPath: false } },
      onUse:
        process.env.NODE_ENV === 'development'
          ? () => warnImplicitRouting(history, node)
          : undefined,
    });
  }, [history, routePattern, ownsMount, parentNode, node]);
  if (!router) {
    return <>{children}</>;
  }
  return (
    <LegacyExtensionRouterContext.Provider value={node}>
      <router.Router mounts={mounts}>
        <NavigationProvider useNavigation={useLegacyNavigation}>
          {children}
        </NavigationProvider>
      </router.Router>
    </LegacyExtensionRouterContext.Provider>
  );
}
