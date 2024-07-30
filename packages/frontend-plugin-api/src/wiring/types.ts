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
import { Extension } from './resolveExtensionDefinition';

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
export interface BackstagePlugin<
  Routes extends AnyRoutes = AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
  PluginId extends string = string,
  Extensions,
> {
  readonly $$type: '@backstage/BackstagePlugin';
  readonly id: string;
  readonly routes: Routes;
  readonly externalRoutes: ExternalRoutes;

  get(id: {
    [key in keyof Extensions]: Extensions[key] extends Extension<infer T>
      ? T extends { id: infer Id }
        ? Id
        : never
      : never;
  }): Extensions;
}

/** @public */
export interface ExtensionOverrides {
  readonly $$type: '@backstage/ExtensionOverrides';
}

/** @public */
export type FrontendFeature = BackstagePlugin | ExtensionOverrides;
