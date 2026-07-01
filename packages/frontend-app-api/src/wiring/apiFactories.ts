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
  ApiBlueprint,
  AnyApiFactory,
  ApiHolder,
  AppNode,
  FrontendFeature,
  featureFlagsApiRef,
} from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';
import { instantiateAppNodeSubtree } from '../tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  isInternalFrontendModule,
  toInternalFrontendModule,
} from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
import { ErrorCollector } from './createErrorCollector';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';
import { type ExtensionPredicateContext } from './predicates';

export type ApiFactoryEntry = {
  node: AppNode;
  pluginId: string;
  factory: AnyApiFactory;
};

/**
 * Registers feature flag declarations on an already prepared API holder.
 *
 * This is primarily used when bootstrap reuses APIs from a provided session
 * state rather than building a fresh registry from bootstrap-visible factories.
 */
export function registerFeatureFlagDeclarationsInHolder(
  apis: ApiHolder,
  features: FrontendFeature[],
  collector: ErrorCollector,
) {
  const featureFlagApi = apis.get(featureFlagsApiRef);
  if (featureFlagApi) {
    registerFeatureFlagDeclarations(featureFlagApi, features, collector);
  }
}

/**
 * Decorates the feature flags API factory so plugin and module declarations are
 * registered whenever that API is instantiated.
 */
export function wrapFeatureFlagApiFactory(
  factory: AnyApiFactory,
  features: FrontendFeature[],
  collector: ErrorCollector,
) {
  if (factory.api.id !== featureFlagsApiRef.id) {
    return factory;
  }

  return {
    ...factory,
    factory(deps) {
      const featureFlagApi = factory.factory(
        deps,
      ) as typeof featureFlagsApiRef.T;
      registerFeatureFlagDeclarations(featureFlagApi, features, collector);
      return featureFlagApi;
    },
  } as AnyApiFactory;
}

/**
 * Reconciles deferred API factories into the finalized API registry.
 *
 * It preserves bootstrap-frozen APIs, allows safe deferred additions, and
 * reports cases where bootstrap-visible extensions relied on APIs that only
 * became available during finalization.
 */
export function syncFinalApiFactories(options: {
  deferredApiNodes: Iterable<AppNode>;
  appApiRegistry: FrontendApiRegistry;
  apiResolver: FrontendApiResolver;
  collector: ErrorCollector;
  features: FrontendFeature[];
  bootstrapApiFactoryEntries: ReadonlyMap<string, ApiFactoryEntry>;
  bootstrapMissingApiAccesses: Map<string, { node: AppNode; apiRefId: string }>;
  predicateContext: ExtensionPredicateContext;
}) {
  const finalApiEntries = collectApiFactoryEntries({
    apiNodes: options.deferredApiNodes,
    collector: options.collector,
    predicateContext: options.predicateContext,
    entries: new Map(options.bootstrapApiFactoryEntries),
  });
  // Only newly introduced or still-safe overrides are registered here. Any
  // bootstrap-materialized API remains frozen for the lifetime of the app.
  const changedEntries = Array.from(finalApiEntries.values()).filter(entry => {
    const bootstrapEntry = options.bootstrapApiFactoryEntries.get(
      entry.factory.api.id,
    );
    if (!bootstrapEntry) {
      return true;
    }
    if (bootstrapEntry.factory === entry.factory) {
      return false;
    }
    if (options.apiResolver.isMaterialized(entry.factory.api.id)) {
      options.collector.report({
        code: 'EXTENSION_BOOTSTRAP_API_OVERRIDE_IGNORED',
        message:
          `Extension '${entry.node.spec.id}' tried to override API ` +
          `'${entry.factory.api.id}' after it had already been materialized during bootstrap. ` +
          'The bootstrap implementation was kept and the deferred override was ignored.',
        context: {
          node: entry.node,
          apiRefId: entry.factory.api.id,
          bootstrapNode: bootstrapEntry.node,
          pluginId: entry.pluginId,
          bootstrapPluginId: bootstrapEntry.pluginId,
        },
      });
      return false;
    }
    return true;
  });
  const changedFactories = changedEntries.map(entry =>
    wrapFeatureFlagApiFactory(
      entry.factory,
      options.features,
      options.collector,
    ),
  );
  options.appApiRegistry.setAll(changedFactories);
  options.apiResolver.invalidate(
    changedFactories.map(factory => factory.api.id),
  );
  for (const bootstrapAccess of options.bootstrapMissingApiAccesses.values()) {
    if (
      options.bootstrapApiFactoryEntries.has(bootstrapAccess.apiRefId) ||
      !finalApiEntries.has(bootstrapAccess.apiRefId)
    ) {
      continue;
    }

    options.collector.report({
      code: 'EXTENSION_BOOTSTRAP_API_UNAVAILABLE',
      message:
        `Extension '${bootstrapAccess.node.spec.id}' tried to access API ` +
        `'${bootstrapAccess.apiRefId}' during bootstrap before it was available. ` +
        'That API became available during finalization, so bootstrap-visible extensions must not depend on deferred APIs.',
      context: {
        node: bootstrapAccess.node,
        apiRefId: bootstrapAccess.apiRefId,
      },
    });
  }
}

const EMPTY_API_HOLDER: ApiHolder = {
  get() {
    return undefined;
  },
};

function registerFeatureFlagDeclarations(
  featureFlagApi: typeof featureFlagsApiRef.T,
  features: FrontendFeature[],
  collector: ErrorCollector,
) {
  for (const feature of features) {
    let pluginId: string | undefined;
    let flags: Array<{ name: string; description?: string }> | undefined;
    let source: string | undefined;

    if (OpaqueFrontendPlugin.isType(feature)) {
      pluginId = feature.id;
      flags = OpaqueFrontendPlugin.toInternal(feature).featureFlags;
      source = 'Plugin';
    } else if (isInternalFrontendModule(feature)) {
      pluginId = feature.pluginId;
      flags = toInternalFrontendModule(feature).featureFlags;
      source = 'Module for plugin';
    }

    if (pluginId && flags && source) {
      for (const flag of flags) {
        try {
          featureFlagApi.registerFlag({
            name: flag.name,
            description: flag.description,
            pluginId,
          });
        } catch (error) {
          collector.report({
            code: 'FEATURE_FLAG_INVALID',
            message: `${source} '${pluginId}' declared invalid feature flag '${flag.name}': ${error}`,
            context: { pluginId, flagName: flag.name, error: error as Error },
          });
        }
      }
    }
  }
}

/**
 * Instantiates API extension subtrees in isolation and extracts the factories
 * they provide without mutating the live app tree.
 *
 * The collected entries are later used both for bootstrap registration and for
 * the finalization-time reconciliation of deferred API roots.
 */
export function collectApiFactoryEntries(options: {
  apiNodes: Iterable<AppNode>;
  collector: ErrorCollector;
  predicateContext?: ExtensionPredicateContext;
  entries?: Map<string, ApiFactoryEntry>;
}): Map<string, ApiFactoryEntry> {
  const factoriesById = options.entries ?? new Map<string, ApiFactoryEntry>();
  for (const apiNode of options.apiNodes) {
    // API extensions are instantiated in isolation so we can inspect the
    // produced factories without mutating the live app tree.
    const detachedApiNode = instantiateAppNodeSubtree({
      rootNode: apiNode,
      apis: EMPTY_API_HOLDER,
      collector: options.collector,
      predicateContext: options.predicateContext,
      writeNodeInstances: false,
      reuseExistingInstances: false,
    });
    if (!detachedApiNode) {
      continue;
    }
    const apiFactory = detachedApiNode.instance?.getData(
      ApiBlueprint.dataRefs.factory,
    );
    if (apiFactory) {
      const apiRefId = apiFactory.api.id;
      const ownerId = getApiOwnerId(apiRefId);
      const pluginId = apiNode.spec.plugin.pluginId ?? 'app';
      const existingFactory = factoriesById.get(apiRefId);

      // This allows modules to override factories provided by the plugin, but
      // it rejects API overrides from other plugins. In the event of a
      // conflict, the owning plugin is attempted to be inferred from the API
      // reference ID.
      if (existingFactory && existingFactory.pluginId !== pluginId) {
        const shouldReplace =
          ownerId === pluginId && existingFactory.pluginId !== ownerId;
        const acceptedPluginId = shouldReplace
          ? pluginId
          : existingFactory.pluginId;
        const rejectedPluginId = shouldReplace
          ? existingFactory.pluginId
          : pluginId;

        options.collector.report({
          code: 'API_FACTORY_CONFLICT',
          message: `API '${apiRefId}' is already provided by plugin '${acceptedPluginId}', cannot also be provided by '${rejectedPluginId}'.`,
          context: {
            node: apiNode,
            apiRefId,
            pluginId: rejectedPluginId,
            existingPluginId: acceptedPluginId,
          },
        });
        if (shouldReplace) {
          factoriesById.set(apiRefId, {
            pluginId,
            node: apiNode,
            factory: apiFactory,
          });
        }
        continue;
      }

      factoriesById.set(apiRefId, {
        pluginId,
        node: apiNode,
        factory: apiFactory,
      });
    } else {
      options.collector.report({
        code: 'API_EXTENSION_INVALID',
        message: `API extension '${apiNode.spec.id}' did not output an API factory`,
        context: {
          node: apiNode,
        },
      });
    }
  }

  return factoriesById;
}

// TODO(Rugvip): It would be good if this was more explicit, but I think that
//               might need to wait for some future update for API factories.
function getApiOwnerId(apiRefId: string): string {
  const [prefix, ...rest] = apiRefId.split('.');
  if (!prefix) {
    return apiRefId;
  }
  if (prefix === 'core') {
    return 'app';
  }
  if (prefix === 'plugin' && rest[0]) {
    return rest[0];
  }
  return prefix;
}
