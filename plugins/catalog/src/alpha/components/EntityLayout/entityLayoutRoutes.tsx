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

import { Entity } from '@backstage/catalog-model';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { ReactElement, ReactNode } from 'react';

export type EntityLayoutRouteProps = {
  path: string;
  title: string;
  group?: string;
  icon?: string | ReactElement;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
};

export type EntityLayoutRouteData = EntityLayoutRouteProps;

const dataKey = 'plugin.catalog.entityLayoutRoute';

export const EntityLayoutRoute: (props: EntityLayoutRouteProps) => null = () =>
  null;
attachComponentData(EntityLayoutRoute, dataKey, true);
// Ensures mount points discovered within a route use the route's own path.
attachComponentData(EntityLayoutRoute, 'core.gatherMountPoints', true);

export function useEntityLayoutRouteChildren(children: ReactNode) {
  return useElementFilter(
    children,
    elements =>
      elements
        .selectByComponentData({
          key: dataKey,
          withStrictError:
            'Child of EntityLayout must be an EntityLayout.Route',
        })
        .getElements<EntityLayoutRouteProps>()
        .map(({ props }) => props),
    [],
  );
}

export function filterEntityLayoutRoutes(
  routes: EntityLayoutRouteData[],
  entity: Entity | undefined,
) {
  if (!entity) {
    return [];
  }
  return routes.filter(route => !route.if || route.if(entity));
}
