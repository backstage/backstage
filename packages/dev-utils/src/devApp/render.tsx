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

import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import {
  createApp,
  SidebarPage,
  Sidebar,
  SidebarItem,
  SidebarSpacer,
  ApiFactory,
  createPlugin,
  ApiTestRegistry,
  ApiHolder,
} from '@backstage/core';
import { lightTheme } from '@backstage/theme';
import * as apiFactories from './apiFactories';

type BackstagePlugin = ReturnType<typeof createPlugin>;

export type RenderInAppConfig = {
  plugins: BackstagePlugin[];
  apis: ApiFactory<unknown, unknown, unknown>[];
};

// Set up an API registry that merges together default implementations with ones provided through config.
function setupApiRegistry(config: RenderInAppConfig): ApiHolder {
  const providedApis = new Set(config.apis.map(factory => factory.implements));

  // Exlude any default API factory that we receive a factory for in the config
  const defaultFactories = Object.values(apiFactories).filter(factory =>
    providedApis.has(factory.implements),
  );
  const allFactories = [...defaultFactories, ...config.apis];

  // Use a test registry with dependency injection so that the consumer
  // can override APIs but still depend on the default implementations.
  const registry = new ApiTestRegistry();
  for (const factory of allFactories) {
    registry.register(factory);
  }

  return registry;
}

// Create a sidebar that exposes the touchpoints of a plugin
function setupSidebar(config: RenderInAppConfig): JSX.Element {
  const sidebarItems = new Array<JSX.Element>();

  for (const plugin of config.plugins) {
    for (const output of plugin.output()) {
      switch (output.type) {
        case 'route': {
          const { path } = output;
          sidebarItems.push(
            <SidebarItem
              key={path}
              to={path}
              text={path}
              icon={BookmarkIcon}
            />,
          );
          break;
        }
        default:
          break;
      }
    }
  }

  return (
    <Sidebar>
      <SidebarSpacer />
      {sidebarItems}
    </Sidebar>
  );
}

// TODO(rugvip): Figure out patterns for how to allow in-house apps to build upon
// this to provide their own plugin dev wrappers.

// Renders one or more plugins in a dev app and exposes outputs from the plugin
export function renderPluginsInApp(config: RenderInAppConfig): void {
  const app = createApp();
  app.registerApis(setupApiRegistry(config));
  app.registerPlugin(...config.plugins);
  const AppComponent = app.build();

  const sidebar = setupSidebar(config);

  const App: FC<{}> = () => {
    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline>
          <BrowserRouter>
            <SidebarPage>
              {sidebar}
              <AppComponent />
            </SidebarPage>
          </BrowserRouter>
        </CssBaseline>
      </ThemeProvider>
    );
  };

  ReactDOM.render(<App />, document.getElementById('root'));
}
