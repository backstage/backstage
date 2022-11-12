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
import { ComponentAdaptation } from '../adaptable-components/types';

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
  expose(plugin: BackstagePlugin): T;
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
 * Plugin type.
 *
 * @public
 */
export type BackstagePlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
  PluginInputOptions extends {} = {},
  ComponentAdaptations extends Record<
    string,
    ComponentAdaptation<any, any>
  > = {},
> = {
  getId(): string;
  getApis(): Iterable<AnyApiFactory>;
  /**
   * Returns all registered feature flags for this plugin.
   */
  getFeatureFlags(): Iterable<PluginFeatureFlagConfig>;
  provide<T>(extension: Extension<T>): T;
  routes: Routes;
  readonly adaptations: ComponentAdaptations;
  externalRoutes: ExternalRoutes;
  __experimentalReconfigure(options: PluginInputOptions): void;
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
  PluginInputOptions extends {},
  ComponentAdaptations extends Record<
    string,
    Extension<ComponentAdaptation<any, any>>
  > = {},
> = {
  id: string;
  apis?: Iterable<AnyApiFactory>;
  routes?: Routes;
  adaptations?: ComponentAdaptations;
  externalRoutes?: ExternalRoutes;
  featureFlags?: PluginFeatureFlagConfig[];
  __experimentalConfigure?(options?: PluginInputOptions): {};
};

/**
 * Interface for registering feature flags hooks.
 *
 * @public
 */
export type FeatureFlagsHooks = {
  register(name: string): void;
};
