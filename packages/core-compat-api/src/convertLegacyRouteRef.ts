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
  RouteRef as LegacyRouteRef,
  SubRouteRef as LegacySubRouteRef,
  ExternalRouteRef as LegacyExternalRouteRef,
  AnyRouteRefParams,
} from '@backstage/core-plugin-api';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { routeRefType } from '../../core-plugin-api/src/routing/types';

import {
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
  createRouteRef,
  createSubRouteRef,
  createExternalRouteRef,
} from '@backstage/frontend-plugin-api';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalRouteRef } from '../../frontend-plugin-api/src/routing/RouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalSubRouteRef } from '../../frontend-plugin-api/src/routing/SubRouteRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExternalRouteRef } from '../../frontend-plugin-api/src/routing/ExternalRouteRef';

/**
 * Converts a legacy route ref type to the new system.
 *
 * @public
 */
export type ToNewRouteRef<
  T extends LegacyRouteRef | LegacySubRouteRef | LegacyExternalRouteRef,
> = T extends LegacyRouteRef<infer IParams>
  ? RouteRef<IParams>
  : T extends LegacySubRouteRef<infer IParams>
  ? SubRouteRef<IParams>
  : T extends LegacyExternalRouteRef<infer IParams, infer IOptional>
  ? ExternalRouteRef<IParams, IOptional>
  : never;

/**
 * Converts a collection of legacy route refs to the new system.
 * This is particularly useful when defining plugin `routes` and `externalRoutes`.
 *
 * @public
 */
export function convertLegacyRouteRefs<
  TRefs extends {
    [name in string]:
      | LegacyRouteRef
      | LegacySubRouteRef
      | LegacyExternalRouteRef;
  },
>(refs: TRefs): { [KName in keyof TRefs]: ToNewRouteRef<TRefs[KName]> } {
  return Object.fromEntries(
    Object.entries(refs).map(([name, ref]) => [
      name,
      convertLegacyRouteRef(ref as LegacyRouteRef),
    ]),
  ) as { [KName in keyof TRefs]: ToNewRouteRef<TRefs[KName]> };
}

/**
 * A temporary helper to convert a legacy route ref to the new system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: LegacyRouteRef<TParams>,
): RouteRef<TParams>;

/**
 * A temporary helper to convert a legacy sub route ref to the new system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createSubRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: LegacySubRouteRef<TParams>,
): SubRouteRef<TParams>;

/**
 * A temporary helper to convert a legacy external route ref to the new system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createExternalRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<
  TParams extends AnyRouteRefParams,
  TOptional extends boolean,
>(
  ref: LegacyExternalRouteRef<TParams, TOptional>,
): ExternalRouteRef<TParams, TOptional>;

export function convertLegacyRouteRef(
  ref: LegacyRouteRef | LegacySubRouteRef | LegacyExternalRouteRef,
): RouteRef | SubRouteRef | ExternalRouteRef {
  // Ref has already been converted
  if ('$$type' in ref) {
    return ref as unknown as RouteRef | SubRouteRef | ExternalRouteRef;
  }

  const type = (ref as unknown as { [routeRefType]: unknown })[routeRefType];

  if (type === 'absolute') {
    const legacyRef = ref as LegacyRouteRef;
    const legacyRefStr = String(legacyRef);
    const newRef = toInternalRouteRef(
      createRouteRef<{ [key in string]: string }>({
        params: legacyRef.params as string[],
      }),
    );
    return Object.assign(legacyRef, {
      $$type: '@backstage/RouteRef' as const,
      version: 'v1',
      T: newRef.T,
      getParams() {
        return newRef.getParams();
      },
      getDescription() {
        return legacyRefStr;
      },
      setId(id: string) {
        newRef.setId(id);
      },
      toString() {
        return legacyRefStr;
      },
    });
  }
  if (type === 'sub') {
    const legacyRef = ref as LegacySubRouteRef;
    const legacyRefStr = String(legacyRef);
    const newRef = toInternalSubRouteRef(
      createSubRouteRef({
        path: legacyRef.path,
        parent: convertLegacyRouteRef(legacyRef.parent),
      }),
    );
    return Object.assign(legacyRef, {
      $$type: '@backstage/SubRouteRef' as const,
      version: 'v1',
      T: newRef.T,
      getParams() {
        return newRef.getParams();
      },
      getParent() {
        return newRef.getParent();
      },
      getDescription() {
        return legacyRefStr;
      },
      toString() {
        return legacyRefStr;
      },
    });
  }
  if (type === 'external') {
    const legacyRef = ref as LegacyExternalRouteRef;
    const legacyRefStr = String(legacyRef);
    const newRef = toInternalExternalRouteRef(
      createExternalRouteRef<{ [key in string]: string }>({
        params: legacyRef.params as string[],
        optional: legacyRef.optional,
      }),
    );
    return Object.assign(legacyRef, {
      $$type: '@backstage/ExternalRouteRef' as const,
      version: 'v1',
      T: newRef.T,
      optional: newRef.optional,
      getParams() {
        return newRef.getParams();
      },
      getDescription() {
        return legacyRefStr;
      },
      getDefaultTarget() {
        // TODO(freben): These are not yet supported in the old system; just returning undefined for now
        return undefined;
      },
      setId(id: string) {
        newRef.setId(id);
      },
      toString() {
        return legacyRefStr;
      },
    });
  }

  throw new Error(`Failed to convert legacy route ref, unknown type '${type}'`);
}
