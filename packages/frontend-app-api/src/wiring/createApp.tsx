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

import React, { JSX, ReactNode } from 'react';
import { ConfigReader } from '@backstage/config';
import {
  ApiBlueprint,
  AppTree,
  AppTreeApi,
  appTreeApiRef,
  coreExtensionData,
  FrontendFeature,
  RouteRef,
  ExternalRouteRef,
  SubRouteRef,
  AnyRouteRefParams,
  RouteFunc,
  RouteResolutionApiResolveOptions,
  RouteResolutionApi,
  createApiFactory,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';

import {
  AnyApiFactory,
  ApiHolder,
  ConfigApi,
  configApiRef,
  featureFlagsApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { getAvailableFeatures } from './discovery';
import { ApiFactoryRegistry, ApiResolver } from '@backstage/core-app-api';

// TODO: Get rid of all of these

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../../core-app-api/src/app/overrideBaseUrlConfigs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

import { extractRouteInfoFromAppNode } from '../routing/extractRouteInfoFromAppNode';

import { CreateAppRouteBinder } from '../routing';
import { RouteResolver } from '../routing/RouteResolver';
import { resolveRouteBindings } from '../routing/resolveRouteBindings';
import { collectRouteIds } from '../routing/collectRouteIds';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalBackstagePlugin } from '../../../frontend-plugin-api/src/wiring/createFrontendPlugin';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionOverrides } from '../../../frontend-plugin-api/src/wiring/createExtensionOverrides';
import { stringifyError } from '@backstage/errors';
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
      if (feature.$$type !== '@backstage/BackstagePlugin') {
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

/**
 * A source of dynamically loaded frontend features.
 *
 * @public
 */
export interface CreateAppFeatureLoader {
  /**
   * Returns name of this loader. suitable for showing to users.
   */
  getLoaderName(): string;

  /**
   * Loads a number of features dynamically.
   */
  load(options: { config: ConfigApi }): Promise<{
    features: FrontendFeature[];
  }>;
}

/** @public */
export function createApp(options?: {
  features?: (FrontendFeature | CreateAppFeatureLoader)[];
  configLoader?: () => Promise<{ config: ConfigApi }>;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
  /**
   * The component to render while loading the app (waiting for config, features, etc)
   *
   * Is the text "Loading..." by default.
   * If set to "null" then no loading fallback component is rendered.   *
   */
  loadingComponent?: ReactNode;
}): {
  createRoot(): JSX.Element;
} {
  let suspenseFallback = options?.loadingComponent;
  if (suspenseFallback === undefined) {
    suspenseFallback = 'Loading...';
  }

  async function appLoader() {
    const config =
      (await options?.configLoader?.().then(c => c.config)) ??
      ConfigReader.fromConfigs(
        overrideBaseUrlConfigs(defaultConfigLoaderSync()),
      );

    const discoveredFeatures = getAvailableFeatures(config);

    const providedFeatures: FrontendFeature[] = [];
    for (const entry of options?.features ?? []) {
      if ('load' in entry) {
        try {
          const result = await entry.load({ config });
          providedFeatures.push(...result.features);
        } catch (e) {
          throw new Error(
            `Failed to read frontend features from loader '${entry.getLoaderName()}', ${stringifyError(
              e,
            )}`,
          );
        }
      } else {
        providedFeatures.push(entry);
      }
    }

    const app = createSpecializedApp({
      config,
      features: [...discoveredFeatures, ...providedFeatures],
      bindRoutes: options?.bindRoutes,
    }).createRoot();

    return { default: () => app };
  }

  return {
    createRoot() {
      const LazyApp = React.lazy(appLoader);
      return (
        <React.Suspense fallback={suspenseFallback}>
          <LazyApp />
        </React.Suspense>
      );
    },
  };
}

// Helps delay callers from reaching out to the API before the app tree has been materialized
class AppTreeApiProxy implements AppTreeApi {
  #safeToUse: boolean = false;

  constructor(private readonly tree: AppTree) {}

  getTree() {
    if (!this.#safeToUse) {
      throw new Error(
        `You can't access the AppTreeApi during initialization of the app tree. Please move occurrences of this out of the initialization of the factory`,
      );
    }
    return { tree: this.tree };
  }

  initialize() {
    this.#safeToUse = true;
  }
}

// Helps delay callers from reaching out to the API before the app tree has been materialized
class RouteResolutionApiProxy implements RouteResolutionApi {
  #delegate: RouteResolutionApi | undefined;
  #routeObjects: BackstageRouteObject[] | undefined;

  constructor(
    private readonly tree: AppTree,
    private readonly routeBindings: Map<
      ExternalRouteRef,
      RouteRef | SubRouteRef
    >,
    private readonly basePath: string,
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

  initialize() {
    const routeInfo = extractRouteInfoFromAppNode(this.tree.root);

    this.#delegate = new RouteResolver(
      routeInfo.routePaths,
      routeInfo.routeParents,
      routeInfo.routeObjects,
      this.routeBindings,
      this.basePath,
    );
    this.#routeObjects = routeInfo.routeObjects;

    return routeInfo;
  }

  getRouteObjects() {
    return this.#routeObjects;
  }
}

/**
 * Synchronous version of {@link createApp}, expecting all features and
 * config to have been loaded already.
 *
 * @public
 */
export function createSpecializedApp(options?: {
  features?: FrontendFeature[];
  config?: ConfigApi;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
}): { createRoot(): JSX.Element } {
  const {
    features: duplicatedFeatures = [],
    config = new ConfigReader({}, 'empty-config'),
  } = options ?? {};

  const features = deduplicateFeatures(duplicatedFeatures);

  const tree = resolveAppTree(
    'root',
    resolveAppNodeSpecs({
      features,
      builtinExtensions: [resolveExtensionDefinition(Root)],
      parameters: readAppExtensionsConfig(config),
      forbidden: new Set(['root']),
    }),
  );

  const factories = createApiFactories({ tree });
  const appTreeApi = new AppTreeApiProxy(tree);
  const routeResolutionApi = new RouteResolutionApiProxy(
    tree,
    resolveRouteBindings(
      options?.bindRoutes,
      config,
      collectRouteIds(features),
    ),
    getBasePath(config),
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

  // Now instantiate the entire tree, which will skip anything that's already been instantiated
  instantiateAppNodeTree(tree.root, apiHolder);

  routeResolutionApi.initialize();
  appTreeApi.initialize();

  const featureFlagApi = apiHolder.get(featureFlagsApiRef);
  if (featureFlagApi) {
    for (const feature of features) {
      if (feature.$$type === '@backstage/BackstagePlugin') {
        toInternalBackstagePlugin(feature).featureFlags.forEach(flag =>
          featureFlagApi.registerFlag({
            name: flag.name,
            pluginId: feature.id,
          }),
        );
      }
      if (feature.$$type === '@backstage/ExtensionOverrides') {
        toInternalExtensionOverrides(feature).featureFlags.forEach(flag =>
          featureFlagApi.registerFlag({ name: flag.name, pluginId: '' }),
        );
      }
    }
  }

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

  for (const factory of options.factories) {
    factoryRegistry.register('default', factory);
  }

  for (const factory of options.staticFactories) {
    factoryRegistry.register('static', factory);
  }

  ApiResolver.validateFactories(factoryRegistry, factoryRegistry.getAllApis());

  return new ApiResolver(factoryRegistry);
}
