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

import { ConfigReader } from '@backstage/config';
import {
  ApiBlueprint,
  AppTree,
  AppTreeApi,
  appTreeApiRef,
  RouteRef,
  ExternalRouteRef,
  SubRouteRef,
  AnyRouteRefParams,
  RouteFunc,
  RouteResolutionApi,
  createApiFactory,
  routeResolutionApiRef,
  AppNode,
  ExtensionFactoryMiddleware,
  FrontendFeature,
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
import {
  createExtensionDataContainer,
  OpaqueFrontendPlugin,
} from '@internal/frontend';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  resolveExtensionDefinition,
  toInternalExtension,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

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
import { RouteInfo } from './types';
import { matchRoutes } from 'react-router-dom';
import {
  createPluginInfoAttacher,
  FrontendPluginInfoResolver,
} from './createPluginInfoAttacher';
import { createRouteAliasResolver } from '../routing/RouteAliasResolver';

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

  getNodesByRoutePath(routePath: string): { nodes: AppNode[] } {
    this.checkIfInitialized();

    let path = routePath;
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
    options?: { sourcePath?: string },
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
      routeInfo.routeAliasResolver,
    );
    this.#routeObjects = routeInfo.routeObjects;

    return routeInfo;
  }

  getRouteObjects() {
    return this.#routeObjects;
  }
}

/**
 * Options for {@link createSpecializedApp}.
 *
 * @public
 */
export type CreateSpecializedAppOptions = {
  /**
   * The list of features to load.
   */
  features?: FrontendFeature[];

  /**
   * The config API implementation to use. For most normal apps, this should be
   * specified.
   *
   * If none is given, a new _empty_ config will be used during startup. In
   * later stages of the app lifecycle, the config API in the API holder will be
   * used.
   */
  config?: ConfigApi;

  /**
   * Allows for the binding of plugins' external route refs within the app.
   */
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;

  /**
   * Advanced, more rarely used options.
   */
  advanced?: {
    /**
     * A replacement API holder implementation to use.
     *
     * By default, a new API holder will be constructed automatically based on
     * the other inputs. If you pass in a custom one here, none of that
     * automation will take place - so you will have to take care to supply all
     * those APIs yourself.
     */
    apis?: ApiHolder;

    /**
     * If set to true, the system will silently accept and move on if
     * encountering config for extensions that do not exist. The default is to
     * reject such config to help catch simple mistakes.
     *
     * This flag can be useful in some scenarios where you have a dynamic set of
     * extensions enabled at different times, but also increases the risk of
     * accidentally missing e.g. simple typos in your config.
     */
    allowUnknownExtensionConfig?: boolean;

    /**
     * Applies one or more middleware on every extension, as they are added to
     * the application.
     *
     * This is an advanced use case for modifying extension data on the fly as
     * it gets emitted by extensions being instantiated.
     */
    extensionFactoryMiddleware?:
      | ExtensionFactoryMiddleware
      | ExtensionFactoryMiddleware[];

    /**
     * Allows for customizing how plugin info is retrieved.
     */
    pluginInfoResolver?: FrontendPluginInfoResolver;
  };
};

/**
 * Creates an empty app without any default features. This is a low-level API is
 * intended for use in tests or specialized setups. Typically you want to use
 * `createApp` from `@backstage/frontend-defaults` instead.
 *
 * @public
 */
export function createSpecializedApp(options?: CreateSpecializedAppOptions): {
  apis: ApiHolder;
  tree: AppTree;
} {
  const config = options?.config ?? new ConfigReader({}, 'empty-config');
  const features = deduplicateFeatures(options?.features ?? []).map(
    createPluginInfoAttacher(config, options?.advanced?.pluginInfoResolver),
  );

  const tree = resolveAppTree(
    'root',
    resolveAppNodeSpecs({
      features,
      builtinExtensions: [
        resolveExtensionDefinition(Root, { namespace: 'root' }),
      ],
      parameters: readAppExtensionsConfig(config),
      forbidden: new Set(['root']),
      allowUnknownExtensionConfig:
        options?.advanced?.allowUnknownExtensionConfig,
    }),
  );

  const factories = createApiFactories({ tree });
  const appBasePath = getBasePath(config);
  const appTreeApi = new AppTreeApiProxy(tree, appBasePath);

  const routeRefsById = collectRouteIds(features);
  const routeResolutionApi = new RouteResolutionApiProxy(
    resolveRouteBindings(options?.bindRoutes, config, routeRefsById),
    appBasePath,
  );

  const appIdentityProxy = new AppIdentityProxy();
  const apis =
    options?.advanced?.apis ??
    createApiHolder({
      factories,
      staticFactories: [
        createApiFactory(appTreeApiRef, appTreeApi),
        createApiFactory(configApiRef, config),
        createApiFactory(routeResolutionApiRef, routeResolutionApi),
        createApiFactory(identityApiRef, appIdentityProxy),
      ],
    });

  const featureFlagApi = apis.get(featureFlagsApiRef);
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
  instantiateAppNodeTree(
    tree.root,
    apis,
    mergeExtensionFactoryMiddleware(
      options?.advanced?.extensionFactoryMiddleware,
    ),
  );

  const routeInfo = extractRouteInfoFromAppNode(
    tree.root,
    createRouteAliasResolver(routeRefsById),
  );

  routeResolutionApi.initialize(routeInfo);
  appTreeApi.initialize(routeInfo);

  return { apis, tree };
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

function mergeExtensionFactoryMiddleware(
  middlewares?: ExtensionFactoryMiddleware | ExtensionFactoryMiddleware[],
): ExtensionFactoryMiddleware | undefined {
  if (!middlewares) {
    return undefined;
  }
  if (!Array.isArray(middlewares)) {
    return middlewares;
  }
  if (middlewares.length <= 1) {
    return middlewares[0];
  }
  return middlewares.reduce((prev, next) => {
    if (!prev || !next) {
      return prev ?? next;
    }
    return (orig, ctx) => {
      const internalExt = toInternalExtension(ctx.node.spec.extension);
      if (internalExt.version !== 'v2') {
        return orig();
      }
      return next(ctxOverrides => {
        return createExtensionDataContainer(
          prev(orig, {
            node: ctx.node,
            apis: ctx.apis,
            config: ctxOverrides?.config ?? ctx.config,
          }),
          'extension factory middleware',
        );
      }, ctx);
    };
  });
}
