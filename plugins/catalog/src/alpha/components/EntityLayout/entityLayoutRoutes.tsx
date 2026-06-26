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
import { ReactElement } from 'react';

export type EntityLayoutRoute = {
  path: string;
  title: string;
  group?: string;
  icon?: string | ReactElement;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
};

export function filterEntityLayoutRoutes(
  routes: EntityLayoutRoute[],
  entity: Entity | undefined,
) {
  if (!entity) {
    return [];
  }
  return routes.filter(route => !route.if || route.if(entity));
}
