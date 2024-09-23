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

import { Extension } from '@backstage/frontend-plugin-api';
import { ExtensionParameters } from './readAppExtensionsConfig';
import { AppNodeSpec } from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  isInternalFrontendModule,
  toInternalFrontendModule,
} from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { FrontendFeature } from '../wiring';

/** @internal */
export function resolveAppNodeSpecs(options: {
  features?: FrontendFeature[];
  builtinExtensions?: Extension<any, any>[];
  parameters?: Array<ExtensionParameters>;
  forbidden?: Set<string>;
}): AppNodeSpec[] {
  const {
    builtinExtensions = [],
    parameters = [],
    forbidden = new Set(),
    features = [],
  } = options;

  const plugins = features.filter(OpaqueFrontendPlugin.isType);
  const modules = features.filter(isInternalFrontendModule);

  const pluginExtensions = plugins.flatMap(source => {
    return OpaqueFrontendPlugin.toInternal(source).extensions.map(
      extension => ({
        ...extension,
        source,
      }),
    );
  });
  const moduleExtensions = modules.flatMap(mod =>
    toInternalFrontendModule(mod).extensions.flatMap(extension => {
      // Modules for plugins that are not installed are ignored
      const source = plugins.find(p => p.id === mod.pluginId);
      if (!source) {
        return [];
      }

      return [{ ...extension, source }];
    }),
  );

  // Prevent core override
  if (pluginExtensions.some(({ id }) => forbidden.has(id))) {
    const pluginsStr = pluginExtensions
      .filter(({ id }) => forbidden.has(id))
      .map(({ source }) => `'${source.id}'`)
      .join(', ');
    const forbiddenStr = [...forbidden].map(id => `'${id}'`).join(', ');
    throw new Error(
      `It is forbidden to override the following extension(s): ${forbiddenStr}, which is done by the following plugin(s): ${pluginsStr}`,
    );
  }
  if (moduleExtensions.some(({ id }) => forbidden.has(id))) {
    const pluginsStr = moduleExtensions
      .filter(({ id }) => forbidden.has(id))
      .map(({ source }) => `'${source.id}'`)
      .join(', ');
    const forbiddenStr = [...forbidden].map(id => `'${id}'`).join(', ');
    throw new Error(
      `It is forbidden to override the following extension(s): ${forbiddenStr}, which is done by a module for the following plugin(s): ${pluginsStr}`,
    );
  }

  const configuredExtensions = [
    ...pluginExtensions.map(({ source, ...extension }) => {
      const internalExtension = toInternalExtension(extension);
      return {
        extension: internalExtension,
        params: {
          source,
          attachTo: internalExtension.attachTo,
          disabled: internalExtension.disabled,
          config: undefined as unknown,
        },
      };
    }),
    ...builtinExtensions.map(extension => {
      const internalExtension = toInternalExtension(extension);
      return {
        extension: internalExtension,
        params: {
          source: undefined,
          attachTo: internalExtension.attachTo,
          disabled: internalExtension.disabled,
          config: undefined as unknown,
        },
      };
    }),
  ];

  // Install all module overrides
  for (const extension of moduleExtensions) {
    const internalExtension = toInternalExtension(extension);

    // Check if our override is overriding an extension that already exists
    const index = configuredExtensions.findIndex(
      e => e.extension.id === extension.id,
    );
    if (index !== -1) {
      // Only implementation, attachment point and default disabled status are overridden, the source is kept
      configuredExtensions[index].extension = internalExtension;
      configuredExtensions[index].params.attachTo = internalExtension.attachTo;
      configuredExtensions[index].params.disabled = internalExtension.disabled;
    } else {
      // Add the extension as a new one when not overriding an existing one
      configuredExtensions.push({
        extension: internalExtension,
        params: {
          source: extension.source,
          attachTo: internalExtension.attachTo,
          disabled: internalExtension.disabled,
          config: undefined,
        },
      });
    }
  }

  const duplicatedExtensionIds = new Set<string>();
  const duplicatedExtensionData = configuredExtensions.reduce<
    Record<string, Record<string, number>>
  >((data, { extension, params }) => {
    const extensionId = extension.id;
    const extensionData = data?.[extensionId];
    if (extensionData) duplicatedExtensionIds.add(extensionId);
    const pluginId = params.source?.id ?? 'internal';
    const pluginCount = extensionData?.[pluginId] ?? 0;
    return {
      ...data,
      [extensionId]: { ...extensionData, [pluginId]: pluginCount + 1 },
    };
  }, {});

  if (duplicatedExtensionIds.size > 0) {
    throw new Error(
      `The following extensions are duplicated: ${Array.from(
        duplicatedExtensionIds,
      )
        .map(
          extensionId =>
            `The extension '${extensionId}' was provided ${Object.keys(
              duplicatedExtensionData[extensionId],
            )
              .map(
                pluginId =>
                  `${duplicatedExtensionData[extensionId][pluginId]} time(s) by the plugin '${pluginId}'`,
              )
              .join(' and ')}`,
        )
        .join(', ')}`,
    );
  }

  const order = new Map<string, (typeof configuredExtensions)[number]>();
  for (const overrideParam of parameters) {
    const extensionId = overrideParam.id;

    if (forbidden.has(extensionId)) {
      throw new Error(
        `Configuration of the '${extensionId}' extension is forbidden`,
      );
    }

    const existing = configuredExtensions.find(
      e => e.extension.id === extensionId,
    );
    if (existing) {
      if (overrideParam.attachTo) {
        existing.params.attachTo = overrideParam.attachTo;
      }
      if (overrideParam.config) {
        // TODO: merge config?
        existing.params.config = overrideParam.config;
      }
      if (
        Boolean(existing.params.disabled) !== Boolean(overrideParam.disabled)
      ) {
        existing.params.disabled = Boolean(overrideParam.disabled);
      }
      order.set(extensionId, existing);
    } else {
      throw new Error(`Extension ${extensionId} does not exist`);
    }
  }

  const orderedExtensions = [
    ...order.values(),
    ...configuredExtensions.filter(e => !order.has(e.extension.id)),
  ];

  return orderedExtensions.map(param => ({
    id: param.extension.id,
    attachTo: param.params.attachTo,
    extension: param.extension,
    disabled: param.params.disabled,
    source: param.params.source,
    config: param.params.config,
  }));
}
