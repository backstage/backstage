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

/** @internal */
export interface InternalRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> extends RouteRef<TParams> {
  readonly version: 'v1';
  getParams(): string[];
  getDescription(): string;

  setId(id: string): void;
}

/** @internal */
export function toInternalRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
>(resource: RouteRef<TParams>): InternalRouteRef<TParams> {
  const r = resource as InternalRouteRef<TParams>;
  if (r.$$type !== '@backstage/RouteRef') {
    throw new Error(`Invalid RouteRef, bad type '${r.$$type}'`);
  }

  return r;
}

/** @internal */
export function isRouteRef(opaque: { $$type: string }): opaque is RouteRef {
  return opaque.$$type === '@backstage/RouteRef';
}

/** @internal */
export class RouteRefImpl implements InternalRouteRef {
  readonly $$type = '@backstage/RouteRef';
  readonly version = 'v1';
  declare readonly T: never;

  #id?: string;
  #params: string[];
  #creationSite: string;

  constructor(
    readonly params: string[] = [],
    creationSite: string,
  ) {
    this.#params = params;
    this.#creationSite = creationSite;
  }

  getParams(): string[] {
    return this.#params;
  }

  getDescription(): string {
    if (this.#id) {
      return this.#id;
    }
    return `created at '${this.#creationSite}'`;
  }

  get #name() {
    return this.$$type.slice('@backstage/'.length);
  }

  setId(id: string): void {
    if (!id) {
      throw new Error(`${this.#name} id must be a non-empty string`);
    }
    if (this.#id) {
      throw new Error(
        `${this.#name} was referenced twice as both '${this.#id}' and '${id}'`,
      );
    }
    this.#id = id;
  }

  toString(): string {
    return `${this.#name}{${this.getDescription()}}`;
  }
}

/**
 * Create a {@link RouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export function createRouteRef<
  // Params is the type that we care about and the one to be embedded in the route ref.
  // For example, given the params ['name', 'kind'], Params will be {name: string, kind: string}
  TParams extends { [param in TParamKeys]: string } | undefined = undefined,
  TParamKeys extends string = string,
>(config?: {
  /** A list of parameter names that the path that this route ref is bound to must contain */
  readonly params: string extends TParamKeys ? (keyof TParams)[] : TParamKeys[];
}): RouteRef<
  keyof TParams extends never
    ? undefined
    : string extends TParamKeys
      ? TParams
      : { [param in TParamKeys]: string }
> {
  return new RouteRefImpl(
    config?.params as string[] | undefined,
    describeParentCallSite(),
  ) as RouteRef<any>;
}
