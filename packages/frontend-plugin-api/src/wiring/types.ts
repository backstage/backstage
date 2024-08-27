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

import { ExternalRouteRef, RouteRef, SubRouteRef } from '../routing';
import { ExtensionDefinition } from './createExtension';

/**
 * Feature flag configuration.
 *
 * @public
 */
export type FeatureFlagConfig = {
  /** Feature flag name */
  name: string;
};

/** @public */
export type AnyRoutes = { [name in string]: RouteRef | SubRouteRef };

/** @public */
export type AnyExternalRoutes = { [name in string]: ExternalRouteRef };

/** @public */
export type ExtensionMap<
  TExtensionMap extends { [id in string]: ExtensionDefinition<any, any> },
> = {
  get<TId extends keyof TExtensionMap>(id: TId): TExtensionMap[TId];
};

/** @public */
export interface BackstagePlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
  TExtensionMap extends { [id in string]: ExtensionDefinition<any, any> } = {},
> {
  readonly $$type: '@backstage/BackstagePlugin';
  readonly id: string;
  readonly routes: TRoutes;
  readonly externalRoutes: TExternalRoutes;
  getExtension<TId extends keyof TExtensionMap>(id: TId): TExtensionMap[TId];
  withOverrides(options: {
    extensions: Array<ExtensionDefinition<any, any>>;
  }): BackstagePlugin<TRoutes, TExternalRoutes, TExtensionMap>;
}

/** @public */
export interface ExtensionOverrides {
  readonly $$type: '@backstage/ExtensionOverrides';
}

/** @public */
export type FrontendFeature = BackstagePlugin | ExtensionOverrides;
