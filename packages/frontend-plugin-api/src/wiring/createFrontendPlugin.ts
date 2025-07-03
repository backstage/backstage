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
  OpaqueExtensionDefinition,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { ExtensionDefinition } from './createExtension';
import {
  Extension,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';
import { AnyExternalRoutes, AnyRoutes, FeatureFlagConfig } from './types';
import { MakeSortedExtensionsMap } from './MakeSortedExtensionsMap';
import { JsonObject } from '@backstage/types';

/**
 * Information about the plugin.
 *
 * @public
 * @remarks
 *
 * This interface is intended to be extended via [module
 * augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
 * in order to add fields that are specific to each project.
 *
 * For example, one might add a `slackChannel` field that is read from the
 * opaque manifest file.
 *
 * See the options for `createApp` for more information about how to
 * customize the parsing of manifest files.
 */
export interface FrontendPluginInfo {
  /**
   * The name of the package that implements the plugin.
   */
  packageName?: string;

  /**
   * The version of the plugin, typically the version of the package.json file.
   */
  version?: string;

  /**
   * As short description of the plugin, typically the description field in
   * package.json.
   */
  description?: string;

  /**
   * The owner entity references of the plugin.
   */
  ownerEntityRefs?: string[];

  /**
   * Links related to the plugin.
   */
  links?: Array<{ title: string; url: string }>;
}

/**
 * Options for providing information for a plugin.
 *
 * @public
 */
export type FrontendPluginInfoOptions = {
  /**
   * A loader function for the package.json file for the plugin.
   */
  packageJson?: () => Promise<{ name: string } & JsonObject>;
  /**
   * A loader function for an opaque manifest file for the plugin.
   */
  manifest?: () => Promise<JsonObject>;
};

/** @public */
export interface FrontendPlugin<
  TRoutes extends AnyRoutes = AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes = AnyExternalRoutes,
  TExtensionMap extends { [id in string]: ExtensionDefinition } = {
    [id in string]: ExtensionDefinition;
  },
> {
  readonly $$type: '@backstage/FrontendPlugin';
  readonly id: string;
  readonly routes: TRoutes;
  readonly externalRoutes: TExternalRoutes;

  /**
   * Loads the plugin info.
   */
  info(): Promise<FrontendPluginInfo>;
  getExtension<TId extends keyof TExtensionMap>(id: TId): TExtensionMap[TId];
  withOverrides(options: {
    extensions: Array<ExtensionDefinition>;

    /**
     * Overrides the original info loaders of the plugin one by one.
     */
    info?: FrontendPluginInfoOptions;
  }): FrontendPlugin<TRoutes, TExternalRoutes, TExtensionMap>;
}

/** @public */
export interface PluginOptions<
  TId extends string,
  TRoutes extends AnyRoutes,
  TExternalRoutes extends AnyExternalRoutes,
  TExtensions extends readonly ExtensionDefinition[],
> {
  pluginId: TId;
  routes?: TRoutes;
  externalRoutes?: TExternalRoutes;
  extensions?: TExtensions;
  featureFlags?: FeatureFlagConfig[];
  info?: FrontendPluginInfoOptions;
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
  MakeSortedExtensionsMap<TExtensions[number], TId>
>;
/**
 * @public
 * @deprecated The `id` option is deprecated, use `pluginId` instead.
 */
export function createFrontendPlugin<
  TId extends string,
  TRoutes extends AnyRoutes = {},
  TExternalRoutes extends AnyExternalRoutes = {},
  TExtensions extends readonly ExtensionDefinition[] = [],
>(
  options: Omit<
    PluginOptions<TId, TRoutes, TExternalRoutes, TExtensions>,
    'pluginId'
  > & { id: string },
): FrontendPlugin<
  TRoutes,
  TExternalRoutes,
  MakeSortedExtensionsMap<TExtensions[number], TId>
>;
export function createFrontendPlugin<
  TId extends string,
  TRoutes extends AnyRoutes = {},
  TExternalRoutes extends AnyExternalRoutes = {},
  TExtensions extends readonly ExtensionDefinition[] = [],
>(
  options:
    | PluginOptions<TId, TRoutes, TExternalRoutes, TExtensions>
    | (Omit<
        PluginOptions<TId, TRoutes, TExternalRoutes, TExtensions>,
        'pluginId'
      > & { id: string }),
): FrontendPlugin<
  TRoutes,
  TExternalRoutes,
  MakeSortedExtensionsMap<TExtensions[number], TId>
> {
  const pluginId = 'pluginId' in options ? options.pluginId : options.id;
  if (!pluginId) {
    throw new Error(
      "Either 'id' or 'pluginId' must be provided to createFrontendPlugin",
    );
  }
  const extensions = new Array<Extension<any>>();
  const extensionDefinitionsById = new Map<
    string,
    typeof OpaqueExtensionDefinition.TInternal
  >();

  for (const def of options.extensions ?? []) {
    const internal = OpaqueExtensionDefinition.toInternal(def);
    const ext = resolveExtensionDefinition(def, { namespace: pluginId });
    extensions.push(ext);
    extensionDefinitionsById.set(ext.id, {
      ...internal,
      namespace: pluginId,
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
      `Plugin '${pluginId}' provided duplicate extensions: ${duplicates.join(
        ', ',
      )}`,
    );
  }

  return OpaqueFrontendPlugin.createInstance('v1', {
    id: pluginId,
    routes: options.routes ?? ({} as TRoutes),
    externalRoutes: options.externalRoutes ?? ({} as TExternalRoutes),
    featureFlags: options.featureFlags ?? [],
    extensions: extensions,
    infoOptions: options.info,

    // This method is overridden when the plugin instance is installed in an app
    async info() {
      throw new Error(
        `Attempted to load plugin info for plugin '${pluginId}', but the plugin instance is not installed in an app`,
      );
    },
    getExtension(id) {
      const ext = extensionDefinitionsById.get(id);
      if (!ext) {
        throw new Error(
          `Attempted to get non-existent extension '${id}' from plugin '${pluginId}'`,
        );
      }
      return ext;
    },
    toString() {
      return `Plugin{id=${pluginId}}`;
    },
    withOverrides(overrides) {
      const overriddenExtensionIds = new Set(
        overrides.extensions.map(
          e => resolveExtensionDefinition(e, { namespace: pluginId }).id,
        ),
      );
      const nonOverriddenExtensions = (options.extensions ?? []).filter(
        e =>
          !overriddenExtensionIds.has(
            resolveExtensionDefinition(e, { namespace: pluginId }).id,
          ),
      );
      return createFrontendPlugin({
        ...options,
        pluginId,
        extensions: [...nonOverriddenExtensions, ...overrides.extensions],
        info: {
          ...options.info,
          ...overrides.info,
        },
      });
    },
  });
}
