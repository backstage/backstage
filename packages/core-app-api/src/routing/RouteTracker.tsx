/*
 * Copyright 2021 The Backstage Authors
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

import { useEffect } from 'react';
import { matchRoutes, useInRouterContext, useLocation } from 'react-router-dom';
import {
  useAnalytics,
  AnalyticsContext,
  RouteRef,
  AnalyticsEventAttributes,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
import { BackstageRouteObject } from './types';

/**
 * Returns an extension context given the current pathname and a list of
 * Backstage route objects.
 */
const getExtensionContext = (
  pathname: string,
  routes: BackstageRouteObject[],
) => {
  try {
    // Find matching routes for the given path name.
    const matches = matchRoutes(routes, { pathname });

    // Of the matching routes, get the last (e.g. most specific) instance of
    // the BackstageRouteObject that contains a routeRef. Filtering by routeRef
    // ensures subRouteRefs are aligned to their parent routes' context.
    const routeMatch = matches
      ?.filter(match => match?.route.routeRefs?.size > 0)
      .pop();
    const routeObject = routeMatch?.route;

    // If there is no route object, then allow inheritance of default context.
    if (!routeObject) {
      return undefined;
    }

    // If the matched route is the root route (no path), and the pathname is
    // not the path of the homepage, then inherit from the default context.
    if (routeObject.path === '' && pathname !== '/') {
      return undefined;
    }

    // If there is a single route ref, use it.
    let routeRef: RouteRef | undefined;
    if (routeObject.routeRefs.size === 1) {
      routeRef = routeObject.routeRefs.values().next().value;
    }

    // If there is a single plugin, use it.
    let plugin: BackstagePlugin | undefined;
    if (routeObject.plugins.size === 1) {
      plugin = routeObject.plugins.values().next().value;
    }

    const params = Object.entries(
      routeMatch?.params || {},
    ).reduce<AnalyticsEventAttributes>((acc, [key, value]) => {
      if (value !== undefined && key !== '*') {
        acc[key] = value;
      }
      return acc;
    }, {});

    return {
      extension: 'App',
      pluginId: plugin?.getId() || 'root',
      ...(routeRef ? { routeRef: (routeRef as { id?: string }).id } : {}),
      _routeNodeType: routeObject.element as string,
      params,
    };
  } catch {
    return undefined;
  }
};

/**
 * Performs the actual event capture on render.
 */
const TrackNavigation = ({
  pathname,
  search,
  hash,
  attributes,
}: {
  pathname: string;
  search: string;
  hash: string;
  attributes?: AnalyticsEventAttributes;
}) => {
  const analytics = useAnalytics();
  useEffect(() => {
    analytics.captureEvent('navigate', `${pathname}${search}${hash}`, {
      attributes,
    });
  }, [analytics, pathname, search, hash, attributes]);

  return null;
};

/**
 * Reads the location being navigated to and reports it.
 *
 * Split out of {@link RouteTracker} so that `useLocation` is only ever called
 * from a component that is mounted inside a router, where it cannot throw.
 */
const TrackRouterNavigation = ({
  routeObjects,
}: {
  routeObjects: BackstageRouteObject[];
}) => {
  const { pathname, search, hash } = useLocation();

  const { params, ...attributes } = getExtensionContext(
    pathname,
    routeObjects,
  ) || { params: {} };

  return (
    <AnalyticsContext attributes={attributes}>
      <TrackNavigation
        pathname={pathname}
        search={search}
        hash={hash}
        attributes={params}
      />
    </AnalyticsContext>
  );
};

/**
 * Logs a "navigate" event with appropriate plugin-level analytics context
 * attributes each time the user navigates to a page.
 *
 * App chrome is allowed to render with no ambient React Router at all — an app
 * that supplies a passthrough `Router` component has none — and React Router's
 * `useLocation` throws there. `useInRouterContext` is the probe React Router
 * offers instead: it reads the very context `useLocation` reads and returns
 * `false` rather than throwing. It is called unconditionally and the branch is
 * on its value, so hook order is stable whether or not a router is present.
 * Without one there is no location, and so no navigation to report.
 */
export const RouteTracker = ({
  routeObjects,
}: {
  routeObjects: BackstageRouteObject[];
}) => {
  const inRouterContext = useInRouterContext();

  if (!inRouterContext) {
    return null;
  }

  return <TrackRouterNavigation routeObjects={routeObjects} />;
};
