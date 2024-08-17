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

import {
  ApiFactoryRegistry,
  ApiProvider,
  ApiResolver,
  AppThemeSelector,
  ConfigReader,
} from '@backstage/core-app-api';
import {
  AnyApiFactory,
  ApiHolder,
  AppTheme,
  ConfigApi,
  IconComponent,
  appThemeApiRef,
  configApiRef,
  featureFlagsApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  ApiBlueprint,
  AppTree,
  IconBundleBlueprint,
  RouteResolutionApi,
  ThemeBlueprint,
  TranslationBlueprint,
  appTreeApiRef,
  componentsApiRef,
  coreExtensionData,
  iconsApiRef,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import React, {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../../core-app-api/src/app/AppThemeProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LocalStorageFeatureFlags } from '../../../core-app-api/src/apis/implementations/FeatureFlagsApi/LocalStorageFeatureFlags';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi/AppLanguageSelector';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi/I18nextTranslationApi';
import {
  appLanguageApiRef,
  translationApiRef,
} from '@backstage/core-plugin-api/alpha';
import { RouteResolver } from '../routing/RouteResolver';
import { InternalAppContext } from './InternalAppContext';
import { DefaultComponentsApi } from '../apis/implementations/ComponentsApi';
import { DefaultIconsApi } from '../apis/implementations/IconsApi';
import {
  ExtensionBoundary,
  createComponentExtension,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { icons as defaultIcons } from '../../../app-defaults/src/defaults';
import { getBasePath } from '../routing/getBasePath';
import {
  IdentityApi,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import {
  RouterBlueprint,
  SignInPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { BrowserRouter } from 'react-router-dom';
import { RouteTracker } from '../routing/RouteTracker';
import { extractRouteInfoFromAppNode } from '../routing/extractRouteInfoFromAppNode';
import { resolveRouteBindings } from '../routing/resolveRouteBindings';
import { collectRouteIds } from '../routing/collectRouteIds';

export const App = createExtension({
  namespace: 'app',
  attachTo: { id: 'root', input: 'default' }, // ignored
  inputs: {
    apis: createExtensionInput([ApiBlueprint.dataRefs.factory]),
    themes: createExtensionInput([ThemeBlueprint.dataRefs.theme]),
    components: createExtensionInput([
      createComponentExtension.componentDataRef,
    ]),
    translations: createExtensionInput([
      TranslationBlueprint.dataRefs.translation,
    ]),
    icons: createExtensionInput([IconBundleBlueprint.dataRefs.icons]),
    router: createExtensionInput([RouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
    signInPage: createExtensionInput([SignInPageBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
    }),
    root: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory({ node, inputs }) {
    const config = new ConfigReader({}, 'empty-config');

    const routeInfo = extractRouteInfoFromAppNode(node);
    const routeBindings = resolveRouteBindings(
      undefined,
      config,
      collectRouteIds(features),
    );

    const appIdentityProxy = new AppIdentityProxy();
    const apiHolder = createApiHolder(
      tree,
      config,
      appIdentityProxy,
      new RouteResolver(
        routeInfo.routePaths,
        routeInfo.routeParents,
        routeInfo.routeObjects,
        routeBindings,
        getBasePath(config),
      ),
      options?.icons,
    );

    return [
      coreExtensionData.reactElement(
        <ApiProvider apis={apiHolder}>
          <AppThemeProvider>
            <ExtensionBoundary node={node}>
              <AppRouter
                SignInPageComponent={inputs.signInPage?.get(
                  SignInPageBlueprint.dataRefs.component,
                )}
                RouterComponent={inputs.router?.get(
                  RouterBlueprint.dataRefs.component,
                )}
              >
                {inputs.root.get(coreExtensionData.reactElement)}
              </AppRouter>
              ,
            </ExtensionBoundary>
          </AppThemeProvider>
        </ApiProvider>,
      ),
    ];
  },
});

function createApiHolder(
  tree: AppTree,
  configApi: ConfigApi,
  appIdentityProxy: AppIdentityProxy,
  routeResolutionApi: RouteResolutionApi,
  icons?: { [key in string]: IconComponent },
): ApiHolder {
  const factoryRegistry = new ApiFactoryRegistry();

  const pluginApis =
    tree.root.edges.attachments
      .get('apis')
      ?.map(e => e.instance?.getData(ApiBlueprint.dataRefs.factory))
      .filter((x): x is AnyApiFactory => !!x) ?? [];

  const themeExtensions =
    tree.root.edges.attachments
      .get('themes')
      ?.map(e => e.instance?.getData(ThemeBlueprint.dataRefs.theme))
      .filter((x): x is AppTheme => !!x) ?? [];

  const translationResources =
    tree.root.edges.attachments
      .get('translations')
      ?.map(e => e.instance?.getData(TranslationBlueprint.dataRefs.translation))
      .filter(
        (x): x is typeof TranslationBlueprint.dataRefs.translation.T => !!x,
      ) ?? [];

  const extensionIcons = tree.root.edges.attachments
    .get('icons')
    ?.map(e => e.instance?.getData(IconBundleBlueprint.dataRefs.icons))
    .reduce((acc, bundle) => ({ ...acc, ...bundle }), {});

  for (const factory of pluginApis) {
    factoryRegistry.register('default', factory);
  }

  // TODO: properly discovery feature flags, maybe rework the whole thing
  factoryRegistry.register('default', {
    api: featureFlagsApiRef,
    deps: {},
    factory: () => new LocalStorageFeatureFlags(),
  });

  factoryRegistry.register('static', {
    api: identityApiRef,
    deps: {},
    factory: () => appIdentityProxy,
  });

  factoryRegistry.register('static', {
    api: appTreeApiRef,
    deps: {},
    factory: () => ({
      getTree: () => ({ tree }),
    }),
  });

  factoryRegistry.register('static', {
    api: routeResolutionApiRef,
    deps: {},
    factory: () => routeResolutionApi,
  });

  factoryRegistry.register('static', {
    api: componentsApiRef,
    deps: {},
    factory: () => DefaultComponentsApi.fromTree(tree),
  });

  factoryRegistry.register('static', {
    api: iconsApiRef,
    deps: {},
    factory: () =>
      new DefaultIconsApi({ ...defaultIcons, ...extensionIcons, ...icons }),
  });

  factoryRegistry.register('static', {
    api: appThemeApiRef,
    deps: {},
    // TODO: add extension for registering themes
    factory: () => AppThemeSelector.createWithStorage(themeExtensions),
  });

  factoryRegistry.register('static', {
    api: appLanguageApiRef,
    deps: {},
    factory: () => AppLanguageSelector.createWithStorage(),
  });

  factoryRegistry.register('static', {
    api: configApiRef,
    deps: {},
    factory: () => configApi,
  });

  factoryRegistry.register('static', {
    api: appLanguageApiRef,
    deps: {},
    factory: () => AppLanguageSelector.createWithStorage(),
  });

  factoryRegistry.register('static', {
    api: translationApiRef,
    deps: { languageApi: appLanguageApiRef },
    factory: ({ languageApi }) =>
      I18nextTranslationApi.create({
        languageApi,
        resources: translationResources,
      }),
  });

  ApiResolver.validateFactories(factoryRegistry, factoryRegistry.getAllApis());

  return new ApiResolver(factoryRegistry);
}

// This wraps the sign-in page and waits for sign-in to be completed before rendering the app
function SignInPageWrapper({
  component: Component,
  appIdentityProxy,
  children,
}: {
  component: ComponentType<SignInPageProps>;
  appIdentityProxy: AppIdentityProxy;
  children: ReactNode;
}) {
  const [identityApi, setIdentityApi] = useState<IdentityApi>();
  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);

  if (!identityApi) {
    return <Component onSignInSuccess={setIdentityApi} />;
  }

  appIdentityProxy.setTarget(identityApi, {
    signOutTargetUrl: basePath || '/',
  });
  return <>{children}</>;
}

/**
 * Props for the {@link AppRouter} component.
 * @public
 */
export interface AppRouterProps {
  children?: ReactNode;
  SignInPageComponent?: ComponentType<SignInPageProps>;
  RouterComponent?: ComponentType<PropsWithChildren<{}>>;
}

function DefaultRouter(props: PropsWithChildren<{}>) {
  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);
  return <BrowserRouter basename={basePath}>{props.children}</BrowserRouter>;
}

/**
 * App router and sign-in page wrapper.
 *
 * @remarks
 *
 * The AppRouter provides the routing context and renders the sign-in page.
 * Until the user has successfully signed in, this component will render
 * the sign-in page. Once the user has signed-in, it will instead render
 * the app, while providing routing and route tracking for the app.
 */
export function AppRouter(props: AppRouterProps) {
  const {
    children,
    SignInPageComponent,
    RouterComponent = DefaultRouter,
  } = props;

  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);
  const internalAppContext = useContext(InternalAppContext);
  if (!internalAppContext) {
    throw new Error('AppRouter must be rendered within the AppProvider');
  }
  const { routeObjects, appIdentityProxy } = internalAppContext;

  // If the app hasn't configured a sign-in page, we just continue as guest.
  if (!SignInPageComponent) {
    appIdentityProxy.setTarget(
      {
        getUserId: () => 'guest',
        getIdToken: async () => undefined,
        getProfile: () => ({
          email: 'guest@example.com',
          displayName: 'Guest',
        }),
        getProfileInfo: async () => ({
          email: 'guest@example.com',
          displayName: 'Guest',
        }),
        getBackstageIdentity: async () => ({
          type: 'user',
          userEntityRef: 'user:default/guest',
          ownershipEntityRefs: ['user:default/guest'],
        }),
        getCredentials: async () => ({}),
        signOut: async () => {},
      },
      { signOutTargetUrl: basePath || '/' },
    );

    return (
      <RouterComponent>
        <RouteTracker routeObjects={routeObjects} />
        {children}
      </RouterComponent>
    );
  }

  return (
    <RouterComponent>
      <RouteTracker routeObjects={routeObjects} />
      <SignInPageWrapper
        component={SignInPageComponent}
        appIdentityProxy={appIdentityProxy}
      >
        {children}
      </SignInPageWrapper>
    </RouterComponent>
  );
}
