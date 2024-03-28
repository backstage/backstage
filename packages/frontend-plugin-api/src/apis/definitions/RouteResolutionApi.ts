/*
 * Copyright 2024 The Backstage Authors
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
  AnyRouteRefParams,
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
} from '../../routing';
import { createApiRef } from '@backstage/core-plugin-api';

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
export type RouteFunc<TParams extends AnyRouteRefParams> = (
  ...[params]: TParams extends undefined
    ? readonly []
    : readonly [params: TParams]
) => string;

/**
 * @public
 */
export type RouteResolutionApiResolveOptions = {
  /**
   * An absolute path to use as a starting point when resolving the route.
   * If no path is provided the route will be resolved from the root of the app.
   */
  sourcePath?: string;
};

/**
 * @public
 */
export interface RouteResolutionApi {
  resolve<TParams extends AnyRouteRefParams>(
    anyRouteRef:
      | RouteRef<TParams>
      | SubRouteRef<TParams>
      | ExternalRouteRef<TParams, any>,
    options?: RouteResolutionApiResolveOptions,
  ): RouteFunc<TParams> | undefined;
}

/**
 * The `ApiRef` of {@link RouteResolutionApi}.
 *
 * @public
 */
export const routeResolutionApiRef = createApiRef<RouteResolutionApi>({
  id: 'core.route-resolution',
});
