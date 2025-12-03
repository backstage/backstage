/*
 * Copyright 2023 The Backstage Authors
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
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';
import {
  OpaqueRouteRef,
  OpaqueSubRouteRef,
  OpaqueExternalRouteRef,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { ErrorCollector } from '../wiring/createErrorCollector';

/** @internal */
export interface RouteRefsById {
  routes: Map<string, RouteRef | SubRouteRef>;
  externalRoutes: Map<string, ExternalRouteRef>;
}

/** @internal */
export function collectRouteIds(
  features: FrontendFeature[],
  collector: ErrorCollector,
): RouteRefsById {
  const routesById = new Map<string, RouteRef | SubRouteRef>();
  const externalRoutesById = new Map<string, ExternalRouteRef>();

  for (const feature of features) {
    if (!OpaqueFrontendPlugin.isType(feature)) {
      continue;
    }

    for (const [name, ref] of Object.entries(feature.routes)) {
      const refId = `${feature.id}.${name}`;
      if (routesById.has(refId)) {
        collector.report({
          code: 'ROUTE_DUPLICATE',
          message: `Duplicate route id '${refId}' encountered while collecting routes`,
          context: { routeId: refId },
        });
        continue;
      }

      if (OpaqueRouteRef.isType(ref)) {
        const internalRef = OpaqueRouteRef.toInternal(ref);
        internalRef.setId(refId);
        routesById.set(refId, ref);
      } else {
        const internalRef = OpaqueSubRouteRef.toInternal(ref);
        routesById.set(refId, internalRef);
      }
    }
    for (const [name, ref] of Object.entries(feature.externalRoutes)) {
      const refId = `${feature.id}.${name}`;
      if (externalRoutesById.has(refId)) {
        collector.report({
          code: 'ROUTE_DUPLICATE',
          message: `Duplicate external route id '${refId}' encountered while collecting routes`,
          context: { routeId: refId },
        });
        continue;
      }

      const internalRef = OpaqueExternalRouteRef.toInternal(ref);
      internalRef.setId(refId);
      externalRoutesById.set(refId, ref);
    }
  }

  return { routes: routesById, externalRoutes: externalRoutesById };
}
