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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { isInternalFrontendModule } from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { validateRouteNamespace } from '../../../frontend-plugin-api/src/routing/validateRouteNamespace';
import { RouteRedirects } from './RouteRedirects';
import { ErrorCollector } from '../wiring/createErrorCollector';

/** @internal */
export interface RouteRefsById {
  routes: Map<string, RouteRef | SubRouteRef>;
  allRoutes?: Set<RouteRef | SubRouteRef>;
  redirects?: RouteRedirects;
  externalRoutes: Map<string, ExternalRouteRef>;
}

/** @internal */
export function collectRouteIds(
  features: FrontendFeature[],
  collector: ErrorCollector,
): RouteRefsById {
  const allRoutes = new Set<RouteRef | SubRouteRef>();
  const routesById = new Map<string, RouteRef | SubRouteRef>();
  const externalRoutesById = new Map<string, ExternalRouteRef>();

  for (const feature of features) {
    if (!OpaqueFrontendPlugin.isType(feature)) {
      continue;
    }

    validateRouteNamespace(feature.id, feature.routes);
    for (const [name, ref] of Object.entries(feature.routes)) {
      const refId = `${feature.id}.${name}`;
      allRoutes.add(ref);
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
        if (!internalRef.getExtensionId) {
          internalRef.setId(refId);
        }
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

  const originalRoutes = new Map(routesById);

  // This is the same resolved feature order used by resolveAppNodeSpecs:
  // plugins first, then modules, with the last module winning.
  const pluginIds = new Set(
    features.filter(OpaqueFrontendPlugin.isType).map(p => p.id),
  );
  for (const module of features.filter(isInternalFrontendModule)) {
    if (!pluginIds.has(module.pluginId)) {
      continue;
    }
    validateRouteNamespace(module.pluginId, module.routes ?? {});
    for (const [name, ref] of Object.entries(module.routes ?? {})) {
      const refId = `${module.pluginId}.${name}`;
      if (OpaqueRouteRef.isType(ref)) {
        const internal = OpaqueRouteRef.toInternal(ref);
        if (!internal.getExtensionId) {
          internal.setId(refId);
        }
      }
      routesById.set(refId, ref);
    }
    for (const [name, ref] of Object.entries(module.externalRoutes ?? {})) {
      const refId = `${module.pluginId}.${name}`;
      OpaqueExternalRouteRef.toInternal(ref).setId(refId);
      externalRoutesById.set(refId, ref);
    }
  }

  for (const ref of routesById.values()) {
    allRoutes.add(ref);
  }
  const redirects = new RouteRedirects();
  for (const [name, source] of originalRoutes) {
    const target = routesById.get(name)!;
    redirects.add(name, source, target);
  }
  for (const ref of allRoutes) {
    redirects.resolve(ref);
  }

  return {
    routes: routesById,
    externalRoutes: externalRoutesById,
    allRoutes,
    redirects,
  };
}
