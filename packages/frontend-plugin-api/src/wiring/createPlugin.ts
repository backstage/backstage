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

import { Extension } from './createExtension';
import { ExternalRouteRef, RouteRef } from '../routing';
import { FeatureFlagConfig } from './types';

/** @public */
export type AnyRoutes = { [name in string]: RouteRef };

/** @public */
export type AnyExternalRoutes = { [name in string]: ExternalRouteRef };

/** @public */
export interface PluginOptions<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
> {
  id: string;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
  extensions?: Extension<unknown>[];
  featureFlags?: FeatureFlagConfig[];
}

/** @public */
export interface BackstagePlugin<
  Routes extends AnyRoutes = AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
> {
  readonly $$type: '@backstage/BackstagePlugin';
  readonly id: string;
  readonly routes: Routes;
  readonly externalRoutes: ExternalRoutes;
}

/** @public */
export interface InternalBackstagePlugin<
  Routes extends AnyRoutes = AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
> extends BackstagePlugin<Routes, ExternalRoutes> {
  readonly version: 'v1';
  readonly extensions: Extension<unknown>[];
  readonly featureFlags: FeatureFlagConfig[];
}

/** @public */
export function createPlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {},
>(
  options: PluginOptions<Routes, ExternalRoutes>,
): BackstagePlugin<Routes, ExternalRoutes> {
  return {
    $$type: '@backstage/BackstagePlugin',
    version: 'v1',
    id: options.id,
    routes: options.routes ?? ({} as Routes),
    externalRoutes: options.externalRoutes ?? ({} as ExternalRoutes),
    extensions: options.extensions ?? [],
    featureFlags: options.featureFlags ?? [],
  } as InternalBackstagePlugin<Routes, ExternalRoutes>;
}

/** @internal */
export function toInternalBackstagePlugin(
  plugin: BackstagePlugin,
): InternalBackstagePlugin {
  const internal = plugin as InternalBackstagePlugin;
  if (internal.$$type !== '@backstage/BackstagePlugin') {
    throw new Error(`Invalid plugin instance, bad type '${internal.$$type}'`);
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid plugin instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}
