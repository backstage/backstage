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

import React, { ComponentType, FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppContextProvider } from './AppContext';
import { BackstageApp, AppOptions, AppComponents } from './types';
import { BackstagePlugin } from '../plugin';
import { FeatureFlagsRegistryItem } from './FeatureFlags';
import { featureFlagsApiRef } from '../apis/definitions';
import ErrorPage from '../../layout/ErrorPage';
import { AppThemeProvider } from './AppThemeProvider';

import {
  IconComponent,
  SystemIcons,
  SystemIconKey,
  defaultSystemIcons,
} from '../../icons';
import {
  ApiHolder,
  ApiProvider,
  ApiRegistry,
  AppTheme,
  AppThemeSelector,
  appThemeApiRef,
} from '../apis';
import { lightTheme, darkTheme } from '@backstage/theme';
import { ApiAggregator } from '../apis/ApiAggregator';

type FullAppOptions = {
  apis: ApiHolder;
  icons: SystemIcons;
  plugins: BackstagePlugin[];
  components: AppComponents;
  themes: AppTheme[];
};

class AppImpl implements BackstageApp {
  private readonly apis: ApiHolder;
  private readonly icons: SystemIcons;
  private readonly plugins: BackstagePlugin[];
  private readonly components: AppComponents;
  private readonly themes: AppTheme[];

  constructor(options: FullAppOptions) {
    this.apis = options.apis;
    this.icons = options.icons;
    this.plugins = options.plugins;
    this.components = options.components;
    this.themes = options.themes;
  }

  getApis(): ApiHolder {
    return this.apis;
  }

  getPlugins(): BackstagePlugin[] {
    return this.plugins;
  }

  getSystemIcon(key: SystemIconKey): IconComponent {
    return this.icons[key];
  }

  getRootComponent(): ComponentType<{}> {
    const routes = new Array<JSX.Element>();
    const registeredFeatureFlags = new Array<FeatureFlagsRegistryItem>();

    const { NotFoundErrorPage } = this.components;

    for (const plugin of this.plugins.values()) {
      for (const output of plugin.output()) {
        switch (output.type) {
          case 'legacy-route': {
            const { path, component, options = {} } = output;
            const { exact = true } = options;
            routes.push(
              <Route
                key={path}
                path={path}
                component={component}
                exact={exact}
              />,
            );
            break;
          }
          case 'route': {
            const { target, component, options = {} } = output;
            const { exact = true } = options;
            routes.push(
              <Route
                key={`${plugin.getId()}-${target.path}`}
                path={target.path}
                component={component}
                exact={exact}
              />,
            );
            break;
          }
          case 'redirect-route': {
            const { path, target, options = {} } = output;
            const { exact = true } = options;
            routes.push(
              <Redirect key={path} path={path} to={target} exact={exact} />,
            );
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
      <Switch>
        {routes}
        <Route component={NotFoundErrorPage} />
      </Switch>
    );

    return () => rendered;
  }

  getProvider(): ComponentType<{}> {
    const appApis = ApiRegistry.from([
      [appThemeApiRef, AppThemeSelector.createWithStorage(this.themes)],
    ]);
    const apis = new ApiAggregator(this.apis, appApis);

    const Provider: FC<{}> = ({ children }) => (
      <ApiProvider apis={apis}>
        <AppContextProvider app={this}>
          <AppThemeProvider>{children}</AppThemeProvider>
        </AppContextProvider>
      </ApiProvider>
    );
    return Provider;
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

/**
 * Creates a new Backstage App.
 */
export function createApp(options?: AppOptions) {
  const DefaultNotFoundPage = () => (
    <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
  );

  const apis = options?.apis ?? ApiRegistry.from([]);
  const icons = { ...defaultSystemIcons, ...options?.icons };
  const plugins = options?.plugins ?? [];
  const components = {
    NotFoundErrorPage: DefaultNotFoundPage,
    ...options?.components,
  };
  const themes = options?.themes ?? [
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      theme: lightTheme,
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      variant: 'dark',
      theme: darkTheme,
    },
  ];

  const app = new AppImpl({ apis, icons, plugins, components, themes });

  app.verify();

  return app;
}
