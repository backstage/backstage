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

import { ComponentType, ReactNode, useState, JSX } from 'react';
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
  appHistoryApiRef,
  useAnalytics,
  useAppRouting,
} from '@backstage/frontend-plugin-api';
import { BreadcrumbsRegistryProvider } from './BreadcrumbsRegistryProvider';
import {
  AppRootWrapperBlueprint,
  SignInPageBlueprint,
} from '@backstage/plugin-app-react';
import { BUIProvider, type BUIRouter } from '@backstage/ui';
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
import { AppRouteProvider } from '../../../../packages/frontend-app-api/src/routing/AppRouteProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../../packages/frontend-app-api/src/routing/getBasePath';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RootHistoryRouter } from '../../../../packages/frontend-app-api/src/routing/RootHistoryRouter';

export const AppRoot = createExtension({
  name: 'root',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
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
 * History authority is the AppHistory. `BUIProvider` receives navigation,
 * href resolution, and active pathname through one hook backed by that
 * history, so first-party chrome does not depend on an ambient router.
 * The hook captures each consumer's route ancestry, which lets a target
 * resolve against the page the anchor is written in and produces a
 * browser-ready href with the deployment basename.
 *
 * `RootHistoryRouter` is a residual projection for third-party new frontend
 * system chrome that still reads React Router v6 context. It owns no browser
 * history. New chrome should read the app history directly, or use the
 * `useApp*` helpers in `@internal/frontend` when supporting both frontend
 * systems.
 *
 * Remove this compatibility projection once all first-party new frontend
 * system chrome runs without an ambient
 * React Router context, routerless conformance tests cover that behavior, and
 * dependency enforcement prevents new React Router v6 imports in that chrome.
 *
 * Existing pages also receive implicit React Router v6 matches for gradual
 * migration. Development warnings identify use of that fallback. A page can
 * select its library explicitly, for example by rendering
 * `ReactRouterV6PageRouter` inside its lazily loaded page component.
 */
export function AppRouter(props: AppRouterProps) {
  const { children, SignInPageComponent, extraElements = [] } = props;

  const configApi = useApi(configApiRef);
  const appIdentityProxy = toAppIdentityProxy(useApi(identityApiRef));
  const routeResolutionsApi = useApi(routeResolutionApiRef);
  const basePath = getBasePath(configApi);
  const appHistory = useApi(appHistoryApiRef);

  // TODO: Private access for now, probably replace with path -> node lookup method on the API
  if (!('getRouteObjects' in routeResolutionsApi)) {
    throw new Error('Unexpected route resolution API implementation');
  }
  const routeObjects = (
    routeResolutionsApi as RouteResolverProxy
  ).getRouteObjects();

  // If the app hasn't configured a sign-in page, we just continue as guest.
  if (!SignInPageComponent && !isProtectedApp()) {
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
    <AppRouteProvider history={appHistory} routeObjects={routeObjects}>
      <RootHistoryRouter history={appHistory}>
        <BUIProvider useAnalytics={useAnalytics} useRouter={useBUIRouter}>
          <BreadcrumbsRegistryProvider>
            {...extraElements}
            <RouteTracker routeObjects={routeObjects} />
            {SignInPageComponent ? (
              <SignInPageWrapper
                component={SignInPageComponent}
                appIdentityProxy={appIdentityProxy}
              >
                {children}
              </SignInPageWrapper>
            ) : (
              children
            )}
          </BreadcrumbsRegistryProvider>
        </BUIProvider>
      </RootHistoryRouter>
    </AppRouteProvider>
  );
}

function useBUIRouter(): BUIRouter {
  const routing = useAppRouting();
  return {
    navigate: routing.navigate,
    resolveHref: routing.createHref,
    pathname: new URL(
      routing.createHref(routing.location.pathname),
      'http://backstage.local',
    ).pathname,
  };
}
