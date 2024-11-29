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

import {
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
  BackstagePlugin,
  AnyRoutes,
  AnyExternalRoutes,
} from '@backstage/core-plugin-api';
import { AppOptions, AppRouteBinder } from './types';
import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';

/** @internal */
export function collectRouteIds(
  plugins: Iterable<
    Pick<
      BackstagePlugin<AnyRoutes, AnyExternalRoutes>,
      'getId' | 'routes' | 'externalRoutes'
    >
  >,
) {
  const routesById = new Map<string, RouteRef | SubRouteRef>();
  const externalRoutesById = new Map<string, ExternalRouteRef>();

  for (const plugin of plugins) {
    for (const [name, ref] of Object.entries(plugin.routes ?? {})) {
      const refId = `${plugin.getId()}.${name}`;
      if (routesById.has(refId)) {
        throw new Error(`Unexpected duplicate route '${refId}'`);
      }

      routesById.set(refId, ref);
    }
    for (const [name, ref] of Object.entries(plugin.externalRoutes ?? {})) {
      const refId = `${plugin.getId()}.${name}`;
      if (externalRoutesById.has(refId)) {
        throw new Error(`Unexpected duplicate external route '${refId}'`);
      }

      externalRoutesById.set(refId, ref);
    }
  }

  return { routes: routesById, externalRoutes: externalRoutesById };
}

/** @internal */
export function resolveRouteBindings(
  bindRoutes: AppOptions['bindRoutes'],
  config: Config,
  plugins: Iterable<
    Pick<
      BackstagePlugin<AnyRoutes, AnyExternalRoutes>,
      'getId' | 'routes' | 'externalRoutes'
    >
  >,
) {
  const routesById = collectRouteIds(plugins);
  const result = new Map<ExternalRouteRef, RouteRef | SubRouteRef>();
  const disabledExternalRefs = new Set<ExternalRouteRef>();

  // Perform callback bindings first with highest priority
  if (bindRoutes) {
    const bind: AppRouteBinder = (
      externalRoutes,
      targetRoutes: { [name: string]: RouteRef | SubRouteRef },
    ) => {
      for (const [key, value] of Object.entries(targetRoutes)) {
        const externalRoute = externalRoutes[key];
        if (!externalRoute) {
          throw new Error(`Key ${key} is not an existing external route`);
        }
        if (!value && !externalRoute.optional) {
          throw new Error(
            `External route ${key} is required but was ${
              value === false ? 'disabled' : 'not provided'
            }`,
          );
        }
        if (value) {
          result.set(externalRoute, value);
        } else if (value === false) {
          disabledExternalRefs.add(externalRoute);
        }
      }
    };
    bindRoutes({ bind });
  }

  // Then perform config based bindings with lower priority
  const bindings = config
    .getOptionalConfig('app.routes.bindings')
    ?.get<JsonObject>();
  if (bindings) {
    for (const [externalRefId, targetRefId] of Object.entries(bindings)) {
      if (!isValidTargetRefId(targetRefId)) {
        throw new Error(
          `Invalid config at app.routes.bindings['${externalRefId}'], value must be a non-empty string or false`,
        );
      }

      const externalRef = routesById.externalRoutes.get(externalRefId);
      if (!externalRef) {
        throw new Error(
          `Invalid config at app.routes.bindings, '${externalRefId}' is not a valid external route`,
        );
      }

      // Skip if binding was already defined in code
      if (result.has(externalRef) || disabledExternalRefs.has(externalRef)) {
        continue;
      }

      if (targetRefId === false) {
        disabledExternalRefs.add(externalRef);
      } else {
        const targetRef = routesById.routes.get(targetRefId);
        if (!targetRef) {
          throw new Error(
            `Invalid config at app.routes.bindings['${externalRefId}'], '${targetRefId}' is not a valid route`,
          );
        }

        result.set(externalRef, targetRef);
      }
    }
  }

  // Finally fall back to attempting to map defaults, at lowest priority
  for (const externalRef of routesById.externalRoutes.values()) {
    if (!result.has(externalRef) && !disabledExternalRefs.has(externalRef)) {
      const defaultRefId =
        'getDefaultTarget' in externalRef
          ? (externalRef.getDefaultTarget as () => string | undefined)()
          : undefined;
      if (defaultRefId) {
        const defaultRef = routesById.routes.get(defaultRefId);
        if (defaultRef) {
          result.set(externalRef, defaultRef);
        }
      }
    }
  }

  return result;
}

function isValidTargetRefId(value: unknown): value is string | false {
  if (value === false) {
    return true;
  }

  if (typeof value === 'string' && value) {
    return true;
  }

  return false;
}
