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
  ExtensionDefinition,
  InternalExtensionDefinition,
  toInternalExtensionDefinition,
} from './createExtension';
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
  TExtensions extends readonly ExtensionDefinition[],
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
export function createFrontendPlugin<
  TId extends string,
  TRoutes extends AnyRoutes = {},
  TExternalRoutes extends AnyExternalRoutes = {},
  TExtensions extends readonly ExtensionDefinition[] = [],
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
  const extensions = new Array<Extension<any>>();
  const extensionDefinitionsById = new Map<
    string,
    InternalExtensionDefinition
  >();

  for (const def of options.extensions ?? []) {
    const internal = toInternalExtensionDefinition(def);
    const ext = resolveExtensionDefinition(def, { namespace: options.id });
    extensions.push(ext);
    extensionDefinitionsById.set(ext.id, {
      ...internal,
      namespace: options.id,
    });
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
    withOverrides(overrides) {
      const overriddenExtensionIds = new Set(
        overrides.extensions.map(
          e => resolveExtensionDefinition(e, { namespace: options.id }).id,
        ),
      );
      const nonOverriddenExtensions = (options.extensions ?? []).filter(
        e =>
          !overriddenExtensionIds.has(
            resolveExtensionDefinition(e, { namespace: options.id }).id,
          ),
      );
      return createFrontendPlugin({
        ...options,
        extensions: [...nonOverriddenExtensions, ...overrides.extensions],
      });
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

/**
 * @public
 * @deprecated Use {@link createFrontendPlugin} instead.
 */
export const createPlugin = createFrontendPlugin;
