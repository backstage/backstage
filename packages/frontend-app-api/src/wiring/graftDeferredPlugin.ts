/*
 * Copyright 2026 The Backstage Authors
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
  ApiHolder,
  AppNodeSpec,
  AppTree,
  ConfigApi,
  coreExtensionData,
  ExternalRouteRef,
  FrontendFeature,
  FrontendPlugin,
  RouteRef,
  SubRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  DeferredFrontendFeature,
  OpaqueFrontendModule,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { collectRouteIds } from '../routing/collectRouteIds';
import { readAppExtensionsConfig } from '../tree/readAppExtensionsConfig';
import { resolveAppNodeSpecs } from '../tree/resolveAppNodeSpecs';
import { graftAppTreeNodes } from '../tree/resolveAppTree';
import { instantiateAppNodeSubtree } from '../tree/instantiateAppNodeTree';
import { registerFeatureFlagDeclarationsInHolder } from './apiFactories';
import { ErrorCollector } from './createErrorCollector';
import { getPluginId } from './deferredFeatures';
import {
  AppTreeApiProxy,
  initializePhaseRouting,
  RouteResolutionApiProxy,
} from './phaseApis';
import { type ExtensionPredicateContext } from './predicates';
import { ExtensionFactoryMiddleware } from './types';

const APIS_ATTACHMENT = { id: 'root', input: 'apis' };

function getAttachTo(spec: AppNodeSpec) {
  return Array.isArray(spec.attachTo) ? undefined : spec.attachTo;
}

function isAttachedTo(
  spec: AppNodeSpec,
  attachment: { id: string; input: string },
) {
  const attachTo = getAttachTo(spec);
  return attachTo?.id === attachment.id && attachTo.input === attachment.input;
}

/**
 * Picks the specs that can be added to the app after it has been finalized:
 * the pages and elements that replace the stubs created from the manifest,
 * and anything attached to those pages.
 */
function selectGraftableSpecs(options: {
  specs: AppNodeSpec[];
  stubExtensionIds: Set<string>;
  existingIds: Set<string>;
  stub: FrontendPlugin;
  collector: ErrorCollector;
}): AppNodeSpec[] {
  const { specs, stubExtensionIds, existingIds, stub, collector } = options;
  const candidates = specs.filter(
    spec => !existingIds.has(spec.id) && !spec.disabled,
  );

  const selected = new Set<string>();
  for (const spec of candidates) {
    if (stubExtensionIds.has(spec.id) && getAttachTo(spec)) {
      selected.add(spec.id);
    }
  }

  // Add everything that attaches to a selected extension, repeating until
  // no more extensions are added since the specs are not in tree order.
  let added = true;
  while (added) {
    added = false;
    for (const spec of candidates) {
      const attachTo = getAttachTo(spec);
      if (!selected.has(spec.id) && attachTo && selected.has(attachTo.id)) {
        selected.add(spec.id);
        added = true;
      }
    }
  }

  for (const spec of candidates) {
    if (selected.has(spec.id)) {
      continue;
    }
    const attachTo = getAttachTo(spec);
    const reason = `it is not an extension listed in the manifest, it attaches to ${
      attachTo
        ? `'${attachTo.id}' input '${attachTo.input}'`
        : 'more than one extension'
    }`;
    collector.report({
      code: 'EXTENSION_IGNORED',
      message: `The '${spec.id}' extension of the deferred '${spec.plugin.pluginId}' plugin was ignored because ${reason}. A deferred plugin can only provide pages and elements that are listed in its manifest, so the manifest is likely out of date.`,
      context: { plugin: stub, extensionId: spec.id },
    });
  }

  return candidates.filter(spec => selected.has(spec.id));
}

function updateRouteBindings(options: {
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef | undefined>;
  stub: FrontendPlugin;
  plugin: FrontendPlugin;
}) {
  const { routeBindings, stub, plugin } = options;

  // External routes of other plugins that were bound to the stub routes now
  // point to the real ones.
  const stubRoutes = Object.entries(stub.routes) as [string, RouteRef][];
  for (const [externalRef, target] of routeBindings) {
    const match = stubRoutes.find(([, stubRef]) => stubRef === target);
    const realRef = match && plugin.routes[match[0]];
    if (realRef) {
      routeBindings.set(externalRef, realRef);
    }
  }

  // Bindings of the stub external routes carry over to the real ones.
  for (const [name, stubRef] of Object.entries(stub.externalRoutes)) {
    const realRef = plugin.externalRoutes[name];
    if (realRef && routeBindings.has(stubRef)) {
      routeBindings.set(realRef, routeBindings.get(stubRef));
    }
  }
}

/**
 * Adds a loaded deferred plugin to a finalized app, in place of its stub.
 *
 * @remarks
 *
 * The real pages and elements replace the stubs in the app tree and are
 * instantiated, but the rest of the tree keeps its instances. The stub
 * elements are already rendered by their parents, for example `app/routes`
 * or an entity page, so they render the real elements that are returned from
 * here. A deferred plugin can't provide APIs, since APIs are created when
 * the app starts, so a loaded plugin that provides one fails to load.
 *
 * @returns The current feature list, and the real elements keyed by
 * extension ID.
 * @internal
 */
export function graftDeferredPlugin(options: {
  entry: DeferredFrontendFeature;
  loadedFeature: unknown;
  stub: FrontendPlugin;
  features: FrontendFeature[];
  attachPluginInfo(feature: FrontendFeature): FrontendFeature;
  tree: AppTree;
  config: ConfigApi;
  apis: ApiHolder;
  collector: ErrorCollector;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  predicateContext?: ExtensionPredicateContext;
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef | undefined>;
  routeResolutionApi: RouteResolutionApiProxy;
  appTreeApi: AppTreeApiProxy;
}): { features: FrontendFeature[]; elements: Map<string, JSX.Element> } {
  const { entry, stub, tree, collector } = options;
  const pluginId = entry.manifest.pluginId;

  if (!OpaqueFrontendPlugin.isType(options.loadedFeature)) {
    throw new Error(
      `The deferred '${entry.name}' package didn't provide a frontend plugin as its default export`,
    );
  }
  const loadedPlugin = options.loadedFeature as FrontendPlugin;
  const loadedPluginId = getPluginId(loadedPlugin);
  if (loadedPluginId !== pluginId) {
    throw new Error(
      `The deferred '${entry.name}' package provided the '${loadedPluginId}' plugin, but its manifest is for the '${pluginId}' plugin`,
    );
  }
  const plugin = options.attachPluginInfo(loadedPlugin) as FrontendPlugin;

  // Modules for the plugin were installed together with the stub, so they are
  // applied to the real plugin as well.
  const modules = options.features
    .filter(OpaqueFrontendModule.isType)
    .filter(mod => mod.pluginId === pluginId);
  const ownExtensionIds = new Set([
    ...OpaqueFrontendPlugin.toInternal(plugin).extensions.map(e => e.id),
    ...modules.flatMap(mod =>
      OpaqueFrontendModule.toInternal(mod).extensions.map(e => e.id),
    ),
  ]);
  const specs = resolveAppNodeSpecs({
    features: [plugin, ...modules],
    parameters: readAppExtensionsConfig(options.config).filter(param =>
      ownExtensionIds.has(param.id),
    ),
    forbidden: new Set(['root']),
    collector,
  });

  const stubExtensionIds = new Set(
    OpaqueFrontendPlugin.toInternal(stub).extensions.map(e => e.id),
  );
  // Nodes that are already in the tree and don't belong to the stub, for
  // example extensions added by modules, are kept as they are.
  const existingIds = new Set(
    Array.from(tree.nodes.keys()).filter(id => !stubExtensionIds.has(id)),
  );
  // APIs are created when the app starts, so they can't be added once the app
  // is running. This is checked before the tree is changed.
  const api = specs.find(
    spec =>
      !spec.disabled &&
      !existingIds.has(spec.id) &&
      isAttachedTo(spec, APIS_ATTACHMENT),
  );
  if (api) {
    throw new Error(
      `The deferred '${entry.name}' package can't be loaded, it provides the '${api.id}' API, and plugins that provide APIs can't be deferred. Its manifest is likely out of date.`,
    );
  }
  const graftSpecs = selectGraftableSpecs({
    specs,
    stubExtensionIds,
    existingIds,
    stub,
    collector,
  });

  // Stub extensions that the loaded plugin doesn't provide are dropped when
  // the stub they attach to is replaced.
  const graftIds = new Set(graftSpecs.map(spec => spec.id));
  const newNodes = graftAppTreeNodes(tree, graftSpecs, {
    staleIds: new Set(
      Array.from(stubExtensionIds).filter(id => !graftIds.has(id)),
    ),
  });

  // The route refs of the real plugin replace those of the stub, so the route
  // IDs are collected again from the current features. The routing APIs are
  // initialized from these below, which is the only place they are used once
  // the app is finalized.
  const features = options.features.map(feature =>
    feature === stub ? plugin : feature,
  );
  const routeRefsById = collectRouteIds(features, collector);
  updateRouteBindings({
    routeBindings: options.routeBindings,
    stub,
    plugin,
  });

  registerFeatureFlagDeclarationsInHolder(options.apis, [plugin], collector);

  const elements = new Map<string, JSX.Element>();
  for (const node of newNodes) {
    if (!stubExtensionIds.has(node.spec.id)) {
      continue;
    }
    const instantiated = instantiateAppNodeSubtree({
      rootNode: node,
      apis: options.apis,
      collector,
      extensionFactoryMiddleware: options.extensionFactoryMiddleware,
      predicateContext: options.predicateContext,
    });
    const element = instantiated?.instance?.getData(
      coreExtensionData.reactElement,
    );
    if (element) {
      elements.set(node.spec.id, element);
    }
  }

  initializePhaseRouting({
    tree,
    routeResolutionApi: options.routeResolutionApi,
    appTreeApi: options.appTreeApi,
    routeRefsById,
  });

  return { features, elements };
}
