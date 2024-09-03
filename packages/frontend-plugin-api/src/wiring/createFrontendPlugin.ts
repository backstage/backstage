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
import { AnyExternalRoutes, AnyRoutes, FeatureFlagConfig } from './types';

/** @public */
export interface FrontendPlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
  TExtensionMap extends { [id in string]: ExtensionDefinition } = {},
> {
  readonly $$type: '@backstage/FrontendPlugin';
  readonly id: string;
  readonly routes: TRoutes;
  readonly externalRoutes: TExternalRoutes;
  getExtension<TId extends keyof TExtensionMap>(id: TId): TExtensionMap[TId];
  withOverrides(options: {
    extensions: Array<ExtensionDefinition>;
  }): FrontendPlugin<TRoutes, TExternalRoutes, TExtensionMap>;
}

/**
 * @public
 * @deprecated Use {@link FrontendPlugin} instead.
 */
export type BackstagePlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
  TExtensionMap extends { [id in string]: ExtensionDefinition } = {},
> = FrontendPlugin<TRoutes, TExternalRoutes, TExtensionMap>;
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
export interface InternalFrontendPlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
> extends FrontendPlugin<TRoutes, TExternalRoutes> {
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
): FrontendPlugin<
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
    $$type: '@backstage/FrontendPlugin',
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
  } as InternalFrontendPlugin<TRoutes, TExternalRoutes>;
}

/** @internal */
export function isInternalFrontendPlugin(opaque: {
  $$type: string;
}): opaque is InternalFrontendPlugin {
  if (
    opaque.$$type === '@backstage/FrontendPlugin' ||
    opaque.$$type === '@backstage/BackstagePlugin'
  ) {
    // Make sure we throw if invalid
    toInternalFrontendPlugin(opaque as FrontendPlugin);
    return true;
  }
  return false;
}

/** @internal */
export function toInternalFrontendPlugin(
  plugin: FrontendPlugin,
): InternalFrontendPlugin {
  const internal = plugin as InternalFrontendPlugin;
  if (
    internal.$$type !== '@backstage/FrontendPlugin' &&
    internal.$$type !== '@backstage/BackstagePlugin'
  ) {
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
