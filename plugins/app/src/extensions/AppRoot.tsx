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

import { ComponentType, ReactNode, useCallback, useState, JSX } from 'react';
import {
  ExtensionBoundary,
  coreExtensionData,
  discoveryApiRef,
  fetchApiRef,
  errorApiRef,
  createExtension,
  createExtensionInput,
  routeResolutionApiRef,
  pluginWrapperApiRef,
  navigationControllerApiRef,
  useAnalytics,
} from '@backstage/frontend-plugin-api';
import { BreadcrumbsRegistryProvider } from './BreadcrumbsRegistryProvider';
import {
  AppRootWrapperBlueprint,
  RouterBlueprint,
  SignInPageBlueprint,
} from '@backstage/plugin-app-react';
import { BUIProvider } from '@backstage/ui';
import {
  DiscoveryApi,
  ErrorApi,
  FetchApi,
  IdentityApi,
  ProfileInfo,
  SignInPageProps,
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { isProtectedApp } from '../../../../packages/core-app-api/src/app/isProtectedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RouteTracker } from '../../../../packages/frontend-app-api/src/routing/RouteTracker';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../../packages/frontend-app-api/src/routing/getBasePath';
import { RootReactRouterV6 } from '../components/RootReactRouterV6';

export const AppRoot = createExtension({
  name: 'root',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
    router: createExtensionInput([RouterBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
      internal: true,
    }),
    signInPage: createExtensionInput([SignInPageBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
      internal: true,
    }),
    children: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
    elements: createExtensionInput([coreExtensionData.reactElement]),
    wrappers: createExtensionInput(
      [AppRootWrapperBlueprint.dataRefs.component],
      {
        internal: true,
      },
    ),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs, apis, node }) {
    if (isProtectedApp()) {
      const identityApi = apis.get(identityApiRef);
      if (!identityApi) {
        throw new Error('App requires an Identity API implementation');
      }
      const appIdentityProxy = toAppIdentityProxy(identityApi);
      const discoveryApi = apis.get(discoveryApiRef);
      const errorApi = apis.get(errorApiRef);
      const fetchApi = apis.get(fetchApiRef);
      if (!discoveryApi || !errorApi || !fetchApi) {
        throw new Error(
          'App is running in protected mode but missing required APIs',
        );
      }
      appIdentityProxy.enableCookieAuth({
        discoveryApi,
        errorApi,
        fetchApi,
      });
    }

    let content = inputs.children?.get(coreExtensionData.reactElement);

    for (const wrapper of inputs.wrappers) {
      const Component = wrapper.get(AppRootWrapperBlueprint.dataRefs.component);
      if (Component) {
        content = <Component>{content}</Component>;
      }
    }

    const pluginWrapperApi = apis.get(pluginWrapperApiRef);
    const RootWrapper = pluginWrapperApi?.getRootWrapper();
    if (RootWrapper) {
      content = <RootWrapper>{content}</RootWrapper>;
    }

    return [
      coreExtensionData.reactElement(
        <ExtensionBoundary node={node}>
          <AppRouter
            SignInPageComponent={inputs.signInPage?.get(
              SignInPageBlueprint.dataRefs.component,
            )}
            RouterComponent={inputs.router?.get(
              RouterBlueprint.dataRefs.component,
            )}
            extraElements={inputs.elements?.map(el =>
              el.get(coreExtensionData.reactElement),
            )}
          >
            {content}
          </AppRouter>
        </ExtensionBoundary>,
      ),
    ];
  },
});

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

type AppIdentityProxy = IdentityApi & {
  enableCookieAuth(ctx: {
    errorApi: ErrorApi;
    fetchApi: FetchApi;
    discoveryApi: DiscoveryApi;
  }): void;
  setTarget(
    impl: IdentityApi & /* backwards compat stuff */ {
      getUserId?(): string;
      getIdToken?(): Promise<string | undefined>;
      getProfile?(): ProfileInfo;
    },
    options: { signOutTargetUrl: string },
  ): void;
};

function toAppIdentityProxy(identityApi: IdentityApi): AppIdentityProxy {
  if (!('enableCookieAuth' in identityApi)) {
    throw new Error('Unexpected Identity API implementation');
  }
  return identityApi as AppIdentityProxy;
}

type RouteResolverProxy = {
  getRouteObjects(): any[];
};

/**
 * Props for the {@link AppRouter} component.
 * @public
 */
export interface AppRouterProps {
  children?: ReactNode;
  SignInPageComponent?: ComponentType<SignInPageProps>;
  RouterComponent?: (props: { children: ReactNode }) => JSX.Element | null;
  extraElements?: Array<JSX.Element>;
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
 *
 * History authority is the NavigationController. The default root wrapper
 * is a residual React Router v6 projection for chrome that still needs RR
 * context (`useResolvedPath`, relative links, and `@backstage/ui`'s own
 * react-router-backed href resolution in `useDefinition` / `Tabs` /
 * `HeaderNav`). `BUIProvider` is given the navigation controller directly so
 * BUI-authored chrome (`Link`, `Tabs`, `Menu`, ...) navigates through it
 * instead of a scoped page router, regardless of which page (if any) chrome
 * is rendered under. Sidebar active-state and RouteTracker already prefer
 * framework location. Per-page adapters own in-plugin routing via
 * PageBlueprint's `router` input / {@link pageRouterApiRef}.
 */
export function AppRouter(props: AppRouterProps) {
  const {
    children,
    SignInPageComponent,
    RouterComponent = RootReactRouterV6,
    extraElements = [],
  } = props;

  const configApi = useApi(configApiRef);
  const appIdentityProxy = toAppIdentityProxy(useApi(identityApiRef));
  const routeResolutionsApi = useApi(routeResolutionApiRef);
  const basePath = getBasePath(configApi);
  // Chrome navigation (BUI Link/Tabs/Menu clicks) goes through the
  // navigation controller directly rather than through a scoped React
  // Router context, so it works regardless of which page (if any) chrome
  // happens to be rendered under.
  const navigationController = useApi(navigationControllerApiRef);
  const frameworkNavigate = useCallback(
    (
      path: string,
      options?: Parameters<typeof navigationController.navigate>[1],
    ) => {
      navigationController.navigate(path, options);
    },
    [navigationController],
  );

  // TODO: Private access for now, probably replace with path -> node lookup method on the API
  if (!('getRouteObjects' in routeResolutionsApi)) {
    throw new Error('Unexpected route resolution API implementation');
  }
  const routeObjects = (
    routeResolutionsApi as RouteResolverProxy
  ).getRouteObjects();

  // If the app hasn't configured a sign-in page, we just continue as guest.
  if (!SignInPageComponent) {
    if (!isProtectedApp()) {
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
    }

    return (
      <RouterComponent>
        <BUIProvider useAnalytics={useAnalytics} navigate={frameworkNavigate}>
          <BreadcrumbsRegistryProvider>
            {...extraElements}
            <RouteTracker routeObjects={routeObjects} />
            {children}
          </BreadcrumbsRegistryProvider>
        </BUIProvider>
      </RouterComponent>
    );
  }

  return (
    <RouterComponent>
      <BUIProvider useAnalytics={useAnalytics} navigate={frameworkNavigate}>
        <BreadcrumbsRegistryProvider>
          {...extraElements}
          <RouteTracker routeObjects={routeObjects} />
          <SignInPageWrapper
            component={SignInPageComponent}
            appIdentityProxy={appIdentityProxy}
          >
            {children}
          </SignInPageWrapper>
        </BreadcrumbsRegistryProvider>
      </BUIProvider>
    </RouterComponent>
  );
}
