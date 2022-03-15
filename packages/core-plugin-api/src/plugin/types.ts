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
import { AnyApiFactory } from '../apis';

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
 * Extend metadata for a plugin
 */
export type ExtendMetadata = (
  info: PluginInfo,
  pluginId: string,
) => void | Promise<void | undefined>;

/**
 * Plugin type.
 *
 * @public
 */
export type BackstagePlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
  PluginInputOptions extends {} = {},
> = {
  getId(): string;
  getApis(): Iterable<AnyApiFactory>;
  /**
   * Returns all registered feature flags for this plugin.
   */
  getFeatureFlags(): Iterable<PluginFeatureFlagConfig>;
  getInfo(): Promise<PluginInfo>;
  setMetadataExtender(extender: ExtendMetadata): void;
  provide<T>(extension: Extension<T>): T;
  routes: Routes;
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

export type PluginInfoLink = {
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;
};

/**
 * PluginInfo
 *
 * @public
 */
export type PluginInfo = {
  /**
   * The raw package.json (or a subset thereof)
   */
  packageJson?: Record<string, unknown>;

  /**
   * Plugin description; defaults to `description` in package.json
   */
  description?: string;

  /**
   * Plugin version; defaults to `version` in package.json
   */
  version?: string;

  /**
   * Owner of the plugin. It's a catalog entity ref, defaulting the kind to
   * Group, so it's either a full entity ref, or just a group name
   */
  ownerEntityRef?: string;

  /**
   * A set of links. Will by default include the `homepage` and `repository`
   * field in package.json.
   */
  links: PluginInfoLink[];

  /**
   * Plugin role; will likely be frontend-plugin, frontend-plugin-module or
   * common-library
   */
  role?: string;
};

export type LazyLoadedPackageJson = () => Promise<{
  default: Record<string, unknown>;
}>;

export type PluginConfigInfo =
  | Partial<PluginInfo>
  | (Omit<Partial<PluginInfo>, 'packageJson'> & {
      packageJson: LazyLoadedPackageJson;
    })
  | LazyLoadedPackageJson;

/**
 * Plugin descriptor type.
 *
 * @public
 */
export type PluginConfig<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
  PluginInputOptions extends {},
> = {
  id: string;
  apis?: Iterable<AnyApiFactory>;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
  featureFlags?: PluginFeatureFlagConfig[];
  info?: PluginConfigInfo;
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
