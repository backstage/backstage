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

import { ComponentType } from 'react';
import { RouteRef, SubRouteRef, ExternalRouteRef } from '../routing';
import { AnyApiFactory } from '../apis/system';

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RoutePath = string;

// Replace with using RouteRefs
export type LegacyRouteOutput = {
  type: 'legacy-route';
  path: RoutePath;
  component: ComponentType<{}>;
  options?: RouteOptions;
};

export type RouteOutput = {
  type: 'route';
  target: RouteRef;
  component: ComponentType<{}>;
  options?: RouteOptions;
};

export type RedirectRouteOutput = {
  type: 'redirect-route';
  from: RouteRef;
  to: RouteRef;
  options?: RouteOptions;
};

export type LegacyRedirectRouteOutput = {
  type: 'legacy-redirect-route';
  path: RoutePath;
  target: RoutePath;
  options?: RouteOptions;
};

export type FeatureFlagOutput = {
  type: 'feature-flag';
  name: string;
};

export type PluginOutput =
  | LegacyRouteOutput
  | RouteOutput
  | LegacyRedirectRouteOutput
  | RedirectRouteOutput
  | FeatureFlagOutput;

export type Extension<T> = {
  expose(plugin: BackstagePlugin<any, any>): T;
};

export type AnyRoutes = { [name: string]: RouteRef | SubRouteRef };

export type AnyExternalRoutes = { [name: string]: ExternalRouteRef };

export type BackstagePlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {}
> = {
  getId(): string;
  output(): PluginOutput[];
  getApis(): Iterable<AnyApiFactory>;
  provide<T>(extension: Extension<T>): T;
  routes: Routes;
  externalRoutes: ExternalRoutes;
};

export type PluginConfig<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes
> = {
  id: string;
  apis?: Iterable<AnyApiFactory>;
  register?(hooks: PluginHooks): void;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
};

export type PluginHooks = {
  /**
   * @deprecated All router hooks have been deprecated
   */
  router: RouterHooks;
  featureFlags: FeatureFlagsHooks;
};

export type RouterHooks = {
  /**
   * @deprecated Use a routable extension instead, see https://backstage.io/docs/plugins/composability#porting-existing-plugins
   */
  addRoute(
    target: RouteRef,
    Component: ComponentType<any>,
    options?: RouteOptions,
  ): void;
};

export type FeatureFlagsHooks = {
  register(name: string): void;
};
