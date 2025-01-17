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

import React, { JSX } from 'react';
import { ConfigReader } from '@backstage/config';
import {
  ApiBlueprint,
  AppTree,
  AppTreeApi,
  appTreeApiRef,
  coreExtensionData,
  RouteRef,
  ExternalRouteRef,
  SubRouteRef,
  AnyRouteRefParams,
  RouteFunc,
  RouteResolutionApiResolveOptions,
  RouteResolutionApi,
  createApiFactory,
  routeResolutionApiRef,
  AppNode,
} from '@backstage/frontend-plugin-api';
import {
  AnyApiFactory,
  ApiHolder,
  ConfigApi,
  configApiRef,
  featureFlagsApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { ApiFactoryRegistry, ApiResolver } from '@backstage/core-app-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

import { extractRouteInfoFromAppNode } from '../routing/extractRouteInfoFromAppNode';

import { CreateAppRouteBinder } from '../routing';
import { RouteResolver } from '../routing/RouteResolver';
import { resolveRouteBindings } from '../routing/resolveRouteBindings';
import { collectRouteIds } from '../routing/collectRouteIds';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalFrontendModule,
  isInternalFrontendModule,
} from '../../../frontend-plugin-api/src/wiring/createFrontendModule';
import { getBasePath } from '../routing/getBasePath';
import { Root } from '../extensions/Root';
import { resolveAppTree } from '../tree/resolveAppTree';
import { resolveAppNodeSpecs } from '../tree/resolveAppNodeSpecs';
import { readAppExtensionsConfig } from '../tree/readAppExtensionsConfig';
import { instantiateAppNodeTree } from '../tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiRegistry } from '../../../core-app-api/src/apis/system/ApiRegistry';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { BackstageRouteObject } from '../routing/types';
import { FrontendFeature, RouteInfo } from './types';
import { matchRoutes } from 'react-router-dom';

function deduplicateFeatures(
  allFeatures: FrontendFeature[],
): FrontendFeature[] {
  // Start by removing duplicates by reference
  const features = Array.from(new Set(allFeatures));

  // Plugins are deduplicated by ID, last one wins
  const seenIds = new Set<string>();
  return features
    .reverse()
    .filter(feature => {
      if (!OpaqueFrontendPlugin.isType(feature)) {
        return true;
      }
      if (seenIds.has(feature.id)) {
        return false;
      }
      seenIds.add(feature.id);
      return true;
    })
    .reverse();
}

// Helps delay callers from reaching out to the API before the app tree has been materialized
class AppTreeApiProxy implements AppTreeApi {
  #routeInfo?: RouteInfo;

  constructor(
    private readonly tree: AppTree,
    private readonly appBasePath: string,
  ) {}

  private checkIfInitialized() {
    if (!this.#routeInfo) {
      throw new Error(
        `You can't access the AppTreeApi during initialization of the app tree. Please move occurrences of this out of the initialization of the factory`,
      );
    }
  }

  getTree() {
    this.checkIfInitialized();

    return { tree: this.tree };
  }

  getNodesByRoutePath(sourcePath: string): { nodes: AppNode[] } {
    this.checkIfInitialized();

    let path = sourcePath;
    if (path.startsWith(this.appBasePath)) {
      path = path.slice(this.appBasePath.length);
    }

    const matchedRoutes = matchRoutes(this.#routeInfo!.routeObjects, path);

    const matchedAppNodes =
      matchedRoutes
        ?.filter(routeObj => !!routeObj.route.appNode)
        .map(routeObj => routeObj.route.appNode!) || [];

    return { nodes: matchedAppNodes };
  }

  initialize(routeInfo: RouteInfo) {
    this.#routeInfo = routeInfo;
  }
}

// Helps delay callers from reaching out to the API before the app tree has been materialized
class RouteResolutionApiProxy implements RouteResolutionApi {
  #delegate: RouteResolutionApi | undefined;
  #routeObjects: BackstageRouteObject[] | undefined;

  constructor(
    private readonly routeBindings: Map<
      ExternalRouteRef,
      RouteRef | SubRouteRef
    >,
    private readonly appBasePath: string,
  ) {}

  resolve<TParams extends AnyRouteRefParams>(
    anyRouteRef:
      | RouteRef<TParams>
      | SubRouteRef<TParams>
      | ExternalRouteRef<TParams>,
    options?: RouteResolutionApiResolveOptions,
  ): RouteFunc<TParams> | undefined {
    if (!this.#delegate) {
      throw new Error(
        `You can't access the RouteResolver during initialization of the app tree. Please move occurrences of this out of the initialization of the factory`,
      );
    }

    return this.#delegate.resolve(anyRouteRef, options);
  }

  initialize(routeInfo: RouteInfo) {
    this.#delegate = new RouteResolver(
      routeInfo.routePaths,
      routeInfo.routeParents,
      routeInfo.routeObjects,
      this.routeBindings,
      this.appBasePath,
    );
    this.#routeObjects = routeInfo.routeObjects;

    return routeInfo;
  }

  getRouteObjects() {
    return this.#routeObjects;
  }
}
/**
 * Creates an empty app without any default features. This is a low-level API is
 * intended for use in tests or specialized setups. Typically wou want to use
 * `createApp` from `@backstage/frontend-defaults` instead.
 *
 * @public
 */
export function createSpecializedApp(options?: {
  features?: FrontendFeature[];
  config?: ConfigApi;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
}): { createRoot(): JSX.Element } {
  const config = options?.config ?? new ConfigReader({}, 'empty-config');
  const features = deduplicateFeatures(options?.features ?? []);

  const tree = resolveAppTree(
    'root',
    resolveAppNodeSpecs({
      features,
      builtinExtensions: [
        resolveExtensionDefinition(Root, { namespace: 'root' }),
      ],
      parameters: readAppExtensionsConfig(config),
      forbidden: new Set(['root']),
    }),
  );

  const factories = createApiFactories({ tree });
  const appBasePath = getBasePath(config);
  const appTreeApi = new AppTreeApiProxy(tree, appBasePath);
  const routeResolutionApi = new RouteResolutionApiProxy(
    resolveRouteBindings(
      options?.bindRoutes,
      config,
      collectRouteIds(features),
    ),
    appBasePath,
  );

  const appIdentityProxy = new AppIdentityProxy();
  const apiHolder = createApiHolder({
    factories,
    staticFactories: [
      createApiFactory(appTreeApiRef, appTreeApi),
      createApiFactory(configApiRef, config),
      createApiFactory(routeResolutionApiRef, routeResolutionApi),
      createApiFactory(identityApiRef, appIdentityProxy),
    ],
  });

  const featureFlagApi = apiHolder.get(featureFlagsApiRef);
  if (featureFlagApi) {
    for (const feature of features) {
      if (OpaqueFrontendPlugin.isType(feature)) {
        OpaqueFrontendPlugin.toInternal(feature).featureFlags.forEach(flag =>
          featureFlagApi.registerFlag({
            name: flag.name,
            pluginId: feature.id,
          }),
        );
      }
      if (isInternalFrontendModule(feature)) {
        toInternalFrontendModule(feature).featureFlags.forEach(flag =>
          featureFlagApi.registerFlag({
            name: flag.name,
            pluginId: feature.pluginId,
          }),
        );
      }
    }
  }

  // Now instantiate the entire tree, which will skip anything that's already been instantiated
  instantiateAppNodeTree(tree.root, apiHolder);

  const routeInfo = extractRouteInfoFromAppNode(tree.root);

  routeResolutionApi.initialize(routeInfo);
  appTreeApi.initialize(routeInfo);

  const rootEl = tree.root.instance!.getData(coreExtensionData.reactElement);

  const AppComponent = () => rootEl;

  return {
    createRoot() {
      return <AppComponent />;
    },
  };
}

function createApiFactories(options: { tree: AppTree }): AnyApiFactory[] {
  const emptyApiHolder = ApiRegistry.from([]);
  const factories = new Array<AnyApiFactory>();

  for (const apiNode of options.tree.root.edges.attachments.get('apis') ?? []) {
    instantiateAppNodeTree(apiNode, emptyApiHolder);
    const apiFactory = apiNode.instance?.getData(ApiBlueprint.dataRefs.factory);
    if (!apiFactory) {
      throw new Error(
        `No API factory found in for extension ${apiNode.spec.id}`,
      );
    }
    factories.push(apiFactory);
  }

  return factories;
}

function createApiHolder(options: {
  factories: AnyApiFactory[];
  staticFactories: AnyApiFactory[];
}): ApiHolder {
  const factoryRegistry = new ApiFactoryRegistry();

  for (const factory of options.factories.slice().reverse()) {
    factoryRegistry.register('default', factory);
  }

  for (const factory of options.staticFactories) {
    factoryRegistry.register('static', factory);
  }

  ApiResolver.validateFactories(factoryRegistry, factoryRegistry.getAllApis());

  return new ApiResolver(factoryRegistry);
}
