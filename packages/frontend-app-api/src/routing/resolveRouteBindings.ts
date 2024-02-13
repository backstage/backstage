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
import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExternalRouteRef } from '../../../frontend-plugin-api/src/routing/ExternalRouteRef';

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
    infer Params,
    any
  >
    ? RouteRef<Params> | SubRouteRef<Params>
    : never;
};

/**
 * A function that can bind from external routes of a given plugin, to concrete
 * routes of other plugins. See {@link createApp}.
 *
 * @public
 */
export type CreateAppRouteBinder = <
  TExternalRoutes extends { [name: string]: ExternalRouteRef },
>(
  externalRoutes: TExternalRoutes,
  targetRoutes: PartialKeys<
    TargetRouteMap<TExternalRoutes>,
    KeysWithType<TExternalRoutes, ExternalRouteRef<any, true>>
  >,
) => void;

/** @internal */
export function resolveRouteBindings(
  bindRoutes: ((context: { bind: CreateAppRouteBinder }) => void) | undefined,
  config: Config,
  routesById: RouteRefsById,
): Map<ExternalRouteRef, RouteRef | SubRouteRef> {
  const result = new Map<ExternalRouteRef, RouteRef | SubRouteRef>();

  // Perform callback bindings first with highest priority
  if (bindRoutes) {
    const bind: CreateAppRouteBinder = (
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
            `External route ${key} is required but was undefined`,
          );
        }
        if (value) {
          result.set(externalRoute, value);
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
      if (typeof targetRefId !== 'string' || targetRefId === '') {
        throw new Error(
          `Invalid config at app.routes.bindings['${externalRefId}'], value must be a non-empty string`,
        );
      }

      const externalRef = routesById.externalRoutes.get(externalRefId);
      if (!externalRef) {
        throw new Error(
          `Invalid config at app.routes.bindings, '${externalRefId}' is not a valid external route`,
        );
      }
      if (result.has(externalRef)) {
        continue;
      }
      const targetRef = routesById.routes.get(targetRefId);
      if (!targetRef) {
        throw new Error(
          `Invalid config at app.routes.bindings['${externalRefId}'], '${targetRefId}' is not a valid route`,
        );
      }

      result.set(externalRef, targetRef);
    }
  }

  // Finally fall back to attempting to map defaults, at lowest priority
  for (const externalRef of routesById.externalRoutes.values()) {
    if (!result.has(externalRef)) {
      const defaultRefId =
        toInternalExternalRouteRef(externalRef).getDefaultTarget();
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
