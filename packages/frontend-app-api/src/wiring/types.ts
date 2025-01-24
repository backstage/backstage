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
import { RouteRef } from '@backstage/frontend-plugin-api';
import { FrontendModule, FrontendPlugin } from '@backstage/frontend-plugin-api';
import { BackstageRouteObject } from '../routing/types';

/** @public  */
export type FrontendFeature =
  | FrontendPlugin
  | FrontendModule
  // TODO(blam): This is just forwards backwards compatibility, remove after v1.31.0
  | { $$type: '@backstage/ExtensionOverrides' }
  | { $$type: '@backstage/BackstagePlugin' };

/** @internal */
export type RouteInfo = {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
};
