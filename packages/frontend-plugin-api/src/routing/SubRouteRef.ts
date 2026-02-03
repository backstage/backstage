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

import { OpaqueRouteRef, OpaqueSubRouteRef } from '@internal/frontend';
import { RouteRef } from './RouteRef';
import { AnyRouteRefParams } from './types';

// Should match the pattern in react-router
const PARAM_PATTERN = /^\w+$/;

/**
 * Descriptor of a route relative to an absolute {@link RouteRef}.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export interface SubRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> {
  readonly $$type: '@backstage/SubRouteRef';

  readonly T: TParams;

  readonly path: string;
}

/** @internal */
export interface InternalSubRouteRef<
  TParams extends AnyRouteRefParams = AnyRouteRefParams,
> extends SubRouteRef<TParams> {
  readonly version: 'v1';

  getParams(): string[];
  getParent(): RouteRef;
  getDescription(): string;
}

/**
 * Used in {@link PathParams} type declaration.
 * @ignore
 */
type ParamPart<S extends string> = S extends `:${infer Param}` ? Param : never;

/**
 * Used in {@link PathParams} type declaration.
 * @ignore
 */
type ParamNames<S extends string> = S extends `${infer Part}/${infer Rest}`
  ? ParamPart<Part> | ParamNames<Rest>
  : ParamPart<S>;
/**
 * This utility type helps us infer a Param object type from a string path
 * For example, `/foo/:bar/:baz` inferred to `{ bar: string, baz: string }`
 * @ignore
 */
type PathParams<S extends string> = { [name in ParamNames<S>]: string };

/**
 * Merges a param object type with an optional params type into a params object.
 * @ignore
 */
type MergeParams<
  P1 extends { [param in string]: string },
  P2 extends AnyRouteRefParams,
> = (P1[keyof P1] extends never ? {} : P1) & (P2 extends undefined ? {} : P2);

/**
 * Convert empty params to undefined.
 * @ignore
 */
type TrimEmptyParams<Params extends { [param in string]: string }> =
  keyof Params extends never ? undefined : Params;

/**
 * Creates a SubRouteRef type given the desired parameters and parent route parameters.
 * The parameters types are merged together while ensuring that there is no overlap between the two.
 *
 * @ignore
 */
type MakeSubRouteRef<
  Params extends { [param in string]: string },
  ParentParams extends AnyRouteRefParams,
> = keyof Params & keyof ParentParams extends never
  ? SubRouteRef<TrimEmptyParams<MergeParams<Params, ParentParams>>>
  : never;

/**
 * Create a {@link SubRouteRef} from a route descriptor.
 *
 * @param config - Description of the route reference to be created.
 * @public
 */
export function createSubRouteRef<
  Path extends string,
  ParentParams extends AnyRouteRefParams = never,
>(config: {
  path: Path;
  parent: RouteRef<ParentParams>;
}): MakeSubRouteRef<PathParams<Path>, ParentParams> {
  const { path, parent } = config;
  type Params = PathParams<Path>;

  const internalParent = OpaqueRouteRef.toInternal(parent);
  const parentParams = internalParent.getParams();
  const parentDescription = internalParent.getDescription();

  // Collect runtime parameters from the path, e.g. ['bar', 'baz'] from '/foo/:bar/:baz'
  const pathParams = path
    .split('/')
    .filter(p => p.startsWith(':'))
    .map(p => p.substring(1));
  const params = [...parentParams, ...pathParams];

  if (parentParams.some(p => pathParams.includes(p as string))) {
    throw new Error(
      'SubRouteRef may not have params that overlap with its parent',
    );
  }
  if (!path.startsWith('/')) {
    throw new Error(`SubRouteRef path must start with '/', got '${path}'`);
  }
  if (path.endsWith('/')) {
    throw new Error(`SubRouteRef path must not end with '/', got '${path}'`);
  }
  for (const param of pathParams) {
    if (!PARAM_PATTERN.test(param)) {
      throw new Error(`SubRouteRef path has invalid param, got '${param}'`);
    }
  }

  return OpaqueSubRouteRef.createInstance('v1', {
    T: undefined as unknown as TrimEmptyParams<
      MergeParams<Params, ParentParams>
    >,
    path,
    getParams() {
      return params;
    },
    getParent() {
      return parent;
    },
    getDescription() {
      return `at ${path} with parent ${parentDescription}`;
    },
    toString() {
      return `subRouteRef{path='${path}',parent=${parent}}`;
    },
  });
}
