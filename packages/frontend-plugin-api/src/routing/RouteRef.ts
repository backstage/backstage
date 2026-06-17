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

import { OpaqueRouteRef } from '@internal/frontend';
import { describeParentCallSite } from './describeParentCallSite';
import { AnyRouteRefParams } from './types';

/**
 * Absolute route reference.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export interface RouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> {
  readonly $$type: '@backstage/RouteRef';
  readonly T: TParams;
}

/**
 * Create a {@link RouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export function createRouteRef<
  // ParamKey is narrowed to the literal union of param name strings.
  // Defaulting to never means we get undefined params when the array is empty or omitted.
  TParamKey extends string = never,
>(config?: {
  /** A list of parameter names that the path that this route ref is bound to must contain */
  readonly params?: TParamKey[];

  aliasFor?: string;
}): RouteRef<
  [TParamKey] extends [never] ? undefined : { [param in TParamKey]: string }
> {
  const params = (config?.params ?? []) as string[];
  const creationSite = describeParentCallSite();

  let id: string | undefined = undefined;

  return OpaqueRouteRef.createInstance('v1', {
    T: undefined as any,
    getParams() {
      return params;
    },
    getDescription() {
      if (id) {
        return id;
      }
      return `created at '${creationSite}'`;
    },
    alias: config?.aliasFor,
    setId(newId: string) {
      if (!newId) {
        throw new Error(`RouteRef id must be a non-empty string`);
      }
      if (id && id !== newId) {
        throw new Error(
          `RouteRef was referenced twice as both '${id}' and '${newId}'`,
        );
      }
      id = newId;
    },
    toString(): string {
      return `routeRef{id=${id},at='${creationSite}'}`;
    },
  });
}
