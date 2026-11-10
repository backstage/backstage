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
import { OpaqueFrontendPlugin } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  isInternalFrontendModule,
  toInternalFrontendModule,
} from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
import { collectRouteIds, RouteRefsById } from '../routing/collectRouteIds';
import { readAppExtensionsConfig } from '../tree/readAppExtensionsConfig';
import { resolveAppNodeSpecs } from '../tree/resolveAppNodeSpecs';
import { graftAppTreeNodes } from '../tree/resolveAppTree';
import { instantiateAppNodeSubtree } from '../tree/instantiateAppNodeTree';
import { ErrorCollector } from './createErrorCollector';
import { DeferredFrontendFeature } from './deferredFeatures';
import {
  AppTreeApiProxy,
  initializePhaseRouting,
  RouteResolutionApiProxy,
} from './phaseApis';
import { type ExtensionPredicateContext } from './predicates';
import { ExtensionFactoryMiddleware } from './types';

const ROUTES_ATTACHMENT = { id: 'app/routes', input: 'routes' };

function getPluginId(plugin: FrontendPlugin) {
  return plugin.pluginId ?? OpaqueFrontendPlugin.toInternal(plugin).id;
}

function getAttachTo(spec: AppNodeSpec) {
  return Array.isArray(spec.attachTo) ? undefined : spec.attachTo;
}

/**
 * Picks the specs that can be added to the app after it has been finalized:
 * pages attached to `app/routes`, plus anything attached to those pages. The
 * pages must also be in the manifest, because they are rendered through the
 * stub pages that were created from it.
 */
function selectGraftableSpecs(options: {
  specs: AppNodeSpec[];
  manifestPageIds: Set<string>;
  existingIds: Set<string>;
  stub: FrontendPlugin;
  collector: ErrorCollector;
}): AppNodeSpec[] {
  const { specs, manifestPageIds, existingIds, stub, collector } = options;
  const candidates = specs.filter(
    spec => !existingIds.has(spec.id) && !spec.disabled,
  );

  const selected = new Set<string>();
  for (const spec of candidates) {
    const attachTo = getAttachTo(spec);
    if (
      attachTo?.id === ROUTES_ATTACHMENT.id &&
      attachTo.input === ROUTES_ATTACHMENT.input &&
      spec.id.startsWith('page:') &&
      manifestPageIds.has(spec.id)
    ) {
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
    const reason = manifestPageIds.has(spec.id)
      ? 'it attaches outside of app/routes'
      : `it is not a page listed in the manifest, it attaches to ${
          attachTo
            ? `'${attachTo.id}' input '${attachTo.input}'`
            : 'more than one extension'
        }`;
    collector.report({
      code: 'EXTENSION_IGNORED',
      message: `The '${spec.id}' extension of the deferred '${spec.plugin.pluginId}' plugin was ignored because ${reason}. A deferred plugin can only provide pages, so its manifest is likely out of date.`,
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
 * The real pages replace the stub pages in the app tree and are
 * instantiated, but the rest of the tree keeps its instances. The stub page
 * elements are already rendered by `app/routes`, so they render the real page
 * elements that are returned from here.
 *
 * @returns The current feature list, and the real page elements keyed by
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
  routeRefsById: RouteRefsById;
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
    .filter(isInternalFrontendModule)
    .filter(mod => mod.pluginId === pluginId);
  const ownExtensionIds = new Set([
    ...OpaqueFrontendPlugin.toInternal(plugin).extensions.map(e => e.id),
    ...modules.flatMap(mod =>
      toInternalFrontendModule(mod).extensions.map(e => e.id),
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
  const graftSpecs = selectGraftableSpecs({
    specs,
    manifestPageIds: stubExtensionIds,
    existingIds,
    stub,
    collector,
  });

  const newNodes = graftAppTreeNodes(tree, graftSpecs);

  // Route refs aren't matched by ID yet, so the IDs are collected again with
  // the real plugin in place of the stub.
  const features = options.features.map(feature =>
    feature === stub ? plugin : feature,
  );
  const routeRefsById = collectRouteIds(features, collector);
  for (const key of ['routes', 'externalRoutes'] as const) {
    const target = options.routeRefsById[key] as Map<string, unknown>;
    target.clear();
    for (const [id, ref] of routeRefsById[key]) {
      target.set(id, ref);
    }
  }
  updateRouteBindings({
    routeBindings: options.routeBindings,
    stub,
    plugin,
  });

  const elements = new Map<string, JSX.Element>();
  for (const node of newNodes) {
    const attachTo = getAttachTo(node.spec);
    if (attachTo?.id !== ROUTES_ATTACHMENT.id) {
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
    routeRefsById: options.routeRefsById,
  });

  return { features, elements };
}
