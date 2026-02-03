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
} from '@backstage/frontend-plugin-api';
import { RouteRefsById } from './collectRouteIds';
import { ErrorCollector } from '../wiring/createErrorCollector';
import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { OpaqueExternalRouteRef } from '@internal/frontend';

/**
 * Extracts a union of the keys in a map whose value extends the given type
 *
 * @ignore
 */
type KeysWithType<Obj extends { [key in string]: any }, Type> = {
  [key in keyof Obj]: Obj[key] extends Type ? key : never;
}[keyof Obj];

/**
 * Takes a map Map required values and makes all keys matching Keys optional
 *
 * @ignore
 */
type PartialKeys<
  Map extends { [name in string]: any },
  Keys extends keyof Map,
> = Partial<Pick<Map, Keys>> & Required<Omit<Map, Keys>>;

/**
 * Creates a map of target routes with matching parameters based on a map of external routes.
 *
 * @ignore
 */
type TargetRouteMap<
  ExternalRoutes extends { [name: string]: ExternalRouteRef },
> = {
  [name in keyof ExternalRoutes]: ExternalRoutes[name] extends ExternalRouteRef<
    infer Params
  >
    ? RouteRef<Params> | SubRouteRef<Params> | false
    : never;
};

/**
 * A function that can bind from external routes of a given plugin, to concrete
 * routes of other plugins. See {@link @backstage/frontend-defaults#createApp}.
 *
 * @public
 */
export type CreateAppRouteBinder = <
  TExternalRoutes extends { [name: string]: ExternalRouteRef },
>(
  externalRoutes: TExternalRoutes,
  targetRoutes: PartialKeys<
    TargetRouteMap<TExternalRoutes>,
    KeysWithType<TExternalRoutes, ExternalRouteRef<any>>
  >,
) => void;

/** @internal */
export function resolveRouteBindings(
  bindRoutes: ((context: { bind: CreateAppRouteBinder }) => void) | undefined,
  config: Config,
  routesById: RouteRefsById,
  collector: ErrorCollector,
): Map<ExternalRouteRef, RouteRef | SubRouteRef> {
  const result = new Map<ExternalRouteRef, RouteRef | SubRouteRef>();
  const disabledExternalRefs = new Set<ExternalRouteRef>();

  // Perform callback bindings first with highest priority
  if (bindRoutes) {
    const bind: CreateAppRouteBinder = (
      externalRoutes,
      targetRoutes: { [name: string]: RouteRef | SubRouteRef },
    ) => {
      for (const [key, value] of Object.entries(targetRoutes)) {
        const externalRoute = externalRoutes[key];
        if (!externalRoute) {
          collector.report({
            code: 'ROUTE_NOT_FOUND',
            message: `Key ${key} is not an existing external route`,
            context: { routeId: String(key) },
          });
          continue;
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
        collector.report({
          code: 'ROUTE_BINDING_INVALID_VALUE',
          message: `Invalid config at app.routes.bindings['${externalRefId}'], value must be a non-empty string or false`,
          context: { routeId: externalRefId },
        });
        continue;
      }

      const externalRef = routesById.externalRoutes.get(externalRefId);
      if (!externalRef) {
        collector.report({
          code: 'ROUTE_NOT_FOUND',
          message: `Invalid config at app.routes.bindings, '${externalRefId}' is not a valid external route`,
          context: { routeId: externalRefId },
        });
        continue;
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
          collector.report({
            code: 'ROUTE_NOT_FOUND',
            message: `Invalid config at app.routes.bindings['${externalRefId}'], '${String(
              targetRefId,
            )}' is not a valid route`,
            context: { routeId: String(targetRefId) },
          });
          continue;
        }

        result.set(externalRef, targetRef);
      }
    }
  }

  // Finally fall back to attempting to map defaults, at lowest priority
  for (const externalRef of routesById.externalRoutes.values()) {
    if (!result.has(externalRef) && !disabledExternalRefs.has(externalRef)) {
      const defaultRefId =
        OpaqueExternalRouteRef.toInternal(externalRef).getDefaultTarget();
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
