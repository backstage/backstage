import { ComponentType } from 'react';

export type EntityConfig = {
  kind: string;
  title: string;
  icon: React.ComponentType<{ fontSize: number }>;
  color: {
    primary: string;
    secondary: string;
  };
  pages: {
    list?: ComponentType<{}> | AppComponentBuilder;
    view?: ComponentType<{}> | AppComponentBuilder;
  };
};

export type App = {
  getEntityConfig(kind: string): EntityConfig;
};

export class AppComponentBuilder<T = any> {
  build(_app: App): ComponentType<T> {
    throw new Error('Must override build() in AppComponentBuilder');
  }
}

export type User = {
  id: string;
  email: string;
};

export type UserApi = {
  isLoggedIn(): Promise<boolean>;

  getUser(): Promise<User>;
};

export type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

export interface BackstagePlugin {
  id: string;
  register(hooks: PluginHooks): void;
}

export type PluginHooks = {
  router: Router;
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
