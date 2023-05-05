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

import { createApp } from '@backstage/app-defaults';
import {
  AppRouter,
  ConfigReader,
  FlatRoutes,
  defaultConfigLoader,
} from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
} from '@backstage/core-components';
import {
  BackstagePlugin,
  RouteRef,
  getComponentData,
} from '@backstage/core-plugin-api';
import React from 'react';
import { Route } from 'react-router';
import { apis } from '../apis';
import * as plugins from '../plugins';
import { DeclarativeSidebar } from './DeclarativeSidebar';

type PluginThing = BackstagePlugin & {
  output?(): Array<{ type: 'feature-flag'; name: string } | { type: string }>; // support for old plugins
};

function loadSymbol(moduleName: string, symbolName?: string): any {
  const loadedModule = (plugins as any)[moduleName] as any;
  if (!loadedModule) {
    throw new Error(`Could not load module ${moduleName}`);
  }

  // console.log(moduleName, plugins, loadedModule);
  const loadedSymbol = loadedModule[symbolName ?? 'default'];
  if (!loadedSymbol) {
    throw new Error(
      `Could not load symbol ${symbolName} from module ${moduleName}`,
    );
  }

  return loadedSymbol;
}

export async function declarativeCreateApp() {
  const config = ConfigReader.fromConfigs(await defaultConfigLoader());

  const loadedPlugins = new Array<PluginThing>();
  for (const featureConfig of config.getConfigArray('app.features')) {
    const plugin = loadSymbol(
      featureConfig.getString('import'),
      featureConfig.getOptionalString('name'),
    );
    loadedPlugins.push(plugin);
  }

  const loadedRoutes = new Array<JSX.Element>();
  for (const routeConfig of config.getConfigArray('app.routes')) {
    const moduleName = routeConfig.getString('import');
    const symbolName = routeConfig.getString('name');
    const path = routeConfig.getString('path');
    const Component = loadSymbol(moduleName, symbolName);
    const routeRef = getComponentData<RouteRef>(
      <Component />,
      'core.mountPoint',
    );
    if (!routeRef) {
      throw new Error(
        `Could not find route ref on symbol ${symbolName} from module ${moduleName}`,
      );
    }
    loadedRoutes.push(<Route key={path} path={path} element={<Component />} />);
  }
  console.log(loadedRoutes);
  const app = createApp({
    plugins: loadedPlugins,
    apis,
  });

  return app.createRoot(
    <>
      <AlertDisplay transientTimeoutMs={2500} />
      <OAuthRequestDialog />
      <AppRouter>
        <SidebarPage>
          <DeclarativeSidebar />
          <FlatRoutes>
            <Route path="/" element={<h1>Home</h1>} />
            {loadedRoutes}
          </FlatRoutes>
        </SidebarPage>
      </AppRouter>
    </>,
  );
}
