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
  appHistoryApiRef,
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
import { matchRouteRefs } from '../routing/matchRouteRefs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { createRouteAliasResolver } from '../routing/RouteAliasResolver';
import { createAppHistory, type AppHistory } from '../routing/AppHistory';
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

    const matchedRoutes = matchRouteRefs(routeInfo.routeObjects, path);

    const matchedAppNodes =
      matchedRoutes?.flatMap(routeObj => {
        const appNode = routeObj.routeObject.appNode;
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

  // Avoid constructing a window-history AppHistory (and attaching popstate)
  // when the API is already supplied elsewhere: by a static factory (tests), or
  // by an `ApiBlueprint` extension in the app itself — which is how an app owner
  // supplies a hash, memory or host-owned history.
  //
  // Not registering the default is what lets an app-supplied factory through.
  // The phase registry below is the *primary* one, so anything registered here
  // shadows the app's own registry; that is what protects the framework-owned
  // proxies from being replaced by a plugin, but app history is a default rather
  // than a proxy. Registering it unconditionally would silently outrank the
  // app's factory and still attach a `popstate` listener fighting it.
  //
  // The one supplier this question cannot see is a predicate-gated one. An API
  // extension with an `if` anywhere in its subtree is deferred to finalization
  // (`classifyBootstrapTree`), so its root is not in `appApiRegistry` yet and
  // the answer here is `undefined` however the predicate would have evaluated.
  // Resolving it now is not possible — predicate context does not exist during
  // preparation — so the gap is not closed here but refused below: the default
  // registers as usual and then declines to answer if a competitor turns up.
  const hasNavigationOverride =
    options.staticFactories.some(
      factory => factory.api.id === appHistoryApiRef.id,
    ) || Boolean(options.appApiRegistry.get(appHistoryApiRef));

  // The app registry can only gain an `appHistoryApiRef` factory after this
  // point, and only from a predicate-gated API root that `hasNavigationOverride`
  // was unable to see. The default sits in the primary registry and would win
  // that race without making a sound, leaving the app running on a window
  // history nobody asked for, so it stops instead of winning.
  function assertNoDeferredNavigationOverride() {
    if (!options.appApiRegistry.get(appHistoryApiRef)) {
      return;
    }
    throw new Error(
      [
        `The '${appHistoryApiRef.id}' API is supplied by an extension that is gated behind an 'if' predicate, which is not supported.`,
        `Predicate-gated extensions are only resolved once predicate context exists, which is after the app has been prepared, and the app history has to be decided during preparation.`,
        `The built-in window history was therefore registered as the app default, and it outranks the extension's factory.`,
        `Remove the 'if' from the extension that provides '${appHistoryApiRef.id}' and from every extension attached below it, or supply the history another way, such as an app-level API factory override.`,
      ].join(' '),
    );
  }

  // Creating an AppHistory attaches a popstate listener that lives until it is
  // disposed, so the instance is kept here and released through the returned
  // dispose(). An overridden API is owned by whoever supplied the factory.
  let appHistory: AppHistory | undefined;
  let disposed = false;
  function getOrCreateAppHistory(): AppHistory {
    if (!appHistory) {
      appHistory = createAppHistory({
        basename: options.appBasePath || undefined,
      });
      // Only reachable through the deferred factory below. Handing back a live
      // history after teardown would attach a listener with no handle left to
      // release it, so it is created dead instead.
      if (disposed) {
        appHistory.dispose();
      }
    }
    return appHistory;
  }

  // Register the default up front, but acquire history only when requested.
  // The primary registry outranks fallbackApis, so consult a reused session's
  // holder before constructing a history owned by this app.
  function createAppHistoryFactory(): AnyApiFactory | undefined {
    if (hasNavigationOverride) {
      return undefined;
    }
    return createApiFactory({
      api: appHistoryApiRef,
      deps: {},
      factory: () => {
        assertNoDeferredNavigationOverride();
        return (
          options.fallbackApis?.get(appHistoryApiRef) ?? getOrCreateAppHistory()
        );
      },
    });
  }
  const appHistoryFactory = createAppHistoryFactory();

  phaseApiRegistry.registerAll([
    createApiFactory(appTreeApiRef, appTreeApi),
    ...(options.includeConfigApi
      ? [createApiFactory(configApiRef, options.config)]
      : []),
    createApiFactory(routeResolutionApiRef, routeResolutionApi),
    createApiFactory(identityApiRef, identityProxy),
    ...options.staticFactories,
    ...(appHistoryFactory ? [appHistoryFactory] : []),
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
    /**
     * Releases the resources owned by these phase APIs. Safe to call more than
     * once, and a no-op when the app history API was overridden or supplied by
     * a reused session.
     */
    dispose() {
      disposed = true;
      appHistory?.dispose();
    },
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
