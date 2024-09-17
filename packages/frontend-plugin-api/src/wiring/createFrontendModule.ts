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

import { OpaqueExtensionDefinition } from '@internal/frontend';
import { ExtensionDefinition } from './createExtension';
import {
  Extension,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';
import { FeatureFlagConfig } from './types';

/** @public */
export interface CreateFrontendModuleOptions<
  TPluginId extends string,
  TExtensions extends readonly ExtensionDefinition[],
> {
  pluginId: TPluginId;
  extensions?: TExtensions;
  featureFlags?: FeatureFlagConfig[];
}

/** @public */
export interface FrontendModule {
  readonly $$type: '@backstage/FrontendModule';
  readonly pluginId: string;
}

/** @internal */
export interface InternalFrontendModule extends FrontendModule {
  readonly version: 'v1';
  readonly extensions: Extension<unknown>[];
  readonly featureFlags: FeatureFlagConfig[];
}

/** @public */
export function createFrontendModule<
  TId extends string,
  TExtensions extends readonly ExtensionDefinition[] = [],
>(options: CreateFrontendModuleOptions<TId, TExtensions>): FrontendModule {
  const { pluginId } = options;

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

  return {
    $$type: '@backstage/FrontendModule',
    version: 'v1',
    pluginId,
    featureFlags: options.featureFlags ?? [],
    extensions,
    toString() {
      return `Module{pluginId=${pluginId}}`;
    },
  } as InternalFrontendModule;
}

/** @internal */
export function isInternalFrontendModule(opaque: {
  $$type: string;
}): opaque is InternalFrontendModule {
  if (opaque.$$type === '@backstage/FrontendModule') {
    // Make sure we throw if invalid
    toInternalFrontendModule(opaque as FrontendModule);
    return true;
  }
  return false;
}

/** @internal */
export function toInternalFrontendModule(
  plugin: FrontendModule,
): InternalFrontendModule {
  const internal = plugin as InternalFrontendModule;
  if (internal.$$type !== '@backstage/FrontendModule') {
    throw new Error(`Invalid plugin instance, bad type '${internal.$$type}'`);
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid plugin instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}
