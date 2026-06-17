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
  AnyApiFactory,
  ApiHolder,
  AppTree,
  AppTreeApi,
  appTreeApiRef,
  ConfigApi,
  configApiRef,
  createApiFactory,
  ExternalRouteRef,
  identityApiRef,
  RouteFunc,
  RouteRef,
  RouteResolutionApi,
  routeResolutionApiRef,
  SubRouteRef,
  type AnyRouteRefParams,
  type AppNode,
  type ExtensionFactoryMiddleware,
  type IdentityApi,
} from '@backstage/frontend-plugin-api';
import { matchRoutes } from 'react-router-dom';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { createRouteAliasResolver } from '../routing/RouteAliasResolver';
import { RouteResolver } from '../routing/RouteResolver';
import { collectRouteIds } from '../routing/collectRouteIds';
import {
  extractRouteInfoFromAppNode,
  type RouteInfo,
} from '../routing/extractRouteInfoFromAppNode';
import { type BackstageRouteObject } from '../routing/types';
import { instantiateAppNodeTree } from '../tree/instantiateAppNodeTree';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';
import { type ExtensionPredicateContext } from './predicates';
import { type ErrorCollector } from './createErrorCollector';

// Helps delay callers from reaching out to the API before the app tree has been materialized
export class AppTreeApiProxy implements AppTreeApi {
  #routeInfo?: RouteInfo;
  private readonly tree: AppTree;
  private readonly appBasePath: string;

  constructor(tree: AppTree, appBasePath: string) {
    this.tree = tree;
    this.appBasePath = appBasePath;
  }

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
    const routeInfo = this.#routeInfo;
    if (!routeInfo) {
      throw new Error(
        `You can't access the AppTreeApi during initialization of the app tree. Please move occurrences of this out of the initialization of the factory`,
      );
    }

    let path = routePath;
    if (path.startsWith(this.appBasePath)) {
      path = path.slice(this.appBasePath.length);
    }

    const matchedRoutes = matchRoutes(routeInfo.routeObjects, path);

    const matchedAppNodes =
      matchedRoutes?.flatMap(routeObj => {
        const appNode = routeObj.route.appNode;
        return appNode ? [appNode] : [];
      }) || [];

    return { nodes: matchedAppNodes };
  }

  initialize(routeInfo: RouteInfo) {
    this.#routeInfo = routeInfo;
  }
}

// Helps delay callers from reaching out to the API before the app tree has been materialized
export class RouteResolutionApiProxy implements RouteResolutionApi {
  #delegate: RouteResolutionApi | undefined;
  #routeObjects: BackstageRouteObject[] | undefined;

  private readonly routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  private readonly appBasePath: string;

  constructor(
    routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>,
    appBasePath: string,
  ) {
    this.routeBindings = routeBindings;
    this.appBasePath = appBasePath;
  }

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

  initialize(
    routeInfo: RouteInfo,
    routeRefsById: Map<string, RouteRef | SubRouteRef>,
  ) {
    this.#delegate = new RouteResolver(
      routeInfo.routePaths,
      routeInfo.routeParents,
      routeInfo.routeObjects,
      this.routeBindings,
      this.appBasePath,
      routeInfo.routeAliasResolver,
      routeRefsById,
    );
    this.#routeObjects = routeInfo.routeObjects;

    return routeInfo;
  }

  getRouteObjects() {
    return this.#routeObjects;
  }
}

export class PreparedAppIdentityProxy extends AppIdentityProxy {
  #onTargetSet?:
    | ((identityApi: Parameters<AppIdentityProxy['setTarget']>[0]) => void)
    | undefined;

  setTargetHandlers(options: {
    onTargetSet?(
      identityApi: Parameters<AppIdentityProxy['setTarget']>[0],
    ): void;
  }) {
    this.#onTargetSet = options.onTargetSet;
  }

  clearTargetHandlers() {
    this.#onTargetSet = undefined;
  }

  override setTarget(
    identityApi: Parameters<AppIdentityProxy['setTarget']>[0],
    targetOptions: Parameters<AppIdentityProxy['setTarget']>[1],
  ) {
    super.setTarget(identityApi, targetOptions);

    const onTargetSet = this.#onTargetSet;
    if (!onTargetSet) {
      return;
    }

    this.clearTargetHandlers();
    onTargetSet(identityApi);
  }
}

export function createPhaseApis(options: {
  tree: AppTree;
  config: ConfigApi;
  appApiRegistry: FrontendApiRegistry;
  fallbackApis?: ApiHolder;
  includeConfigApi: boolean;
  appBasePath: string;
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  staticFactories: AnyApiFactory[];
}) {
  const appTreeApi = new AppTreeApiProxy(options.tree, options.appBasePath);
  const routeResolutionApi = new RouteResolutionApiProxy(
    options.routeBindings,
    options.appBasePath,
  );
  const identityProxy = new PreparedAppIdentityProxy();
  const phaseApiRegistry = new FrontendApiRegistry();
  phaseApiRegistry.registerAll([
    createApiFactory(appTreeApiRef, appTreeApi),
    ...(options.includeConfigApi
      ? [createApiFactory(configApiRef, options.config)]
      : []),
    createApiFactory(routeResolutionApiRef, routeResolutionApi),
    createApiFactory(identityApiRef, identityProxy),
    ...options.staticFactories,
  ]);

  const apis = new FrontendApiResolver({
    primaryRegistry: phaseApiRegistry,
    secondaryRegistry: options.appApiRegistry,
    fallbackApis: options.fallbackApis,
  });

  return {
    apis,
    routeResolutionApi,
    appTreeApi,
    identityApiProxy: identityProxy,
  };
}

export function instantiateAndInitializePhaseTree(options: {
  tree: AppTree;
  apis: ApiHolder;
  collector: ErrorCollector;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  routeResolutionApi: RouteResolutionApiProxy;
  appTreeApi: AppTreeApiProxy;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  skipChild?(ctx: { node: AppNode; input: string; child: AppNode }): boolean;
  onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
  predicateContext?: ExtensionPredicateContext;
  stopAtAttachment?(ctx: { node: AppNode; input: string }): boolean;
}) {
  instantiateAppNodeTree(
    options.tree.root,
    options.apis,
    options.collector,
    options.extensionFactoryMiddleware,
    {
      ...(options.stopAtAttachment
        ? { stopAtAttachment: options.stopAtAttachment }
        : {}),
      skipChild: options.skipChild,
      onMissingApi: options.onMissingApi,
      predicateContext: options.predicateContext,
    },
  );

  const routeInfo = extractRouteInfoFromAppNode(
    options.tree.root,
    createRouteAliasResolver(options.routeRefsById),
  );

  options.routeResolutionApi.initialize(
    routeInfo,
    options.routeRefsById.routes,
  );
  options.appTreeApi.initialize(routeInfo);
}

export function setIdentityApiTarget(options: {
  identityApiProxy: AppIdentityProxy;
  identityApi: IdentityApi;
  signOutTargetUrl: string;
}) {
  options.identityApiProxy.setTarget(options.identityApi, {
    signOutTargetUrl: options.signOutTargetUrl,
  });
}
