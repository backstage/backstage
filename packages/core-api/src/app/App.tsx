/*
 * Copyright 2020 Spotify AB
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
import React, {
  ComponentType,
  FC,
  useMemo,
  useCallback,
  useState,
  ReactElement,
} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AppContextProvider } from './AppContext';
import {
  BackstageApp,
  AppComponents,
  AppConfigLoader,
  Apis,
  SignInResult,
  SignInPageProps,
} from './types';
import { BackstagePlugin } from '../plugin';
import { FeatureFlagsRegistryItem } from './FeatureFlags';
import {
  featureFlagsApiRef,
  AppThemeApi,
  ConfigApi,
  identityApiRef,
} from '../apis/definitions';
import { AppThemeProvider } from './AppThemeProvider';

import { IconComponent, SystemIcons, SystemIconKey } from '../icons';
import {
  ApiHolder,
  ApiProvider,
  ApiRegistry,
  AppTheme,
  AppThemeSelector,
  appThemeApiRef,
  configApiRef,
  ConfigReader,
  useApi,
} from '../apis';
import { ApiAggregator } from '../apis/ApiAggregator';
import { useAsync } from 'react-use';
import { AppIdentity } from './AppIdentity';

type FullAppOptions = {
  apis: Apis;
  icons: SystemIcons;
  plugins: BackstagePlugin[];
  components: AppComponents;
  themes: AppTheme[];
  configLoader?: AppConfigLoader;
};

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

  // Before the config is loaded we can't use a router, so exit early
  if (noConfigNode) {
    return {
      node: (
        <ApiProvider apis={ApiRegistry.from([[appThemeApiRef, appThemeApi]])}>
          <AppThemeProvider>{noConfigNode}</AppThemeProvider>
        </ApiProvider>
      ),
    };
  }

  const configReader = ConfigReader.fromConfigs(config.value ?? []);

  return { api: configReader };
}

export class PrivateAppImpl implements BackstageApp {
  private apis?: ApiHolder = undefined;
  private readonly icons: SystemIcons;
  private readonly plugins: BackstagePlugin[];
  private readonly components: AppComponents;
  private readonly themes: AppTheme[];
  private readonly configLoader?: AppConfigLoader;

  private readonly identityApi = new AppIdentity();

  private apisOrFactory: Apis;

  constructor(options: FullAppOptions) {
    this.apisOrFactory = options.apis;
    this.icons = options.icons;
    this.plugins = options.plugins;
    this.components = options.components;
    this.themes = options.themes;
    this.configLoader = options.configLoader;
  }

  getApis(): ApiHolder {
    if (!this.apis) {
      throw new Error('Tried to access APIs before app was loaded');
    }
    return this.apis;
  }

  getPlugins(): BackstagePlugin[] {
    return this.plugins;
  }

  getSystemIcon(key: SystemIconKey): IconComponent {
    return this.icons[key];
  }

  getRoutes(): ComponentType<{}> {
    const routes = new Array<JSX.Element>();
    const registeredFeatureFlags = new Array<FeatureFlagsRegistryItem>();

    const { NotFoundErrorPage } = this.components;

    for (const plugin of this.plugins.values()) {
      for (const output of plugin.output()) {
        switch (output.type) {
          case 'legacy-route': {
            const { path, component: Component } = output;
            routes.push(
              <Route key={path} path={path} element={<Component />} />,
            );
            break;
          }
          case 'route': {
            const { target, component: Component } = output;
            routes.push(
              <Route
                key={`${plugin.getId()}-${target.path}`}
                path={target.path}
                element={<Component />}
              />,
            );
            break;
          }
          case 'legacy-redirect-route': {
            const { path, target } = output;
            routes.push(<Navigate key={path} to={target} />);
            break;
          }
          case 'redirect-route': {
            const { from, to } = output;
            routes.push(<Navigate key={from.path} to={to.path} />);
            break;
          }
          case 'feature-flag': {
            registeredFeatureFlags.push({
              pluginId: plugin.getId(),
              name: output.name,
            });
            break;
          }
          default:
            break;
        }
      }
    }

    const FeatureFlags = this.apis && this.apis.get(featureFlagsApiRef);
    if (FeatureFlags) {
      FeatureFlags.registeredFeatureFlags = registeredFeatureFlags;
    }

    const rendered = (
      <Routes>
        {routes}
        <Route element={<NotFoundErrorPage />} />
      </Routes>
    );

    return () => rendered;
  }

  getProvider(): ComponentType<{}> {
    const Provider: FC<{}> = ({ children }) => {
      const appThemeApi = useMemo(
        () => AppThemeSelector.createWithStorage(this.themes),
        [],
      );

      const loadedConfig = useConfigLoader(
        this.configLoader,
        this.components,
        appThemeApi,
      );

      if ('node' in loadedConfig) {
        return loadedConfig.node;
      }
      const configApi = loadedConfig.api;

      const appApis = ApiRegistry.from([
        [appThemeApiRef, appThemeApi],
        [configApiRef, configApi],
        [identityApiRef, this.identityApi],
      ]);

      if (!this.apis) {
        if ('get' in this.apisOrFactory) {
          this.apis = this.apisOrFactory;
        } else {
          this.apis = this.apisOrFactory(configApi);
        }
      }

      const apis = new ApiAggregator(this.apis, appApis);

      return (
        <ApiProvider apis={apis}>
          <AppContextProvider app={this}>
            <AppThemeProvider>{children}</AppThemeProvider>
          </AppContextProvider>
        </ApiProvider>
      );
    };
    return Provider;
  }

  getRouter(): ComponentType<{}> {
    const {
      Router: RouterComponent,
      SignInPage: SignInPageComponent,
    } = this.components;

    // This wraps the sign-in page and waits for sign-in to be completed before rendering the app
    const SignInPageWrapper: FC<{
      component: ComponentType<SignInPageProps>;
      children: ReactElement;
    }> = ({ component: Component, children }) => {
      const [done, setDone] = useState(false);

      const onResult = useCallback(
        (result: SignInResult) => {
          if (done) {
            throw new Error('Identity result callback was called twice');
          }
          this.identityApi.setSignInResult(result);
          setDone(true);
        },
        [done],
      );

      if (done) {
        return children;
      }

      return <Component onResult={onResult} />;
    };

    const AppRouter: FC<{}> = ({ children }) => {
      const configApi = useApi(configApiRef);

      let { pathname } = new URL(
        configApi.getOptionalString('app.baseUrl') ?? '/',
        'http://dummy.dev', // baseUrl can be specified as just a path
      );
      if (pathname.endsWith('/')) {
        pathname = pathname.replace(/\/$/, '');
      }

      // If the app hasn't configured a sign-in page, we just continue as guest.
      if (!SignInPageComponent) {
        this.identityApi.setSignInResult({
          userId: 'guest',
          idToken: undefined,
          logout: async () => {},
        });

        return (
          <RouterComponent>
            <Routes>
              <Route path={`${pathname}/*`} element={<>{children}</>} />
            </Routes>
          </RouterComponent>
        );
      }

      return (
        <RouterComponent>
          <SignInPageWrapper component={SignInPageComponent}>
            <Routes>
              <Route path={`${pathname}/*`} element={<>{children}</>} />
            </Routes>
          </SignInPageWrapper>
        </RouterComponent>
      );
    };

    return AppRouter;
  }

  verify() {
    const pluginIds = new Set<string>();

    for (const plugin of this.plugins) {
      const id = plugin.getId();
      if (pluginIds.has(id)) {
        throw new Error(`Duplicate plugin found '${id}'`);
      }
      pluginIds.add(id);
    }
  }
}
