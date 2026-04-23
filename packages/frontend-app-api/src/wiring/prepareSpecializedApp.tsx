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
import { isError } from '@backstage/errors';
import {
  AnyApiFactory,
  ApiHolder,
  AppTree,
  ConfigApi,
  coreExtensionData,
  AppNode,
  ExtensionFactoryMiddleware,
  FrontendFeature,
  IdentityApi,
  identityApiRef,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionDataContainer,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { OpaqueType } from '@internal/opaque';
import { ComponentType, ReactNode } from 'react';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  resolveExtensionDefinition,
  toInternalExtension,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

import { CreateAppRouteBinder } from '../routing';
import { resolveRouteBindings } from '../routing/resolveRouteBindings';
import { collectRouteIds } from '../routing/collectRouteIds';
import { getBasePath } from '../routing/getBasePath';
import { Root } from '../extensions/Root';
import { resolveAppTree } from '../tree/resolveAppTree';
import { resolveAppNodeSpecs } from '../tree/resolveAppNodeSpecs';
import { readAppExtensionsConfig } from '../tree/readAppExtensionsConfig';
import {
  createPluginInfoAttacher,
  FrontendPluginInfoResolver,
} from './createPluginInfoAttacher';
import {
  AppError,
  createErrorCollector,
  ErrorCollector,
} from './createErrorCollector';
import {
  createPhaseApis,
  instantiateAndInitializePhaseTree,
  setIdentityApiTarget,
} from './phaseApis';
import {
  collectPredicateReferences,
  createPredicateContextLoader,
  EMPTY_PREDICATE_CONTEXT,
  type ExtensionPredicateContext,
} from './predicates';
import { FrontendApiRegistry } from './FrontendApiRegistry';
import {
  ApiFactoryEntry,
  collectApiFactoryEntries,
  registerFeatureFlagDeclarationsInHolder,
  syncFinalApiFactories,
  wrapFeatureFlagApiFactory,
} from './apiFactories';
import {
  attachThrowingFinalizationChild,
  BootstrapClassification,
  classifyBootstrapTree,
  clearFinalizationBoundaryInstances,
  createBootstrapApp,
  prepareFinalizedTree,
} from './treeLifecycle';

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

/**
 * Result of bootstrapping a prepared specialized app.
 *
 * @public
 */
export type BootstrapSpecializedApp = {
  apis: ApiHolder;
  element: JSX.Element;
  tree: AppTree;
};

/**
 * Result of finalizing a prepared specialized app.
 *
 * @public
 */
export type FinalizedSpecializedApp = {
  apis: ApiHolder;
  element: JSX.Element;
  sessionState: SpecializedAppSessionState;
  tree: AppTree;
  errors?: AppError[];
};

type SignInRuntime = {
  readyIdentityApi?: IdentityApi;
  requiresSignIn: boolean;
};

type FinalizationState = {
  started: boolean;
  promise: Promise<FinalizedSpecializedApp>;
  resolve(app: FinalizedSpecializedApp): void;
  reject(error: unknown): void;
};

type FinalizationMode = 'onFinalized' | 'finalize';

type InternalSpecializedAppSessionState = {
  apis: ApiHolder;
  identityApi?: IdentityApi;
  predicateContext: ExtensionPredicateContext;
};

/**
 * Opaque reusable session state for specialized apps.
 *
 * @public
 */
export type SpecializedAppSessionState = {
  $$type: '@backstage/SpecializedAppSessionState';
};

const OpaqueSpecializedAppSessionState = OpaqueType.create<{
  public: SpecializedAppSessionState;
  versions: InternalSpecializedAppSessionState & {
    version: 'v1';
  };
}>({
  type: '@backstage/SpecializedAppSessionState',
  versions: ['v1'],
});

const signInPageComponentDataRef = createExtensionDataRef<
  ComponentType<SignInPageProps>
>().with({ id: 'core.sign-in-page.component' });

/**
 * Options for {@link prepareSpecializedApp}.
 *
 * @public
 */
export type PrepareSpecializedAppOptions = {
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
     * A reusable specialized app session state to use.
     *
     * This can be obtained from either the app passed to
     * {@link PreparedSpecializedApp.onFinalized} or from
     * {@link PreparedSpecializedApp.finalize}, and reused in a future app
     * instance to skip sign-in and session preparation.
     */
    sessionState?: SpecializedAppSessionState;

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
  getBootstrapApp(): BootstrapSpecializedApp;
  onFinalized(callback: (app: FinalizedSpecializedApp) => void): () => void;
  finalize(): FinalizedSpecializedApp;
};

// Internal options type, not exported in the public API
export interface CreateSpecializedAppInternalOptions
  extends PrepareSpecializedAppOptions {
  __internal?: {
    apiFactoryOverrides?: AnyApiFactory[];
  };
}

export function createSessionStateFromApis(
  apis: ApiHolder,
): SpecializedAppSessionState {
  return OpaqueSpecializedAppSessionState.createInstance('v1', {
    apis,
    identityApi: apis.get(identityApiRef),
    predicateContext: EMPTY_PREDICATE_CONTEXT,
  });
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
  options?: PrepareSpecializedAppOptions,
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
  const providedSessionState = options?.advanced?.sessionState;
  const providedSessionData = providedSessionState
    ? OpaqueSpecializedAppSessionState.toInternal(providedSessionState)
    : undefined;
  const providedApis = providedSessionData?.apis;
  // Bootstrap only renders the parts of the tree that are known to be safe
  // before predicate context and sign-in have been resolved.
  const bootstrapClassification = classifyBootstrapTree({
    tree,
    collector,
  });
  const predicateReferences = collectPredicateReferences(tree.nodes.values());
  const appApiRegistry = new FrontendApiRegistry();
  const internalStaticFactories =
    internalOptions?.__internal?.apiFactoryOverrides ?? [];
  const phaseStaticFactories = [...internalStaticFactories];
  const bootstrapApiFactoryEntries = new Map<string, ApiFactoryEntry>();
  const bootstrapMissingApiAccesses = new Map<
    string,
    { node: AppNode; apiRefId: string }
  >();

  if (providedApis) {
    // Reused session state already carries a fully prepared API holder, so the
    // bootstrap path only needs to register feature flag declarations on top.
    registerFeatureFlagDeclarationsInHolder(providedApis, features, collector);
  } else {
    // Bootstrap materializes only the immediately visible API factories. Any
    // predicate-gated API roots are revisited during finalization.
    collectApiFactoryEntries({
      apiNodes: (tree.root.edges.attachments.get('apis') ?? []).filter(
        apiNode => !bootstrapClassification.deferredApiRoots.has(apiNode),
      ),
      collector,
      entries: bootstrapApiFactoryEntries,
    });
    const apiFactories = Array.from(
      bootstrapApiFactoryEntries.values(),
      entry => wrapFeatureFlagApiFactory(entry.factory, features, collector),
    );
    appApiRegistry.registerAll(apiFactories);
  }
  const phase = createPhaseApis({
    tree,
    config,
    appApiRegistry,
    fallbackApis: providedApis,
    includeConfigApi: !providedApis,
    appBasePath,
    routeBindings,
    staticFactories: phaseStaticFactories,
  });
  const predicateContextLoader = createPredicateContextLoader({
    apis: phase.apis,
    predicateReferences,
  });
  let signInRuntime: SignInRuntime | undefined;
  let finalized: FinalizedSpecializedApp | undefined;
  let bootstrapApp: BootstrapSpecializedApp | undefined;

  function updateIdentityApiTarget(identityApi?: IdentityApi) {
    if (!identityApi) {
      return;
    }

    setIdentityApiTarget({
      identityApiProxy: phase.identityApiProxy,
      identityApi,
      signOutTargetUrl: appBasePath || '/',
    });
  }

  function createSessionState(predicateContext: ExtensionPredicateContext) {
    const identityApi =
      signInRuntime?.readyIdentityApi ?? providedSessionData?.identityApi;
    // As soon as a real identity is available we swap the phase proxy over so
    // the finalized tree observes the same API instance.
    updateIdentityApiTarget(identityApi);
    const sessionState = OpaqueSpecializedAppSessionState.createInstance('v1', {
      apis: phase.apis,
      identityApi,
      predicateContext,
    });
    return sessionState;
  }

  function getSynchronousSessionState() {
    if (providedSessionState) {
      return providedSessionState;
    }
    // The direct finalize() path is intentionally synchronous. If sign-in is
    // still pending we refuse to guess and force the caller to wait.
    if (signInRuntime?.requiresSignIn) {
      return undefined;
    }

    const predicateContext = predicateContextLoader.getImmediate();
    if (!predicateContext) {
      return undefined;
    }

    return createSessionState(predicateContext);
  }

  function loadAsyncSessionState() {
    if (providedSessionState) {
      return Promise.resolve(providedSessionState);
    }
    if (signInRuntime?.requiresSignIn && !signInRuntime.readyIdentityApi) {
      return Promise.reject(
        new Error(
          'prepareSpecializedApp requires waiting for the bootstrap app to be ready before calling finalize()',
        ),
      );
    }

    // For apps without sign-in we can sometimes finalize immediately from the
    // already available predicate context, skipping the async loader.
    if (!signInRuntime?.requiresSignIn) {
      const immediateSessionState = getSynchronousSessionState();
      if (immediateSessionState) {
        return Promise.resolve(immediateSessionState);
      }
    }

    return predicateContextLoader.load().then(createSessionState);
  }

  function finalizeWithSessionState(
    finalizedSessionState: SpecializedAppSessionState,
  ) {
    return finalizeFromSessionState({
      finalized,
      finalizedSessionState,
      tree,
      collector,
      phase,
      extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
      routeRefsById,
      appBasePath,
      providedApis,
      features,
      appApiRegistry,
      bootstrapClassification,
      bootstrapApiFactoryEntries,
      bootstrapMissingApiAccesses,
    });
  }

  function finalizeWithBootstrapError(
    error: Error,
    finalizedSessionState?: SpecializedAppSessionState,
  ) {
    return finalizeFromBootstrapError({
      finalized,
      error,
      finalizedSessionState,
      tree,
      collector,
      phase,
      extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
      routeRefsById,
      signInRuntime,
      providedSessionData,
    });
  }

  const finalization = createFinalizationController({
    getFinalized() {
      return finalized;
    },
    setFinalized(finalizedApp) {
      finalized = finalizedApp;
    },
    finalizeFromSessionState: finalizeWithSessionState,
    finalizeFromBootstrapError: finalizeWithBootstrapError,
  });

  function getBootstrapApp() {
    if (bootstrapApp) {
      return bootstrapApp;
    }

    const runtime: SignInRuntime = {
      requiresSignIn: false,
    };
    if (!providedSessionState) {
      phase.identityApiProxy.setTargetHandlers({
        onTargetSet(identityApi) {
          runtime.readyIdentityApi = identityApi;
          // Sign-in completion only auto-starts finalization for onFinalized().
          // The direct finalize() path stays explicit and synchronous.
          if (finalization.getMode() === 'onFinalized') {
            finalization.start(loadAsyncSessionState);
          }
        },
      });
    }

    const result = createBootstrapApp({
      tree,
      apis: phase.apis,
      collector,
      routeRefsById,
      routeResolutionApi: phase.routeResolutionApi,
      appTreeApi: phase.appTreeApi,
      extensionFactoryMiddleware: mergedExtensionFactoryMiddleware,
      disableSignIn: Boolean(providedSessionState),
      skipBootstrapChild({ child }) {
        return bootstrapClassification.deferredRoots.has(child);
      },
      onMissingApi({ node, apiRefId }) {
        bootstrapMissingApiAccesses.set(`${node.spec.id}:${apiRefId}`, {
          node,
          apiRefId,
        });
      },
      hasSignInPage(signInPageNode) {
        return Boolean(
          signInPageNode?.instance?.getData(signInPageComponentDataRef),
        );
      },
    });
    if (!result.requiresSignIn) {
      phase.identityApiProxy.clearTargetHandlers();
    }

    runtime.requiresSignIn = result.requiresSignIn;
    signInRuntime = runtime;
    bootstrapApp = { ...result.bootstrapApp, apis: phase.apis };

    return bootstrapApp;
  }

  return {
    getBootstrapApp,
    onFinalized(callback) {
      finalization.selectMode('onFinalized');
      // Subscribing to finalization also ensures the bootstrap tree exists,
      // because sign-in may need to capture identity before finalization starts.
      getBootstrapApp();

      let subscribed = true;

      if (finalized) {
        const finalizedApp = finalized;
        Promise.resolve().then(() => {
          if (subscribed) {
            callback(finalizedApp);
          }
        });
        return () => {
          subscribed = false;
        };
      }

      // If sign-in is still in progress we wait for the shared promise created
      // by the sign-in callback. Otherwise we can start finalization right away.
      const finalizedAppPromise =
        signInRuntime?.requiresSignIn && !signInRuntime.readyIdentityApi
          ? finalization.getPromise()
          : finalization.start(loadAsyncSessionState);
      finalizedAppPromise
        .then(finalizedApp => {
          if (subscribed) {
            callback(finalizedApp);
          }
        })
        .catch(() => {});

      return () => {
        subscribed = false;
      };
    },
    finalize() {
      finalization.selectMode('finalize');
      if (finalized) {
        return finalized;
      }
      if (!providedSessionState) {
        // finalize() still depends on bootstrap classification and sign-in
        // discovery unless a reusable session was supplied up front, so we make
        // sure the bootstrap tree has been prepared first.
        getBootstrapApp();
      }

      // Direct finalization never waits for async session preparation. Callers
      // must either provide sessionState during prepareSpecializedApp() or
      // invoke finalize() only when the predicate context is already available
      // synchronously.
      const finalizedSessionState = signInRuntime?.requiresSignIn
        ? undefined
        : getSynchronousSessionState();
      if (!finalizedSessionState) {
        if (signInRuntime?.requiresSignIn) {
          throw new Error(
            'prepareSpecializedApp requires waiting for the bootstrap app to be ready before calling finalize()',
          );
        }
        throw new Error(
          'prepareSpecializedApp requires waiting for asynchronous finalization before calling finalize()',
        );
      }

      finalized = finalizeWithSessionState(finalizedSessionState);
      return finalized;
    },
  };
}

/**
 * Materializes the fully finalized app tree from a prepared session state.
 *
 * This is responsible for switching the identity proxy to the resolved target,
 * synchronizing any deferred API factories, and re-instantiating the parts of
 * the tree that are only valid once predicate context is available.
 */
function finalizeFromSessionState(options: {
  finalized?: FinalizedSpecializedApp;
  finalizedSessionState: SpecializedAppSessionState;
  tree: AppTree;
  collector: ErrorCollector;
  phase: ReturnType<typeof createPhaseApis>;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  appBasePath: string;
  providedApis?: ApiHolder;
  features: FrontendFeature[];
  appApiRegistry: FrontendApiRegistry;
  bootstrapClassification: BootstrapClassification;
  bootstrapApiFactoryEntries: Map<string, ApiFactoryEntry>;
  bootstrapMissingApiAccesses: Map<string, { node: AppNode; apiRefId: string }>;
}): FinalizedSpecializedApp {
  if (options.finalized) {
    return options.finalized;
  }

  const sessionStateData = OpaqueSpecializedAppSessionState.toInternal(
    options.finalizedSessionState,
  );
  if (sessionStateData.identityApi) {
    // Finalization retargets the identity proxy before any additional nodes are
    // instantiated so the full tree observes the captured identity immediately.
    setIdentityApiTarget({
      identityApiProxy: options.phase.identityApiProxy,
      identityApi: sessionStateData.identityApi,
      signOutTargetUrl: options.appBasePath || '/',
    });
  }
  if (!options.providedApis) {
    // Deferred API roots are synchronized at finalization time, but bootstrap-
    // materialized APIs stay frozen if they were already observed earlier.
    syncFinalApiFactories({
      deferredApiNodes: options.bootstrapClassification.deferredApiRoots,
      appApiRegistry: options.appApiRegistry,
      apiResolver: options.phase.apis,
      collector: options.collector,
      features: options.features,
      bootstrapApiFactoryEntries: options.bootstrapApiFactoryEntries,
      bootstrapMissingApiAccesses: options.bootstrapMissingApiAccesses,
      predicateContext: sessionStateData.predicateContext,
    });
  }

  prepareFinalizedTree({
    tree: options.tree,
  });
  // Finalization re-instantiates the boundary subtree so predicate-gated app
  // content can be re-evaluated without disturbing preserved bootstrap nodes.
  clearFinalizationBoundaryInstances(options.tree);
  instantiateAndInitializePhaseTree({
    tree: options.tree,
    apis: options.phase.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
    routeResolutionApi: options.phase.routeResolutionApi,
    appTreeApi: options.phase.appTreeApi,
    routeRefsById: options.routeRefsById,
    predicateContext: sessionStateData.predicateContext,
  });

  const element = options.tree.root.instance?.getData(
    coreExtensionData.reactElement,
  );
  if (!element) {
    throw new Error('Expected finalized app tree to expose a root element');
  }

  return {
    apis: options.phase.apis,
    element,
    sessionState: options.finalizedSessionState,
    tree: options.tree,
    errors: options.collector.collectErrors(),
  };
}

/**
 * Builds a finalized app that rethrows a bootstrap-time failure through the
 * normal app root boundary.
 *
 * This keeps the error handling path aligned with normal finalization while
 * preserving any session state that was already resolved before the failure.
 */
function finalizeFromBootstrapError(options: {
  finalized?: FinalizedSpecializedApp;
  error: Error;
  finalizedSessionState?: SpecializedAppSessionState;
  tree: AppTree;
  collector: ErrorCollector;
  phase: ReturnType<typeof createPhaseApis>;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  signInRuntime?: SignInRuntime;
  providedSessionData?: InternalSpecializedAppSessionState;
}): FinalizedSpecializedApp {
  if (options.finalized) {
    return options.finalized;
  }

  // If finalization fails after session state was already prepared, keep using
  // it so the error app reflects the same identity and API view.
  const finalizedSessionState =
    options.finalizedSessionState ??
    OpaqueSpecializedAppSessionState.createInstance('v1', {
      apis: options.phase.apis,
      identityApi:
        options.signInRuntime?.readyIdentityApi ??
        options.providedSessionData?.identityApi,
      predicateContext: EMPTY_PREDICATE_CONTEXT,
    });

  prepareFinalizedTree({
    tree: options.tree,
  });
  clearFinalizationBoundaryInstances(options.tree);
  // The final app reports bootstrap failures through app/root.children so the
  // normal app root boundary renders the error state for us.
  attachThrowingFinalizationChild(options.tree, options.error);
  instantiateAndInitializePhaseTree({
    tree: options.tree,
    apis: options.phase.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
    routeResolutionApi: options.phase.routeResolutionApi,
    appTreeApi: options.phase.appTreeApi,
    routeRefsById: options.routeRefsById,
  });

  const element = options.tree.root.instance?.getData(
    coreExtensionData.reactElement,
  );
  if (!element) {
    throw new Error('Expected finalized app tree to expose a root element');
  }

  return {
    apis: options.phase.apis,
    element,
    sessionState: finalizedSessionState,
    tree: options.tree,
  };
}

/**
 * Owns the callback-driven finalization lifecycle for a prepared app.
 *
 * The controller enforces the selected finalization mode, memoizes the shared
 * async finalization promise for `onFinalized()` subscribers, and funnels both
 * successful and failing async finalization through the same resolution path.
 */
function createFinalizationController(options: {
  getFinalized(): FinalizedSpecializedApp | undefined;
  setFinalized(finalizedApp: FinalizedSpecializedApp): void;
  finalizeFromSessionState(
    finalizedSessionState: SpecializedAppSessionState,
  ): FinalizedSpecializedApp;
  finalizeFromBootstrapError(
    error: Error,
    finalizedSessionState?: SpecializedAppSessionState,
  ): FinalizedSpecializedApp;
}) {
  let finalizationState: FinalizationState | undefined;
  let finalizationMode: FinalizationMode | undefined;

  function getState(): FinalizationState {
    if (finalizationState) {
      return finalizationState;
    }

    // onFinalized() subscribers all fan into the same promise so that the full
    // finalization flow only ever runs once.
    let resolve: ((app: FinalizedSpecializedApp) => void) | undefined;
    let reject: ((error: unknown) => void) | undefined;
    const promise = new Promise<FinalizedSpecializedApp>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    if (!resolve || !reject) {
      throw new Error('Failed to create finalization state');
    }

    finalizationState = {
      started: false,
      promise,
      resolve,
      reject,
    };
    return finalizationState;
  }

  return {
    getMode() {
      return finalizationMode;
    },
    getPromise() {
      return getState().promise;
    },
    selectMode(mode: FinalizationMode) {
      if (finalizationMode && finalizationMode !== mode) {
        throw new Error(
          `prepareSpecializedApp only supports using either onFinalized() or finalize(), not both`,
        );
      }

      // A prepared app now has one owner: either the callback-driven path or
      // the direct finalize() path, never both.
      finalizationMode = mode;
    },
    start(loader: () => Promise<SpecializedAppSessionState>) {
      const finalized = options.getFinalized();
      if (finalized) {
        return Promise.resolve(finalized);
      }

      const state = getState();
      if (state.started) {
        return state.promise;
      }
      state.started = true;

      // If loading finishes but final tree materialization fails, we still
      // want to preserve the resolved session state when building the error app.
      let finalizedSessionState: SpecializedAppSessionState | undefined;
      loader()
        .then(sessionState => {
          finalizedSessionState = sessionState;
          const finalizedApp = options.finalizeFromSessionState(sessionState);
          options.setFinalized(finalizedApp);
          state.resolve(finalizedApp);
        })
        .catch(error => {
          try {
            const bootstrapFailure = isError(error)
              ? error
              : new Error(String(error));
            const finalizedApp = options.finalizeFromBootstrapError(
              bootstrapFailure,
              finalizedSessionState,
            );
            options.setFinalized(finalizedApp);
            state.resolve(finalizedApp);
          } catch (finalizationError) {
            finalizationState = undefined;
            state.reject(finalizationError);
          }
        });

      return state.promise;
    },
  };
}

/**
 * Combines one or more extension factory middlewares into a single middleware
 * invocation chain that preserves Backstage's extension data container shape.
 */
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
