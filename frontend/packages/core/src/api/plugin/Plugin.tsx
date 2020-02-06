import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PluginOutputHook from './PluginOutputHook';

export type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

export type PluginHooks = {
  router: Router;
  provide<T>(ref: PluginOutputHook<T>, value: T): void;
};

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RedirectOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type Router = {
  registerRoute(
    path: string,
    Component: React.ComponentType<any>,
    options?: RouteOptions,
  ): void;
  registerRedirect(
    path: string,
    target: string,
    options?: RedirectOptions,
  ): void;
};

export type PluginRegistrationResult = {
  routes?: JSX.Element[];
  outputs?: Map<PluginOutputHook<any>, any>;
};

export const registerSymbol = Symbol('plugin-register');
export const outputSymbol = Symbol('plugin-output');

export default class Plugin {
  private result?: PluginRegistrationResult;

  constructor(private readonly config: PluginConfig) {}

  [registerSymbol](): PluginRegistrationResult {
    if (this.result) {
      return this.result;
    }
    if (!this.config.register) {
      return {};
    }

    const { id } = this.config;

    const routes = new Array<JSX.Element>();
    const outputs = new Map<PluginOutputHook<any>, any>();

    this.config.register({
      router: {
        registerRoute(path, component, options = {}) {
          if (path.startsWith('/entity/')) {
            throw new Error(
              `Plugin ${id} tried to register forbidden route ${path}`,
            );
          }
          const { exact = true } = options;
          routes.push(
            <Route
              key={path}
              path={path}
              component={component}
              exact={exact}
            />,
          );
        },
        registerRedirect(path, target, options = {}) {
          if (path.startsWith('/entity/')) {
            throw new Error(
              `Plugin ${id} tried to register forbidden redirect ${path}`,
            );
          }
          const { exact = true } = options;
          routes.push(
            <Redirect key={path} path={path} to={target} exact={exact} />,
          );
        },
      },
      provide(hook, value) {
        outputs.set(hook, value);
      },
    });

    this.result = { routes, outputs };
    return this.result;
  }

  [outputSymbol]<T>(outputHook: PluginOutputHook<T>): T | undefined {
    const { outputs } = this[registerSymbol]();
    return outputs?.get(outputHook) as T;
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}
