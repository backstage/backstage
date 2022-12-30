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

import {
  AnyParams,
  RouteDescriptorFunc,
  RouteRef,
  SubRouteRef,
  useRouteDescriptor,
} from '@backstage/core-plugin-api';
import React, { ComponentType, useMemo } from 'react';

import {
  DrawerWrapper,
  DrawerWrapperComponent,
  DrawerView,
  DrawerViewFunc,
  DrawerViewRouteRefFunc,
  MatchUrlInfo,
} from './types';

import { matchAndParseRouteDescriptor, RoutePartWithParams } from '../utils';

interface DrawerStoreItemWithoutRouteRef {
  url?: string;
  routeRef?: undefined;
  drawerFunc: DrawerViewFunc;
}

interface DrawerStoreItemWithRouteRef<Params extends AnyParams = any> {
  url?: string;
  routeRef: RouteRef<Params> | SubRouteRef<Params>;
  drawerFunc: DrawerViewRouteRefFunc<Params>;
}

type DrawerStoreItem =
  | DrawerStoreItemWithoutRouteRef
  | DrawerStoreItemWithRouteRef;

function ensureDrawerFunc(
  drawer: DrawerView<any> | DrawerViewFunc | DrawerViewRouteRefFunc,
): DrawerViewFunc {
  return typeof drawer === 'function'
    ? (drawer as DrawerViewFunc)
    : () => drawer;
}

class DrawerStore {
  private wrappers: Map<RouteRef | SubRouteRef, DrawerWrapper<any>[]> =
    new Map();
  private items: Array<DrawerStoreItem> = [];

  public registerWrapper<Params extends AnyParams>(
    routeRef: RouteRef<Params> | SubRouteRef<Params>,
    component: DrawerWrapperComponent<Params>,
  ) {
    const wrappers = this.wrappers.get(routeRef) ?? [];
    wrappers.push({ routeRef, component });
    this.wrappers.set(routeRef, wrappers);
  }

  public registerUrl(url: string, drawer: DrawerView | DrawerViewFunc) {
    this.items.push({ url, drawerFunc: ensureDrawerFunc(drawer) });
  }

  public registerRouteRef<Params extends AnyParams>(
    routeRef: RouteRef<Params> | SubRouteRef<Params>,
    drawer: DrawerView<Params> | DrawerViewRouteRefFunc<Params>,
  ) {
    this.items.push({ routeRef, drawerFunc: ensureDrawerFunc(drawer) });
  }

  public registerDynamic(drawer: DrawerViewFunc) {
    this.items.push({ drawerFunc: drawer });
  }

  public matchUrl(url: string, getRouteDescriptor: RouteDescriptorFunc) {
    const info = new URL(url, window.origin);
    const matchUrlInfo: MatchUrlInfo = {
      url,
      info,
      getRouteDescriptor,
    };

    for (const item of this.items) {
      if (item.routeRef) {
        const routeDescriptor = getRouteDescriptor(item.routeRef);
        if (!routeDescriptor.complete) continue;

        const parts = matchAndParseRouteDescriptor(
          info.pathname,
          routeDescriptor,
        );
        if (!parts) continue;

        const lastPart = parts[parts.length - 1]!;
        const view = item.drawerFunc({
          ...matchUrlInfo,
          params: lastPart.params,
        });
        if (view) return this.renderWithWrappers(info.pathname, parts, view);
        continue;
      } else if (item.url) {
        if (!matchUrls(item.url, info)) continue;
        const view = item.drawerFunc(matchUrlInfo);
        if (view) return view;
      } else {
        const view = item.drawerFunc(matchUrlInfo);
        if (view) return view;
      }
    }
    return undefined;
  }

  private renderWithWrappers(
    path: string,
    parts: RoutePartWithParams[],
    drawer: DrawerView,
  ): DrawerView {
    const wrappecContent: ComponentType<{}> = () =>
      parts
        .map(part =>
          (this.wrappers.get(part.routeRef) ?? []).map(wrapper => ({
            part,
            wrapper: wrapper.component,
          })),
        )
        .flat(2)
        .reduce(
          (prev, { part, wrapper: Cur }) => (
            <Cur params={part.params}>{prev}</Cur>
          ),
          <drawer.content
            path={path}
            params={parts[parts.length - 1]!.params}
          />,
        );

    return { ...drawer, content: wrappecContent };
  }
}

export const drawerStore = new DrawerStore();

export function useDrawerMatch(path: string | undefined) {
  const getRouteDescriptor = useRouteDescriptor();

  const renderView = useMemo(
    () =>
      path === undefined
        ? undefined
        : drawerStore.matchUrl(path, getRouteDescriptor),
    [path, getRouteDescriptor],
  );

  return renderView;
}

function matchUrls(urlA: string, urlB: URL) {
  try {
    const _urlA = new URL(urlA, window.origin);

    return _urlA.pathname === urlB.pathname;
  } catch (_err) {
    return false;
  }
}
