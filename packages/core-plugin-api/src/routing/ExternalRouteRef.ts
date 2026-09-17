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
  ExternalRouteRef,
  routeRefType,
  AnyParams,
  ParamKeys,
  OptionalParams,
} from './types';

/**
 * @internal
 */
export class ExternalRouteRefImpl<
  Params extends AnyParams,
  Optional extends boolean,
> implements ExternalRouteRef<Params, Optional>
{
  // The marker is used for type checking while the symbol is used at runtime.
  declare $$routeRefType: 'external';
  readonly [routeRefType] = 'external';

  private readonly id: string;
  readonly params: ParamKeys<Params>;
  readonly optional: Optional;
  readonly defaultTarget: string | undefined;

  constructor(
    id: string,
    params: ParamKeys<Params>,
    optional: Optional,
    defaultTarget: string | undefined,
  ) {
    this.id = id;
    this.params = params;
    this.optional = optional;
    this.defaultTarget = defaultTarget;
  }

  toString() {
    if (this.#nfsId) {
      return `externalRouteRef{id=${this.#nfsId},legacyId=${this.id}}`;
    }
    return `routeRef{type=external,id=${this.id}}`;
  }

  getDefaultTarget() {
    return this.defaultTarget;
  }

  // NFS implementation below
  readonly $$type = '@backstage/ExternalRouteRef';
  readonly version = 'v1';
  readonly T = undefined as any;

  #nfsId: string | undefined = undefined;

  getParams(): string[] {
    return this.params as string[];
  }
  getDescription(): string {
    if (this.#nfsId) {
      return this.#nfsId;
    }
    return this.id;
  }
  setId(newId: string) {
    if (!newId) {
      throw new Error(`ExternalRouteRef id must be a non-empty string`);
    }
    if (this.#nfsId && this.#nfsId !== newId) {
      throw new Error(
        `ExternalRouteRef was referenced twice as both '${
          this.#nfsId
        }' and '${newId}'`,
      );
    }
    this.#nfsId = newId;
  }
}

/**
 * Creates a route descriptor, to be later bound to a concrete route by the app. Used to implement cross-plugin route references.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @param options - Description of the route reference to be created.
 * @public
 */
export function createExternalRouteRef<
  Params extends { [param in ParamKey]: string },
  Optional extends boolean = false,
  ParamKey extends string = never,
>(options: {
  /**
   * An identifier for this route, used to identify it in error messages
   */
  id: string;

  /**
   * The parameters that will be provided to the external route reference.
   */
  params?: ParamKey[];

  /**
   * Whether or not this route is optional, defaults to false.
   *
   * Optional external routes are not required to be bound in the app, and
   * if they aren't, `useRouteRef` will return `undefined`.
   */
  optional?: Optional;

  /**
   * The route (typically in another plugin) that this should map to by default.
   *
   * The string is expected to be on the standard `<plugin id>.<route id>` form,
   * for example `techdocs.docRoot`.
   */
  defaultTarget?: string;
}): ExternalRouteRef<OptionalParams<Params>, Optional> {
  return new ExternalRouteRefImpl(
    options.id,
    (options.params ?? []) as ParamKeys<OptionalParams<Params>>,
    Boolean(options.optional) as Optional,
    options?.defaultTarget,
  ) as ExternalRouteRef<OptionalParams<Params>, Optional>;
}
