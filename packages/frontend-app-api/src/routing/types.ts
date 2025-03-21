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
  AppNode,
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/frontend-plugin-api';
import { BackstagePlugin as LegacyBackstagePlugin } from '@backstage/core-plugin-api';

/** @internal */
export type AnyRouteRef = RouteRef | SubRouteRef | ExternalRouteRef;

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
  plugins: Set<LegacyBackstagePlugin>;
  appNode?: AppNode;
}
