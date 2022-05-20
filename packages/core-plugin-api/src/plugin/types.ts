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

import { RouteRef, SubRouteRef, ExternalRouteRef } from '../routing';
import { AnyApiFactory } from '../apis/system';

/**
 * Plugin extension type.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#extensions}.
 *
 * @public
 */
export type Extension<T> = {
  expose(plugin: BackstagePlugin<any, any>): T;
};

/**
 * Catch-all route type.
 *
 * @public
 */
export type AnyRoutes = { [name: string]: RouteRef | SubRouteRef };

/**
 * Catch-all type for {@link ExternalRouteRef}s.
 *
 * @public
 */
export type AnyExternalRoutes = { [name: string]: ExternalRouteRef };

/**
 * Catch-all metadata type.
 *
 * @public
 */
export type AnyPluginOptions = { [name: string]: any };

/**
 * Plugin type.
 *
 * @public
 */
export type BackstagePlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
  PluginOptions extends AnyPluginOptions = { [name: string]: any },
> = {
  getId(): string;
  getApis(): Iterable<AnyApiFactory>;
  /**
   * Returns all registered feature flags for this plugin.
   */
  getFeatureFlags(): Iterable<PluginFeatureFlagConfig>;
  provide<T>(extension: Extension<T>): T;
  getPluginOptions(): PluginOptions;
  reconfigure(pluginOptions: PluginOptions): void;
  routes: Routes;
  externalRoutes: ExternalRoutes;
};

/**
 * Plugin feature flag configuration.
 *
 * @public
 */
export type PluginFeatureFlagConfig = {
  /** Feature flag name */
  name: string;
};

/**
 * Plugin descriptor type.
 *
 * @public
 */
export type PluginConfig<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
  PluginOptions extends AnyPluginOptions,
> = {
  id: string;
  apis?: Iterable<AnyApiFactory>;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
  featureFlags?: PluginFeatureFlagConfig[];
  options?: PluginOptions;
  /**
   * TODO: Not clear yet does it make sense to do it as a function.
   * As for me it makes more sense to provide it as an object with default values.
   * And keep only reconfigure as a function to update default values.
   * Otherwise it looks like we have 2 places where it is possible to override default values.
   * @param inputOptions
   */
  pluginOptions(inputOptions: AnyPluginOptions): PluginOptions;
};

/**
 * Interface for registering feature flags hooks.
 *
 * @public
 */
export type FeatureFlagsHooks = {
  register(name: string): void;
};
