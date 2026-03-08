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
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  AnyApiFactory,
  ApiHolder,
  ConfigApi,
  configApiRef,
  featureFlagsApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { ApiFactoryRegistry, ApiResolver } from '@backstage/core-app-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiProvider } from '../../../core-app-api/src';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../../core-app-api/src/app/AppThemeProvider';
import {
  createExtensionDataContainer,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
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
import { instantiateAppNodeTree } from '../tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiRegistry } from '../../../core-app-api/src/apis/system/ApiRegistry';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
import { BackstageRouteObject } from '../routing/types';
import { BrowserRouter, matchRoutes } from 'react-router-dom';
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
 * Result of {@link prepareSpecializedApp}.
 *
 * @public
 */
export type PreparedSpecializedApp = {
  signIn?: {
    element: JSX.Element;
    identity: Promise<IdentityApi>;
  };
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

  const tree = resolveAppTree(
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

  const factories = createApiFactories({ tree, collector });
  const appBasePath = getBasePath(config);
  const appTreeApi = new AppTreeApiProxy(tree, appBasePath);

  const routeRefsById = collectRouteIds(features, collector);
  const routeResolutionApi = new RouteResolutionApiProxy(
    resolveRouteBindings(options?.bindRoutes, config, routeRefsById, collector),
    appBasePath,
  );

  const appIdentityProxy = new AppIdentityProxy();
  const providedApis = options?.apis ?? options?.advanced?.apis;
  const createPreparedApis = () =>
    providedApis ??
    createApiHolder({
      factories,
      staticFactories: [
        createApiFactory(appTreeApiRef, appTreeApi),
        createApiFactory(configApiRef, config),
        createApiFactory(routeResolutionApiRef, routeResolutionApi),
        createApiFactory(identityApiRef, appIdentityProxy),
        ...(internalOptions?.__internal?.apiFactoryOverrides ?? []),
      ],
    });

  const mergedExtensionFactoryMiddleware = mergeExtensionFactoryMiddleware(
    options?.advanced?.extensionFactoryMiddleware,
  );
  const preparedApis = createPreparedApis();
  registerFeatureFlags(preparedApis, features);

  let capturedIdentityApi: IdentityApi | undefined;
  let resolveIdentity: (identityApi: IdentityApi) => void = () => {};
  const identity = new Promise<IdentityApi>(resolve => {
    resolveIdentity = resolve;
  });

  const signInPageComponent = extractSignInPageComponent({
    tree,
    apis: preparedApis,
    collector,
    extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
  });
  const SignInPageComponent = signInPageComponent;
  const signIn =
    SignInPageComponent &&
    ({
      element: (
        <ApiProvider apis={preparedApis}>
          <AppThemeProvider>
            <BrowserRouter
              basename={appBasePath}
              future={{
                v7_relativeSplatPath: false,
                v7_startTransition: false,
              }}
            >
              <SignInPageComponent
                onSignInSuccess={identityApi => {
                  capturedIdentityApi = identityApi;
                  resolveIdentity(identityApi);
                }}
              />
            </BrowserRouter>
          </AppThemeProvider>
        </ApiProvider>
      ),
      identity,
    } satisfies PreparedSpecializedApp['signIn']);

  let finalized:
    | { apis: ApiHolder; tree: AppTree; errors?: AppError[] }
    | undefined;
  return {
    signIn,
    finalize() {
      if (finalized) {
        return finalized;
      }

      if (capturedIdentityApi) {
        setIdentityApiTarget({
          apis: preparedApis,
          identityApi: capturedIdentityApi,
          signOutTargetUrl: appBasePath || '/',
        });
        removeSignInPageAttachment(tree);
      }

      const apis = preparedApis;

      // Now instantiate the entire tree, which will skip anything that's already been instantiated
      instantiateAppNodeTree(
        tree.root,
        apis,
        collector,
        mergedExtensionFactoryMiddleware,
      );

      const routeInfo = extractRouteInfoFromAppNode(
        tree.root,
        createRouteAliasResolver(routeRefsById),
      );

      routeResolutionApi.initialize(routeInfo, routeRefsById.routes);
      appTreeApi.initialize(routeInfo);

      finalized = { apis, tree, errors: collector.collectErrors() };
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

function registerFeatureFlags(apis: ApiHolder, features: FrontendFeature[]) {
  const featureFlagApi = apis.get(featureFlagsApiRef);
  if (!featureFlagApi) {
    return;
  }

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

function removeSignInPageAttachment(tree: AppTree) {
  const appRootNode = tree.nodes.get('app/root');
  if (!appRootNode) {
    return;
  }
  (appRootNode.edges.attachments as Map<string, AppNode[]>).delete(
    'signInPage',
  );
}

function createApiFactories(options: {
  tree: AppTree;
  collector: ErrorCollector;
}): AnyApiFactory[] {
  const emptyApiHolder = ApiRegistry.from([]);
  const factoriesById = new Map<
    string,
    { pluginId: string; factory: AnyApiFactory }
  >();

  for (const apiNode of options.tree.root.edges.attachments.get('apis') ?? []) {
    if (!instantiateAppNodeTree(apiNode, emptyApiHolder, options.collector)) {
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
            factory: apiFactory,
          });
        }
        continue;
      }

      factoriesById.set(apiRefId, { pluginId, factory: apiFactory });
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

  return Array.from(factoriesById.values(), entry => entry.factory);
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
