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

import { hot } from 'react-hot-loader/root';
import React, { FC, ComponentType, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import BookmarkIcon from '@material-ui/icons/Bookmark';
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
  AlertDisplay,
  OAuthRequestDialog,
} from '@backstage/core';
import * as defaultApiFactories from './apiFactories';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

// TODO(rugvip): export proper plugin type from core that isn't the plugin class
type BackstagePlugin = ReturnType<typeof createPlugin>;

/**
 * DevApp builder that is similar to the App builder API, but creates an App
 * with the purpose of developing one or more plugins inside it.
 */
class DevAppBuilder {
  private readonly plugins = new Array<BackstagePlugin>();
  private readonly factories = new Array<ApiFactory<any, any, any>>();
  private readonly rootChildren = new Array<ReactNode>();

  /**
   * Register one or more plugins to render in the dev app
   */
  registerPlugin(...plugins: BackstagePlugin[]): DevAppBuilder {
    this.plugins.push(...plugins);
    return this;
  }

  /**
   * Register an API factory to add to the app
   */
  registerApiFactory<Api, Impl, Deps>(
    factory: ApiFactory<Api, Impl, Deps>,
  ): DevAppBuilder {
    this.factories.push(factory);
    return this;
  }

  /**
   * Adds a React node to place just inside the App Provider.
   *
   * Useful for adding more global components like the AlertDisplay.
   */
  addRootChild(node: ReactNode): DevAppBuilder {
    this.rootChildren.push(node);
    return this;
  }

  /**
   * Build a DevApp component using the resources registered so far
   */
  build(): ComponentType<{}> {
    const app = createApp({
      apis: this.setupApiRegistry(this.factories),
      plugins: this.plugins,
    });
    const AppProvider = app.getProvider();
    const AppComponent = app.getRootComponent();

    const sidebar = this.setupSidebar(this.plugins);

    const DevApp: FC<{}> = () => {
      return (
        <AppProvider>
          <AlertDisplay />
          <OAuthRequestDialog />
          {this.rootChildren}
          <SidebarPage>
            {sidebar}
            <AppComponent />
          </SidebarPage>
        </AppProvider>
      );
    };

    return DevApp;
  }

  /**
   * Build and render directory to #root element, with react hot loading.
   */
  render(): void {
    const DevApp = hot(this.build());

    const paths = this.findPluginPaths(this.plugins);

    if (window.location.pathname === '/') {
      if (!paths.includes('/') && paths.length > 0) {
        window.location.pathname = paths[0];
      }
    }

    ReactDOM.render(<DevApp />, document.getElementById('root'));
  }

  // Create a sidebar that exposes the touchpoints of a plugin
  private setupSidebar(plugins: BackstagePlugin[]): JSX.Element {
    const sidebarItems = new Array<JSX.Element>();
    for (const plugin of plugins) {
      for (const output of plugin.output()) {
        switch (output.type) {
          case 'legacy-route': {
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
          case 'route': {
            const { target } = output;
            sidebarItems.push(
              <SidebarItem
                key={target.path}
                to={target.path}
                text={target.title}
                icon={target.icon ?? SentimentDissatisfiedIcon}
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

  // Set up an API registry that merges together default implementations with ones provided through config.
  private setupApiRegistry(
    providedFactories: ApiFactory<any, any, any>[],
  ): ApiHolder {
    const providedApis = new Set(
      providedFactories.map(factory => factory.implements),
    );

    // Exlude any default API factory that we receive a factory for in the config
    const defaultFactories = Object.values(defaultApiFactories).filter(
      factory => !providedApis.has(factory.implements),
    );
    const allFactories = [...defaultFactories, ...providedFactories];

    // Use a test registry with dependency injection so that the consumer
    // can override APIs but still depend on the default implementations.
    const registry = new ApiTestRegistry();
    for (const factory of allFactories) {
      registry.register(factory);
    }

    return registry;
  }

  private findPluginPaths(plugins: BackstagePlugin[]) {
    const paths = new Array<string>();

    for (const plugin of plugins) {
      for (const output of plugin.output()) {
        if (output.type === 'legacy-route') {
          paths.push(output.path);
        }
      }
    }

    return paths;
  }
}

// TODO(rugvip): Figure out patterns for how to allow in-house apps to build upon
// this to provide their own plugin dev wrappers.

/**
 * Creates a dev app for rendering one or more plugins and exposing the touchpoints of the plugin.
 */
export function createDevApp() {
  return new DevAppBuilder();
}
