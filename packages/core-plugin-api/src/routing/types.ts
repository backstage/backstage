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

import { OldIconComponent } from '../icons/types';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

/**
 * Catch-all type for route params.
 *
 * @public
 */
export type AnyParams = { [param in string]: string } | undefined;

/**
 * Type describing the key type of a route parameter mapping.
 *
 * @public
 */
export type ParamKeys<Params extends AnyParams> = keyof Params extends never
  ? []
  : (keyof Params)[];

/**
 * Optional route params.
 *
 * @public
 */
export type OptionalParams<Params extends { [param in string]: string }> =
  Params[keyof Params] extends never ? undefined : Params;

/**
 * TS magic for handling route parameters.
 *
 * @remarks
 *
 * The extra TS magic here is to require a single params argument if the RouteRef
 * had at least one param defined, but require 0 arguments if there are no params defined.
 * Without this we'd have to pass in empty object to all parameter-less RouteRefs
 * just to make TypeScript happy, or we would have to make the argument optional in
 * which case you might forget to pass it in when it is actually required.
 *
 * @public
 */
export type RouteFunc<Params extends AnyParams> = (
  ...[params]: Params extends undefined ? readonly [] : readonly [Params]
) => string;

/**
 * This symbol is what we use at runtime to determine whether a given object
 * is a type of RouteRef or not. It doesn't work well in TypeScript though since
 * the `unique symbol` will refer to different values between package versions.
 * For that reason we use the marker $$routeRefType to represent the symbol at
 * compile-time instead of using the symbol directly.
 *
 * @internal
 */
export const routeRefType: unique symbol = getOrCreateGlobalSingleton<any>(
  'route-ref-type',
  () => Symbol('route-ref-type'),
);

/**
 * Absolute route reference.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export type RouteRef<Params extends AnyParams = any> = {
  $$routeRefType: 'absolute'; // See routeRefType above

  params: ParamKeys<Params>;

  // TODO(Rugvip): Remove all of these once plugins don't rely on the path
  /** @deprecated paths are no longer accessed directly from RouteRefs, use useRouteRef instead */
  path: string;
  /** @deprecated icons are no longer accessed via RouteRefs */
  icon?: OldIconComponent;
  /** @deprecated titles are no longer accessed via RouteRefs */
  title?: string;
};

/**
 * Descriptor of a route relative to an absolute {@link RouteRef}.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export type SubRouteRef<Params extends AnyParams = any> = {
  $$routeRefType: 'sub'; // See routeRefType above

  parent: RouteRef;

  path: string;

  params: ParamKeys<Params>;
};

/**
 * Route descriptor, to be later bound to a concrete route by the app. Used to implement cross-plugin route references.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}.
 *
 * @public
 */
export type ExternalRouteRef<
  Params extends AnyParams = any,
  Optional extends boolean = any,
> = {
  $$routeRefType: 'external'; // See routeRefType above

  params: ParamKeys<Params>;

  optional?: Optional;
};

/**
 * @internal
 */
export type AnyRouteRef =
  | RouteRef<any>
  | SubRouteRef<any>
  | ExternalRouteRef<any, any>;

// TODO(Rugvip): None of these should be found in the wild anymore, remove in next minor release
/**
 * @deprecated
 * @internal
 */
export type ConcreteRoute = {};
/**
 * @deprecated
 * @internal
 */
export type AbsoluteRouteRef = RouteRef<{}>;
/**
 * @deprecated
 * @internal
 */
export type MutableRouteRef = RouteRef<{}>;

/**
 * A duplicate of the react-router RouteObject, but with routeRef added
 * @internal
 */
export interface BackstageRouteObject {
  caseSensitive: boolean;
  children?: BackstageRouteObject[];
  element: React.ReactNode;
  path: string;
  routeRefs: Set<RouteRef>;
}
