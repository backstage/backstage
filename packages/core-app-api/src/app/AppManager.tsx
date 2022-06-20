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
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Route, Routes } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  ApiProvider,
  AppThemeSelector,
  ConfigReader,
  LocalStorageFeatureFlags,
} from '../apis';
import {
  useApi,
  AnyApiFactory,
  ApiHolder,
  IconComponent,
  AppTheme,
  appThemeApiRef,
  configApiRef,
  AppThemeApi,
  ConfigApi,
  featureFlagsApiRef,
  IdentityApi,
  identityApiRef,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
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
} from '../routing/collectors';
import { RoutingProvider } from '../routing/RoutingProvider';
import { RouteTracker } from '../routing/RouteTracker';
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
  SignInPageProps,
} from './types';
import { AppThemeProvider } from './AppThemeProvider';
import { defaultConfigLoader } from './defaultConfigLoader';
import { ApiRegistry } from '../apis/system/ApiRegistry';
import { resolveRouteBindings } from './resolveRouteBindings';
import { BackstageRouteObject } from '../routing/types';

type CompatiblePlugin =
  | BackstagePlugin<any, any>
  | (Omit<BackstagePlugin<any, any>, 'getFeatureFlags'> & {
      output(): Array<{ type: 'feature-flag'; name: string }>;
    });

const InternalAppContext = createContext<{
  routeObjects: BackstageRouteObject[];
}>({ routeObjects: [] });

/**
 * Get the app base path from the configured app baseUrl.
 *
 * The returned path does not have a trailing slash.
 */
function getBasePath(configApi: Config) {
  let { pathname } = new URL(
    configApi.getOptionalString('app.baseUrl') ?? '/',
    'http://dummy.dev', // baseUrl can be specified as just a path
  );
  pathname = pathname.replace(/\/*$/, '');
  return pathname;
}

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

  const configReader = ConfigReader.fromConfigs(config.value ?? []);

  return { api: configReader };
}

class AppContextImpl implements AppContext {
  constructor(private readonly app: AppManager) {}

  getPlugins(): BackstagePlugin<any, any>[] {
    return this.app.getPlugins();
  }

  getSystemIcon(key: string): IconComponent | undefined {
    return this.app.getSystemIcon(key);
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
  private readonly components: AppComponents;
  private readonly themes: AppTheme[];
  private readonly configLoader?: AppConfigLoader;
  private readonly defaultApis: Iterable<AnyApiFactory>;
  private readonly bindRoutes: AppOptions['bindRoutes'];

  private readonly appIdentityProxy = new AppIdentityProxy();
  private readonly apiFactoryRegistry: ApiFactoryRegistry;

  constructor(options: AppOptions) {
    this.apis = options.apis ?? [];
    this.icons = options.icons;
    this.plugins = new Set((options.plugins as CompatiblePlugin[]) ?? []);
    this.components = options.components;
    this.themes = options.themes as AppTheme[];
    this.configLoader = options.configLoader ?? defaultConfigLoader;
    this.defaultApis = options.defaultApis ?? [];
    this.bindRoutes = options.bindRoutes;
    this.apiFactoryRegistry = new ApiFactoryRegistry();
  }

  getPlugins(): BackstagePlugin<any, any>[] {
    return Array.from(this.plugins) as BackstagePlugin<any, any>[];
  }

  getSystemIcon(key: string): IconComponent | undefined {
    return this.icons[key];
  }

  getComponents(): AppComponents {
    return this.components;
  }

  getProvider(): ComponentType<{}> {
    const appContext = new AppContextImpl(this);

    // We only validate routes once
    let routesHaveBeenValidated = false;

    const Provider = ({ children }: PropsWithChildren<{}>) => {
      const appThemeApi = useMemo(
        () => AppThemeSelector.createWithStorage(this.themes),
        [],
      );

      const { routing, featureFlags, routeBindings } = useMemo(() => {
        const result = traverseElementTree({
          root: children,
          discoverers: [childDiscoverer, routeElementDiscoverer],
          collectors: {
            routing: routingV1Collector,
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
        return {
          ...result,
          routeBindings: resolveRouteBindings(this.bindRoutes),
        };
      }, [children]);

      if (!routesHaveBeenValidated) {
        routesHaveBeenValidated = true;
        validateRouteParameters(routing.paths, routing.parents);
        validateRouteBindings(
          routeBindings,
          this.plugins as Iterable<BackstagePlugin<any, any>>,
        );
      }

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

      useEffect(() => {
        if (hasConfigApi) {
          const featureFlagsApi = this.getApiHolder().get(featureFlagsApiRef)!;

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
          for (const name of featureFlags) {
            featureFlagsApi.registerFlag({ name, pluginId: '' });
          }
        }
      }, [hasConfigApi, loadedConfig, featureFlags]);

      if ('node' in loadedConfig) {
        // Loading or error
        return loadedConfig.node;
      }

      const { ThemeProvider = AppThemeProvider } = this.components;

      return (
        <ApiProvider apis={this.getApiHolder()}>
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
                  value={{ routeObjects: routing.objects }}
                >
                  {children}
                </InternalAppContext.Provider>
              </RoutingProvider>
            </ThemeProvider>
          </AppContextProvider>
        </ApiProvider>
      );
    };
    return Provider;
  }

  getRouter(): ComponentType<{}> {
    const { Router: RouterComponent, SignInPage: SignInPageComponent } =
      this.components;

    // This wraps the sign-in page and waits for sign-in to be completed before rendering the app
    const SignInPageWrapper = ({
      component: Component,
      children,
    }: {
      component: ComponentType<SignInPageProps>;
      children: ReactElement;
    }) => {
      const [identityApi, setIdentityApi] = useState<IdentityApi>();
      const configApi = useApi(configApiRef);
      const basePath = getBasePath(configApi);

      if (!identityApi) {
        return <Component onSignInSuccess={setIdentityApi} />;
      }

      this.appIdentityProxy.setTarget(identityApi, {
        signOutTargetUrl: basePath || '/',
      });
      return children;
    };

    const AppRouter = ({ children }: PropsWithChildren<{}>) => {
      const configApi = useApi(configApiRef);
      const basePath = getBasePath(configApi);
      const mountPath = `${basePath}/*`;
      const { routeObjects } = useContext(InternalAppContext);

      // If the app hasn't configured a sign-in page, we just continue as guest.
      if (!SignInPageComponent) {
        this.appIdentityProxy.setTarget(
          {
            getUserId: () => 'guest',
            getIdToken: async () => undefined,
            getProfile: () => ({
              email: 'guest@example.com',
              displayName: 'Guest',
            }),
            getProfileInfo: async () => ({
              email: 'guest@example.com',
              displayName: 'Guest',
            }),
            getBackstageIdentity: async () => ({
              type: 'user',
              userEntityRef: 'user:default/guest',
              ownershipEntityRefs: ['user:default/guest'],
            }),
            getCredentials: async () => ({}),
            signOut: async () => {},
          },
          { signOutTargetUrl: basePath || '/' },
        );

        return (
          <RouterComponent>
            <RouteTracker routeObjects={routeObjects} />
            <Routes>
              <Route path={mountPath} element={<>{children}</>} />
            </Routes>
          </RouterComponent>
        );
      }

      return (
        <RouterComponent>
          <RouteTracker routeObjects={routeObjects} />
          <SignInPageWrapper component={SignInPageComponent}>
            <Routes>
              <Route path={mountPath} element={<>{children}</>} />
            </Routes>
          </SignInPageWrapper>
        </RouterComponent>
      );
    };

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
