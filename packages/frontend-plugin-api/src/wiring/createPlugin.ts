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

import { ExtensionDefinition } from './createExtension';
import {
  Extension,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';
import {
  AnyExternalRoutes,
  AnyRoutes,
  BackstagePlugin,
  FeatureFlagConfig,
} from './types';

/** @public */
export interface PluginOptions<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes,
> {
  id: string;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
  extensions?: ExtensionDefinition<unknown>[];
  featureFlags?: FeatureFlagConfig[];
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
  const extensions = (options.extensions ?? []).map(def =>
    resolveExtensionDefinition(def, { namespace: options.id }),
  );

  const extensionIds = extensions.map(e => e.id);
  if (extensionIds.length !== new Set(extensionIds).size) {
    const duplicates = Array.from(
      new Set(
        extensionIds.filter((id, index) => extensionIds.indexOf(id) !== index),
      ),
    );
    // TODO(Rugvip): This could provide some more information about the kind + name of the extensions
    throw new Error(
      `Plugin '${options.id}' provided duplicate extensions: ${duplicates.join(
        ', ',
      )}`,
    );
  }

  return {
    $$type: '@backstage/BackstagePlugin',
    version: 'v1',
    id: options.id,
    routes: options.routes ?? ({} as Routes),
    externalRoutes: options.externalRoutes ?? ({} as ExternalRoutes),
    featureFlags: options.featureFlags ?? [],
    extensions,
    toString() {
      return `Plugin{id=${options.id}}`;
    },
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
