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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  isRouteRef,
  toInternalRouteRef,
} from '../../../frontend-plugin-api/src/routing/RouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExternalRouteRef } from '../../../frontend-plugin-api/src/routing/ExternalRouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalSubRouteRef } from '../../../frontend-plugin-api/src/routing/SubRouteRef';

/** @internal */
export interface RouteRefsById {
  routes: Map<string, RouteRef | SubRouteRef>;
  externalRoutes: Map<string, ExternalRouteRef>;
}

/** @internal */
export function collectRouteIds(features: FrontendFeature[]): RouteRefsById {
  const routesById = new Map<string, RouteRef | SubRouteRef>();
  const externalRoutesById = new Map<string, ExternalRouteRef>();

  for (const feature of features) {
    if (feature.$$type !== '@backstage/BackstagePlugin') {
      continue;
    }

    for (const [name, ref] of Object.entries(feature.routes)) {
      const refId = `${feature.id}.${name}`;
      if (routesById.has(refId)) {
        throw new Error(`Unexpected duplicate route '${refId}'`);
      }

      if (isRouteRef(ref)) {
        const internalRef = toInternalRouteRef(ref);
        internalRef.setId(refId);
        routesById.set(refId, ref);
      } else {
        const internalRef = toInternalSubRouteRef(ref);
        routesById.set(refId, internalRef);
      }
    }
    for (const [name, ref] of Object.entries(feature.externalRoutes)) {
      const refId = `${feature.id}.${name}`;
      if (externalRoutesById.has(refId)) {
        throw new Error(`Unexpected duplicate external route '${refId}'`);
      }

      const internalRef = toInternalExternalRouteRef(ref);
      internalRef.setId(refId);
      externalRoutesById.set(refId, ref);
    }
  }

  return { routes: routesById, externalRoutes: externalRoutesById };
}
