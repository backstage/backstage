/*
 * Copyright 2022 The Backstage Authors
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

import {
  RouteRef,
  SubRouteRef,
  BackstageRouteObject,
  useRouteContext,
} from '@backstage/core-plugin-api';
import { useDevToolsPlugins } from './plugins';
import { DevToolsPluginRouteInfoPlugin } from '../types';

export function useDevToolsRoutes() {
  const { routeRefMap } = useDevToolsPlugins();
  const resolver = useRouteContext();

  const bindings = useMemo(
    () =>
      [...(resolver?.routeBindings.entries() ?? [])].map(([key, val]) => ({
        from: {
          id: (key as any).id,
          params: key.params,
          type: key.$$routeRefType,
          optional: key.optional,
        },
        to: routeRefInfo(val),
      })),
    [resolver?.routeBindings],
  );

  const routes = useMemo(
    () => routeObjectInfo(routeRefMap, resolver?.routeObjects ?? []),
    [resolver?.routeObjects, routeRefMap],
  );

  return {
    bindings,
    routes,
  };
}

export interface RouteRefInfo {
  id: string;
  type: string;
  params: (string | number | symbol)[];
  path?: string;
  parent?: RouteRefInfo;
}

function routeRefInfo(ref: RouteRef | SubRouteRef): RouteRefInfo {
  return {
    id: (ref as any).id,
    type: ref.$$routeRefType,
    params: ref.params,
    path: (ref as SubRouteRef).path,
    parent: (ref as SubRouteRef).parent
      ? routeRefInfo((ref as SubRouteRef).parent)
      : undefined,
  };
}

export interface RouteObjectInfo {
  caseSensitive: boolean;
  children: RouteObjectInfo[];
  path: string;
  refs: ({ routeRef: RouteRef } & Partial<DevToolsPluginRouteInfoPlugin>)[];
}

function routeObjectInfo(
  routeRefMap: Map<RouteRef, DevToolsPluginRouteInfoPlugin>,
  objects: BackstageRouteObject[],
): RouteObjectInfo[] {
  return objects.map(obj => ({
    caseSensitive: obj.caseSensitive,
    children: routeObjectInfo(routeRefMap, obj.children ?? []),
    path: obj.path,
    refs: [...obj.routeRefs].map(routeRef => ({
      routeRef,
      ...routeRefMap.get(routeRef),
    })),
  }));
}
