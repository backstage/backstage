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

import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  Sidebar,
  SidebarDivider,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  SidebarSpacer,
  SignInPage,
  SignInProviderConfig,
} from '@backstage/core-components';
import {
  AnyApiFactory,
  ApiFactory,
  AppTheme,
  attachComponentData,
  BackstagePlugin,
  configApiRef,
  createApiFactory,
  createRouteRef,
  IconComponent,
  RouteRef,
} from '@backstage/core-plugin-api';
import { TranslationResource } from '@backstage/core-plugin-api/alpha';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import Box from '@material-ui/core/Box';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import React, { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { createRoutesFromChildren, Route } from 'react-router-dom';
import { SidebarThemeSwitcher } from './SidebarThemeSwitcher';
import 'react-dom';
import { SidebarLanguageSwitcher, SidebarSignOutButton } from '../components';

let ReactDOMPromise: Promise<
  typeof import('react-dom') | typeof import('react-dom/client')
>;
if (process.env.HAS_REACT_DOM_CLIENT) {
  ReactDOMPromise = import('react-dom/client');
} else {
  ReactDOMPromise = import('react-dom');
}

export function isReactRouterBeta(): boolean {
  const [obj] = createRoutesFromChildren(<Route index element={<div />} />);
  return !obj.index;
}

const MaybeGatheringRoute: (props: {
  path: string;
  element: JSX.Element;
  children?: ReactNode;
}) => JSX.Element = ({ element }) => element;

if (isReactRouterBeta()) {
  attachComponentData(MaybeGatheringRoute, 'core.gatherMountPoints', true);
}

/** @public */
export type DevAppPageOptions = {
  path?: string;
  element: JSX.Element;
  children?: JSX.Element;
  title?: string;
  icon?: IconComponent;
};

/**
 * DevApp builder that is similar to the App builder API, but creates an App
 * with the purpose of developing one or more plugins inside it.
 *
 * @public
 */
export class DevAppBuilder {
  private readonly plugins = new Array<BackstagePlugin>();
  private readonly apis = new Array<AnyApiFactory>();
  private readonly rootChildren = new Array<ReactNode>();
  private readonly routes = new Array<JSX.Element>();
  private readonly sidebarItems = new Array<JSX.Element>();
  private readonly signInProviders = new Array<SignInProviderConfig>();
  private readonly translationResources = new Array<TranslationResource>();

  private defaultPage?: string;
  private themes?: Array<AppTheme>;
  private languages?: string[];
  private defaultLanguage?: string;

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
  registerApi<
    Api,
    Impl extends Api,
    Deps extends { [name in string]: unknown },
  >(factory: ApiFactory<Api, Impl, Deps>): DevAppBuilder {
    this.apis.push(factory);
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
   * Adds a new sidebar item to the dev app.
   *
   * Useful for adding only sidebar items without a corresponding page.
   */
  addSidebarItem(sidebarItem: JSX.Element): DevAppBuilder {
    this.sidebarItems.push(sidebarItem);
    return this;
  }

  /**
   * Adds a page component along with accompanying sidebar item.
   *
   * If no path is provided one will be generated.
   * If no title is provided, no sidebar item will be created.
   */
  addPage(opts: DevAppPageOptions): DevAppBuilder {
    const path = opts.path ?? `/page-${this.routes.length + 1}`;

    if (!this.defaultPage || path === '/') {
      this.defaultPage = path;
    }

    if (opts.title) {
      this.sidebarItems.push(
        <SidebarItem
          key={path}
          to={path}
          text={opts.title}
          icon={opts.icon ?? BookmarkIcon}
        />,
      );
    }

    this.routes.push(
      <MaybeGatheringRoute
        key={path}
        path={path}
        element={opts.element}
        children={opts.children}
      />,
    );
    return this;
  }

  /**
   * Adds an array of themes to override the default theme.
   */
  addThemes(themes: AppTheme[]) {
    this.themes = themes;
    return this;
  }

  /**
   * Adds new sign in provider for the dev app
   */
  addSignInProvider(provider: SignInProviderConfig) {
    this.signInProviders.push(provider);
    return this;
  }

  /**
   * Set available languages to be shown in the dev app
   */
  setAvailableLanguages(languages: string[]) {
    this.languages = languages;
    return this;
  }

  /**
   * Add translation resource to the dev app
   */
  addTranslationResource(resource: TranslationResource) {
    this.translationResources.push(resource);
    return this;
  }

  /**
   * Set default language for the dev app
   */
  setDefaultLanguage(language: string) {
    this.defaultLanguage = language;
    return this;
  }

  /**
   * Build a DevApp component using the resources registered so far
   */
  build(): ComponentType<PropsWithChildren<{}>> {
    const fakeRouteRef = createRouteRef({ id: 'fake' });
    const FakePage = () => <Box p={3}>Page belonging to another plugin.</Box>;
    attachComponentData(FakePage, 'core.mountPoint', fakeRouteRef);

    const apis = [...this.apis];
    if (!apis.some(api => api.api.id === scmIntegrationsApiRef.id)) {
      apis.push(
        createApiFactory({
          api: scmIntegrationsApiRef,
          deps: { configApi: configApiRef },
          factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
        }),
      );
    }

    const app = createApp({
      apis,
      plugins: this.plugins,
      themes: this.themes,
      components: {
        SignInPage: props => {
          return (
            <SignInPage
              {...props}
              providers={['guest', ...this.signInProviders]}
              title="Select a sign-in method"
              align="center"
            />
          );
        },
      },
      bindRoutes: ({ bind }) => {
        for (const plugin of this.plugins ?? []) {
          const targets: Record<string, RouteRef<any>> = {};
          for (const routeKey of Object.keys(plugin.externalRoutes)) {
            targets[routeKey] = fakeRouteRef;
          }
          bind(plugin.externalRoutes, targets);
        }
      },
      __experimentalTranslations: {
        defaultLanguage: this.defaultLanguage,
        availableLanguages: this.languages,
        resources: this.translationResources,
      },
    });

    const DevApp = (
      <>
        <AlertDisplay />
        <OAuthRequestDialog />
        {this.rootChildren}
        <AppRouter>
          <SidebarPage>
            <Sidebar>
              <SidebarSpacer />
              {this.sidebarItems}
              <SidebarSpace />
              <SidebarDivider />
              <SidebarThemeSwitcher />
              <SidebarLanguageSwitcher />
              <SidebarSignOutButton />
            </Sidebar>
            <FlatRoutes>
              {this.routes}
              <Route path="/_external_route" element={<FakePage />} />
            </FlatRoutes>
          </SidebarPage>
        </AppRouter>
      </>
    );

    return app.createRoot(DevApp);
  }

  /**
   * Build and render directory to #root element, with react hot loading.
   */
  render(): void {
    const DevApp = this.build();

    if (
      window.location.pathname === '/' &&
      this.defaultPage &&
      this.defaultPage !== '/'
    ) {
      window.location.pathname = this.defaultPage;
    }

    ReactDOMPromise.then(ReactDOM => {
      if ('createRoot' in ReactDOM) {
        ReactDOM.createRoot(document.getElementById('root')!).render(
          <DevApp />,
        );
      } else {
        ReactDOM.render(<DevApp />, document.getElementById('root'));
      }
    });
  }
}

// TODO(rugvip): Figure out patterns for how to allow in-house apps to build upon
// this to provide their own plugin dev wrappers.

/**
 * Creates a dev app for rendering one or more plugins and exposing the touch points of the plugin.
 *
 * @public
 */
export function createDevApp() {
  return new DevAppBuilder();
}
