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

import { RouteRefImpl } from './RouteRef';
import { describeParentCallSite } from './describeParentCallSite';
import { AnyRouteRefParams } from './types';

/**
 * Route descriptor, to be later bound to a concrete route by the app. Used to implement cross-plugin route references.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export interface ExternalRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> {
  readonly $$type: '@backstage/ExternalRouteRef';
  readonly T: TParams;
}

/** @internal */
export interface InternalExternalRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> extends ExternalRouteRef<TParams> {
  readonly version: 'v1';
  getParams(): string[];
  getDescription(): string;
  getDefaultTarget(): string | undefined;

  setId(id: string): void;
}

/** @internal */
export function toInternalExternalRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
>(resource: ExternalRouteRef<TParams>): InternalExternalRouteRef<TParams> {
  const r = resource as InternalExternalRouteRef<TParams>;
  if (r.$$type !== '@backstage/ExternalRouteRef') {
    throw new Error(`Invalid ExternalRouteRef, bad type '${r.$$type}'`);
  }

  return r;
}

/** @internal */
export function isExternalRouteRef(opaque: {
  $$type: string;
}): opaque is ExternalRouteRef {
  return opaque.$$type === '@backstage/ExternalRouteRef';
}

/** @internal */
class ExternalRouteRefImpl
  extends RouteRefImpl
  implements InternalExternalRouteRef
{
  readonly $$type = '@backstage/ExternalRouteRef' as any;

  constructor(
    readonly params: string[] = [],
    readonly defaultTarget: string | undefined,
    creationSite: string,
  ) {
    super(params, creationSite);
  }

  getDefaultTarget() {
    return this.defaultTarget;
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
  TParams extends { [param in TParamKeys]: string } | undefined = undefined,
  TParamKeys extends string = string,
>(options?: {
  /**
   * The parameters that will be provided to the external route reference.
   */
  readonly params?: string extends TParamKeys
    ? (keyof TParams)[]
    : TParamKeys[];

  /**
   * The route (typically in another plugin) that this should map to by default.
   *
   * The string is expected to be on the standard `<plugin id>.<route id>` form,
   * for example `techdocs.docRoot`.
   */
  defaultTarget?: string;
}): ExternalRouteRef<
  keyof TParams extends never
    ? undefined
    : string extends TParamKeys
    ? TParams
    : { [param in TParamKeys]: string }
> {
  return new ExternalRouteRefImpl(
    options?.params as string[] | undefined,
    options?.defaultTarget,
    describeParentCallSite(),
  );
}
