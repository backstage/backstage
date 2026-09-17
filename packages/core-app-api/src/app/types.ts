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

import { ComponentType, PropsWithChildren } from 'react';
import {
  AnyApiFactory,
  AppTheme,
  BackstagePlugin,
  ExternalRouteRef,
  FeatureFlag,
  IconComponent,
  IdentityApi,
  RouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import { AppConfig } from '@backstage/config';

/**
 * Props for the `BootErrorPage` component of {@link AppComponents}.
 *
 * @public
 */
export type BootErrorPageProps = PropsWithChildren<{
  step: 'load-config' | 'load-chunk';
  error: Error;
}>;

/**
 * Props for the `SignInPage` component of {@link AppComponents}.
 *
 * @public
 */
export type SignInPageProps = PropsWithChildren<{
  /**
   * Set the IdentityApi on successful sign-in. This should only be called once.
   */
  onSignInSuccess(identityApi: IdentityApi): void;
}>;

/**
 * Props for the fallback error boundary.
 *
 * @public
 */
export type ErrorBoundaryFallbackProps = PropsWithChildren<{
  plugin?: BackstagePlugin;
  error: Error;
  resetError: () => void;
}>;

/**
 * A set of replaceable core components that are part of every Backstage app.
 *
 * @public
 */
export type AppComponents = {
  NotFoundErrorPage: ComponentType<PropsWithChildren<{}>>;
  BootErrorPage: ComponentType<BootErrorPageProps>;
  Progress: ComponentType<PropsWithChildren<{}>>;
  Router: ComponentType<PropsWithChildren<{ basename?: string }>>;
  ErrorBoundaryFallback: ComponentType<ErrorBoundaryFallbackProps>;
  ThemeProvider?: ComponentType<PropsWithChildren<{}>>;

  /**
   * An optional sign-in page that will be rendered instead of the AppRouter at startup.
   *
   * If a sign-in page is set, it will always be shown before the app, and it is up
   * to the sign-in page to handle e.g. saving of login methods for subsequent visits.
   *
   * The sign-in page will be displayed until it has passed up a result to the parent,
   * and which point the AppRouter and all of its children will be rendered instead.
   */
  SignInPage?: ComponentType<SignInPageProps>;
};

/**
 * A set of well-known icons that should be available within an app.
 *
 * @public
 */
export type AppIcons = {
  'kind:api': IconComponent;
  'kind:component': IconComponent;
  'kind:domain': IconComponent;
  'kind:group': IconComponent;
  'kind:location': IconComponent;
  'kind:system': IconComponent;
  'kind:user': IconComponent;
  'kind:resource': IconComponent;
  'kind:template': IconComponent;
  brokenImage: IconComponent;
  catalog: IconComponent;
  chat: IconComponent;
  dashboard: IconComponent;
  docs: IconComponent;
  email: IconComponent;
  github: IconComponent;
  group: IconComponent;
  help: IconComponent;
  scaffolder: IconComponent;
  search: IconComponent;
  techdocs: IconComponent;
  user: IconComponent;
  warning: IconComponent;
  star: IconComponent;
  unstarred: IconComponent;
};

/**
 * A function that loads in the App config that will be accessible via the ConfigApi.
 *
 * If multiple config objects are returned in the array, values in the earlier configs
 * will override later ones.
 *
 * @public
 */
export type AppConfigLoader = () => Promise<AppConfig[]>;

/**
 * Extracts a union of the keys in a map whose value extends the given type
 *
 * @ignore
 */
type KeysWithType<Obj extends { [key in string]: any }, Type> = {
  [key in keyof Obj]: Obj[key] extends Type ? key : never;
}[keyof Obj];

/**
 * Takes a map Map required values and makes all keys matching Keys optional
 *
 * @ignore
 */
type PartialKeys<
  Map extends { [name in string]: any },
  Keys extends keyof Map,
> = Partial<Pick<Map, Keys>> & Required<Omit<Map, Keys>>;

/**
 * Creates a map of target routes with matching parameters based on a map of external routes.
 *
 * @ignore
 */
type TargetRouteMap<
  ExternalRoutes extends { [name: string]: ExternalRouteRef },
> = {
  [name in keyof ExternalRoutes]: ExternalRoutes[name] extends ExternalRouteRef<
    infer Params,
    any
  >
    ? RouteRef<Params> | SubRouteRef<Params> | false
    : never;
};

/**
 * A function that can bind from external routes of a given plugin, to concrete
 * routes of other plugins. See {@link createSpecializedApp}.
 *
 * @public
 */
export type AppRouteBinder = <
  ExternalRoutes extends { [name: string]: ExternalRouteRef },
>(
  externalRoutes: ExternalRoutes,
  targetRoutes: PartialKeys<
    TargetRouteMap<ExternalRoutes>,
    KeysWithType<ExternalRoutes, ExternalRouteRef<any, true>>
  >,
) => void;

/**
 * The options accepted by {@link createSpecializedApp}.
 *
 * @public
 */
export type AppOptions = {
  /**
   * A collection of ApiFactories to register in the application to either
   * add new ones, or override factories provided by default or by plugins.
   */
  apis?: Iterable<AnyApiFactory>;

  /**
   * A collection of ApiFactories to register in the application as default APIs.
   * These APIs cannot be overridden by plugin factories, but can be overridden
   * by plugin APIs provided through the
   * A collection of ApiFactories to register in the application to either
   * add new ones, or override factories provided by default or by plugins.
   */
  defaultApis?: Iterable<AnyApiFactory>;

  /**
   * Supply icons to override the default ones.
   */
  icons: AppIcons & { [key in string]: IconComponent };

  /**
   * A list of all plugins to include in the app.
   */
  plugins?: Array<
    BackstagePlugin & {
      output?(): Array<
        { type: 'feature-flag'; name: string } | { type: string }
      >; // support for old plugins
    }
  >;

  /**
   * Application level feature flags.
   */
  featureFlags?: (FeatureFlag & Omit<FeatureFlag, 'pluginId'>)[];

  /**
   * Supply components to the app to override the default ones.
   */
  components: AppComponents;

  /**
   * Themes provided as a part of the app. By default two themes are included, one
   * light variant of the default backstage theme, and one dark.
   *
   * This is the default config:
   *
   * ```
   * [{
   *   id: 'light',
   *   title: 'Light Theme',
   *   variant: 'light',
   *   icon: <LightIcon />,
   *   Provider: ({ children }) => <UnifiedThemeProvider theme={themes.light} />,
   * }, {
   *   id: 'dark',
   *   title: 'Dark Theme',
   *   variant: 'dark',
   *   icon: <DarkIcon />,
   *   Provider: ({ children }) => <UnifiedThemeProvider theme={themes.dark} />,
   * }]
   * ```
   */
  themes: (Partial<AppTheme> & Omit<AppTheme, 'theme'>)[];

  /**
   * A function that loads in App configuration that will be accessible via
   * the ConfigApi.
   *
   * Defaults to an empty config.
   *
   * TODO(Rugvip): Omitting this should instead default to loading in configuration
   *  that was packaged by the backstage-cli and default docker container boot script.
   */
  configLoader?: AppConfigLoader;

  /**
   * A function that is used to register associations between cross-plugin route
   * references, enabling plugins to navigate between each other.
   *
   * The `bind` function that is passed in should be used to bind all external
   * routes of all used plugins.
   *
   * ```ts
   * bindRoutes({ bind }) {
   *   bind(docsPlugin.externalRoutes, {
   *     homePage: managePlugin.routes.managePage,
   *   })
   *   bind(homePagePlugin.externalRoutes, {
   *     settingsPage: settingsPlugin.routes.settingsPage,
   *   })
   * }
   * ```
   */
  bindRoutes?(context: { bind: AppRouteBinder }): void;

  __experimentalTranslations?: {
    defaultLanguage?: string;
    availableLanguages?: string[];
    resources?: Array<
      // Separate declaration for now to avoid dependency on core-plugin-api/alpha and TS 5.0
      | { $$type: '@backstage/TranslationResource'; id: string }
      | {
          $$type: '@backstage/TranslationMessages';
          id: string;
          full: boolean;
          messages: Record<string, string>;
        }
    >;
  };
};

/**
 * The public API of the output of {@link createSpecializedApp}.
 *
 * @public
 */
export type BackstageApp = {
  /**
   * Returns all plugins registered for the app.
   */
  getPlugins(): BackstagePlugin[];

  /**
   * Get a common or custom icon for this app.
   */
  getSystemIcon(key: string): IconComponent | undefined;

  /**
   * Creates the root component that renders the entire app.
   *
   * @remarks
   *
   * This method must only be called once, and you have to provide it the entire
   * app element tree. The element tree will be analyzed to discover plugins,
   * routes, and other app features. The returned component will render all
   * of the app elements wrapped within the app context provider.
   *
   * @example
   * ```tsx
   * export default app.createRoot(
   *   <>
   *     <AlertDisplay />
   *     <OAuthRequestDialog />
   *     <AppRouter>
   *       <Root>{routes}</Root>
   *     </AppRouter>
   *   </>,
   * );
   * ```
   */
  createRoot(element: JSX.Element): ComponentType<PropsWithChildren<{}>>;

  /**
   * Provider component that should wrap the Router created with getRouter()
   * and any other components that need to be within the app context.
   *
   * @deprecated Use {@link BackstageApp.createRoot} instead.
   */
  getProvider(): ComponentType<PropsWithChildren<{}>>;

  /**
   * Router component that should wrap the App Routes create with getRoutes()
   * and any other components that should only be available while signed in.
   *
   * @deprecated Import and use the {@link AppRouter} component from `@backstage/core-app-api` instead
   */
  getRouter(): ComponentType<PropsWithChildren<{}>>;
};

/**
 * The central context providing runtime app specific state that plugin views
 * want to consume.
 *
 * @public
 */
export type AppContext = {
  /**
   * Get a list of all plugins that are installed in the app.
   */
  getPlugins(): BackstagePlugin[];

  /**
   * Get a common or custom icon for this app.
   */
  getSystemIcon(key: string): IconComponent | undefined;

  /**
   * Get a list of common and custom icons for this app.
   */
  getSystemIcons(): Record<string, IconComponent>;

  /**
   * Get the components registered for various purposes in the app.
   */
  getComponents(): AppComponents;
};
