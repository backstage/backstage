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
  createFrontendPlugin,
  Extension,
  FrontendFeature,
  FrontendPlugin,
} from '@backstage/frontend-plugin-api';
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
import { ErrorCollector } from '../wiring/createErrorCollector';

function normalizePlugin(plugin: FrontendPlugin): FrontendPlugin {
  // Ensure pluginId is always set for plugins in the app
  if (!plugin.pluginId && 'id' in plugin && typeof plugin.id === 'string') {
    (plugin as any).pluginId = plugin.id;
  }
  return plugin;
}

/** @internal */
export function resolveAppNodeSpecs(options: {
  features?: FrontendFeature[];
  builtinExtensions?: Extension<any, any>[];
  parameters?: Array<ExtensionParameters>;
  forbidden?: Set<string>;
  collector: ErrorCollector;
}): AppNodeSpec[] {
  const {
    builtinExtensions = [],
    parameters = [],
    forbidden = new Set(),
    features = [],
    collector,
  } = options;

  const plugins = features
    .filter(OpaqueFrontendPlugin.isType)
    .map(normalizePlugin);
  const modules = features.filter(isInternalFrontendModule);

  const filterForbidden = (
    extension: Extension<any, any> & { plugin: FrontendPlugin },
  ) => {
    if (forbidden.has(extension.id)) {
      collector.report({
        code: 'EXTENSION_IGNORED',
        message: `It is forbidden to override the '${extension.id}' extension, attempted by the '${extension.plugin.pluginId}' plugin`,
        context: {
          plugin: extension.plugin,
          extensionId: extension.id,
        },
      });
      return false;
    }
    return true;
  };

  const pluginExtensions = plugins.flatMap(plugin => {
    return OpaqueFrontendPlugin.toInternal(plugin)
      .extensions.map(extension => ({
        ...extension,
        plugin,
      }))
      .filter(filterForbidden);
  });
  const moduleExtensions = modules.flatMap(mod =>
    toInternalFrontendModule(mod)
      .extensions.flatMap(extension => {
        // Modules for plugins that are not installed are ignored
        const plugin = plugins.find(p => p.pluginId === mod.pluginId);
        if (!plugin) {
          return [];
        }

        return [{ ...extension, plugin }];
      })
      .filter(filterForbidden),
  );

  const appPlugin =
    plugins.find(plugin => plugin.pluginId === 'app') ??
    createFrontendPlugin({
      pluginId: 'app',
    });

  const configuredExtensions = [
    ...pluginExtensions.map(({ plugin, ...extension }) => {
      const internalExtension = toInternalExtension(extension);
      return {
        extension: internalExtension,
        params: {
          plugin,
          source: plugin,
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
          source: appPlugin,
          plugin: appPlugin,
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
          plugin: extension.plugin,
          source: extension.plugin,
          attachTo: internalExtension.attachTo,
          disabled: internalExtension.disabled,
          config: undefined,
        },
      });
    }
  }

  const seenExtensionIds = new Set<string>();
  const deduplicatedExtensions = configuredExtensions.filter(
    ({ extension, params }) => {
      if (seenExtensionIds.has(extension.id)) {
        collector.report({
          code: 'EXTENSION_IGNORED',
          message: `The '${extension.id}' extension from the '${params.plugin.pluginId}' plugin is a duplicate and will be ignored`,
          context: {
            plugin: params.plugin,
            extensionId: extension.id,
          },
        });
        return false;
      }
      seenExtensionIds.add(extension.id);
      return true;
    },
  );

  const order = new Map<string, (typeof deduplicatedExtensions)[number]>();
  for (const overrideParam of parameters) {
    const extensionId = overrideParam.id;

    if (forbidden.has(extensionId)) {
      collector.report({
        code: 'INVALID_EXTENSION_CONFIG_KEY',
        message: `Configuration of the '${extensionId}' extension is forbidden`,
        context: {
          extensionId,
        },
      });
      continue;
    }

    const existing = deduplicatedExtensions.find(
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
      collector.report({
        code: 'INVALID_EXTENSION_CONFIG_KEY',
        message: `Extension ${extensionId} does not exist`,
        context: {
          extensionId,
        },
      });
    }
  }

  const orderedExtensions = [
    ...order.values(),
    ...deduplicatedExtensions.filter(e => !order.has(e.extension.id)),
  ];

  return orderedExtensions.map(param => ({
    id: param.extension.id,
    attachTo: param.params.attachTo,
    extension: param.extension,
    disabled: param.params.disabled,
    plugin: param.params.plugin,
    source: param.params.source,
    config: param.params.config,
  }));
}
