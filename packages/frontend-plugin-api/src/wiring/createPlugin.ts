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
  ResolveExtensionId,
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
  TId extends string,
  TRoutes extends AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes,
  TExtensions extends readonly ExtensionDefinition<any, any>[],
> {
  id: TId;
  routes?: TRoutes;
  externalRoutes?: TExternalRoutes;
  extensions?: TExtensions;
  featureFlags?: FeatureFlagConfig[];
}

/** @public */
export interface InternalBackstagePlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
> extends BackstagePlugin<TRoutes, TExternalRoutes> {
  readonly version: 'v1';
  readonly extensions: Extension<unknown>[];
  readonly featureFlags: FeatureFlagConfig[];
}

/** @public */
export function createPlugin<
  TId extends string,
  TRoutes extends AnyRoutes = {},
  TExternalRoutes extends AnyExternalRoutes = {},
  TExtensions extends readonly ExtensionDefinition<any, any>[] = [],
>(
  options: PluginOptions<TId, TRoutes, TExternalRoutes, TExtensions>,
): BackstagePlugin<
  TRoutes,
  TExternalRoutes,
  {
    [KExtension in TExtensions[number] as ResolveExtensionId<
      KExtension,
      TId
    >]: KExtension;
  }
> {
  const extensions = new Array<Extension<unknown>>();
  const extensionDefinitionsById = new Map<
    string,
    ExtensionDefinition<unknown>
  >();

  for (const def of options.extensions ?? []) {
    const ext = resolveExtensionDefinition(def, { namespace: options.id });
    extensions.push(ext);
    extensionDefinitionsById.set(ext.id, def);
  }

  if (extensions.length !== extensionDefinitionsById.size) {
    const extensionIds = extensions.map(e => e.id);
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
    routes: options.routes ?? ({} as TRoutes),
    externalRoutes: options.externalRoutes ?? ({} as TExternalRoutes),
    featureFlags: options.featureFlags ?? [],
    extensions,
    getExtension(id) {
      return extensionDefinitionsById.get(id);
    },
    toString() {
      return `Plugin{id=${options.id}}`;
    },
  } as InternalBackstagePlugin<TRoutes, TExternalRoutes>;
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
