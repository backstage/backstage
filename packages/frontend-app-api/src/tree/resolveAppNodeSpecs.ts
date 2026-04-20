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
import { FilterPredicate } from '@backstage/filter-predicates';
import { ExtensionParameters } from './readAppExtensionsConfig';
import { AppNodeSpec } from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  isInternalFrontendModule,
  toInternalFrontendModule,
} from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalExtension,
  resolveExtensionDefinition,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { ErrorCollector } from '../wiring/createErrorCollector';

/**
 * Parses an extension ID into its kind, namespace, and name components.
 * Extension IDs follow the format: `kind:namespace/name` or `kind:namespace`
 * @internal
 */
function parseExtensionId(extensionId: string): {
  kind?: string;
  namespace?: string;
  name?: string;
} {
  let kind: string | undefined;
  let rest: string;

  const colonIndex = extensionId.indexOf(':');
  if (colonIndex >= 0) {
    kind = extensionId.substring(0, colonIndex);
    rest = extensionId.substring(colonIndex + 1);
  } else {
    rest = extensionId;
  }

  const slashIndex = rest.indexOf('/');
  if (slashIndex >= 0) {
    return {
      kind,
      namespace: rest.substring(0, slashIndex),
      name: rest.substring(slashIndex + 1),
    };
  }

  return { kind, namespace: rest };
}

function normalizePlugin(plugin: FrontendPlugin): FrontendPlugin {
  // Ensure pluginId is always set for plugins in the app
  if (!plugin.pluginId && 'id' in plugin && typeof plugin.id === 'string') {
    (plugin as any).pluginId = plugin.id;
  }
  return plugin;
}

function combinePredicates(
  left: FilterPredicate | undefined,
  right: FilterPredicate | undefined,
) {
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }

  return { $all: [left, right] };
}

function getExtensionPredicate(options: {
  internalExtension: ReturnType<typeof toInternalExtension>;
}) {
  if (options.internalExtension.version === 'v2') {
    return options.internalExtension.if;
  }
  return undefined;
}

/**
 * Attempts to create a new extension from a registered blueprint when a
 * config references an extension ID that doesn't exist in code.
 *
 * Parses the extension ID to extract kind/namespace/name, then looks for a
 * matching blueprint in the plugin that owns that namespace.
 *
 * @internal
 */
function tryCreateFromBlueprint(
  extensionId: string,
  _overrideParam: ExtensionParameters,
  plugins: FrontendPlugin[],
): { extension: Extension<any, any>; plugin: FrontendPlugin } | undefined {
  const { kind, namespace, name } = parseExtensionId(extensionId);

  // We need kind, namespace, and name to create from a blueprint.
  // kind is needed to find the right blueprint.
  // namespace identifies the owning plugin.
  // name is needed to distinguish the new extension from the default.
  if (!kind || !namespace || !name) {
    return undefined;
  }

  // Find the plugin that owns this namespace
  const plugin = plugins.find(p => p.pluginId === namespace);
  if (!plugin) {
    return undefined;
  }

  // Look for a matching blueprint in the plugin's registered blueprints
  const internalPlugin = OpaqueFrontendPlugin.toInternal(plugin);
  const blueprints = internalPlugin.blueprints ?? [];
  const blueprint = blueprints.find(bp => bp.kind === kind);

  if (!blueprint) {
    return undefined;
  }

  // The blueprint must have defaultParams to support config-driven creation
  if (!blueprint.defaultParams) {
    return undefined;
  }

  // Create the extension using the blueprint's defaults
  const definition = blueprint.makeFromConfig({ name });
  const extension = resolveExtensionDefinition(definition, { namespace });

  return { extension, plugin };
}

/**
 * Creates a clone of an existing extension with a new ID.
 * The clone shares the same factory, inputs, outputs, and config schema
 * but gets a new name and can have different config overrides.
 *
 * @internal
 */
function tryCloneExtension(
  extensionId: string,
  overrideParam: ExtensionParameters,
  deduplicatedExtensions: Array<{
    extension: ReturnType<typeof toInternalExtension>;
    params: {
      plugin: FrontendPlugin;
      source: FrontendPlugin;
      attachTo: any;
      disabled: boolean;
      if?: any;
      config: unknown;
    };
  }>,
) {
  const sourceId = overrideParam.from!;
  const source = deduplicatedExtensions.find(e => e.extension.id === sourceId);
  if (!source) {
    return undefined;
  }

  // Create a cloned extension with the new ID but same factory/inputs/outputs
  const clonedExtension = {
    ...source.extension,
    id: extensionId,
    attachTo: overrideParam.attachTo ?? source.extension.attachTo,
    disabled: overrideParam.disabled ?? source.extension.disabled,
  };

  return {
    extension: clonedExtension,
    params: {
      plugin: source.params.plugin,
      source: source.params.source,
      attachTo: overrideParam.attachTo ?? source.params.attachTo,
      disabled: Boolean(overrideParam.disabled ?? source.params.disabled),
      if: source.params.if,
      config: overrideParam.config ?? source.params.config,
    },
  };
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
    const internalPlugin = OpaqueFrontendPlugin.toInternal(plugin);
    return internalPlugin.extensions
      .map(extension => {
        const internalExtension = toInternalExtension(extension);
        return {
          ...internalExtension,
          plugin,
          if: combinePredicates(
            internalPlugin.if,
            internalExtension.version === 'v2'
              ? internalExtension.if
              : undefined,
          ),
        };
      })
      .filter(filterForbidden);
  });
  const moduleExtensions = modules.flatMap(mod => {
    const internalModule = toInternalFrontendModule(mod);
    return internalModule.extensions
      .flatMap(extension => {
        const internalExtension = toInternalExtension(extension);

        // Modules for plugins that are not installed are ignored
        const plugin = plugins.find(p => p.pluginId === mod.pluginId);
        if (!plugin) {
          return [];
        }

        return [
          {
            ...internalExtension,
            plugin,
            if: combinePredicates(
              internalModule.if,
              internalExtension.version === 'v2'
                ? internalExtension.if
                : undefined,
            ),
          },
        ];
      })
      .filter(filterForbidden);
  });

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
          if: getExtensionPredicate({ internalExtension }),
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
          if: getExtensionPredicate({ internalExtension }),
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
      configuredExtensions[index].params.if = getExtensionPredicate({
        internalExtension,
      });
    } else {
      // Add the extension as a new one when not overriding an existing one
      configuredExtensions.push({
        extension: internalExtension,
        params: {
          plugin: extension.plugin,
          source: extension.plugin,
          attachTo: internalExtension.attachTo,
          disabled: internalExtension.disabled,
          if: getExtensionPredicate({ internalExtension }),
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
    } else if (overrideParam.from) {
      // Clone an existing extension with a new ID and different config
      const cloned = tryCloneExtension(
        extensionId,
        overrideParam,
        deduplicatedExtensions,
      );
      if (cloned) {
        deduplicatedExtensions.push(cloned);
        seenExtensionIds.add(extensionId);
        order.set(extensionId, cloned);
      } else {
        collector.report({
          code: 'INVALID_EXTENSION_CONFIG_KEY',
          message: `Cannot clone extension '${overrideParam.from}': source extension does not exist`,
          context: {
            extensionId,
          },
        });
      }
    } else {
      // Try to create a new extension from a registered blueprint
      const created = tryCreateFromBlueprint(
        extensionId,
        overrideParam,
        plugins,
      );
      if (created) {
        const { extension, plugin } = created;
        const internalExtension = toInternalExtension(extension);
        const newEntry = {
          extension: internalExtension,
          params: {
            plugin,
            source: plugin,
            attachTo: overrideParam.attachTo ?? internalExtension.attachTo,
            disabled: Boolean(overrideParam.disabled),
            if: getExtensionPredicate({ internalExtension }),
            config: overrideParam.config,
          },
        };
        deduplicatedExtensions.push(newEntry);
        seenExtensionIds.add(extensionId);
        order.set(extensionId, newEntry);
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
    if: param.params.if,
    plugin: param.params.plugin,
    source: param.params.source,
    config: param.params.config,
  }));
}
