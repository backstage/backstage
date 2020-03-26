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

import React, { ComponentType } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppContextProvider } from './AppContext';
import { App } from './types';
import BackstagePlugin from '../plugin/Plugin';
import { FeatureFlagName } from '../plugin/Plugin/types';
import {
  IconComponent,
  SystemIcons,
  SystemIconKey,
  defaultSystemIcons,
} from '../../icons';
import { ApiHolder, ApiProvider } from '../apis';
import LoginPage from './LoginPage';

class AppImpl implements App {
  constructor(private readonly systemIcons: SystemIcons) {}

  getSystemIcon(key: SystemIconKey): IconComponent {
    return this.systemIcons[key];
  }
}

export default class AppBuilder {
  private apis?: ApiHolder;
  private systemIcons = { ...defaultSystemIcons };
  private readonly plugins = new Set<BackstagePlugin>();

  registerApis(apis: ApiHolder) {
    this.apis = apis;
  }

  registerIcons(icons: Partial<SystemIcons>) {
    this.systemIcons = { ...this.systemIcons, ...icons };
  }

  registerPlugin(...plugin: BackstagePlugin[]) {
    for (const p of plugin) {
      if (this.plugins.has(p)) {
        throw new Error(`Plugin '${p}' is already registered`);
      }
      this.plugins.add(p);
    }
  }

  build(): ComponentType<{}> {
    const app = new AppImpl(this.systemIcons);

    const routes = new Array<JSX.Element>();
    const registeredFeatureFlags = new Array<{ name: FeatureFlagName }>();

    for (const plugin of this.plugins.values()) {
      for (const output of plugin.output()) {
        switch (output.type) {
          case 'route': {
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
          case 'redirect-route': {
            const { path, target, options = {} } = output;
            const { exact = true } = options;
            routes.push(
              <Redirect key={path} path={path} to={target} exact={exact} />,
            );
            break;
          }
          case 'feature-flag': {
            registeredFeatureFlags.push({ name: output.name });
            break;
          }
          default:
            break;
        }
      }
    }

    routes.push(
      <Route key="login" path="/login" component={LoginPage} exact />,
    );

    let rendered = (
      <Switch>
        {routes}
        <Route component={() => <span>404 Not Found</span>} />
      </Switch>
    );

    if (this.apis) {
      rendered = <ApiProvider apis={this.apis} children={rendered} />;
    }

    return () => <AppContextProvider app={app} children={rendered} />;
  }
}
