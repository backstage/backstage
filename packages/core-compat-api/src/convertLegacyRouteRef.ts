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
  : T extends LegacyExternalRouteRef<infer IParams>
  ? ExternalRouteRef<IParams>
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
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: LegacyExternalRouteRef<TParams>,
): ExternalRouteRef<TParams>;

/**
 * A temporary helper to convert a new route ref to the legacy system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: RouteRef<TParams>,
): LegacyRouteRef<TParams>;

/**
 * A temporary helper to convert a new sub route ref to the legacy system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createSubRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: SubRouteRef<TParams>,
): LegacySubRouteRef<TParams>;

/**
 * A temporary helper to convert a new external route ref to the legacy system.
 *
 * @public
 * @remarks
 *
 * In the future the legacy createExternalRouteRef will instead create refs compatible with both systems.
 */
export function convertLegacyRouteRef<TParams extends AnyRouteRefParams>(
  ref: ExternalRouteRef<TParams>,
): LegacyExternalRouteRef<TParams, true>;
export function convertLegacyRouteRef(
  ref:
    | LegacyRouteRef
    | LegacySubRouteRef
    | LegacyExternalRouteRef
    | RouteRef
    | SubRouteRef
    | ExternalRouteRef,
):
  | RouteRef
  | SubRouteRef
  | ExternalRouteRef
  | LegacyRouteRef
  | LegacySubRouteRef
  | LegacyExternalRouteRef {
  const isNew = '$$type' in ref;
  const oldType = (ref as unknown as { [routeRefType]: unknown })[routeRefType];

  // Ref has already been converted
  if (isNew && oldType) {
    return ref as any;
  }

  if (isNew) {
    return convertNewToOld(
      ref as unknown as RouteRef | SubRouteRef | ExternalRouteRef,
    );
  }

  return convertOldToNew(ref, oldType);
}

function convertNewToOld(
  ref: RouteRef | SubRouteRef | ExternalRouteRef,
): LegacyRouteRef | LegacySubRouteRef | LegacyExternalRouteRef {
  if (ref.$$type === '@backstage/RouteRef') {
    const newRef = toInternalRouteRef(ref);
    return Object.assign(ref, {
      [routeRefType]: 'absolute',
      params: newRef.getParams(),
      title: newRef.getDescription(),
    } as Omit<LegacyRouteRef, '$$routeRefType'>) as unknown as LegacyRouteRef;
  }
  if (ref.$$type === '@backstage/SubRouteRef') {
    const newRef = toInternalSubRouteRef(ref);
    return Object.assign(ref, {
      [routeRefType]: 'sub',
      parent: convertLegacyRouteRef(newRef.getParent()),
      params: newRef.getParams(),
    } as Omit<LegacySubRouteRef, '$$routeRefType' | 'path'>) as unknown as LegacySubRouteRef;
  }
  if (ref.$$type === '@backstage/ExternalRouteRef') {
    const newRef = toInternalExternalRouteRef(ref);
    return Object.assign(ref, {
      [routeRefType]: 'external',
      optional: true,
      params: newRef.getParams(),
      defaultTarget: newRef.getDefaultTarget(),
    } as Omit<LegacyExternalRouteRef, '$$routeRefType' | 'optional'>) as unknown as LegacyExternalRouteRef;
  }

  throw new Error(
    `Failed to convert route ref, unknown type '${(ref as any).$$type}'`,
  );
}

function convertOldToNew(
  ref: LegacyRouteRef | LegacySubRouteRef | LegacyExternalRouteRef,
  type: unknown,
): RouteRef | SubRouteRef | ExternalRouteRef {
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
        defaultTarget:
          'getDefaultTarget' in legacyRef
            ? (legacyRef.getDefaultTarget as () => string | undefined)()
            : undefined,
      }),
    );
    return Object.assign(legacyRef, {
      $$type: '@backstage/ExternalRouteRef' as const,
      version: 'v1',
      T: newRef.T,
      getParams() {
        return newRef.getParams();
      },
      getDescription() {
        return legacyRefStr;
      },
      // This might already be implemented in the legacy ref, but we override it just to be sure
      getDefaultTarget() {
        return newRef.getDefaultTarget();
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
