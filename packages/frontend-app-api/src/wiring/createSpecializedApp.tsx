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
  AnyApiFactory,
  ApiHolder,
  AppTree,
  AppTreeApi,
  appTreeApiRef,
  ConfigApi,
  configApiRef,
  coreExtensionData,
  RouteRef,
  ExternalRouteRef,
  SubRouteRef,
  AnyRouteRefParams,
  RouteFunc,
  RouteResolutionApi,
  createApiFactory,
  routeResolutionApiRef,
  AppNode,
  AppNodeInstance,
  ExtensionFactoryMiddleware,
  ExtensionDataRef,
  featureFlagsApiRef,
  FrontendFeature,
  IdentityApi,
  identityApiRef,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionDataContainer,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { createDeferred, type DeferredPromise } from '@backstage/types';
import { ComponentType, JSX, ReactNode } from 'react';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  resolveExtensionDefinition,
  toInternalExtension,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

import {
  extractRouteInfoFromAppNode,
  RouteInfo,
} from '../routing/extractRouteInfoFromAppNode';

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
import {
  createAppNodeInstance,
  instantiateAppNodeTree,
} from '../tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { BackstageRouteObject } from '../routing/types';
import { matchRoutes } from 'react-router-dom';
import {
  createPluginInfoAttacher,
  FrontendPluginInfoResolver,
} from './createPluginInfoAttacher';
import { createRouteAliasResolver } from '../routing/RouteAliasResolver';
import {
  AppError,
  createErrorCollector,
  ErrorCollector,
} from './createErrorCollector';
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from './FrontendApiRegistry';

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

type SignInPageProps = {
  onSignInSuccess(identityApi: IdentityApi): void;
  children?: ReactNode;
};

type SignInRuntime = {
  value: NonNullable<ReturnType<PreparedSpecializedApp['getSignIn']>>;
  completionDeferred: DeferredPromise<void, unknown>;
  completion?: Promise<void>;
  error?: unknown;
  readyIdentityApi?: IdentityApi;
};

const signInPageComponentDataRef = createExtensionDataRef<
  ComponentType<SignInPageProps>
>().with({ id: 'core.sign-in-page.component' });

// Helps delay callers from reaching out to the API before the app tree has been materialized
class AppTreeApiProxy implements AppTreeApi {
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

/**
 * Options for {@link createSpecializedApp}.
 *
 * @public
 */
export type CreateSpecializedAppOptions = {
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
     * @deprecated Use {@link CreateSpecializedAppOptions.apis} instead.
     *
     * By default, a new API holder will be constructed automatically based on
     * the other inputs. If you pass in a custom one here, none of that
     * automation will take place - so you will have to take care to supply all
     * those APIs yourself.
     */
    apis?: ApiHolder;

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
 * Result of {@link prepareSpecializedApp}.
 *
 * @public
 */
export type PreparedSpecializedApp = {
  getSignIn():
    | {
        element: JSX.Element;
        complete: Promise<void>;
      }
    | undefined;
  finalize(): {
    apis: ApiHolder;
    tree: AppTree;
    errors?: AppError[];
  };
};

// Internal options type, not exported in the public API
export interface CreateSpecializedAppInternalOptions
  extends CreateSpecializedAppOptions {
  __internal?: {
    apiFactoryOverrides?: AnyApiFactory[];
  };
}

/**
 * Prepares an app without instantiating the full extension tree.
 *
 * @remarks
 *
 * This is useful for split sign-in flows where the sign-in page should be
 * rendered first, and the full app finalized once an identity has been
 * captured.
 *
 * @public
 */
export function prepareSpecializedApp(
  options?: CreateSpecializedAppOptions,
): PreparedSpecializedApp {
  const internalOptions = options as CreateSpecializedAppInternalOptions;
  const config = options?.config ?? new ConfigReader({}, 'empty-config');
  const features = deduplicateFeatures(options?.features ?? []).map(
    createPluginInfoAttacher(config, options?.advanced?.pluginInfoResolver),
  );

  const collector = createErrorCollector();

  const baseTree = resolveAppTree(
    'root',
    resolveAppNodeSpecs({
      features,
      builtinExtensions: [
        resolveExtensionDefinition(Root, { namespace: 'root' }),
      ],
      parameters: readAppExtensionsConfig(config),
      forbidden: new Set(['root']),
      collector,
    }),
    collector,
  );

  const appBasePath = getBasePath(config);
  const routeRefsById = collectRouteIds(features, collector);
  const routeBindings = resolveRouteBindings(
    options?.bindRoutes,
    config,
    routeRefsById,
    collector,
  );

  const mergedExtensionFactoryMiddleware = mergeExtensionFactoryMiddleware(
    options?.advanced?.extensionFactoryMiddleware,
  );
  const providedApis = options?.apis ?? options?.advanced?.apis;
  const appApiRegistry = new FrontendApiRegistry();
  const internalStaticFactories =
    internalOptions?.__internal?.apiFactoryOverrides ?? [];
  const phaseStaticFactories = [...internalStaticFactories];
  const deferredApiFactories: AnyApiFactory[] = [];

  if (providedApis) {
    registerFeatureFlagDeclarationsInHolder(providedApis, features);
  } else {
    const apiFactoryEntries = collectApiFactoryEntries({
      tree: baseTree,
      collector,
    });
    const classifiedApiFactories = classifyApiFactories({
      entries: apiFactoryEntries,
      features,
    });
    appApiRegistry.registerAll(classifiedApiFactories.prepareApiFactories);
    deferredApiFactories.push(...classifiedApiFactories.deferredApiFactories);
  }

  let signInRuntime: SignInRuntime | null | undefined;
  let deferredApiFactoriesRegistered = false;

  function startSignInFinalize(
    runtime: SignInRuntime,
    identityApi: IdentityApi,
  ): Promise<void> {
    if (runtime.completion) {
      return runtime.completion;
    }

    runtime.completion = Promise.resolve()
      .then(async () => {
        void baseTree;
        void identityApi;

        // Future: build the post-sign-in predicate context here using the
        // captured identity together with feature flags and permission APIs.
        // finalize() should then use that context when constructing the final
        // tree and deciding which APIs and extensions are available.

        runtime.readyIdentityApi = identityApi;
      })
      .catch(error => {
        runtime.error = error;
        throw error;
      });

    return runtime.completion;
  }

  let finalized:
    | { apis: ApiHolder; tree: AppTree; errors?: AppError[] }
    | undefined;
  return {
    getSignIn() {
      if (signInRuntime === null) {
        return undefined;
      }
      if (signInRuntime) {
        return signInRuntime.value;
      }

      const completionDeferred = createDeferred<void, unknown>();
      const signInElement = createSignInElement({
        baseTree,
        config,
        appApiRegistry,
        fallbackApis: providedApis,
        includeConfigApi: !providedApis,
        collector,
        appBasePath,
        routeBindings,
        routeRefsById,
        staticFactories: phaseStaticFactories,
        extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
        onSignInSuccess(identityApi) {
          void startSignInFinalize(signInRuntime!, identityApi)
            .then(() => {
              completionDeferred.resolve();
            })
            .catch(error => {
              completionDeferred.reject(error);
            });
        },
      });
      if (!signInElement) {
        signInRuntime = null;
        return undefined;
      }

      signInRuntime = {
        completionDeferred,
        value: {
          element: signInElement,
          complete: completionDeferred,
        },
      };

      return signInRuntime.value;
    },
    finalize() {
      if (finalized) {
        return finalized;
      }

      if (signInRuntime?.error) {
        throw signInRuntime.error;
      }

      if (signInRuntime && !signInRuntime.readyIdentityApi) {
        throw new Error(
          'prepareSpecializedApp requires awaiting signIn.complete before calling finalize()',
        );
      }

      if (!deferredApiFactoriesRegistered) {
        appApiRegistry.registerAll(deferredApiFactories);
        deferredApiFactoriesRegistered = true;
      }

      const finalApp = createFinalizedApp({
        baseTree,
        config,
        appApiRegistry,
        fallbackApis: providedApis,
        includeConfigApi: !providedApis,
        collector,
        appBasePath,
        routeBindings,
        routeRefsById,
        staticFactories: phaseStaticFactories,
        extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
        identityApi: signInRuntime?.readyIdentityApi,
      });

      finalized = {
        apis: finalApp.apis,
        tree: finalApp.tree,
        errors: collector.collectErrors(),
      };
      return finalized;
    },
  };
}

/**
 * Creates an empty app without any default features. This is a low-level API is
 * intended for use in tests or specialized setups. Typically you want to use
 * `createApp` from `@backstage/frontend-defaults` instead.
 *
 * @deprecated Use {@link prepareSpecializedApp} instead.
 *
 * @public
 */
export function createSpecializedApp(options?: CreateSpecializedAppOptions): {
  apis: ApiHolder;
  tree: AppTree;
  errors?: AppError[];
} {
  return prepareSpecializedApp(options).finalize();
}

function registerFeatureFlagDeclarations(
  featureFlagApi: typeof featureFlagsApiRef.T,
  features: FrontendFeature[],
) {
  for (const feature of features) {
    if (OpaqueFrontendPlugin.isType(feature)) {
      OpaqueFrontendPlugin.toInternal(feature).featureFlags.forEach(flag =>
        featureFlagApi.registerFlag({
          name: flag.name,
          description: flag.description,
          pluginId: feature.id,
        }),
      );
    }
    if (isInternalFrontendModule(feature)) {
      toInternalFrontendModule(feature).featureFlags.forEach(flag =>
        featureFlagApi.registerFlag({
          name: flag.name,
          description: flag.description,
          pluginId: feature.pluginId,
        }),
      );
    }
  }
}

function registerFeatureFlagDeclarationsInHolder(
  apis: ApiHolder,
  features: FrontendFeature[],
) {
  const featureFlagApi = apis.get(featureFlagsApiRef);
  if (featureFlagApi) {
    registerFeatureFlagDeclarations(featureFlagApi, features);
  }
}

function wrapFeatureFlagApiFactory(
  factory: AnyApiFactory,
  features: FrontendFeature[],
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
      registerFeatureFlagDeclarations(featureFlagApi, features);
      return featureFlagApi;
    },
  } as AnyApiFactory;
}

type ApiFactoryEntry = {
  node: AppNode;
  factory: AnyApiFactory;
};

function classifyApiFactories(options: {
  entries: ApiFactoryEntry[];
  features: FrontendFeature[];
}) {
  const prepareApiFactories = new Array<AnyApiFactory>();
  const deferredApiFactories = new Array<AnyApiFactory>();

  for (const entry of options.entries) {
    const wrappedFactory = wrapFeatureFlagApiFactory(
      entry.factory,
      options.features,
    );

    if (hasDeferredApiFactoryAttachments(entry.node)) {
      deferredApiFactories.push(wrappedFactory);
    } else {
      prepareApiFactories.push(wrappedFactory);
    }
  }

  return { prepareApiFactories, deferredApiFactories };
}

function hasDeferredApiFactoryAttachments(
  node: AppNode,
  visited = new Set<AppNode>(),
): boolean {
  if (visited.has(node)) {
    return false;
  }
  visited.add(node);

  // Future: once permissions / feature flag predicates are modeled in the app
  // tree, any predicate on the API node itself or its attachment subtree should
  // move the factory to the deferred phase instead of being registered during
  // sign-in.
  if (hasPhaseSensitivePredicate(node)) {
    return true;
  }

  for (const attachments of node.edges.attachments.values()) {
    for (const child of attachments) {
      if (hasDeferredApiFactoryAttachments(child, visited)) {
        return true;
      }
    }
  }

  return false;
}

function hasPhaseSensitivePredicate(node: AppNode): boolean {
  const spec = node.spec as AppNode['spec'] & {
    if?: unknown;
    enabled?: unknown;
    predicate?: unknown;
  };

  return (
    spec.if !== undefined ||
    spec.enabled !== undefined ||
    spec.predicate !== undefined
  );
}

function extractSignInPageComponent(options: {
  tree: AppTree;
  apis: ApiHolder;
  collector: ErrorCollector;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
}): ComponentType<SignInPageProps> | undefined {
  const appRootNode = options.tree.nodes.get('app/root');
  const signInPageNode = appRootNode?.edges.attachments.get('signInPage')?.[0];
  if (!signInPageNode) {
    return undefined;
  }

  instantiateAppNodeTree(
    signInPageNode,
    options.apis,
    options.collector,
    options.extensionFactoryMiddleware,
  );

  return signInPageNode.instance?.getData(signInPageComponentDataRef);
}

function createSignInElement(options: {
  baseTree: AppTree;
  config: ConfigApi;
  appApiRegistry: FrontendApiRegistry;
  fallbackApis?: ApiHolder;
  includeConfigApi: boolean;
  collector: ErrorCollector;
  appBasePath: string;
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  staticFactories: AnyApiFactory[];
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  onSignInSuccess(identityApi: IdentityApi): void;
}): JSX.Element | undefined {
  const tree = cloneAppTree(options.baseTree);
  const phase = createPhaseApis({
    tree,
    config: options.config,
    appApiRegistry: options.appApiRegistry,
    fallbackApis: options.fallbackApis,
    includeConfigApi: options.includeConfigApi,
    collector: options.collector,
    appBasePath: options.appBasePath,
    routeBindings: options.routeBindings,
    staticFactories: options.staticFactories,
  });

  const signInPageComponent = extractSignInPageComponent({
    tree,
    apis: phase.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
  });
  if (!signInPageComponent) {
    return undefined;
  }

  prepareSignInTree({
    tree,
    signInPageComponent,
    onSignInSuccess: options.onSignInSuccess,
  });

  instantiateAndInitializePhaseTree({
    tree,
    apis: phase.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
    routeResolutionApi: phase.routeResolutionApi,
    appTreeApi: phase.appTreeApi,
    routeRefsById: options.routeRefsById,
  });

  return tree.root.instance?.getData(coreExtensionData.reactElement);
}

function createFinalizedApp(options: {
  baseTree: AppTree;
  config: ConfigApi;
  appApiRegistry: FrontendApiRegistry;
  fallbackApis?: ApiHolder;
  includeConfigApi: boolean;
  collector: ErrorCollector;
  appBasePath: string;
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  staticFactories: AnyApiFactory[];
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  identityApi?: IdentityApi;
}) {
  const tree = cloneAppTree(options.baseTree);
  prepareFinalizedTree(tree);

  const phase = createPhaseApis({
    tree,
    config: options.config,
    appApiRegistry: options.appApiRegistry,
    fallbackApis: options.fallbackApis,
    includeConfigApi: options.includeConfigApi,
    collector: options.collector,
    appBasePath: options.appBasePath,
    routeBindings: options.routeBindings,
    staticFactories: options.staticFactories,
    identityApi: options.identityApi,
  });

  instantiateAndInitializePhaseTree({
    tree,
    apis: phase.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
    routeResolutionApi: phase.routeResolutionApi,
    appTreeApi: phase.appTreeApi,
    routeRefsById: options.routeRefsById,
  });

  return { apis: phase.apis, tree };
}

function createPhaseApis(options: {
  tree: AppTree;
  config: ConfigApi;
  appApiRegistry: FrontendApiRegistry;
  fallbackApis?: ApiHolder;
  includeConfigApi: boolean;
  collector: ErrorCollector;
  appBasePath: string;
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  staticFactories: AnyApiFactory[];
  identityApi?: IdentityApi;
}) {
  const appTreeApi = new AppTreeApiProxy(options.tree, options.appBasePath);
  const routeResolutionApi = new RouteResolutionApiProxy(
    options.routeBindings,
    options.appBasePath,
  );
  const identityProxy = new AppIdentityProxy();
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

  if (options.identityApi) {
    setIdentityApiTarget({
      apis,
      identityApi: options.identityApi,
      signOutTargetUrl: options.appBasePath || '/',
    });
  }

  return { apis, routeResolutionApi, appTreeApi };
}

function instantiateAndInitializePhaseTree(options: {
  tree: AppTree;
  apis: ApiHolder;
  collector: ErrorCollector;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  routeResolutionApi: RouteResolutionApiProxy;
  appTreeApi: AppTreeApiProxy;
  routeRefsById: ReturnType<typeof collectRouteIds>;
}) {
  instantiateAppNodeTree(
    options.tree.root,
    options.apis,
    options.collector,
    options.extensionFactoryMiddleware,
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

function prepareSignInTree(options: {
  tree: AppTree;
  signInPageComponent: ComponentType<SignInPageProps>;
  onSignInSuccess(identityApi: IdentityApi): void;
}) {
  const appRootNode = options.tree.nodes.get('app/root');
  if (!appRootNode) {
    return;
  }

  // Future: apply sign-in phase predicate filtering here before any wrappers,
  // elements, sign-in page APIs, or app-owned APIs are instantiated. APIs or
  // extensions gated by permissions or feature flags must be absent here.
  replaceAttachment(appRootNode, 'children', [
    createSyntheticNode({
      templateNode:
        appRootNode.edges.attachments.get('children')?.[0] ?? appRootNode,
      id: 'sign-in-fallback:prepared',
      instance: createSyntheticReactElementInstance(<div />),
    }),
  ]);
  replaceAttachment(appRootNode, 'signInPage', [
    createSyntheticNode({
      templateNode:
        appRootNode.edges.attachments.get('signInPage')?.[0] ?? appRootNode,
      id: 'sign-in-page:prepared',
      instance: createSyntheticDataRefInstance(
        signInPageComponentDataRef,
        (() => {
          const SignInPageComponent = options.signInPageComponent;
          return (props: SignInPageProps) => (
            <SignInPageComponent
              {...props}
              onSignInSuccess={identityApi => {
                options.onSignInSuccess(identityApi);
              }}
            />
          );
        })(),
      ),
    }),
  ]);
}

function prepareFinalizedTree(tree: AppTree) {
  const appRootNode = tree.nodes.get('app/root');
  if (!appRootNode) {
    return;
  }

  // Future: once post-sign-in predicate context has been evaluated, apply the
  // final feature-flag and permission filtering here before collecting API
  // factories or instantiating the final tree.
  deleteAttachment(appRootNode, 'signInPage');
}

function createSyntheticReactElementInstance(element: JSX.Element) {
  return createSyntheticDataRefInstance(
    coreExtensionData.reactElement,
    element,
  );
}

function createSyntheticDataRefInstance<T>(
  ref: ExtensionDataRef<T>,
  value: T,
): AppNodeInstance {
  return {
    getDataRefs() {
      return [ref][Symbol.iterator]();
    },
    getData<TValue>(dataRef: ExtensionDataRef<TValue>) {
      if (dataRef.id !== ref.id) {
        return undefined;
      }
      return value as unknown as TValue;
    },
  };
}

function createSyntheticNode(options: {
  templateNode: AppNode;
  id: string;
  instance: NonNullable<ReturnType<typeof createAppNodeInstance>>;
}) {
  return createClonedAppNode(
    { ...options.templateNode.spec, id: options.id },
    options.instance,
  );
}

function setIdentityApiTarget(options: {
  apis: ApiHolder;
  identityApi: IdentityApi;
  signOutTargetUrl: string;
}) {
  const existingIdentityApi = options.apis.get(identityApiRef);
  if (!existingIdentityApi || !('setTarget' in existingIdentityApi)) {
    return;
  }

  (
    existingIdentityApi as IdentityApi & {
      setTarget(
        impl: IdentityApi & {
          getUserId?(): string;
          getIdToken?(): Promise<string | undefined>;
          getProfile?(): {
            displayName?: string;
            email?: string;
            picture?: string;
          };
        },
        targetOptions: { signOutTargetUrl: string },
      ): void;
    }
  ).setTarget(options.identityApi, {
    signOutTargetUrl: options.signOutTargetUrl,
  });
}

const EMPTY_API_HOLDER: ApiHolder = {
  get() {
    return undefined;
  },
};

function collectApiFactoryEntries(options: {
  tree: AppTree;
  collector: ErrorCollector;
}): ApiFactoryEntry[] {
  const factoriesById = new Map<
    string,
    { pluginId: string; node: AppNode; factory: AnyApiFactory }
  >();

  for (const apiNode of options.tree.root.edges.attachments.get('apis') ?? []) {
    if (!instantiateAppNodeTree(apiNode, EMPTY_API_HOLDER, options.collector)) {
      continue;
    }
    const apiFactory = apiNode.instance?.getData(ApiBlueprint.dataRefs.factory);
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

  return Array.from(factoriesById.values(), entry => ({
    node: entry.node,
    factory: entry.factory,
  }));
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

function replaceAttachment(
  node: AppNode,
  input: string,
  attachment: AppNode[],
) {
  const attachments = node.edges.attachments as Map<string, AppNode[]>;
  attachments.set(input, attachment);

  for (const child of attachment) {
    (
      child.edges as {
        attachedTo?: { node: AppNode; input: string };
      }
    ).attachedTo = { node, input };
  }
}

function deleteAttachment(node: AppNode, input: string) {
  (node.edges.attachments as Map<string, AppNode[]>).delete(input);
}

function cloneAppTree(tree: AppTree): AppTree {
  const clonedNodes = new Map<AppNode, ClonedAppNode>();
  const cloneNode = (node: AppNode): ClonedAppNode => {
    const existing = clonedNodes.get(node);
    if (existing) {
      return existing;
    }

    const clonedNode = createClonedAppNode(node.spec);
    clonedNodes.set(node, clonedNode);

    const attachedTo = node.edges.attachedTo;
    if (attachedTo) {
      clonedNode.edges.attachedTo = {
        node: cloneNode(attachedTo.node),
        input: attachedTo.input,
      };
    }

    for (const [input, attachment] of node.edges.attachments) {
      clonedNode.edges.attachments.set(
        input,
        attachment.map(child => cloneNode(child)),
      );
    }

    return clonedNode;
  };

  for (const node of tree.nodes.values()) {
    cloneNode(node);
  }

  return {
    root: cloneNode(tree.root),
    nodes: new Map(
      Array.from(tree.nodes.entries(), ([id, node]) => [id, cloneNode(node)]),
    ),
    orphans: Array.from(tree.orphans, node => cloneNode(node)),
  };
}

function indent(str: string) {
  return str.replace(/^/gm, '  ');
}

class ClonedAppNode implements AppNode {
  public readonly spec: AppNode['spec'];
  public readonly edges = {
    attachedTo: undefined as { node: AppNode; input: string } | undefined,
    attachments: new Map<string, AppNode[]>(),
  };
  public instance?: AppNodeInstance;

  constructor(spec: AppNode['spec'], instance?: AppNodeInstance) {
    this.spec = spec;
    this.instance = instance;
  }

  toJSON() {
    const dataRefs = this.instance && [...this.instance.getDataRefs()];
    return {
      id: this.spec.id,
      output:
        dataRefs && dataRefs.length > 0
          ? dataRefs.map(ref => ref.id)
          : undefined,
      attachments:
        this.edges.attachments.size > 0
          ? Object.fromEntries(this.edges.attachments)
          : undefined,
    };
  }

  toString(): string {
    const dataRefs = this.instance && [...this.instance.getDataRefs()];
    const out =
      dataRefs && dataRefs.length > 0
        ? ` out=[${[...dataRefs].map(r => r.id).join(', ')}]`
        : '';

    if (this.edges.attachments.size === 0) {
      return `<${this.spec.id}${out} />`;
    }

    return [
      `<${this.spec.id}${out}>`,
      ...[...this.edges.attachments.entries()].map(([key, value]) =>
        indent(
          [`${key} [`, ...value.map(node => indent(node.toString())), `]`].join(
            '\n',
          ),
        ),
      ),
      `</${this.spec.id}>`,
    ].join('\n');
  }
}

function createClonedAppNode(
  spec: AppNode['spec'],
  instance?: AppNodeInstance,
) {
  return new ClonedAppNode(spec, instance);
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
