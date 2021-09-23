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

import React, { useEffect, useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import {
  useAnalytics,
  AnalyticsContext,
  CommonAnalyticsContext,
  RouteRef,
} from '@backstage/core-plugin-api';
import { routeObjectCollector } from './collectors';
import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
} from '../extensions/traversal';
import { BackstageRouteObject } from './types';

/**
 * Returns an extension context given the current pathname and a list of
 * Backstage route objects.
 */
const getExtensionContext = (
  pathname: string,
  routes: BackstageRouteObject[],
): CommonAnalyticsContext | {} => {
  try {
    // Find matching routes for the given path name.
    const matches = matchRoutes(routes, { pathname });

    // Of the matching routes, get the last (e.g. most specific) instance of
    // the BackstageRouteObject.
    const routeObject = matches
      ?.filter(
        match => (match?.route as BackstageRouteObject).routeRefs?.size > 0,
      )
      .pop()?.route as BackstageRouteObject;

    // If there is no route object, then allow inheritance of default context.
    if (!routeObject) {
      return {};
    }

    // If there is a single route ref, return it.
    // todo: get routeRef of rendered gathered mount point(?)
    let routeRef: RouteRef | undefined;
    if (routeObject.routeRefs.size === 1) {
      routeRef = routeObject.routeRefs.values().next().value;
    }

    return {
      extension: 'App',
      pluginId: routeObject.plugin?.getId() || 'root',
      ...(routeRef ? { routeRef: (routeRef as { id?: string }).id } : {}),
    };
  } catch {
    return {};
  }
};

/**
 * Performs the actual event capture on render.
 */
const TrackNavigation = ({
  pathname,
  search,
  hash,
}: {
  pathname: string;
  search: string;
  hash: string;
}) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.captureEvent('navigate', `${pathname}${search}${hash}`);
  }, [analytics, pathname, search, hash]);

  return null;
};

/**
 * Logs a "navigate" event with appropriate plugin-level analytics context
 * attributes each time the user navigates to a page.
 */
export const RouteTracker = ({ tree }: { tree: React.ReactNode }) => {
  const { pathname, search, hash } = useLocation();
  const { routeObjects } = useMemo(() => {
    return traverseElementTree({
      root: tree,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        routeObjects: routeObjectCollector,
      },
    });
  }, [tree]);

  return (
    <AnalyticsContext attributes={getExtensionContext(pathname, routeObjects)}>
      <TrackNavigation pathname={pathname} search={search} hash={hash} />
    </AnalyticsContext>
  );
};
