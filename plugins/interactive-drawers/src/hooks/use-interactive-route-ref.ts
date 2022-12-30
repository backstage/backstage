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

import { useCallback, useMemo } from 'react';

import {
  AnyParams,
  RouteDescriptor,
  RouteRef,
  SubRouteRef,
  useRouteDescriptor,
  isCompleteRouteDescriptor,
} from '@backstage/core-plugin-api';

import { matchAndParseRouteDescriptor } from '../utils';
import { constructUrl } from '../utils/route-descriptor';

import { useDrawerPath } from './use-drawer-path';

/**
 * Works similar to useRouteRef() but doesn't require the routeRef to be mounted
 * at the current window location.
 *
 * @param routeRef The route ref for the url to create
 * @param path Optional base path, defaults to the current drawer path or window
 * location path
 * @returns
 */
export function useInteractiveRouteRef<Params extends AnyParams>(
  routeRef: RouteRef<Params> | SubRouteRef<Params>,
  path?: string,
): (params: Params) => string {
  const getRouteDescriptor = useRouteDescriptor();

  const drawerPath = useDrawerPath();

  const descriptor = useMemo(
    () => getRouteDescriptor(routeRef),
    [routeRef, getRouteDescriptor],
  );

  const parentDescriptor = useMemo(
    () =>
      descriptor.parts.length < 2
        ? undefined
        : getRouteDescriptor(
            descriptor.parts[descriptor.parts.length - 2].routeRef,
          ),
    [descriptor, getRouteDescriptor],
  );

  const matchPath = path ?? drawerPath.path;

  if (
    !isCompleteRouteDescriptor(descriptor) ||
    (parentDescriptor && !isCompleteRouteDescriptor(parentDescriptor))
  ) {
    throw new Error(
      `Cannot make link from incomplete routeRef (requiring params)`,
    );
  }

  return useCallback(
    (params: Params) => {
      const hasParams = descriptor.parts.some(
        part => part.routeRef.params.length,
      );
      if (matchPath === undefined && hasParams) {
        throw new Error(`Cannot make link from routeRef (requiring params)`);
      }

      const getParts = () => {
        if (!parentDescriptor) {
          return [];
        }

        if (!matchPath) {
          return parentDescriptor.parts.map(part => ({ ...part, params: {} }));
        }

        const parts = matchAndParseRouteDescriptor(
          matchPath,
          parentDescriptor as RouteDescriptor<true>,
        );
        if (!parts) {
          throw new Error(`Cannot match the routeRef with the path`);
        }
        return parts;
      };
      const parts = getParts();

      parts.push({
        ...descriptor.parts[descriptor.parts.length - 1],
        params: params ?? {},
      });

      return constructUrl(parts);
    },
    [descriptor, parentDescriptor, matchPath],
  );
}
