/*
 * Copyright 2020 The Backstage Authors
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

import { Config } from '@backstage/config';
import React, {
  ComponentType,
  PropsWithChildren,
  Suspense,
  useMemo,
  useRef,
} from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  ApiProvider,
  AppThemeSelector,
  ConfigReader,
  LocalStorageFeatureFlags,
} from '../apis';
import {
  AnyApiFactory,
  ApiHolder,
  IconComponent,
  AppTheme,
  appThemeApiRef,
  configApiRef,
  AppThemeApi,
  ConfigApi,
  featureFlagsApiRef,
  identityApiRef,
  BackstagePlugin,
  FeatureFlag,
  fetchApiRef,
  discoveryApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import {
  AppLanguageApi,
  appLanguageApiRef,
  translationApiRef,
  TranslationMessages,
  TranslationResource,
} from '@backstage/core-plugin-api/alpha';
import { ApiFactoryRegistry, ApiResolver } from '../apis/system';
import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
} from '../extensions/traversal';
import { pluginCollector } from '../plugins/collectors';
import {
  featureFlagCollector,
  routingV1Collector,
  routingV2Collector,
} from '../routing/collectors';
import { RoutingProvider } from '../routing/RoutingProvider';
import {
  validateRouteParameters,
  validateRouteBindings,
} from '../routing/validation';
import { AppContextProvider } from './AppContext';
import { AppIdentityProxy } from '../apis/implementations/IdentityApi/AppIdentityProxy';
import {
  AppComponents,
  AppConfigLoader,
  AppContext,
  AppOptions,
  BackstageApp,
} from './types';
import { AppThemeProvider } from './AppThemeProvider';
import { defaultConfigLoader } from './defaultConfigLoader';
import { ApiRegistry } from '../apis/system/ApiRegistry';
import { resolveRouteBindings } from './resolveRouteBindings';
import { isReactRouterBeta } from './isReactRouterBeta';
import { InternalAppContext } from './InternalAppContext';
import { AppRouter, getBasePath } from './AppRouter';
import { AppLanguageSelector } from '../apis/implementations/AppLanguageApi';
import { I18nextTranslationApi } from '../apis/implementations/TranslationApi';
import { overrideBaseUrlConfigs } from './overrideBaseUrlConfigs';
import { isProtectedApp } from './isProtectedApp';

type CompatiblePlugin =
  | BackstagePlugin
  | (Omit<BackstagePlugin, 'getFeatureFlags'> & {
      output(): Array<{ type: 'feature-flag'; name: string }>;
    });

function useConfigLoader(
  configLoader: AppConfigLoader | undefined,
  components: AppComponents,
  appThemeApi: AppThemeApi,
): { api: ConfigApi } | { node: JSX.Element } {
  // Keeping this synchronous when a config loader isn't set simplifies tests a lot
  const hasConfig = Boolean(configLoader);
  const config = useAsync(configLoader || (() => Promise.resolve([])));

  let noConfigNode = undefined;

  if (hasConfig && config.loading) {
    const { Progress } = components;
    noConfigNode = <Progress />;
  } else if (config.error) {
    const { BootErrorPage } = components;
    noConfigNode = <BootErrorPage step="load-config" error={config.error} />;
  }

  const { ThemeProvider = AppThemeProvider } = components;

  // Before the config is loaded we can't use a router, so exit early
  if (noConfigNode) {
    return {
      node: (
        <ApiProvider apis={ApiRegistry.with(appThemeApiRef, appThemeApi)}>
          <ThemeProvider>{noConfigNode}</ThemeProvider>
        </ApiProvider>
      ),
    };
  }

  const configReader = ConfigReader.fromConfigs(
    config.value?.length ? overrideBaseUrlConfigs(config.value) : [],
  );

  return { api: configReader };
}

class AppContextImpl implements AppContext {
  constructor(private readonly app: AppManager) {}

  getPlugins(): BackstagePlugin[] {
    return this.app.getPlugins();
  }

  getSystemIcon(key: string): IconComponent | undefined {
    return this.app.getSystemIcon(key);
  }

  getSystemIcons(): Record<string, IconComponent> {
    return this.app.getSystemIcons();
  }

  getComponents(): AppComponents {
    return this.app.getComponents();
  }
}

export class AppManager implements BackstageApp {
  private apiHolder?: ApiHolder;
  private configApi?: ConfigApi;

  private readonly apis: Iterable<AnyApiFactory>;
  private readonly icons: NonNullable<AppOptions['icons']>;
  private readonly plugins: Set<CompatiblePlugin>;
  private readonly featureFlags: (FeatureFlag &
    Omit<FeatureFlag, 'pluginId'>)[];
  private readonly components: AppComponents;
  private readonly themes: AppTheme[];
  private readonly configLoader?: AppConfigLoader;
  private readonly defaultApis: Iterable<AnyApiFactory>;
  private readonly bindRoutes: AppOptions['bindRoutes'];
  private readonly appLanguageApi: AppLanguageApi;
  private readonly translationResources: Array<
    TranslationResource | TranslationMessages
  >;

  private readonly appIdentityProxy = new AppIdentityProxy();
  private readonly apiFactoryRegistry: ApiFactoryRegistry;

  constructor(options: AppOptions) {
    this.apis = options.apis ?? [];
    this.icons = options.icons;
    this.plugins = new Set((options.plugins as CompatiblePlugin[]) ?? []);
    this.featureFlags = options.featureFlags ?? [];
    this.components = options.components;
    this.themes = options.themes as AppTheme[];
    this.configLoader = options.configLoader ?? defaultConfigLoader;
    this.defaultApis = options.defaultApis ?? [];
    this.bindRoutes = options.bindRoutes;
    this.apiFactoryRegistry = new ApiFactoryRegistry();
    this.appLanguageApi = AppLanguageSelector.createWithStorage({
      defaultLanguage: options.__experimentalTranslations?.defaultLanguage,
      availableLanguages:
        options.__experimentalTranslations?.availableLanguages,
    });
    this.translationResources =
      options.__experimentalTranslations?.resources ?? [];
  }

  getPlugins(): BackstagePlugin[] {
    return Array.from(this.plugins) as BackstagePlugin[];
  }

  getSystemIcon(key: string): IconComponent | undefined {
    return this.icons[key];
  }

  getSystemIcons(): Record<string, IconComponent> {
    return this.icons;
  }

  getComponents(): AppComponents {
    return this.components;
  }

  createRoot(element: JSX.Element): ComponentType<PropsWithChildren<{}>> {
    const AppProvider = this.getProvider();
    const AppRoot = () => {
      return <AppProvider>{element}</AppProvider>;
    };
    return AppRoot;
  }

  #getProviderCalled = false;
  getProvider(): ComponentType<PropsWithChildren<{}>> {
    if (this.#getProviderCalled) {
      throw new Error(
        'app.getProvider() or app.createRoot() has already been called, and can only be called once',
      );
    }
    this.#getProviderCalled = true;

    const appContext = new AppContextImpl(this);

    // We only bind and validate routes once
    let routeBindings: ReturnType<typeof resolveRouteBindings>;
    // Store and keep throwing the same error if we encounter one
    let routeValidationError: Error | undefined = undefined;

    const Provider = ({ children }: PropsWithChildren<{}>) => {
      const needsFeatureFlagRegistrationRef = useRef(true);
      const appThemeApi = useMemo(
        () => AppThemeSelector.createWithStorage(this.themes),
        [],
      );

      const { routing, featureFlags } = useMemo(() => {
        const usesReactRouterBeta = isReactRouterBeta();
        if (usesReactRouterBeta) {
          // eslint-disable-next-line no-console
          console.warn(`
DEPRECATION WARNING: React Router Beta is deprecated and support for it will be removed in a future release.
                     Please migrate to use React Router v6 stable.
                     See https://backstage.io/docs/tutorials/react-router-stable-migration
`);
        }

        const result = traverseElementTree({
          root: children,
          discoverers: [childDiscoverer, routeElementDiscoverer],
          collectors: {
            routing: usesReactRouterBeta
              ? routingV1Collector
              : routingV2Collector,
            collectedPlugins: pluginCollector,
            featureFlags: featureFlagCollector,
          },
        });

        // TODO(Rugvip): Restructure the public API so that we can get an immediate view of
        //               the app, rather than having to wait for the provider to render.
        //               For now we need to push the additional plugins we find during
        //               collection and then make sure we initialize things afterwards.
        result.collectedPlugins.forEach(plugin => this.plugins.add(plugin));
        this.verifyPlugins(this.plugins);

        // Initialize APIs once all plugins are available
        this.getApiHolder();
        return result;
      }, [children]);

      const loadedConfig = useConfigLoader(
        this.configLoader,
        this.components,
        appThemeApi,
      );

      const hasConfigApi = 'api' in loadedConfig;
      if (hasConfigApi) {
        const { api } = loadedConfig as { api: Config };
        this.configApi = api;
      }

      if ('node' in loadedConfig) {
        // Loading or error
        return loadedConfig.node;
      }

      if (routeValidationError) {
        throw routeValidationError;
      } else if (!routeBindings) {
        try {
          routeBindings = resolveRouteBindings(
            this.bindRoutes,
            loadedConfig.api,
            this.plugins,
          );

          validateRouteParameters(routing.paths, routing.parents);
          validateRouteBindings(routeBindings, this.plugins);
        } catch (error) {
          routeValidationError = error;
          throw error;
        }
      }

      // We can't register feature flags just after the element traversal, because the
      // config API isn't available yet and implementations frequently depend on it.
      // Instead we make it happen immediately, to make sure all flags are available
      // for the first render.
      if (hasConfigApi && needsFeatureFlagRegistrationRef.current) {
        needsFeatureFlagRegistrationRef.current = false;

        const featureFlagsApi = this.getApiHolder().get(featureFlagsApiRef)!;

        if (featureFlagsApi) {
          for (const flag of this.featureFlags) {
            featureFlagsApi.registerFlag({
              ...flag,
              pluginId: '',
            });
          }
          for (const plugin of this.plugins.values()) {
            if ('getFeatureFlags' in plugin) {
              for (const flag of plugin.getFeatureFlags()) {
                featureFlagsApi.registerFlag({
                  name: flag.name,
                  pluginId: plugin.getId(),
                });
              }
            } else {
              for (const output of plugin.output()) {
                if (output.type === 'feature-flag') {
                  featureFlagsApi.registerFlag({
                    name: output.name,
                    pluginId: plugin.getId(),
                  });
                }
              }
            }
          }

          // Go through the featureFlags returned from the traversal and
          // register those now the configApi has been loaded
          const registeredFlags = featureFlagsApi.getRegisteredFlags();
          const flagNames = new Set(registeredFlags.map(f => f.name));
          for (const name of featureFlags) {
            // Prevents adding duplicate feature flags
            if (!flagNames.has(name)) {
              featureFlagsApi.registerFlag({ name, pluginId: '' });
            }
          }
        }
      }

      const { ThemeProvider = AppThemeProvider, Progress } = this.components;

      const apis = this.getApiHolder();

      if (isProtectedApp()) {
        const errorApi = apis.get(errorApiRef);
        const fetchApi = apis.get(fetchApiRef);
        const discoveryApi = apis.get(discoveryApiRef);
        if (!errorApi || !fetchApi || !discoveryApi) {
          throw new Error(
            'App is running in protected mode but missing required APIs',
          );
        }
        this.appIdentityProxy.enableCookieAuth({
          errorApi,
          fetchApi,
          discoveryApi,
        });
      }

      return (
        <ApiProvider apis={apis}>
          <AppContextProvider appContext={appContext}>
            <ThemeProvider>
              <RoutingProvider
                routePaths={routing.paths}
                routeParents={routing.parents}
                routeObjects={routing.objects}
                routeBindings={routeBindings}
                basePath={getBasePath(loadedConfig.api)}
              >
                <InternalAppContext.Provider
                  value={{
                    routeObjects: routing.objects,
                    appIdentityProxy: this.appIdentityProxy,
                  }}
                >
                  <Suspense fallback={<Progress />}>{children}</Suspense>
                </InternalAppContext.Provider>
              </RoutingProvider>
            </ThemeProvider>
          </AppContextProvider>
        </ApiProvider>
      );
    };
    return Provider;
  }

  getRouter(): ComponentType<PropsWithChildren<{}>> {
    return AppRouter;
  }

  private getApiHolder(): ApiHolder {
    if (this.apiHolder) {
      // Register additional plugins if they have been added.
      // Routes paths, objects and others are already updated in the provider when children of it change
      for (const plugin of this.plugins) {
        for (const factory of plugin.getApis()) {
          if (!this.apiFactoryRegistry.get(factory.api)) {
            this.apiFactoryRegistry.register('default', factory);
          }
        }
      }
      ApiResolver.validateFactories(
        this.apiFactoryRegistry,
        this.apiFactoryRegistry.getAllApis(),
      );
      return this.apiHolder;
    }
    this.apiFactoryRegistry.register('static', {
      api: appThemeApiRef,
      deps: {},
      factory: () => AppThemeSelector.createWithStorage(this.themes),
    });
    this.apiFactoryRegistry.register('static', {
      api: configApiRef,
      deps: {},
      factory: () => {
        if (!this.configApi) {
          throw new Error(
            'Tried to access config API before config was loaded',
          );
        }
        return this.configApi;
      },
    });
    this.apiFactoryRegistry.register('static', {
      api: identityApiRef,
      deps: {},
      factory: () => this.appIdentityProxy,
    });
    this.apiFactoryRegistry.register('static', {
      api: appLanguageApiRef,
      deps: {},
      factory: () => this.appLanguageApi,
    });

    // The translation API is registered as a default API so that it can be overridden.
    // It will be up to the implementer of the new API to register translation resources.
    this.apiFactoryRegistry.register('default', {
      api: translationApiRef,
      deps: { languageApi: appLanguageApiRef },
      factory: ({ languageApi }) =>
        I18nextTranslationApi.create({
          languageApi,
          resources: this.translationResources,
        }),
    });

    // It's possible to replace the feature flag API, but since we must have at least
    // one implementation we add it here directly instead of through the defaultApis.
    this.apiFactoryRegistry.register('default', {
      api: featureFlagsApiRef,
      deps: {},
      factory: () => new LocalStorageFeatureFlags(),
    });
    for (const factory of this.defaultApis) {
      this.apiFactoryRegistry.register('default', factory);
    }

    for (const plugin of this.plugins) {
      for (const factory of plugin.getApis()) {
        if (!this.apiFactoryRegistry.register('default', factory)) {
          throw new Error(
            `Plugin ${plugin.getId()} tried to register duplicate or forbidden API factory for ${
              factory.api
            }`,
          );
        }
      }
    }

    for (const factory of this.apis) {
      if (!this.apiFactoryRegistry.register('app', factory)) {
        throw new Error(
          `Duplicate or forbidden API factory for ${factory.api} in app`,
        );
      }
    }

    ApiResolver.validateFactories(
      this.apiFactoryRegistry,
      this.apiFactoryRegistry.getAllApis(),
    );

    this.apiHolder = new ApiResolver(this.apiFactoryRegistry);
    return this.apiHolder;
  }

  private verifyPlugins(plugins: Iterable<CompatiblePlugin>) {
    const pluginIds = new Set<string>();

    for (const plugin of plugins) {
      const id = plugin.getId();
      if (pluginIds.has(id)) {
        throw new Error(`Duplicate plugin found '${id}'`);
      }
      pluginIds.add(id);
    }
  }
}
