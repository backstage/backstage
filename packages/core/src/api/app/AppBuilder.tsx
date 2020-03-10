import React, { ComponentType } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppContextProvider } from './AppContext';
import { App } from './types';
import BackstagePlugin from '../plugin/Plugin';
import {
  IconComponent,
  SystemIcons,
  SystemIconKey,
  defaultSystemIcons,
} from '../../icons';

class AppImpl implements App {
  constructor(private readonly systemIcons: SystemIcons) {}

  getSystemIcon(key: SystemIconKey): IconComponent {
    return this.systemIcons[key];
  }
}

export default class AppBuilder {
  private systemIcons = { ...defaultSystemIcons };
  private readonly plugins = new Set<BackstagePlugin>();

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
          default:
            break;
        }
      }
    }

    return () => (
      <AppContextProvider app={app}>
        <Switch>
          {routes}
          <Route component={() => <span>404 Not Found</span>} />
        </Switch>
      </AppContextProvider>
    );
  }
}
