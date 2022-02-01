/*
 * Copyright 2020 The Backstage Authors
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

import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { createRouteRef } from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

// TODO(Rugvip): Move these route refs back to the catalog plugin once we're all ported to using external routes
/**
 * @deprecated Use an `ExternalRouteRef` instead, which can point to `catalogPlugin.routes.catalogIndex`.
 */
export const rootRoute = createRouteRef({
  id: 'catalog',
});

/**
 * @deprecated Use an `ExternalRouteRef` instead, which can point to `catalogPlugin.routes.catalogIndex`.
 */
export const catalogRouteRef = rootRoute;

/**
 * A stable route ref that points to the catalog page for an individual entity.
 *
 * This `RouteRef` can be imported and used directly, and does not need to be referenced
 * via an `ExternalRouteRef`.
 *
 * If you want to replace the `EntityPage` from `@backstage/catalog-plugin` in your app,
 * you need to use the `entityRouteRef` as the mount point instead of your own.
 */
export const entityRouteRef = getOrCreateGlobalSingleton(
  'catalog:entity-route-ref',
  () =>
    createRouteRef({
      id: 'catalog:entity',
      params: ['namespace', 'kind', 'name'],
    }),
);

/**
 * @deprecated use `entityRouteRef` instead.
 */
export const entityRoute = entityRouteRef;

// Utility function to get suitable route params for entityRoute, given an
// entity instance
export function entityRouteParams(entity: Entity) {
  return {
    kind: entity.kind.toLocaleLowerCase('en-US'),
    namespace:
      entity.metadata.namespace?.toLocaleLowerCase('en-US') ??
      ENTITY_DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  } as const;
}
