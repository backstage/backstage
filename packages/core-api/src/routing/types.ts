/*
 * Copyright 2020 Spotify AB
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

import { IconComponent } from '../icons';

// @ts-ignore, we're just embedding the Params type for usage in other places
export type RouteRef<Params extends { [param in string]: string } = {}> = {
  // TODO(Rugvip): Remove path, look up via registry instead
  /** @deprecated paths are no longer accessed directly from RouteRefs, use useRouteRef instead */
  path: string;
  icon?: IconComponent;
  title: string;
};

export type AnyRouteRef = RouteRef<any>;

/**
 * This type should not be used
 * @deprecated
 */
export type ConcreteRoute = {};

/**
 * This type should not be used, use RouteRef instead
 * @deprecated
 */
export type AbsoluteRouteRef = RouteRef<{}>;

/**
 * This type should not be used, use RouteRef instead
 * @deprecated
 */
export type MutableRouteRef = RouteRef<{}>;

// A duplicate of the react-router RouteObject, but with routeRef added
export interface BackstageRouteObject {
  caseSensitive: boolean;
  children?: BackstageRouteObject[];
  element: React.ReactNode;
  path: string;
  routeRefs: Set<AnyRouteRef>;
}
